import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070713]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-gaming text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 bg-clip-text text-transparent">
                GAMEVERSE
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              7 ta original mini-o'yin, yagona tajriba (XP), darajalar, yutuqlar va tangalar tizimiga ega eng zamonaviy o'zbek gaming platformasi.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                v1.0.0 Pro Edition
              </span>
              <span>•</span>
              <span>100% Client-Side Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-gaming text-sm font-semibold text-slate-200 tracking-wider mb-4 uppercase">
              O'yinlar Menyusi
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/game/mystic-island" className="hover:text-cyan-400 transition-colors">Mystic Island</Link></li>
              <li><Link to="/game/neon-rush" className="hover:text-pink-400 transition-colors">Neon Rush</Link></li>
              <li><Link to="/game/dark-house" className="hover:text-purple-400 transition-colors">Dark House</Link></li>
              <li><Link to="/game/kingdom-defense" className="hover:text-yellow-400 transition-colors">Kingdom Defense</Link></li>
              <li><Link to="/game/dream-farm" className="hover:text-emerald-400 transition-colors">Dream Farm</Link></li>
              <li><Link to="/game/space-legends" className="hover:text-cyan-400 transition-colors">Space Legends</Link></li>
              <li><Link to="/game/crazy-run" className="hover:text-rose-400 transition-colors">Crazy Run</Link></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="font-gaming text-sm font-semibold text-slate-200 tracking-wider mb-4 uppercase">
              Ekotizim
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/achievements" className="hover:text-cyan-400 transition-colors">Yutuqlar & Badges</Link></li>
              <li><Link to="/profile" className="hover:text-cyan-400 transition-colors">O'yinchi Profili</Link></li>
              <li><Link to="/settings" className="hover:text-cyan-400 transition-colors">Sozlamalar</Link></li>
              <li><span className="text-slate-600 cursor-not-allowed">Turnirlar (Yaqinda)</span></li>
              <li><span className="text-slate-600 cursor-not-allowed">Multiplayer (Yaqinda)</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GAMEVERSE. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1.5">
            Dizayn va kod <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> bilan tayyorlandi
          </p>
        </div>
      </div>
    </footer>
  );
}
