const mongoose = require('mongoose');
require('dotenv').config();

const Inventory = require('./models/Inventory');

const genSVG = (emoji, hex) => {
    // Generate an incredibly beautiful 3D subtle gradient sphere containing the emoji
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${hex}" stop-opacity="0.1"/>
                <stop offset="100%" stop-color="${hex}" stop-opacity="0.5"/>
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="${hex}" flood-opacity="0.5"/>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#g)" />
        <text x="50" y="55" font-size="45" text-anchor="middle" dominant-baseline="middle" filter="url(#shadow)">${emoji}</text>
    </svg>`.trim().replace(/\n/g, '');
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const seedData = [
    // --- BASES (5) ---
    { name: 'Classic Hand-Tossed', category: 'base', price: 100, stock: 100, threshold: 20, color: '#f4a261', imageUrl: genSVG('🌾', '#f4a261') },
    { name: '100% Whole Wheat', category: 'base', price: 120, stock: 80, threshold: 20, color: '#a98467', imageUrl: genSVG('🍞', '#a98467') },
    { name: 'Cheese Burst Crust', category: 'base', price: 180, stock: 50, threshold: 10, color: '#ffd166', imageUrl: genSVG('🧀', '#ffd166') },
    { name: 'Thin & Crispy', category: 'base', price: 110, stock: 90, threshold: 20, color: '#e0b1cb', imageUrl: genSVG('🥖', '#e0b1cb') },
    { name: 'Gluten-Free Base', category: 'base', price: 150, stock: 40, threshold: 10, color: '#84a98c', imageUrl: genSVG('🥗', '#84a98c') },

    // --- SAUCES (5) ---
    { name: 'Classic Tomato Basil', category: 'sauce', price: 30, stock: 200, threshold: 50, color: '#e63946', imageUrl: genSVG('🍅', '#e63946') },
    { name: 'Spicy Marinara', category: 'sauce', price: 40, stock: 150, threshold: 30, color: '#d62828', imageUrl: genSVG('🌶️', '#d62828') },
    { name: 'Creamy Garlic Alfredo', category: 'sauce', price: 50, stock: 100, threshold: 30, color: '#d4a373', imageUrl: genSVG('🧄', '#d4a373') },
    { name: 'Smoky BBQ Sauce', category: 'sauce', price: 45, stock: 120, threshold: 30, color: '#bc6c25', imageUrl: genSVG('🥩', '#bc6c25') },
    { name: 'Fresh Basil Pesto', category: 'sauce', price: 60, stock: 80, threshold: 20, color: '#2a9d8f', imageUrl: genSVG('🌿', '#2a9d8f') },

    // --- CHEESE (5) ---
    { name: '100% Mozzarella', category: 'cheese', price: 60, stock: 300, threshold: 50, color: '#f9c74f', imageUrl: genSVG('🧀', '#f9c74f') },
    { name: 'Cheddar Blend', category: 'cheese', price: 70, stock: 200, threshold: 40, color: '#f8961e', imageUrl: genSVG('🧀', '#f8961e') },
    { name: 'Smoked Gouda', category: 'cheese', price: 90, stock: 100, threshold: 20, color: '#f3722c', imageUrl: genSVG('🧀', '#f3722c') },
    { name: 'Feta Crumbles', category: 'cheese', price: 85, stock: 80, threshold: 20, color: '#cad2c5', imageUrl: genSVG('🥛', '#cad2c5') },
    { name: 'Vegan Cheese Alternative', category: 'cheese', price: 100, stock: 50, threshold: 10, color: '#52b788', imageUrl: genSVG('🌱', '#52b788') },

    // --- VEGGIES (5) ---
    { name: 'Fresh Mushrooms', category: 'veggies', price: 40, stock: 150, threshold: 30, color: '#b08968', imageUrl: genSVG('🍄', '#b08968') },
    { name: 'Crunchy Bell Peppers', category: 'veggies', price: 30, stock: 200, threshold: 40, color: '#4ade80', imageUrl: genSVG('🫑', '#4ade80') },
    { name: 'Black Olives', category: 'veggies', price: 45, stock: 100, threshold: 20, color: '#1e293b', imageUrl: genSVG('🫒', '#1e293b') },
    { name: 'Red Onions', category: 'veggies', price: 20, stock: 250, threshold: 50, color: '#9d0208', imageUrl: genSVG('🧅', '#9d0208') },
    { name: 'Spicy Jalapeños', category: 'veggies', price: 35, stock: 120, threshold: 30, color: '#ef233c', imageUrl: genSVG('🌶️', '#ef233c') },

    // --- MEATS (5) ---
    { name: 'Classic Pepperoni', category: 'meat', price: 70, stock: 150, threshold: 40, color: '#c1121f', imageUrl: genSVG('🍕', '#c1121f') },
    { name: 'Grilled Chicken Tikka', category: 'meat', price: 80, stock: 120, threshold: 30, color: '#f59e0b', imageUrl: genSVG('🍗', '#f59e0b') },
    { name: 'Spicy Italian Sausage', category: 'meat', price: 85, stock: 100, threshold: 20, color: '#d97706', imageUrl: genSVG('🌭', '#d97706') },
    { name: 'Smoked Bacon Strips', category: 'meat', price: 90, stock: 80, threshold: 20, color: '#ef4444', imageUrl: genSVG('🥓', '#ef4444') },
    { name: 'Salami Slices', category: 'meat', price: 75, stock: 110, threshold: 30, color: '#b91c1c', imageUrl: genSVG('🥩', '#b91c1c') }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected for Seeding...');

        // Clear existing inventory to prevent duplicates
        await Inventory.deleteMany({});
        console.log('Cleared existing inventory.');

        // Insert new seeded data
        await Inventory.insertMany(seedData);
        console.log('Successfully seeded 25 rich ingredients with perfectly accurate 3D icons!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
