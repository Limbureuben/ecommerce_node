const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName: { type: String, required: true, maxlength: 255},
    category: { 
        type: String, 
        required: true,
        enum: ['men', 'women', 'kids']
    },
    realPrice: { type: Number, required: true, min: 0},
    discount: { type: Number, default: 0},
    descriptions: { type: String, required: true, maxlength: 500},
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL'],
        required: true
    },
    totalReviews: { type: Number, default: 0},
    image: { type: String, default: null},
    status: {
      type: String,
      enum: ["available", "purchased"],
      default: "available",
    },
}, { timestamps: true});


module.exports = mongoose.model('Product', productSchema);