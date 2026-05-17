import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import GameCard from '../components/GameCard';
import FilterBar from '../components/FilterBar';

const FALLBACK_GAMES = [
  { _id: '1', title: 'God of War Ragnarök', genre: 'Action', platform: ['PS5'], price: 69.99, discountPrice: 49.99, rating: 4.9, stock: 20, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=God+of+War' },
  { _id: '2', title: 'Elden Ring', genre: 'RPG', platform: ['PC'], price: 59.99, discountPrice: 39.99, rating: 4.8, stock: 15, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Elden+Ring' },
  { _id: '3', title: 'Spider-Man 2', genre: 'Action', platform: ['PS5'], price: 69.99, discountPrice: 59.99, rating: 4.8, stock: 18, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Spider-Man+2' },
  { _id: '4', title: 'Hogwarts Legacy', genre: 'RPG', platform: ['PC'], price: 59.99, discountPrice: 34.99, rating: 4.6, stock: 25, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Hogwarts+Legacy' },
  { _id: '5', title: 'FIFA 24', genre: 'Sports', platform: ['PC', 'PS5'], price: 59.99, discountPrice: 29.99, rating: 4.2, stock: 30, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=FIFA+24' },
  { _id: '6', title: 'Zelda: Tears of the Kingdom', genre: 'Action', platform: ['Nintendo Switch'], price: 69.99, discountPrice: 59.99, rating: 4.9, stock: 12, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Zelda+TOTK' },
  { _id: '7', title: 'Cyberpunk 2077', genre: 'RPG', platform: ['PC', 'PS5'], price: 49.99, discountPrice: 19.99, rating: 4.5, stock: 22, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Cyberpunk+2077' },
  { _id: '8', title: 'Forza Horizon 5', genre: 'Racing', platform: ['Xbox', 'PC'], price: 59.99, discountPrice: 39.99, rating: 4.7, stock: 17, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Forza+Horizon+5' },
  { _id: '9', title: 'Resident Evil 4', genre: 'Action', platform: ['PC', 'PS5'], price: 59.99, discountPrice: 39.99, rating: 4.7, stock: 14, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Resident+Evil+4' },
  { _id: '10', title: 'Starfield', genre: 'RPG', platform: ['Xbox', 'PC'], price: 69.99, discountPrice: 49.99, rating: 4.3, stock: 20, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Starfield' },
  { _id: '11', title: 'Mortal Kombat 1', genre: 'FPS', platform: ['PC', 'PS5'], price: 69.99, discountPrice: 44.99, rating: 4.4, stock: 16, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Mortal+Kombat+1' },
  { _id: '12', title: 'Mario Kart 8 Deluxe', genre: 'Racing', platform: ['Nintendo Switch'], price: 59.99, discountPrice: 49.99, rating: 4.8, stock: 28, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Mario+Kart+8' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ genre: '', platform: '', maxPrice: '' });

  const search = searchParams.get('search') || '';

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12, ...(search && { search }), ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await api.get('/games', { params });
      const fetched = data?.data?.games || [];
      if (fetched.length > 0) {
        setGames(fetched);
        setTotal(data?.data?.total || 0);
      } else {
        throw new Error('empty');
      }
    } catch (e) {
      // fallback to hardcoded games, filtered by search/genre/platform
      let filtered = FALLBACK_GAMES;
      if (search) filtered = filtered.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
      if (filters.genre) filtered = filtered.filter(g => g.genre === filters.genre);
      if (filters.platform) filtered = filtered.filter(g => g.platform === filters.platform);
      if (filters.maxPrice) filtered = filtered.filter(g => (g.discountPrice || g.price) <= Number(filters.maxPrice));
      setGames(filtered);
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [page, filters, search]);

  useEffect(() => { setPage(1); }, [filters, search]);
  useEffect(() => { fetchGames(); }, [fetchGames]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {search && <p className="text-gray-400 mb-4">Results for: <span className="text-neon">"{search}"</span></p>}
      <div className="flex flex-col gap-6 md:flex-row">
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => <div key={i} className="card h-72 animate-pulse bg-dark-700" />)}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-red-400 font-semibold mb-2">Games could not be loaded.</p>
              <p>{error}</p>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🎮</p>
              <p>No games found. Try different filters.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">{total} games found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {games.map(g => <GameCard key={g._id} game={g} />)}
              </div>
              {total > 12 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array(Math.ceil(total / 12)).fill(0).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded text-sm ${page === i + 1 ? 'bg-neon text-black font-bold' : 'bg-dark-700 hover:bg-dark-600'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
