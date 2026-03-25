import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './model/userModel.js';

dotenv.config();

const updateTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to database');

        // Update test user with known password
        const testPassword = 'password123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        
        await User.updateOne(
            { email: 'bhargavisurampudi1@gmail.com' },
            { password: hashedPassword }
        );
        
        console.log('Test user updated:');
        console.log('Email: bhargavisurampudi1@gmail.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Update failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

updateTestUser();
