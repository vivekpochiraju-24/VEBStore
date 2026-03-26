import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/userModel.js';

dotenv.config();

async function checkUser() {
    await mongoose.connect(process.env.MONGODB_URL);
    const user = await User.findOne({ email: 'vivekpochiraju@gmail.com' });
    console.log('User JSON:', JSON.stringify(user, null, 2));
    process.exit(0);
}

checkUser().catch(err => {
    console.error(err);
    process.exit(1);
});
