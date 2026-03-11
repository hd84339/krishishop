const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Done', 'Rejected'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'COD',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
