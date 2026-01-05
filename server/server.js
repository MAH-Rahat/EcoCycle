// server.js

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

// Import the new routes
import collectionReportRoutes from './routes/collectionReportRoutes.js';  // NEW
import qrCodeRoutes from './routes/qrCodeRoutes.js';  // NEW

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection Logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            ssl: true,
            tlsInsecure: true,
        });
        console.log('MongoDB connection established successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

// Middleware setup
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes); 
app.use('/api/pickup', pickupRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/rewards', rewardRoutes); 

// Register the new routes
app.use('/api/collection-report', collectionReportRoutes);  // NEW Route
app.use('/api/qrcode', qrCodeRoutes);  // NEW Route

// Start database connection, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Analytics Routes
app.use('/api/analytics', analyticsRoutes);
