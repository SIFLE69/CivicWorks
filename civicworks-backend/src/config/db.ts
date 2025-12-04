import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/civicworks';

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${(error as Error).message}`);
        // In production (Vercel), throw the error so we know DB is down
        // In local development, just log and continue
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            throw error;
        }
        console.log('Continuing without database in development mode...');
    }
};

export default connectDB;
