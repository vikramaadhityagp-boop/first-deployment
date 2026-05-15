import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const CartContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
export const useCart = () => useContext(CartContext);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const login = (userData, tok) => {
    setUser(userData); setToken(tok);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tok);
  };

  const logout = () => {
    setUser(null); setToken('');
    localStorage.removeItem('user'); localStorage.removeItem('token');
  };

  const addToCart = (game, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === game._id);
      if (existing) return prev.map(i => i._id === game._id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...game, quantity: qty }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
