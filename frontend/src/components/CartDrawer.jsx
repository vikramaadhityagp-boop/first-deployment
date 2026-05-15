import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
      <div className="relative w-full max-w-sm bg-dark-800 h-full flex flex-col shadow-2xl border-l border-dark-600">
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <h2 className="font-bold text-lg">🛒 Cart ({cart.length})</h2>
          <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Your cart is empty</p>
          ) : cart.map(item => (
            <div key={item._id} className="flex gap-3 bg-dark-700 rounded-lg p-3">
              <img src={item.coverImage} alt={item.title} className="w-14 h-20 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                <p className="text-neon text-sm font-bold mt-1">₹{item.discountPrice || item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-6 h-6 bg-dark-600 rounded text-sm hover:bg-neon hover:text-black">−</button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-6 h-6 bg-dark-600 rounded text-sm hover:bg-neon hover:text-black">+</button>
                  <button onClick={() => removeFromCart(item._id)} className="ml-auto text-red-400 hover:text-red-300 text-xs">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-dark-600">
            <div className="flex justify-between mb-3 font-semibold">
              <span>Total</span><span className="text-neon">₹{cartTotal}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate('/checkout'); }}
              className="btn-neon w-full text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
