import express from 'express';
import User from '../models/User.js'; 
import bcrypt from 'bcryptjs';

const router = express.Router();
// Set the constant secret code for Admin registration
const ADMIN_SECRET_CODE = "ECOADMIN"; 


// --- REGISTER ---
router.post('/register', async (req, res) => {
    const { name, email, mobile, username, password, role, adminCode } = req.body;

    // --- CRITICAL DEBUGGING LOG ---
    // This logs the received data before processing
    console.log(`[DEBUG] Attempting registration for role: ${role}`);
    if (role === 'admin') {
        console.log(`[DEBUG] Received adminCode: "${adminCode}"`);
    }
    // ---------------------------------

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Check Admin Code
        if (role === 'admin') {
            // FIX: Define inputCode clearly and ensure case conversion.
            const inputCode = String(adminCode || '').toUpperCase();

            if (inputCode !== ADMIN_SECRET_CODE) {
                return res.status(401).json({ message: 'Invalid Admin Private Code.' });
            }
        }
        
        // --- CRITICAL FIX: HASH PASSWORD DIRECTLY HERE ---
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // -------------------------------------------------

        const user = await User.create({
            name, 
            email, 
            mobile, 
            username, 
            password: hashedPassword, // Use the pre-hashed password
            role,
            points: 100, // Grant 100 free points on creation
            adminCode: role === 'admin' ? ADMIN_SECRET_CODE : undefined,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
                token: 'JWT_SKIPPED_FOR_TESTING', 
            });
        }
    } catch (error) {
        console.error('SERVER REGISTER CRASH ERROR:', error); 
        
        if (error.code === 11000) { 
             return res.status(400).json({ message: 'Email or Username already exists. Please use unique credentials.' });
        }
        
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points, 
                token: 'JWT_SKIPPED_FOR_TESTING', 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('SERVER LOGIN ERROR:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});

export default router;