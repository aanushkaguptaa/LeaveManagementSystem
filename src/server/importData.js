require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Employee = require('./models/Employee'); // Import Employee model
const LeaveRequest = require('./models/LeaveRequest'); // Import LeaveRequest model

// Connect to MongoDB using URI from environment
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
    console.log('Connected to MongoDB Atlas'); // Log successful connection
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err); // Log connection error
    process.exit(1); // Exit if connection fails
});

// Function to import Employee data from CSV
async function importEmployees(csvFilePath) {
  const employees = []; // Array to hold employee data
  return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath) // Read the CSV file
          .pipe(csv()) // Parse CSV data
          .on('data', (row) => {
              // Validate SAPID format and push valid rows to employees array
              if (row.SAPID && /^\d{8}$/.test(row.SAPID)) {
                  employees.push({
                      SAPID: row.SAPID,
                      name: row.name,
                      password: row.password,
                      role: row.role,
                  });
              } else {
                  console.warn(`Invalid or missing SAPID: ${JSON.stringify(row)}`); // Log warning for invalid SAPID
              }
          })
          .on('end', async () => {
              try {
                  // Insert all valid employees into the database
                  await Employee.insertMany(employees);
                  console.log('Employees imported successfully!'); // Log success message
                  resolve(); // Resolve the promise
              } catch (err) {
                  console.error('Error importing employees:', err); // Log error during import
                  reject(err); // Reject the promise
              }
          })
          .on('error', reject); // Handle stream errors
  });
}

// Function to import LeaveRequest data from CSV
async function importLeaveRequests(csvFilePath) {
  const leaveRequests = []; // Array to hold leave request data
  const rows = []; // Temporary storage for all rows

  // Step 1: Read the CSV file completely
  return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath) // Read the CSV file
          .pipe(csv()) // Parse CSV data
          .on('data', (row) => {
              rows.push(row); // Store all rows
          })
          .on('end', async () => {
              try {
                  // Step 2: Process rows sequentially after reading the file
                  for (const row of rows) {
                      const employeeExists = await Employee.exists({ SAPID: row.SAPID }); // Check if employee exists
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
                          console.warn(`SAPID ${row.SAPID} not found. Skipping LeaveRequest.`); // Log warning for missing employee
                      }
                  }

                  // Step 3: Insert all valid leave requests into the database
                  if (leaveRequests.length > 0) {
                      await LeaveRequest.insertMany(leaveRequests);
                      console.log('LeaveRequests imported successfully!'); // Log success message
                  } else {
                      console.log('No valid leave requests to import.'); // Log if no valid requests
                  }
                  resolve(); // Resolve the promise
              } catch (err) {
                  console.error('Error importing leave requests:', err); // Log error during import
                  reject(err); // Reject the promise
              }
          })
          .on('error', (err) => reject(err)); // Handle stream errors
  });
}

// Main function to run imports
async function main() {
  try {
      await mongoose.connect(process.env.MONGODB_URI); // Connect to MongoDB
      console.log('Connected to MongoDB Atlas'); // Log successful connection

      // Import employee and leave request data
      await importEmployees('./src/server/database/employee.csv');
      await importLeaveRequests('./src/server/database/request.csv');
  } catch (error) {
    console.error('Error during import process:', error); // Log error during import
  } finally {
    try {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Connection to MongoDB Atlas closed'); // Log closure of connection
    } catch (err) {
        console.error('Error closing the MongoDB connection:', err); // Log error during closure
    }
    // Exit the process explicitly
    process.exit(0);
  }
}
main(); // Execute the main function