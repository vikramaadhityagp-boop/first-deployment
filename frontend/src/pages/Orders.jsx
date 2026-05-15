import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AppContext';

const STATUS_STYLES = { paid: 'bg-green-900 text-green-400', pending: 'bg-yellow-900 text-yellow-400', failed: 'bg-red-900 text-red-400' };

export default function Orders() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get(`/orders/${userId}`)
      .then(r => setOrders(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, user, navigate]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No orders yet</p>
          <button onClick={() => navigate('/')} className="btn-neon mt-4">Shop Now</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                {order.games.map(({ game, quantity, price }) => (
                  <div key={game?._id} className="flex items-center gap-3">
                    <img src={game?.coverImage} alt={game?.title} className="w-10 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{game?.title}</p>
                      <p className="text-xs text-gray-400">Qty: {quantity} × ₹{price}</p>
                    </div>
                    <p className="text-neon text-sm font-bold">₹{quantity * price}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-dark-600 font-bold">
                <span>Total</span><span className="text-neon">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
