import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/AppContext';

const PLATFORM_COLORS = { PC: 'bg-blue-600', PS5: 'bg-indigo-600', Xbox: 'bg-green-700', 'Nintendo Switch': 'bg-red-600' };

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, setCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/games/${id}`)
      .then(r => setGame(r.data.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" /></div>;
  if (!game) return null;

  const discount = game.discountPrice ? Math.round((1 - game.discountPrice / game.price) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-neon mb-6 flex items-center gap-1">← Back</button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-72 shrink-0">
          <img src={game.coverImage || 'https://placehold.co/400x560/1a1a2e/00ff88?text=No+Image'} alt={game.title} className="w-full rounded-xl border border-dark-600" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {game.platform?.map(p => (
              <span key={p} className={`text-xs px-2 py-1 rounded-full text-white ${PLATFORM_COLORS[p] || 'bg-gray-600'}`}>{p}</span>
            ))}
            <span className="text-xs px-2 py-1 rounded-full bg-dark-600 text-gray-300">{game.genre}</span>
          </div>

          <h1 className="text-3xl font-black mb-2">{game.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400">{'★'.repeat(Math.round(game.rating))}{'☆'.repeat(5 - Math.round(game.rating))}</span>
            <span className="text-gray-400 text-sm">{game.rating}/5</span>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>

          <div className="flex items-end gap-3 mb-6">
            {game.discountPrice ? (
              <>
                <span className="text-4xl font-black text-neon">₹{game.discountPrice}</span>
                <span className="text-gray-500 line-through text-xl">₹{game.price}</span>
                <span className="bg-green-900 text-green-400 text-sm px-2 py-1 rounded">{discount}% OFF</span>
              </>
            ) : (
              <span className="text-4xl font-black text-neon">₹{game.price}</span>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-4">
            {game.stock > 0 ? <span className="text-green-400">✓ In Stock ({game.stock} left)</span> : <span className="text-red-400">✗ Out of Stock</span>}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => { addToCart(game); setCartOpen(true); }}
              disabled={game.stock === 0}
              className="btn-outline flex-1"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(game); navigate('/checkout'); }}
              disabled={game.stock === 0}
              className="btn-neon flex-1"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
