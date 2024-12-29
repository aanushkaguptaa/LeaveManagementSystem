import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

const LEAVE_LIMITS = {
  'Full Day': 15,
  'Half Day': 10,
  'RH': 5,
  'Compensatory Off': 2
};

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
    const { sapId } = req.query;

    // Get all approved leave requests for the user
    const leaveRequests = await LeaveRequest.find({
      SAPID: sapId,
      cancel: "0"
    });

    // Calculate used leaves by type
    const usedLeaves = {
      'Full Day': 0,
      'Half Day': 0,
      'RH': 0,
      'Compensatory Off': 0
    };

    leaveRequests.forEach(request => {
        if (usedLeaves.hasOwnProperty(request.type)) {
            usedLeaves[request.type]++;
        }
    });

    // Calculate leave statistics
    const leaveStats = {
      fullLeave: {
        usedLeaves: usedLeaves['Full Day'],
        totalLeaves: LEAVE_LIMITS['Full Day']
      },
      halfLeave: {
        usedLeaves: usedLeaves['Half Day'],
        totalLeaves: LEAVE_LIMITS['Half Day']
      },
      rhLeave: {
        usedLeaves: usedLeaves['RH'],
        totalLeaves: LEAVE_LIMITS['RH']
      },
      compOffLeave: {
        usedLeaves: usedLeaves['Compensatory Off'],
        totalLeaves: LEAVE_LIMITS['Compensatory Off']
      }
    };

    // Get active leave requests
    const activeRequests = await LeaveRequest.find({
      SAPID: sapId,
      cancel: "0",
      //to: { $gte: new Date() }
    }).sort({ takenOn: -1 });

    const formattedRequests = activeRequests.map(request => ({
      id: request.ID,
      type: request.type,
      fromDate: formatDate(request.from),
      toDate: formatDate(request.to),
      requestedOn: formatDate(request.takenOn)
    }));

    res.status(200).json({
      leaveStats,
      activeRequests: formattedRequests
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
