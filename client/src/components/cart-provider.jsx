import React, { createContext, useContext, useState, useEffect } from "react";
const CartContext = createContext(undefined);
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("b2_cart");
            const savedWishlist = localStorage.getItem("b2_wishlist");
            if (savedCart)
                setCart(JSON.parse(savedCart));
            if (savedWishlist)
                setWishlist(JSON.parse(savedWishlist));
        }
        catch (e) { }
        setMounted(true);
    }, []);
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("b2_cart", JSON.stringify(cart));
            localStorage.setItem("b2_wishlist", JSON.stringify(wishlist));
        }
    }, [cart, wishlist, mounted]);
    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) => item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item);
            }
            return [...prev, { product, quantity }];
        });
    };
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity } : item));
    };
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };
    const toggleWishlist = (product) => {
        setWishlist((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                return prev.filter((p) => p.id !== product.id);
            }
            return [...prev, product];
        });
    };
    const isInWishlist = (productId) => {
        return wishlist.some((p) => p.id === productId);
    };
    const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    return (<CartContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            updateQuantity,
            removeFromCart,
            toggleWishlist,
            isInWishlist,
            cartTotal,
            cartCount,
        }}>
      {children}
    </CartContext.Provider>);
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
