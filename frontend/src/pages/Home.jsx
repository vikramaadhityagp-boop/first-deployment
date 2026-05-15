import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import GameCard from '../components/GameCard';
import FilterBar from '../components/FilterBar';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ genre: '', platform: '', maxPrice: '' });

  const search = searchParams.get('search') || '';

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...(search && { search }), ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await api.get('/games', { params });
      setGames(data.data.games);
      setTotal(data.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, filters, search]);

  useEffect(() => { setPage(1); }, [filters, search]);
  useEffect(() => { fetchGames(); }, [fetchGames]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {search && <p className="text-gray-400 mb-4">Results for: <span className="text-neon">"{search}"</span></p>}
      <div className="flex gap-6">
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => <div key={i} className="card h-72 animate-pulse bg-dark-700" />)}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🎮</p>
              <p>No games found. Try different filters.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">{total} games found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
