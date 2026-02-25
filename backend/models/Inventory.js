const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['base', 'sauce', 'cheese', 'veggies', 'meat'], required: true },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, default: '' },
    color: { type: String, default: '#ff4b2b' },
    isVeg: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
