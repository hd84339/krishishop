const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12, featured } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, featured } = req.body;

    let imageData = { url: '', public_id: '' };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'krishi-shop/products',
        transformation: [{ width: 800, height: 800, crop: 'fill' }],
      });
      imageData = { url: result.secure_url, public_id: result.public_id };
    }

    const product = await Product.create({
      name,
      category,
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      featured: featured === 'true',
      image: imageData,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, price, description, stock, featured } = req.body;
    let imageData = product.image;

    if (req.file) {
      // Delete old image from cloudinary
      if (product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'krishi-shop/products',
        transformation: [{ width: 800, height: 800, crop: 'fill' }],
      });
      imageData = { url: result.secure_url, public_id: result.public_id };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
        featured: featured === 'true',
        image: imageData,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from cloudinary
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
