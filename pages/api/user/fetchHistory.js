import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

// Helper function to format dates in 'dd-MMM-yyyy' format
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default async function handler(req, res) {
  // Ensure the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectDB();
    
    // Extract query parameters for filtering
    const { sapId, startDate, endDate } = req.query;

    // Build query based on filters
    let query = { SAPID: sapId };

    // Add date range filter if provided
    if (startDate && endDate) {
      query.from = { 
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get all requests for the user, sorted by newest first
    const requests = await LeaveRequest.find(query)
      .sort({ takenOn: -1 });

    // Format the requests for the response
    const formattedRequests = requests.map(request => ({
      id: request.ID,
      leaveType: request.type,
      fromDate: formatDate(request.from),
      toDate: formatDate(request.to),
      requestedOn: formatDate(request.takenOn),
      cancelled: request.cancel === "1" ? "Yes" : "No"
    }));

    // Send the response with formatted requests
    res.status(200).json({
      requests: formattedRequests
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
