import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

export default async function handler(req, res) {
  // Ensure the request method is PUT
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectDB();
    
    // Extract the request ID from the body
    const { requestId } = req.body;
    
    console.log('Received requestId:', requestId, typeof requestId); // Debug log

    // Find and update the leave request to mark it as cancelled
    const updatedRequest = await LeaveRequest.findOneAndUpdate(
      { ID: parseInt(requestId, 10) },
      { $set: { cancel: "1" } },
      { new: true }
    );

    console.log('Updated request:', updatedRequest); // Debug log

    // If no request is found, return a 404 error
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Send a success response with the updated request
    res.status(200).json({ 
      message: 'Leave request cancelled successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
