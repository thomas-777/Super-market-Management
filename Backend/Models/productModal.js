import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    p_name: {
        type: String,
        required: true,
    },
    p_price: {
        type: Number,
        required: true,
    },
    p_stock: {
        type: Number,
        required: true,
    },

});

const Product = mongoose.model('Product', productSchema);

export default Product;