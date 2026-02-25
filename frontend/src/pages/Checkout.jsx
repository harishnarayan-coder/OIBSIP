import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import '../styles/checkout.css';

const Checkout = () => {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!cart.base || !cart.sauce || !cart.cheese) {
        toast.error("Please complete your pizza first!", { id: 'incomplete-pizza' }); // prevent duplicate toasts
        return <Navigate to="/build" replace />;
    }

    const placeOrder = async (status, order_id, payment_id) => {
        try {
            const orderData = {
                items: {
                    base: cart.base._id,
                    sauce: cart.sauce._id,
                    cheese: cart.cheese._id,
                    veggies: cart.veggies.map(v => v._id),
                    meat: cart.meat.map(m => m._id)
                },
                totalPrice: cart.totalPrice,
                paymentStatus: status,
                razorpayOrderId: order_id,
                razorpayPaymentId: payment_id
            };
            await api.post('/orders', orderData);
            toast.success('Order placed successfully!');
            dispatch({ type: 'RESET_CART' });
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const orderRes = await api.post('/payment/create-order', {
                amount: cart.totalPrice
            });
            const { id: order_id, currency, amount, isDummy } = orderRes.data;

            if (isDummy) {
                toast.success("Demo Mode: Payment Simulated Successfully!");
                await placeOrder('success', order_id, 'dummy_payment_' + Date.now());
                setLoading(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
                amount: amount.toString(),
                currency: currency,
                name: "Pizza App",
                description: "Pizza Order Payment",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify-payment', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            await placeOrder('success', response.razorpay_order_id, response.razorpay_payment_id);
                        } else {
                            toast.error("Payment verification failed");
                            await placeOrder('failed', response.razorpay_order_id, response.razorpay_payment_id);
                        }
                    } catch (err) {
                        toast.error("Error verifying payment");
                    }
                },
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#ff6b6b" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed");
                placeOrder('failed', response.error.metadata.order_id, response.error.metadata.payment_id);
            });
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error processing payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">
                <h2>Order Summary</h2>
                <div className="summary-items" style={{ lineHeight: '2.5', fontSize: '1.05rem', marginTop: '20px' }}>
                    <p style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}><strong>Base:</strong> {cart.base.name} (₹{cart.base.price})</p>
                    <p style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}><strong>Sauce:</strong> {cart.sauce.name} (₹{cart.sauce.price})</p>
                    <p style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}><strong>Cheese:</strong> {cart.cheese.name} (₹{cart.cheese.price})</p>
                    {cart.veggies && cart.veggies.length > 0 && (
                        <p style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}><strong>Veggies:</strong> {cart.veggies.map(v => v.name).join(', ')}</p>
                    )}
                    {cart.meat && cart.meat.length > 0 && (
                        <p style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}><strong>Meat:</strong> {cart.meat.map(m => m.name).join(', ')}</p>
                    )}
                </div>
                <div className="summary-total">
                    <h3>Total Amount: ₹{cart.totalPrice}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        className="btn-primary"
                        onClick={handlePayment}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Processing...' : `Pay ₹${cart.totalPrice} Securely`}
                    </button>
                    <button
                        className="btn-outline"
                        onClick={() => navigate('/build')}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        &larr; Back to Edit Pizza
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
