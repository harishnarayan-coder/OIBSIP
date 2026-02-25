import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/dashboard.css';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [previewItems, setPreviewItems] = useState([]);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const { data } = await api.get('/inventory');
                // Grab a diverse mix of items to show on the dashboard (e.g. 8 items)
                const inStock = data.filter(item => item.stock > 0);
                // Shuffle and pick top 8
                const shuffled = inStock.sort(() => 0.5 - Math.random());
                setPreviewItems(shuffled.slice(0, 8));
            } catch (error) {
                console.error("Failed to load dashboard preview", error);
            }
        };
        fetchPreview();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <span className="pizza-emoji">🍕</span>
                    Pizza App
                </div>
                <div className="nav-links">
                    <span className="user-greeting">Welcome, {user?.name}</span>
                    <Link to="/orders" className="nav-link">My Orders</Link>
                    {user?.role === 'admin' && <Link to="/admin" className="nav-link admin-badge">Admin Panel</Link>}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <main className="dashboard-main">
                <div className="hero-section">
                    <h1>Craving a Masterpiece?</h1>
                    <p>Build your perfect custom pizza from scratch using our fresh ingredients.</p>
                    <Link to="/build" className="cta-btn">Start Building</Link>
                </div>

                <section className="dashboard-varieties" style={{ marginTop: '50px', padding: '0 20px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2em', color: '#1f2937' }}>Available Varieties & Ingredients</h2>
                    <div className="modern-cards-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px'
                    }}>
                        {previewItems.map(item => (
                            <div key={item._id} style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '20px',
                                textAlign: 'center',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                border: '1px solid #f3f4f6',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    marginBottom: '10px',
                                    overflow: 'hidden',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    {item.imageUrl && item.imageUrl.startsWith('data:') ? (
                                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <span style={{ fontSize: '2.5rem', lineHeight: '80px' }}>🍕</span>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', margin: '10px 0 5px', color: '#111827' }}>{item.name}</h3>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    background: `${item.color || '#ff4b2b'}22`,
                                    color: item.color || '#ff4b2b',
                                    marginBottom: '10px'
                                }}>{item.category}</span>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#ff4b2b', fontSize: '1.1rem' }}>₹{item.price}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
                        <Link to="/build" className="btn-outline">View All & Build Pizza &rarr;</Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;
