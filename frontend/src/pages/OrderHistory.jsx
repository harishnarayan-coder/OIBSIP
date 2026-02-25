import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import '../styles/history.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                toast.error('Failed to load your orders');
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (loading) return <div className="history-loading">Fetching your delicious history...</div>;

    return (
        <div className="history-container">
            <header className="history-header" style={{ marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '10px' }}>My Orders</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track your current pizzas and view past favorites.</p>
            </header>

            <div className="orders-wrapper">
                {orders.length === 0 ? (
                    <div className="no-orders">
                        <span className="sad-pizza">🍕😢</span>
                        <p>No orders yet. Time to build a masterpiece!</p>
                        <Link to="/build" className="cta-btn small">Build a Pizza</Link>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className={`history-card ${order.status === 'Sent to delivery' ? 'completed' : 'active'}`}>
                            <div className="history-card-header">
                                <div className="order-basics">
                                    <h3>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                                    <span className="order-time">{new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="order-price">₹{order.totalPrice}</div>
                            </div>

                            <div className="status-tracker">
                                <div className={`status-step ${order.status !== 'Pending' ? 'active' : ''}`}>
                                    <div className="step-icon">📋</div>
                                    <span>Received</span>
                                </div>
                                <div className="status-line"></div>
                                <div className={`status-step ${order.status === 'In the kitchen' || order.status === 'Sent to delivery' ? 'active' : ''}`}>
                                    <div className="step-icon">👨‍🍳</div>
                                    <span>Kitchen</span>
                                </div>
                                <div className="status-line"></div>
                                <div className={`status-step ${order.status === 'Sent to delivery' ? 'active' : ''}`}>
                                    <div className="step-icon">🛵</div>
                                    <span>Delivery</span>
                                </div>
                            </div>

                            <div className="history-details">
                                <p><strong>Payment:</strong> <span className={`payment-${order.paymentStatus}`}>{order.paymentStatus}</span></p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
