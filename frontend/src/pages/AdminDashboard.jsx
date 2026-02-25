import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

const AdminDashboard = () => {
    const { logout } = useAuth();

    // Inventory State
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'base', price: '', stock: '', imageUrl: '', threshold: 20 });
    const [editingId, setEditingId] = useState(null);
    const categories = ['base', 'sauce', 'cheese', 'veggies', 'meat'];

    // Loading State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const { data } = await api.get('/inventory');
            setInventory(data);
        } catch (error) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory', newItem);
            toast.success('Item added successfully');
            setNewItem({ name: '', category: 'base', price: '', stock: '', imageUrl: '', threshold: 20 });
            fetchInventory();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding item');
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await api.put(`/inventory/${id}`, updatedData);
            toast.success('Item updated');
            setEditingId(null);
            fetchInventory();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/inventory/${id}`);
                toast.success('Item deleted');
                fetchInventory();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting item');
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Manage Pizza Inventory</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <a href="/admin/orders" className="btn-outline">
                            View Orders &rarr;
                        </a>
                        <button onClick={logout} className="btn-primary" style={{ background: '#222', borderColor: '#222' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                {/* --- INVENTORY SECTION --- */}
                <section className="add-item-section">
                    <h2>Add New Ingredient</h2>
                    <form onSubmit={handleCreate} className="admin-form">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Initial Stock"
                            value={newItem.stock}
                            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                            required
                        />
                        <input
                            type="url"
                            placeholder="Image URL (Optional)"
                            value={newItem.imageUrl}
                            onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        />
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Add Item</button>
                    </form>
                </section>

                <section className="inventory-section">
                    <h2>Current Inventory</h2>
                    <div className="inventory-grid">
                        {categories.map(category => (
                            <div key={category} className="inventory-category">
                                <h3>{category.toUpperCase()}</h3>
                                <ul className="item-list">
                                    {inventory.filter(item => item.category === category).map(item => (
                                        <li key={item._id} className={`inventory-item ${item.stock < item.threshold ? 'low-stock' : ''}`}>
                                            {editingId === item._id ? (
                                                <div className="edit-form">
                                                    <input type="text" defaultValue={item.name} id={`name-${item._id}`} />
                                                    <input type="number" defaultValue={item.price} id={`price-${item._id}`} />
                                                    <input type="number" defaultValue={item.stock} id={`stock-${item._id}`} />
                                                    <input type="url" defaultValue={item.imageUrl} placeholder="Image URL" id={`img-${item._id}`} />
                                                    <button onClick={() => handleUpdate(item._id, {
                                                        name: document.getElementById(`name-${item._id}`).value,
                                                        price: document.getElementById(`price-${item._id}`).value,
                                                        stock: document.getElementById(`stock-${item._id}`).value,
                                                        imageUrl: document.getElementById(`img-${item._id}`).value
                                                    })} className="btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                                                    <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="item-info">
                                                        <span className="item-name">
                                                            {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle', objectFit: 'cover' }} />}
                                                            {item.name}
                                                        </span>
                                                        <span className="item-price">₹{item.price}</span>
                                                        <span className="item-stock">Stock: {item.stock}</span>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button onClick={() => setEditingId(item._id)} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>Edit</button>
                                                        <button onClick={() => handleDelete(item._id)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem', background: '#222', borderColor: '#222' }}>Delete</button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
