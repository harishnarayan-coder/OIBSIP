const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { checkLowStock } = require('./inventoryController');

const addOrderItems = async (req, res) => {
    try {
        const { items, totalPrice, paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;
        if (!items || !items.base || !items.sauce || !items.cheese) {
            return res.status(400).json({ message: 'Incomplete pizza order' });
        }

        const ingredientIds = [items.base, items.sauce, items.cheese, ...(items.veggies || []), ...(items.meat || [])];
        for (const id of ingredientIds) {
            await Inventory.findByIdAndUpdate(id, { $inc: { stock: -1 } });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice,
            paymentStatus: paymentStatus || 'Pending',
            razorpayOrderId,
            razorpayPaymentId
        });

        // Check low stock after order
        checkLowStock();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.base items.sauce items.cheese items.veggies items.meat', 'name');
        if (order) { res.json(order); }
        else { res.status(404).json({ message: 'Order not found' }); }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
