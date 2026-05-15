import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(query);
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 z-40 bg-dark-800 border-b border-dark-600 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <Link to="/" className="text-neon font-black text-xl tracking-tight shrink-0">🎮 GameStore</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            className="input text-sm"
            placeholder="Search games..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          <button onClick={() => setCartOpen(true)} className="relative text-gray-300 hover:text-neon transition-colors">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <>
              <Link to={`/orders/${user.id}`} className="text-sm text-gray-300 hover:text-neon">Orders</Link>
              <span className="text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="btn-outline text-sm py-1">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-neon text-sm py-1">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
