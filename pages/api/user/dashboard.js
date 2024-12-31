import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

const LEAVE_LIMITS = {
  'Full Day': 15,
  'Half Day': 10,
  'RH': 5,
  'Compensatory Off': 2
};

function calculateLeaveDays(from, to, type) {
  const startDate = new Date(from);
  const endDate = new Date(to);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return type === 'Half Day' ? 1 : diffDays;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { sapId } = req.query;

    // Get all non-cancelled leave requests for the user
    const leaveRequests = await LeaveRequest.find({
      SAPID: sapId,
      cancel: "0" // Only get non-cancelled requests
    });

    // Initialize leave counts
    const usedLeaves = {
      'Full Day': 0,
      'Half Day': 0,
      'RH': 0,
      'Compensatory Off': 0
    };

    // Calculate used leaves by type
    leaveRequests.forEach(request => {
      const days = calculateLeaveDays(request.from, request.to, request.type);
      usedLeaves[request.type] += days;
    });

    // Format response data
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

    // Get active leave requests (non-cancelled)
    const activeRequests = await LeaveRequest.find({
      SAPID: sapId,
      cancel: "0"
    }).sort({ takenOn: -1 });

    const formattedRequests = activeRequests.map(request => ({
      id: request.ID,
      type: request.type,
      fromDate: new Date(request.from).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      toDate: new Date(request.to).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      requestedOn: new Date(request.takenOn).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
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
