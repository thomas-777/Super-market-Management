import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    cust_contact:{
        type: Number,
        required:true
    },
    cust_name:{
        type: String,
        required: true,
    },
    cartItems: {
        type: Array,
        default: [],
    }
});

const Sale = mongoose.model('Sale', salesSchema);

export default Sale;