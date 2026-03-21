import mongoose from "mongoose";

const connectDb = async () => {
    let retries = 3;
    while (retries > 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URL, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                maxPoolSize: 10,
                retryWrites: true,
            });
            console.log("✅ MongoDB connected successfully");
            return;
        } catch (error) {
            retries--;
            console.log(`❌ DB connection failed. Retries left: ${retries}. Error: ${error.message}`);
            if (retries === 0) {
                console.error("💥 Could not connect to MongoDB after 3 attempts.");
                console.error("👉 Fix: Go to MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0 (allow all)");
            } else {
                await new Promise(res => setTimeout(res, 3000)); // wait 3s before retry
            }
        }
    }
}

export default connectDb;