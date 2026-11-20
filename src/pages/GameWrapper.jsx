import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GAMES_DATA } from '../data/gamesData';
import { useGame } from '../context/GameContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Maximize2, 
  Info, 
  Trophy, 
  Coins, 
  Sparkles,
  Gamepad2,
  X
} from 'lucide-react';

// Games Dynamic Import or Component switch
import MysticIsland from '../games/MysticIsland';
import NeonRush from '../games/NeonRush';
import DarkHouse from '../games/DarkHouse';
import KingdomDefense from '../games/KingdomDefense';
import DreamFarm from '../games/DreamFarm';
import SpaceLegends from '../games/SpaceLegends';
import CrazyRun from '../games/CrazyRun';

const GAME_COMPONENTS = {
  'mystic-island': MysticIsland,
  'neon-rush': NeonRush,
  'dark-house': DarkHouse,
  'kingdom-defense': KingdomDefense,
  'dream-farm': DreamFarm,
  'space-legends': SpaceLegends,
  'crazy-run': CrazyRun
};

export default function GameWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { player, recordGameResult } = useGame();
  const [showHowTo, setShowHowTo] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const game = GAMES_DATA.find(g => g.id === id);
  const GameComponent = GAME_COMPONENTS[id];
  const bestScore = player.highScores?.[id] || 0;

  if (!game || !GameComponent) {
    return (
      <div className="py-24 text-center glass-panel rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-2xl font-black font-gaming text-white">O'yin Topilmadi</h2>
        <p className="text-sm text-slate-400">Kechirasiz, bunday o'yin mavjud emas.</p>
        <Link 
          to="/games"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold font-gaming text-xs"
        >
          O'yinlar Katalogiga Qaytish
        </Link>
      </div>
    );
  }

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
  };

  const handleGameOver = (score, coinsEarned, xpEarned) => {
    recordGameResult(id, score, coinsEarned, xpEarned);
  };

  const toggleFullscreen = () => {
    const el = document.getElementById('game-container-view');
    if (!document.fullscreenElement) {
      el?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/games')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Katalogga qaytish"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming text-lg sm:text-xl font-black text-white">
                {game.title}
              </h1>
              <span 
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-gaming"
                style={{ 
                  backgroundColor: `${game.accentColor}20`, 
                  color: game.accentColor,
                  border: `1px solid ${game.accentColor}40`
                }}
              >
                {game.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{game.genre}</p>
          </div>
        </div>

        {/* Center / Right: High Score & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Best Score Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">Rekord:</span>
            <span className="font-gaming font-bold text-cyan-400">{bestScore.toLocaleString()}</span>
          </div>

          {/* Help / Controls button */}
          <button
            onClick={() => setShowHowTo(!showHowTo)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Qoidalar va boshqaruv"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-pink-400 transition-colors"
            title="O'yinni qayta boshlash"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
            title="To'liq ekran"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* How-to Modal / Accordion */}
      {showHowTo && (
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-gaming text-sm font-bold">
              <Gamepad2 className="w-4 h-4" />
              Boshqaruv va Qoidalar
            </div>
            <button 
              onClick={() => setShowHowTo(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {game.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {game.controls.map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block font-gaming">{c.key}</span>
                <span className="text-slate-300 text-[11px]">{c.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Screen Container */}
      <div 
        id="game-container-view"
        className="relative w-full rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl flex items-center justify-center min-h-[460px] sm:min-h-[540px] bg-[#080816]"
      >
        <GameComponent 
          key={gameKey} 
          game={game} 
          onGameOver={handleGameOver}
          onRestart={handleRestart}
        />
      </div>

    </div>
  );
}
