import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js'; // Correct import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        // Includes SSL fix options
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
app.use('/api/waste', wasteRoutes); // Correct route handler integration

// Start database connection, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});