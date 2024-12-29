import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { requestId } = req.body;
    
    console.log('Received requestId:', requestId, typeof requestId); // Debug log

    const updatedRequest = await LeaveRequest.findOneAndUpdate(
      { ID: parseInt(requestId, 10) },
      { $set: { cancel: "1" } },
      { new: true }
    );

    console.log('Updated request:', updatedRequest); // Debug log

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.status(200).json({ 
      message: 'Leave request cancelled successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
