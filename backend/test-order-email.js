import dotenv from 'dotenv';
import { sendOrderEmail } from './utils/emailService.js';
import mongoose from 'mongoose';

dotenv.config();

const mockOrder = {
    _id: new mongoose.Types.ObjectId(),
    items: [
        { name: 'Premium Classic Shirt', quantity: 1, size: 'L', price: 1500 }
    ],
    amount: 1500,
    address: {
        firstName: 'Vivek',
        lastName: 'Pochiraju',
        street: '123 Fashion Street',
        city: 'Hyderabad',
        state: 'Telangana',
        pinCode: '500001',
        country: 'India',
        phone: '9876543210',
        email: 'vivekpochiraju@gmail.com'
    }
};

const targetEmail = 'vivekpochiraju@gmail.com';

console.log(`[TEST] Mimicking Order Controller email trigger...`);
console.log(`[TEST] Sender: ${process.env.EMAIL_USER}`);
console.log(`[TEST] Recipient: ${targetEmail}`);

sendOrderEmail(targetEmail, mockOrder)
    .then(() => {
        console.log('✅ Success! Order email simulation completed.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed! Error details:');
        console.error(err);
        process.exit(1);
    });
