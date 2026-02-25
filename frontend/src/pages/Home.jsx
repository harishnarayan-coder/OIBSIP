import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    return (
        <div className="home-wrapper">
            <nav className="home-navbar">
                <div className="logo-container">
                    <span className="logo-icon">🍕</span>
                    <span className="logo-text">PizzaVerse</span>
                </div>
                <div className="nav-actions">
                    <Link to="/auth" className="btn-outline">User Login</Link>
                    <Link to="/admin-login" className="btn-primary admin-badge">Admin Portal</Link>
                </div>
            </nav>

            <main>
                <section className="home-main">
                    <div className="home-content-left">
                        <h1 className="hero-title">Experience the Magic of <br /><span className="highlight">Perfect Pizza.</span></h1>
                        <p className="hero-subtitle">
                            Don't just order from a menu—build your masterpiece. Select your crust, spread your favorite sauce, and pile on the freshest ingredients with real-time price tracking.
                        </p>
                        <div className="hero-cta-group">
                            <Link to="/auth" className="btn-primary" style={{ fontSize: '1.2rem', padding: '18px 48px' }}>
                                Start Building <span className="arrow" style={{ marginLeft: '8px' }}>&rarr;</span>
                            </Link>
                        </div>
                        <div className="hero-features">
                            <div className="feature"><span className="checkmark">🍕</span> Custom Built</div>
                            <div className="feature"><span className="checkmark">⚡</span> Hot Delivery</div>
                            <div className="feature"><span className="checkmark">🧀</span> 100% Real Cheese</div>
                        </div>
                    </div>

                    <div className="home-content-right">
                        <div className="blob-bg"></div>
                        {/* Bulletproof stylized hero graphic instead of broken image links */}
                        <div className="hero-pizza-img" style={{ fontSize: '16rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', width: '400px', background: 'radial-gradient(circle, rgba(233,196,106,0.5) 0%, transparent 60%)', borderRadius: '50%', margin: '0' }}>
                            🍕
                        </div>
                    </div>
                </section>

                <section className="section bg-alt" style={{ background: '#ffffff', position: 'relative', zIndex: 10 }}>
                    <h2 className="section-title">How PizzaVerse Works</h2>
                    <div className="how-grid">
                        <div className="how-card">
                            <span className="how-icon">🍅</span>
                            <h3>1. Choose Your Base</h3>
                            <p>Select from our freshly kneaded doughs and authentic, rich sauces. Hand-tossed, thin crust, or cheese burst.</p>
                        </div>
                        <div className="how-card">
                            <span className="how-icon">🧀</span>
                            <h3>2. Add Toppings</h3>
                            <p>Pile on the freshest veggies and premium meats. Watch your pizza come alive and track the price instantly.</p>
                        </div>
                        <div className="how-card">
                            <span className="how-icon">🛵</span>
                            <h3>3. Fast Checkout</h3>
                            <p>Pay securely via Razorpay and track your order status live from our oven straight to your doorstep.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <span className="footer-logo">🍕 PizzaVerse</span>
                <p>&copy; 2026 PizzaVerse Delivery. The tastiest pizza in the metaverse.</p>
            </footer>
        </div>
    );
};

export default Home;
