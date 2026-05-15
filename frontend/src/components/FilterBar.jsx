import React from 'react';

const GENRES = ['Action', 'RPG', 'Sports', 'FPS', 'Strategy'];
const PLATFORMS = ['PC', 'PS5', 'Xbox', 'Nintendo Switch'];

export default function FilterBar({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="w-56 shrink-0 space-y-6">
      <div>
        <h3 className="text-neon font-semibold mb-2 text-sm uppercase tracking-wider">Genre</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="genre" checked={!filters.genre} onChange={() => set('genre', '')} className="accent-neon" /> All
          </label>
          {GENRES.map(g => (
            <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="genre" checked={filters.genre === g} onChange={() => set('genre', g)} className="accent-neon" /> {g}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-neon font-semibold mb-2 text-sm uppercase tracking-wider">Platform</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="platform" checked={!filters.platform} onChange={() => set('platform', '')} className="accent-neon" /> All
          </label>
          {PLATFORMS.map(p => (
            <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="platform" checked={filters.platform === p} onChange={() => set('platform', p)} className="accent-neon" /> {p}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-neon font-semibold mb-2 text-sm uppercase tracking-wider">Max Price</h3>
        <input
          type="range" min="0" max="5000" step="100"
          value={filters.maxPrice || 5000}
          onChange={e => set('maxPrice', e.target.value)}
          className="w-full accent-neon"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹0</span><span>₹{filters.maxPrice || 5000}</span>
        </div>
      </div>

      <button onClick={() => onChange({ genre: '', platform: '', maxPrice: '' })} className="btn-outline text-xs w-full">
        Clear Filters
      </button>
    </aside>
  );
}
