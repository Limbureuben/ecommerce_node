const express = require('express');
const  Product = require('../../model/product/productModel');
const router = express.Router();

router.post('/product-register', async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const products = await Product.create({
            name,
            price,
            description,
            image: imageUrl
        });
        res.status(200).json({
            success: true,
            product: products,
            message: 'Product registred successfully',
        });
    } catch( err){
        res.status(400).json({
            success: false,
            product: null,
            message: 'Failed to register product', err
        });
    }
});


//Let us fetch the productfrom the database here

//we will add a middleeware to authenticate the user
router.get('/get-all-products', async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products: products,
            message: 'Data fetched successfully'
        });
    } catch( err) {
        res.status(400).json({
            success: false,
            products: null,
            message: 'Product fetch failed', err
        });
    }
});



//update rest API

router.put('/update-product/:id', async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updateProduct) {
            return res.json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            updateProduct
        });
    } catch(err) {
        return res.json({
        message: err.message
        });
    }
});


router.delete('/delete-product/:id', async (req, res) => {
    try {
        const deleteproduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if(!deleteproduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            messag: 'Product delete successfuly'
        });
    } catch(err) {
        res.json({message: err.message})
    }
} );

//so now we can fetch, update and delete product
module.exports = router;