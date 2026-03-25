import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be guest
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: "General Inquiry"
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Replied', 'Closed'],
        default: 'Pending'
    },
    adminReply: {
        type: String,
        default: ""
    },
    isRead: {
        type: Boolean,
        default: false
    },
    repliedAt: {
        type: Date
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
