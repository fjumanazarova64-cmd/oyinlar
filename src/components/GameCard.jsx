import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  Play, 
  Trophy, 
  Zap, 
  Users, 
  Star,
  Compass,
  Ghost,
  Shield,
  Sprout,
  Rocket,
  Flame
} from 'lucide-react';

const ICON_MAP = {
  Compass,
  Zap,
  Ghost,
  Shield,
  Sprout,
  Rocket,
  Flame
};

export default function GameCard({ game }) {
  const { player } = useGame();
  const Icon = ICON_MAP[game.iconName] || Zap;
  const bestScore = player.highScores?.[game.id] || 0;

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover p-5 flex flex-col justify-between overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
      
      {/* Background Glow */}
      <div 
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: game.accentColor }}
      />

      <div>
        {/* Top Meta */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ 
              backgroundColor: `${game.accentColor}20`,
              border: `1px solid ${game.accentColor}50`,
              color: game.accentColor 
            }}
          >
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <span 
              className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full font-gaming"
              style={{ 
                backgroundColor: `${game.accentColor}25`, 
                color: game.accentColor,
                border: `1px solid ${game.accentColor}40`
              }}
            >
              {game.badgeText}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{game.rating}</span>
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-gaming text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {game.tagline}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-4 text-xs">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block">Janr</span>
            <span className="text-slate-200 font-medium truncate block">{game.genre}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block">Eng yaxshi</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-cyan-400" />
              {bestScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards & Play Button */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400 font-semibold">+{game.xpReward} XP</span>
          <span className="text-slate-600">•</span>
          <span className="text-yellow-400 font-semibold">+{game.coinReward} Tanga</span>
        </div>

        <Link
          to={`/game/${game.id}`}
          className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-gaming tracking-wide text-black transition-all transform group-hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
          style={{
            background: `linear-gradient(135deg, ${game.accentColor}, #ffffff)`
          }}
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>O'YNASH</span>
        </Link>
      </div>

    </div>
  );
}
