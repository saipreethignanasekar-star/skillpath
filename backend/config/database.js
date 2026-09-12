import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillpath');
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    console.warn(`[MongoDB] Operating in memory fallback mode if database is unavailable.`);
  }
};
