import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js'; 
import pickupRoutes from './routes/pickupRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js'; 
import rewardRoutes from './routes/rewardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import collectionReportRoutes from './routes/collectionReportRoutes.js';
import qrCodeRoutes from './routes/qrCodeRoutes.js';
import userRoutes from './routes/userRoutes.js'; // NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection established successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes); 
app.use('/api/pickup', pickupRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/rewards', rewardRoutes); 
app.use('/api/analytics', analyticsRoutes);
app.use('/api/collection-report', collectionReportRoutes);
app.use('/api/qrcode', qrCodeRoutes);
app.use('/api/users', userRoutes); // Registers Access Control endpoints

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

export default app;