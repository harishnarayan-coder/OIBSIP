import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Pizza3DModel from '../components/Pizza3DModel';
import '../styles/builder.css';

const PizzaBuilder = () => {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState({
        base: [], sauce: [], cheese: [], veggies: [], meat: []
    });
    const [loading, setLoading] = useState(true);

    const steps = ['base', 'sauce', 'cheese', 'veggies', 'meat'];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const { data } = await api.get('/inventory');
                // Group by category, ignore items with less than 1 stock
                const grouped = data.reduce((acc, item) => {
                    if (item.stock > 0) {
                        acc[item.category].push(item);
                    }
                    return acc;
                }, { base: [], sauce: [], cheese: [], veggies: [], meat: [] });
                setIngredients(grouped);
            } catch (error) {
                toast.error('Failed to load ingredients');
            } finally {
                setLoading(false);
            }
        };
        fetchIngredients();
    }, []);

    const handleSelectSingle = (item, type) => {
        if (cart[type]?._id === item._id) {
            // Deselect if already selected
            dispatch({ type: `SET_${type.toUpperCase()}`, payload: null });
        } else {
            dispatch({ type: `SET_${type.toUpperCase()}`, payload: item });
        }
    };

    const handleToggleMultiple = (item, type) => {
        const isSelected = cart[type].some(i => i._id === item._id);
        const actionType = type === 'veggies' ? 'VEGGIE' : 'MEAT';
        if (isSelected) {
            dispatch({ type: `REMOVE_${actionType}`, payload: item._id });
        } else {
            dispatch({ type: `ADD_${actionType}`, payload: item });
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            // Validation
            const stepName = steps[currentStep];
            if ((stepName === 'base' && !cart.base) ||
                (stepName === 'sauce' && !cart.sauce) ||
                (stepName === 'cheese' && !cart.cheese)) {
                return toast.error(`Please select a ${stepName} before proceeding`);
            }
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleCheckout = () => {
        if (!cart.base || !cart.sauce || !cart.cheese) {
            return toast.error('Please complete your pizza (Base, Sauce, Cheese are required) before checkout');
        }
        navigate('/checkout');
    };

    if (loading) return <div className="builder-loading">Loading delicious ingredients...</div>;

    const currentCategory = steps[currentStep];
    const isMultiple = currentCategory === 'veggies' || currentCategory === 'meat';

    return (
        <div className="builder-container">
            <div className="builder-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '2em', fontWeight: '800', background: 'linear-gradient(90deg, #ff416c, #ff4b2b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Build Your Custom Pizza
                    </h1>
                </div>
                <div className="progress-bar">
                    {steps.map((step, index) => (
                        <div key={step} className={`step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}>
                            <div className="step-number">{index + 1}</div>
                            <span className="step-name">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="builder-content-split">
                {/* 3D CANVAS COLUMN */}
                <div className="split-left-3d">
                    <Pizza3DModel cart={cart} />
                </div>

                {/* INGREDIENT CARDS COLUMN */}
                <div className="split-right-ui" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h2 style={{ fontSize: '1.5em', marginBottom: '15px' }}>
                        Choose Your {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
                    </h2>

                    <div className="modern-cards-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '20px',
                        flexGrow: 1,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '10px 5px'
                    }}>
                        {ingredients[currentCategory].map(item => {
                            let isSelected = false;
                            let count = 0;
                            if (!isMultiple) {
                                isSelected = cart[currentCategory]?._id === item._id;
                            } else {
                                count = cart[currentCategory]?.filter(i => i._id === item._id).length || 0;
                                isSelected = count > 0;
                            }

                            return (
                                <div
                                    key={item._id}
                                    style={{
                                        position: 'relative',
                                        borderRadius: '16px',
                                        background: isSelected ? `${item.color || '#ff4b2b'}1A` : 'white',
                                        border: isSelected ? `2px solid ${item.color || '#ff4b2b'}` : '2px solid #eee',
                                        boxShadow: isSelected ? `0 8px 20px ${item.color || '#ff4b2b'}33` : '0 4px 6px rgba(0,0,0,0.05)',
                                        cursor: !isMultiple ? 'pointer' : 'default',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        padding: '15px'
                                    }}
                                    onClick={() => !isMultiple && handleSelectSingle(item, currentCategory)}
                                    // Hover effect handled inline for simplicity and immediate feedback
                                    onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                    onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: '#f8f9fa',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                        border: '1px solid #eee'
                                    }}>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: '#ccc', fontSize: '2em' }}>🍕</span>
                                        )}
                                    </div>
                                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1em', fontWeight: '600', color: '#333' }}>{item.name}</h3>
                                    <p style={{ margin: 0, fontSize: '1.2em', fontWeight: '700', color: '#ff4b2b' }}>₹{item.price}</p>

                                    {isMultiple ? (
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const actionType = currentCategory === 'veggies' ? 'VEGGIE' : 'MEAT';
                                                    dispatch({ type: `REMOVE_${actionType}`, payload: item._id });
                                                }}
                                                disabled={count === 0}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: count > 0 ? (item.color || '#ff4b2b') : '#eee', color: count > 0 ? 'white' : '#aaa', cursor: count > 0 ? 'pointer' : 'not-allowed', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: count > 0 ? `0 2px 4px ${item.color || '#ff4b2b'}4D` : 'none' }}>
                                                -
                                            </button>
                                            <span style={{ margin: '0 15px', fontWeight: 'bold', fontSize: '1.2em' }}>{count}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const actionType = currentCategory === 'veggies' ? 'VEGGIE' : 'MEAT';
                                                    dispatch({ type: `ADD_${actionType}`, payload: item });
                                                }}
                                                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: item.color || '#2ecc71', color: 'white', cursor: 'pointer', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 4px ${item.color || '#2ecc71'}4D` }}>
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        isSelected && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: item.color || '#ff4b2b',
                                                color: 'white',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                ✓
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                        <button onClick={handlePrev} disabled={currentStep === 0} className="btn-outline" style={{ opacity: currentStep === 0 ? 0.5 : 1 }}>
                            &larr; Back
                        </button>

                        <div style={{ fontSize: '1.2em', fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#555' }}>
                            Subtotal: <span style={{ color: 'var(--primary)', marginLeft: '10px', fontSize: '1.4em' }}>₹{cart.totalPrice}</span>
                        </div>

                        {currentStep < steps.length - 1 ? (
                            <button onClick={handleNext} className="btn-primary">
                                Next &rarr;
                            </button>
                        ) : (
                            <button onClick={handleCheckout} className="btn-primary" style={{ background: '#2b2b2b', borderColor: '#2b2b2b' }}>
                                Checkout 🛒
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PizzaBuilder;
