import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/AppContext';
import { useAuth } from '../context/AppContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) { navigate('/login'); return null; }
  if (cart.length === 0) { navigate('/'); return null; }

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const items = cart.map(i => ({ gameId: i._id, quantity: i.quantity }));
      const { data } = await api.post('/orders', { items });
      const { razorpayOrderId, amount, currency, keyId } = data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'GameStore',
        description: `${cart.length} game(s)`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post('/orders/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/orders/${user.id}`);
          } catch {
            setError('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#00ff88' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { setError('Payment failed. Please try again.'); setLoading(false); });
      rzp.open();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">Checkout</h1>
      <div className="card p-4 mb-6">
        <h2 className="font-semibold mb-3 text-gray-300">Order Summary</h2>
        {cart.map(item => (
          <div key={item._id} className="flex justify-between py-2 border-b border-dark-600 text-sm">
            <span>{item.title} × {item.quantity}</span>
            <span className="text-neon">₹{(item.discountPrice || item.price) * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-bold text-lg">
          <span>Total</span><span className="text-neon">₹{cartTotal}</span>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <h2 className="font-semibold mb-2 text-gray-300">Billing Info</h2>
        <p className="text-sm">{user.name} — {user.email}</p>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded">{error}</p>}

      <button onClick={handlePayment} disabled={loading} className="btn-neon w-full text-lg py-3">
        {loading ? 'Processing...' : `Pay ₹${cartTotal} with Razorpay`}
      </button>
      <p className="text-center text-xs text-gray-500 mt-3">Secured by Razorpay 🔒</p>
    </div>
  );
}
