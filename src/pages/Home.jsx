import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { GAMES_DATA } from '../data/gamesData';
import { DAILY_MISSIONS, LEADERBOARD_MOCK } from '../data/missionsData';
import GameCard from '../components/GameCard';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Zap, 
  Target, 
  ShieldCheck, 
  Crown,
  Play
} from 'lucide-react';

export default function Home() {
  const { player } = useGame();

  const featuredGames = GAMES_DATA.slice(0, 3);
  const recentGames = GAMES_DATA.filter(g => player.recentlyPlayed?.includes(g.id));

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 p-8 sm:p-12 lg:p-16">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase font-gaming">
            <Sparkles className="w-3.5 h-3.5" />
            Yangi Avlod O'yin Ekotizimi
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-gaming text-white tracking-tight leading-none">
            7 TA EPIC O'YIN <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 bg-clip-text text-transparent">
              YAGONA DUNYODA.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Sarguzasht, poyga, jumboqlar, ferma simulyatori va strategiya! O'yinlarni o'ynang, XP va tangalar yig'ing, darajangizni oshirib yangi yutuqlarni qulflardan xalos qiling.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white font-gaming font-bold text-sm tracking-wider hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              BARCHA O'YINLAR (7)
            </Link>

            <Link
              to="/achievements"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 border border-slate-700 font-semibold text-sm hover:border-cyan-400/50 transition-all"
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              Yutuqlar & Mukofotlar
            </Link>
          </div>
        </div>

        {/* Floating Mini Stats in Hero */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold">O'yinlar Soni</p>
            <p className="text-2xl font-black font-gaming text-cyan-400 mt-0.5">7 Janr</p>
          </div>
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold">Sizning Levelingiz</p>
            <p className="text-2xl font-black font-gaming text-purple-400 mt-0.5">Level {player.level}</p>
          </div>
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold">Jami O'ynalgan</p>
            <p className="text-2xl font-black font-gaming text-pink-400 mt-0.5">{player.totalGamesPlayed} marta</p>
          </div>
          <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold">Ochilgan Yutuqlar</p>
            <p className="text-2xl font-black font-gaming text-yellow-400 mt-0.5">
              {player.unlockedAchievements.length} / 10
            </p>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-gaming text-white">Tanlangan O'yinlar</h2>
              <p className="text-xs text-slate-400">Eng mashhur va ko'p o'ynaladigan mega o'yinlar</p>
            </div>
          </div>

          <Link
            to="/games"
            className="flex items-center gap-1.5 text-xs font-semibold font-gaming text-cyan-400 hover:text-cyan-300 hover:gap-2.5 transition-all"
          >
            Barchasini ko'rish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Daily Missions & Global Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Missions */}
        <section className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-gaming text-white">Kunlik Missiyalar</h3>
                <p className="text-xs text-slate-400">Har 24 soatda yangilanadi va qo'shimcha XP beradi</p>
              </div>
            </div>
            <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Bugun
            </span>
          </div>

          <div className="space-y-4">
            {DAILY_MISSIONS.map(m => {
              const progressPct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-white">{m.title}</h4>
                    <p className="text-xs text-slate-400">{m.description}</p>
                    <div className="w-48 bg-slate-800 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-xs font-bold text-cyan-400">+{m.rewardXP} XP</span>
                      <span className="block text-[11px] text-yellow-400 font-semibold">+{m.rewardCoins} Tanga</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                      {m.current}/{m.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Leaderboard Preview */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-gaming text-white">Global Peshqadamlar</h3>
              <p className="text-xs text-slate-400">Dunyo bo'yicha eng yuqori reyting</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {LEADERBOARD_MOCK.map((user) => (
              <div 
                key={user.rank}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-black ${
                    user.rank === 1 ? 'text-amber-400' : user.rank === 2 ? 'text-slate-300' : user.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    #{user.rank}
                  </span>
                  <span className="text-base">{user.avatar}</span>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-cyan-400 font-semibold">Lvl {user.level}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-amber-400">{user.score.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-500">ball</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Recently Played if any */}
      {recentGames.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-gaming text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Yaqinda O'ynalganlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* All 7 Games Quick Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black font-gaming text-white">
            Barcha 7 ta O'yinlar
          </h2>
          <span className="text-xs text-slate-400">100% to'liq ishlaydigan mexanika</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GAMES_DATA.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

    </div>
  );
}
