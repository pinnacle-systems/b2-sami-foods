import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectIsAuthenticated } from "@/redux/features/authSlice";
import { useAuthModal } from "./auth-modal-provider";

const CartContext = createContext(undefined);
const API_BASE = "/api";

function normalizeProduct(p) {
  const rawImage = p.productImage;
  const image = rawImage
    ? rawImage.startsWith("http") || rawImage.startsWith("/") || rawImage.startsWith("data:")
      ? rawImage
      : `/${rawImage}`
    : null;
  return {
    ...p,
    image,
    name: p.productName,
    price: p.productPrice ?? p.originalPrice ?? 0,
  };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);

  const { openLogin } = useAuthModal();

  const token = useSelector(selectToken);
  const isAuth = useSelector(selectIsAuthenticated);
  const prevAuthRef = useRef(isAuth);

  const syncFromBackend = async (authToken) => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const [cartRes, wishlistRes] = await Promise.all([
        fetch(`${API_BASE}/cart`, { headers }),
        fetch(`${API_BASE}/wishlist`, { headers }),
      ]);
      if (cartRes.ok) {
        const { data } = await cartRes.json();
        setCart(
          (data.items || []).map((item) => ({
            product: normalizeProduct(item.product),
            quantity: item.quantity,
          }))
        );
      }
      if (wishlistRes.ok) {
        const { data } = await wishlistRes.json();
        setWishlist((data || []).map((item) => normalizeProduct(item.product)));
      }
    } catch (e) {
      console.error("Cart sync failed:", e);
    }
  };

  // Merge local cart items into backend on login, then pull fresh state
  const mergeAndSync = async (authToken, localCart) => {
    try {
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` };
      await Promise.all(
        localCart.map((item) =>
          fetch(`${API_BASE}/cart/items`, {
            method: "POST",
            headers,
            body: JSON.stringify({ productId: item.product.id, quantity: item.quantity }),
          })
        )
      );
    } catch (e) {
      console.error("Cart merge failed:", e);
    }
    await syncFromBackend(authToken);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      if (isAuth && token) {
        await syncFromBackend(token);
      } else {
        setCart([]);
        setWishlist([]);
        try {
          localStorage.removeItem("b2_cart");
          localStorage.removeItem("b2_wishlist");
        } catch (e) {}
      }
      setMounted(true);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // React to login / logout transitions
  useEffect(() => {
    if (!mounted) return;
    const wasAuth = prevAuthRef.current;
    prevAuthRef.current = isAuth;

    if (isAuth && token && !wasAuth) {
      // Just logged in — merge any local cart items, then pull backend data
      mergeAndSync(token, cart);
    } else if (!isAuth && wasAuth) {
      // Just logged out — clear cart & wishlist and delete local cache
      setCart([]);
      setWishlist([]);
      try {
        localStorage.removeItem("b2_cart");
        localStorage.removeItem("b2_wishlist");
      } catch (e) {}
    }
  }, [isAuth, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async (product, quantity = 1) => {
    if (!isAuth) {
      openLogin();
      return;
    }
    // Optimistic update
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product: normalizeProduct(product), quantity }];
    });

    if (isAuth && token) {
      try {
        const res = await fetch(`${API_BASE}/cart/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        if (res.ok) {
          const { data } = await res.json();
          setCart(
            (data.items || []).map((item) => ({
              product: normalizeProduct(item.product),
              quantity: item.quantity,
            }))
          );
        }
      } catch (e) {
        console.error("addToCart failed:", e);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // Optimistic update
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    if (isAuth && token) {
      try {
        const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ quantity }),
        });
        if (res.ok) {
          const { data } = await res.json();
          setCart(
            (data.items || []).map((item) => ({
              product: normalizeProduct(item.product),
              quantity: item.quantity,
            }))
          );
        }
      } catch (e) {
        console.error("updateQuantity failed:", e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    // Optimistic update
    setCart((prev) => prev.filter((item) => item.product.id !== productId));

    if (isAuth && token) {
      try {
        const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { data } = await res.json();
          setCart(
            (data.items || []).map((item) => ({
              product: normalizeProduct(item.product),
              quantity: item.quantity,
            }))
          );
        }
      } catch (e) {
        console.error("removeFromCart failed:", e);
      }
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuth) {
      openLogin();
      return;
    }
    const normalized = normalizeProduct(product);
    // Optimistic update
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, normalized];
    });

    if (isAuth && token) {
      try {
        await fetch(`${API_BASE}/wishlist/${product.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await fetch(`${API_BASE}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { data } = await res.json();
          setWishlist((data || []).map((item) => normalizeProduct(item.product)));
        }
      } catch (e) {
        console.error("toggleWishlist failed:", e);
      }
    }
  };

  const isInWishlist = (productId) => wishlist.some((p) => p.id === productId);

  const cartTotal = cart.reduce(
    (total, item) => total + (item.product.price ?? 0) * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        syncFromBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
