import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/AppContext';

const PLATFORM_COLORS = { PC: 'bg-blue-600', PS5: 'bg-indigo-600', Xbox: 'bg-green-700', 'Nintendo Switch': 'bg-red-600' };

export default function GameCard({ game }) {
  const { addToCart } = useCart();

  return (
    <div className="card flex flex-col group">
      <Link to={`/games/${game._id}`} className="block overflow-hidden">
        <img
          src={game.coverImage || 'https://placehold.co/400x560/1a1a2e/00ff88?text=No+Image'}
          alt={game.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {game.platform?.map(p => (
            <span key={p} className={`text-xs px-2 py-0.5 rounded-full text-white ${PLATFORM_COLORS[p] || 'bg-gray-600'}`}>{p}</span>
          ))}
        </div>
        <Link to={`/games/${game._id}`} className="font-semibold text-sm hover:text-neon line-clamp-2 flex-1">{game.title}</Link>
        <div className="flex items-center justify-between mt-3">
          <div>
            {game.discountPrice ? (
              <>
                <span className="text-neon font-bold">₹{game.discountPrice}</span>
                <span className="text-gray-500 line-through text-xs ml-1">₹{game.price}</span>
              </>
            ) : (
              <span className="text-neon font-bold">₹{game.price}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(game)}
            className="btn-neon text-xs py-1 px-3"
            disabled={game.stock === 0}
          >
            {game.stock === 0 ? 'Out of Stock' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
