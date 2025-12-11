// server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['citizen', 'collector', 'admin'], 
        default: 'citizen',
        required: true 
    },
    // User points field
    points: { 
        type: Number, 
        default: 0 
    },
    adminCode: { type: String, select: false } 
}, {
    timestamps: true
});

// --- CRITICAL FIX: The userSchema.pre('save') middleware is REMOVED for stability ---

// Method to verify password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;