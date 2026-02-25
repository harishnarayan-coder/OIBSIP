import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminOrders = () => {
    const { logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const statuses = ['Order Received', 'In the kitchen', 'Sent to delivery'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="admin-loading">Loading Orders...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Order Management</h1>
                    <p>Track and update customer orders</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="/admin" className="btn-outline">
                        &larr; Back to Dashboard
                    </a>
                    <button onClick={logout} className="btn-primary" style={{ background: '#222', borderColor: '#222' }}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No orders yet</div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-card" style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>{new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#ff4b2b', marginBottom: '5px' }}>₹{order.totalPrice}</div>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '0.8em', fontWeight: 'bold',
                                        backgroundColor: order.paymentStatus === 'success' ? '#d4edda' : '#f8d7da',
                                        color: order.paymentStatus === 'success' ? '#155724' : '#721c24'
                                    }}>
                                        {order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <strong>Customer: </strong> {order.user?.name || order.user?.email || 'Unknown'}
                            </div>

                            <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>Items</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li>Base, Sauce, Cheese</li>
                                    {order.items?.veggies?.length > 0 && <li>+ {order.items.veggies.length} Veggies</li>}
                                    {order.items?.meat?.length > 0 && <li>+ {order.items.meat.length} Meats</li>}
                                </ul>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <strong>Update Status:</strong>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    style={{
                                        padding: '8px', borderRadius: '4px', border: '1px solid #ccc',
                                        backgroundColor: order.status === 'Order Received' ? '#fff3cd' : (order.status === 'Sent to delivery' ? '#d4edda' : '#cce5ff'),
                                        fontWeight: 'bold', minWidth: '150px'
                                    }}
                                >
                                    {statuses.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
