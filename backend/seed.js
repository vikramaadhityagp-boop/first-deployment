require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./models/Game');

const games = [
  { title: 'Cyber Odyssey 2077', description: 'Open-world RPG in a dystopian future city.', genre: 'RPG', platform: ['PC', 'PS5', 'Xbox'], price: 2999, discountPrice: 1999, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Cyber+Odyssey', rating: 4.5, stock: 50 },
  { title: 'Shadow Strike', description: 'Tactical FPS with realistic ballistics and team play.', genre: 'FPS', platform: ['PC', 'Xbox'], price: 1999, discountPrice: 1499, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Shadow+Strike', rating: 4.2, stock: 30 },
  { title: 'Dragon Realm', description: 'Epic fantasy RPG with dragons and magic.', genre: 'RPG', platform: ['PS5', 'PC'], price: 3499, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Dragon+Realm', rating: 4.8, stock: 20 },
  { title: 'Speed Kings', description: 'High-octane street racing across global cities.', genre: 'Sports', platform: ['PS5', 'Xbox', 'PC'], price: 2499, discountPrice: 1799, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Speed+Kings', rating: 4.0, stock: 40 },
  { title: 'Galactic Conquest', description: 'Real-time strategy across star systems.', genre: 'Strategy', platform: ['PC'], price: 1499, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Galactic+Conquest', rating: 4.3, stock: 100 },
  { title: 'Neon Brawler', description: 'Side-scrolling action brawler with neon aesthetics.', genre: 'Action', platform: ['Nintendo Switch', 'PC', 'PS5'], price: 999, discountPrice: 699, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Neon+Brawler', rating: 3.9, stock: 60 },
  { title: 'FIFA Pro 2025', description: 'The ultimate football simulation experience.', genre: 'Sports', platform: ['PS5', 'Xbox', 'PC'], price: 3999, discountPrice: 2999, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=FIFA+Pro+2025', rating: 4.1, stock: 75 },
  { title: 'Phantom Ops', description: 'Stealth action game with espionage missions.', genre: 'Action', platform: ['PC', 'PS5'], price: 2299, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Phantom+Ops', rating: 4.4, stock: 35 },
  { title: 'Warfront Commander', description: 'Turn-based strategy with deep military tactics.', genre: 'Strategy', platform: ['PC', 'Nintendo Switch'], price: 1799, discountPrice: 1299, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Warfront', rating: 4.6, stock: 45 },
  { title: 'Pixel Dungeon X', description: 'Roguelike dungeon crawler with pixel art.', genre: 'RPG', platform: ['PC', 'Nintendo Switch'], price: 799, coverImage: 'https://placehold.co/400x560/1a1a2e/00ff88?text=Pixel+Dungeon', rating: 4.7, stock: 200 },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Game.deleteMany({});
  await Game.insertMany(games);
  console.log('✅ Seeded 10 games successfully');
  process.exit(0);
})();
