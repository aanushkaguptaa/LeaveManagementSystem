import { connectDB } from '@/server/config/db';
import LeaveRequest from '@/server/models/LeaveRequest';

export default async function handler(req, res) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectDB();
    
    // Extract request data from the body
    const { sapId, type, from, to, reason } = req.body;

    // Validate that a reason is provided
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Reason is required' });
    }

    // Get the count of all documents (including cancelled ones) to generate a new ID
    const count = await LeaveRequest.countDocuments();
    const nextId = count + 1;

    // Create a new leave request document
    const newRequest = new LeaveRequest({
      ID: nextId,
      SAPID: sapId,
      type,
      from: new Date(from),
      to: new Date(to),
      reason: reason.trim(),
      takenOn: new Date(),
      cancel: "0"
    });

    // Save the new leave request to the database
    await newRequest.save();
    
    // Send a success response with the created request
    res.status(201).json({ 
      message: 'Leave request created successfully',
      request: newRequest
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal server error'
    });
  }
}
