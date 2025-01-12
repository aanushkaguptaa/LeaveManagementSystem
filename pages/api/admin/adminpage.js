import { connectDB } from '@/server/config/db';
import Employee from '@/server/models/Employee';
import LeaveRequest from '@/server/models/LeaveRequest';

export default async function handler(req, res) {
  // Ensure the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectDB();
    
    // Parse pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Set today's date to midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Aggregate active leave requests for today with pagination
    const activeLeaves = await LeaveRequest.aggregate([
      {
        $match: {
          from: { $lte: today },
          to: { $gte: today },
          cancel: "0"
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'SAPID',
          foreignField: 'SAPID',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    // Calculate total count of active leave requests for pagination
    const totalCount = await LeaveRequest.countDocuments({
      from: { $lte: today },
      to: { $gte: today },
      cancel: "0"
    });

    // Initialize leave count object
    const leaveCount = {
      fullLeave: 0,
      halfLeave: 0,
      rhLeave: 0,
      compOffLeave: 0
    };

    // Count leave types
    activeLeaves.forEach(leave => {
      switch(leave.type) {
        case 'Full Day': leaveCount.fullLeave++; break;
        case 'Half Day': leaveCount.halfLeave++; break;
        case 'RH': leaveCount.rhLeave++; break;
        case 'Compensatory Off': leaveCount.compOffLeave++; break;
      }
    });

    // Calculate the number of employees present
    const totalEmployees = await Employee.countDocuments();
    const employeesPresent = totalEmployees - (leaveCount.fullLeave + leaveCount.halfLeave + leaveCount.rhLeave + leaveCount.compOffLeave);

    // Map active leaves to a simplified structure
    const onLeaveToday = activeLeaves.map(leave => ({
      sapId: leave.SAPID,
      employeeName: leave.employee.name,
      leaveType: leave.type
    }));

    // Send response with leave data and pagination info
    res.status(200).json({
      leaveData: {
        employeesPresent,
        ...leaveCount
      },
      onLeaveToday,
      pagination: {
        total: totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}