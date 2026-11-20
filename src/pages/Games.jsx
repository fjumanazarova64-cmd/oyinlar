import React, { useState } from 'react';
import { GAMES_DATA, CATEGORIES } from '../data/gamesData';
import GameCard from '../components/GameCard';
import { Search, Gamepad2, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Games() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredGames = GAMES_DATA.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) ||
                          game.genre.toLowerCase().includes(search.toLowerCase()) ||
                          game.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reward') return b.xpReward - a.xpReward;
    return 0; // default
  });

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-purple-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-gaming uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            Gaming Katalogi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-gaming text-white">
            BARCHA 7 TA O'YIN
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Har bir o'yin o'zining noyob qoidalari, grafikasi, boshqaruvi va mukofotlariga ega. O'zingiz yoqtirgan janrni tanlang va o'yinni boshlang!
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O'yin nomi yoki janr bo'yicha qidirish..."
            className="w-full bg-[#101026] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#101026] border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="popular">Tavsiya etilgan</option>
            <option value="rating">Eng yuqori reyting</option>
            <option value="reward">Eng ko'p XP mukofoti</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-gaming uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-gaming text-lg font-bold text-white">Hech qanday o'yin topilmadi</h3>
          <p className="text-xs text-slate-400">Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.</p>
        </div>
      )}

    </div>
  );
}
