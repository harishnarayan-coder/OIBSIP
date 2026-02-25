const crypto = require('crypto');
const Razorpay = require('razorpay');

const createOrder = async (req, res) => {
    try {
        const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
        const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

        if (key_id === 'rzp_test_placeholder' || key_id === 'your_razorpay_key_id') {
            return res.json({
                id: 'dummy_order_' + Date.now(),
                amount: req.body.amount * 100,
                currency: 'INR',
                isDummy: true
            });
        }

        const instance = new Razorpay({ key_id, key_secret });

        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: 'receipt_order_' + Date.now()
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json({ message: 'Error creating order' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
        const generated_signature = hmac.digest('hex');

        if (signature === generated_signature) {
            res.json({ success: true, message: 'Payment verified' });
        } else {
            res.json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
