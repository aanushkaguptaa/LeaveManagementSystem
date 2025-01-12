const mongoose = require('mongoose');

let isConnected = false; // Track the connection status

// Function to connect to the MongoDB database
const connectDB = async () => {
  // If already connected, exit the function
  if (isConnected) {
    return;
  }

  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true; // Update connection status
    console.log('Connected to MongoDB'); // Log successful connection
  } catch (error) {
    console.error('MongoDB connection error:', error); // Log connection error
    throw error; // Rethrow the error for handling
  }
};

module.exports = { connectDB }; // Export the connectDB function