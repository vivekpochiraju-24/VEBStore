import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    oldProduct: {
        type: String,
        required: true
    },
    oldProductCondition: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        required: true
    },
    oldProductImages: [{
        type: String,
        required: true
    }],
    oldProductDescription: {
        type: String,
        required: true
    },
    clothQuality: {
        type: String,
        required: true
    },
    clothYearsUsed: {
        type: String,
        required: true
    },
    clothDamages: {
        type: String,
        required: true
    },
    requestedCoins: {
        type: Number,
        default: 0
    },
    grantedCoins: {
        type: Number,
        default: 0
    },
    adminNotes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Return to Hub'],
        default: 'Pending'
    },
    exchangeDate: {
        type: Date,
        default: Date.now
    },
    completedDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Exchange = mongoose.model('Exchange', exchangeSchema);

export default Exchange;
