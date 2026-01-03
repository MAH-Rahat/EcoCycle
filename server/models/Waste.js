import mongoose from 'mongoose';

const wasteSchema = new mongoose.Schema({
    // Links the waste item to the User who submitted it
    citizen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Material Details
    material: {
        type: String,
        required: true,
        enum: ['Plastic', 'Paper', 'Metal', 'Glass', 'E-Waste', 'Organic', 'Other'],
    },
    weight: {
        type: Number,
        required: true,
        min: 0.1, // Minimum weight for logging
    },
    photo: {
        type: String, // URL to the uploaded image
        required: false,
    },
    
    // Status and Workflow Tracking
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'Collected', 'Rejected'],
        default: 'Pending',
    },

    // Collector Assignment (Filled when accepted)
    collector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },

    // Pickup Request Details (Where and When the Citizen wants pickup)
    pickupDetails: {
        isRequested: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
            required: function() { return this.pickupDetails.isRequested; }, // Required only if requested
        },
        requestedTime: {
            type: Date,
            required: function() { return this.pickupDetails.isRequested; },
        },
    },

}, {
    timestamps: true
});


const Waste = mongoose.model('Waste', wasteSchema);
export default Waste;