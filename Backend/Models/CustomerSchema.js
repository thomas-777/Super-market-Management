import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    cust_name: {
        type: String,
        required: true,
    },
    cust_contact: {
        type: Number,
        required: true,
    }
});

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;