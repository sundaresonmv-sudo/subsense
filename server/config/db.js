const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subsense';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    try {
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri('subsense');
      await mongoose.connect(memoryUri);
      console.log('MongoDB connected successfully using in-memory server');
    } catch (memoryError) {
      console.error('MongoDB connection failed:', error.message);
      console.error('In-memory MongoDB fallback failed:', memoryError.message);
    }
  }
};

module.exports = connectDB;
