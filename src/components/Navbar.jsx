import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  Gamepad2, 
  Trophy, 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  Flame, 
  Coins, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { player, updateSettings } = useGame();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Bosh Sahifa', path: '/', icon: Flame },
    { name: 'O\'yinlar (7)', path: '/games', icon: Gamepad2 },
    { name: 'Yutuqlar', path: '/achievements', icon: Trophy },
    { name: 'Profil', path: '/profile', icon: User },
    { name: 'Sozlamalar', path: '/settings', icon: Settings },
  ];

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));

  const toggleSound = () => {
    updateSettings('sound', !player.settings.sound);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 transition-all duration-300">
              <div className="w-full h-full bg-[#0d0d1e] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-gaming text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 bg-clip-text text-transparent">
                GAMEVERSE
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-400 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>7 Epic Games</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Player Quick Stats & Controls */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl text-yellow-400 text-sm font-semibold">
              <Coins className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>{player.coins.toLocaleString()}</span>
            </div>

            {/* Level & XP bar */}
            <div className="flex items-center gap-3 bg-purple-950/40 border border-purple-700/30 px-3.5 py-1.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-sm">
                  {player.level}
                </span>
                <span className="text-xs font-bold text-slate-300 hidden lg:inline">LVL</span>
              </div>
              <div className="w-20 lg:w-28 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>XP</span>
                  <span>{player.xp}/{player.xpToNextLevel}</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={player.settings.sound ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700/60 transition-colors"
            >
              {player.settings.sound ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Avatar Pill */}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[2px] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-[#121226] rounded-[10px] flex items-center justify-center text-lg">
                {player.avatar}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800/60 text-slate-300 border border-slate-700/60"
            >
              {player.settings.sound ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-purple-900/30 text-slate-200 border border-purple-500/30"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-purple-900/40 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{player.avatar}</span>
              <div>
                <p className="font-bold text-sm text-white">{player.username}</p>
                <p className="text-xs text-cyan-400 font-semibold">Level {player.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold bg-yellow-500/10 px-3 py-1 rounded-lg">
              <Coins className="w-4 h-4" />
              <span>{player.coins}</span>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 text-cyan-400" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
