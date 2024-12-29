import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';
import Employee from '@/server/models/Employee';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { sapId, employeeName, startDate, endDate, leaveType, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let matchStage = { cancel: "0" };
    
    if (sapId) matchStage.SAPID = sapId;
    if (leaveType) matchStage.type = leaveType;
    if (startDate) matchStage.from = { $gte: new Date(startDate) };
    if (endDate) matchStage.to = { $lte: new Date(endDate) };

    let pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'employees',
          localField: 'SAPID',
          foreignField: 'SAPID',
          as: 'employee'
        }
      },
      { $unwind: '$employee' }
    ];

    if (employeeName) {
      pipeline.push({
        $match: {
          'employee.name': new RegExp(employeeName, 'i')
        }
      });
    }

    // Get total count for pagination
    const totalCount = await LeaveRequest.aggregate([
      ...pipeline,
      { $count: 'total' }
    ]);

    if (parseInt(limit) > 0) {
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });
    }

    const leaveRequests = await LeaveRequest.aggregate(pipeline);

    const formattedRequests = leaveRequests.map(request => ({
      sapId: request.SAPID,
      employeeName: request.employee.name,
      leaveType: request.type,
      leaveRequestDateFrom: formatDate(request.from),
      leaveRequestDateTo: formatDate(request.to),
      leaveRequestedOn: formatDate(request.takenOn),
      cancelled: request.cancel === "1" ? "Yes" : "No"
    }));

    res.status(200).json({
      requests: formattedRequests,
      pagination: {
        total: totalCount[0]?.total || 0,
        page: parseInt(page),
        totalPages: Math.ceil((totalCount[0]?.total || 0) / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Attendance overview error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}