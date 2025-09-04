const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255},
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0},
    description: { type: String, required: true, maxlength: 255},
    image: { type: String, default: null},
    status: {
      type: String,
      enum: ["available", "purchased"],
      default: "available",
    },
}, { timestamps: true});


module.exports = mongoose.model('Product', productSchema);