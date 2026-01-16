import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cochef_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cochef_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity, supplements = []) => {
        const itemTotal = product.base_price + supplements.reduce((acc, s) => acc + s.price, 0);

        const cartItem = {
            id: Date.now(),
            product_id: product.id,
            name: product.name,
            quantity: quantity,
            unit_price: itemTotal,
            total_price: itemTotal * quantity,
            options: {
                supplements: supplements.map(s => ({ id: s.id, name: s.name, price: s.price }))
            },
            img: product.image_url
        };

        setCart(prev => [...prev, cartItem]);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, quantity: newQuantity, total_price: item.unit_price * newQuantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.total_price, 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
