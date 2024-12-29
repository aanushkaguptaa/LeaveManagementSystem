import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

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
    const { sapId, startDate, endDate } = req.query;

    // Build query based on filters
    let query = { SAPID: sapId };

    if (startDate && endDate) {
      query.from = { 
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get all requests for the user
    const requests = await LeaveRequest.find(query)
      .sort({ takenOn: -1 }); // Sort by newest first

    const formattedRequests = requests.map(request => ({
      id: request.ID,
      leaveType: request.type,
      fromDate: formatDate(request.from),
      toDate: formatDate(request.to),
      requestedOn: formatDate(request.takenOn),
      cancelled: request.cancel === "1" ? "Yes" : "No"
    }));

    res.status(200).json({
      requests: formattedRequests
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
