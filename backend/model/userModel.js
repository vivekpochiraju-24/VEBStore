import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    phone: {
        type: String,
        required: false
    },
    cartData: {
        type: Object,
        default: {}
    },
    whatsappOptIn: {
        type: Boolean,
        default: false
    },
    whatsappPhone: {
        type: String,
        default: ""
    },
    preferredProductType: {
        type: String,
        default: "TopWear"
    },
    supercoins: {
        type: Number,
        default: 0
    },
    emailUpdatesOptIn: {
        type: Boolean,
        default: true
    },
    wishlist: {
        type: Array,
        default: []
    }
} , { timestamps: true, minimize: false })

const User = mongoose.model("User", userSchema)

export default User