const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');

const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({});
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getInventoryById = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (item) { res.json(item); }
        else { res.status(404).json({ message: 'Item not found' }); }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createInventoryItem = async (req, res) => {
    try {
        const { name, category, price, stock, isVeg } = req.body;
        const item = await Inventory.create({ name, category, price, stock, isVeg });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Invalid item data' });
    }
};

const updateInventoryItem = async (req, res) => {
    try {
        const { name, category, price, stock, isVeg } = req.body;
        const item = await Inventory.findById(req.params.id);
        if (item) {
            item.name = name || item.name;
            item.category = category || item.category;
            if (price !== undefined) item.price = price;
            if (stock !== undefined) item.stock = stock;
            if (isVeg !== undefined) item.isVeg = isVeg;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid item data' });
    }
};

const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const checkLowStock = async () => {
    try {
        const lowStockItems = await Inventory.find({ stock: { $lt: 20 } });
        if (lowStockItems.length > 0) {
            const itemNames = lowStockItems.map(i => i.name + ' (' + i.category + '): ' + i.stock + ' left').join('\n');
            const message = 'Low Stock Alert!\n\nThe following items are running low:\n\n' + itemNames;
            await sendEmail({
                email: process.env.EMAIL_USER,
                subject: 'LOW STOCK ALERT - Pizza App',
                message
            });
        }
    } catch (error) {
        console.error('Low stock check error:', error);
    }
};

module.exports = { getInventory, getInventoryById, createInventoryItem, updateInventoryItem, deleteInventoryItem, checkLowStock };
