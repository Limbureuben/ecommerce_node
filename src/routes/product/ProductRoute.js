const express = require('express');
const  Product = require('../../model/product/productModel');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/product_images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed!'));
  },
});


router.post('/product-register', upload.single('image'), async (req, res) => {
    const { name, category, price, description } = req.body;
    try {
        const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/public/product_images/${req.file.filename}`
      : null;
      
        const products = await Product.create({
            name,
            category,
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
            message: 'Product deleted successfully'
        });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
} );



router.put("/product/:id/purchase", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "purchased" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
      message: "Product marked as purchased",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update product status",
      error: err.message,
    });
  }
});



module.exports = router;