const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
        base: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
        sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
        cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
        veggies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }],
        meat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }]
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paymentStatus: { type: String, required: true, enum: ['Pending', 'success', 'failed'], default: 'Pending' },
    status: { type: String, required: true, enum: ['Order Received', 'In the kitchen', 'Sent to delivery'], default: 'Order Received' },
    razorpayOrderId: String,
    razorpayPaymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
