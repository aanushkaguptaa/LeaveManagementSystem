require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Employee = require('./models/Employee'); // Adjust the path to your Employee model
const LeaveRequest = require('./models/LeaveRequest'); // Adjust the path to your LeaveRequest model

// MongoDB connection using URI from environment
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1); // Exit if connection fails
});

// Function to import Employee data
async function importEmployees(csvFilePath) {
  const employees = [];
  return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
              if (row.SAPID && /^\d{8}$/.test(row.SAPID)) {
                  employees.push({
                      SAPID: row.SAPID,
                      name: row.name,
                      password: row.password,
                      role: row.role,
                      fullday: parseInt(row.fullday, 10) || 0,
                      halfday: parseInt(row.halfday, 10) || 0,
                      rh: parseInt(row.rh, 10) || 0,
                      compOff: parseInt(row.compOff, 10) || 0,
                  });
              } else {
                  console.warn(`Invalid or missing SAPID: ${JSON.stringify(row)}`);
              }
          })
          .on('end', async () => {
              try {
                  await Employee.insertMany(employees);
                  console.log('Employees imported successfully!');
                  resolve();
              } catch (err) {
                  console.error('Error importing employees:', err);
                  reject(err);
              }
          })
          .on('error', reject);
  });
}


// Function to import LeaveRequest data
async function importLeaveRequests(csvFilePath) {
  const leaveRequests = [];
  const rows = []; // Temporary storage for all rows

  // Step 1: Read the CSV file completely
  return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (row) => {
              rows.push(row); // Store all rows
          })
          .on('end', async () => {
              try {
                  // Step 2: Process rows sequentially after reading the file
                  for (const row of rows) {
                      const employeeExists = await Employee.exists({ SAPID: row.SAPID });
                      if (employeeExists) {
                          leaveRequests.push({
                              ID: parseInt(row.ID, 10),
                              type: row.type,
                              from: new Date(row.from),
                              to: new Date(row.to),
                              takenOn: new Date(row.takenOn),
                              SAPID: row.SAPID,
                              reason: row.reason,
                              cancel: row.cancel,
                          });
                      } else {
                          console.warn(`SAPID ${row.SAPID} not found. Skipping LeaveRequest.`);
                      }
                  }

                  // Step 3: Insert all valid leave requests into the database
                  if (leaveRequests.length > 0) {
                      await LeaveRequest.insertMany(leaveRequests);
                      console.log('LeaveRequests imported successfully!');
                  } else {
                      console.log('No valid leave requests to import.');
                  }
                  resolve();
              } catch (err) {
                  console.error('Error importing leave requests:', err);
                  reject(err);
              }
          })
          .on('error', (err) => reject(err));
  });
}


// Main function to run imports
async function main() {
  try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB Atlas');

      await importEmployees('./server/database/employee.csv');
      await importLeaveRequests('./server/database/request.csv');
  }  catch (error) {
    console.error('Error during import process:', error);
  } finally {
    try {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Connection to MongoDB Atlas closed');
    } catch (err) {
        console.error('Error closing the MongoDB connection:', err);
    }
    // Exit the process explicitly
    process.exit(0);
  }
}
main();