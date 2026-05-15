import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-gray-400 mb-6">Your cart is empty</p>
      <button onClick={() => navigate('/')} className="btn-neon">Browse Games</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">Shopping Cart</h1>
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item._id} className="card flex gap-4 p-4">
            <img src={item.coverImage} alt={item.title} className="w-20 h-28 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-neon font-bold mt-1">₹{item.discountPrice || item.price}</p>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-7 h-7 bg-dark-600 rounded hover:bg-neon hover:text-black">−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-7 h-7 bg-dark-600 rounded hover:bg-neon hover:text-black">+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">₹{(item.discountPrice || item.price) * item.quantity}</p>
              <button onClick={() => removeFromCart(item._id)} className="text-red-400 text-sm mt-2 hover:text-red-300">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-dark-700 rounded-xl p-4 border border-dark-600">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span><span className="text-neon">₹{cartTotal}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn-neon w-full">Proceed to Checkout</button>
      </div>
    </div>
  );
}
