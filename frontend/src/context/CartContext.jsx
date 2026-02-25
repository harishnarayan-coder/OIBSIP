import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const initialState = {
    base: null,
    sauce: null,
    cheese: null,
    veggies: [],
    meat: [],
    totalPrice: 0
};

const calculateTotal = (state) => {
    let total = 0;
    if (state.base) total += state.base.price;
    if (state.sauce) total += state.sauce.price;
    if (state.cheese) total += state.cheese.price;
    state.veggies.forEach(v => total += v.price);
    state.meat.forEach(m => total += m.price);
    return total;
};

const cartReducer = (state, action) => {
    let newState;
    switch (action.type) {
        case 'SET_BASE':
            newState = { ...state, base: action.payload };
            break;
        case 'SET_SAUCE':
            newState = { ...state, sauce: action.payload };
            break;
        case 'SET_CHEESE':
            newState = { ...state, cheese: action.payload };
            break;
        case 'ADD_VEGGIE':
            newState = { ...state, veggies: [...state.veggies, action.payload] };
            break;
        case 'REMOVE_VEGGIE': {
            const index = state.veggies.findIndex(v => v._id === action.payload);
            if (index !== -1) {
                const newVeggies = [...state.veggies];
                newVeggies.splice(index, 1);
                newState = { ...state, veggies: newVeggies };
            } else {
                newState = state;
            }
            break;
        }
        case 'ADD_MEAT':
            newState = { ...state, meat: [...state.meat, action.payload] };
            break;
        case 'REMOVE_MEAT': {
            const index = state.meat.findIndex(m => m._id === action.payload);
            if (index !== -1) {
                const newMeat = [...state.meat];
                newMeat.splice(index, 1);
                newState = { ...state, meat: newMeat };
            } else {
                newState = state;
            }
            break;
        }
        case 'RESET_CART':
            return initialState;
        default:
            return state;
    }

    newState.totalPrice = calculateTotal(newState);
    return newState;
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ cart: state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};
