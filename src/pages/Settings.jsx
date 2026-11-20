import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Globe, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const { player, updateSettings, resetProgress } = useGame();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-gaming text-white">Platforma Sozlamalari</h1>
            <p className="text-xs text-slate-400">Ovozlar, vizual effektlar va hisob sozlamalari</p>
          </div>
        </div>
      </div>

      {/* Options List */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Sound FX */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">O'yin Ovoz Effektlari (SFX)</h4>
              <p className="text-xs text-slate-400">Harakat, sakrash, yig'ish va yutuq tovushlari</p>
            </div>
          </div>

          <button
            onClick={() => updateSettings('sound', !player.settings.sound)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              player.settings.sound ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
              player.settings.sound ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Music */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Fon Musiqasi (BGM)</h4>
              <p className="text-xs text-slate-400">Atmosferik fon musiqasi va retro chiptune ritmlar</p>
            </div>
          </div>

          <button
            onClick={() => updateSettings('music', !player.settings.music)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              player.settings.music ? 'bg-purple-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
              player.settings.music ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Visual FX / Particles */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Vizual Zarrachalar (Particles & Neon)</h4>
              <p className="text-xs text-slate-400">Yorqin neon effektlar va konfetti animatsiyalari</p>
            </div>
          </div>

          <button
            onClick={() => updateSettings('particles', !player.settings.particles)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              player.settings.particles ? 'bg-pink-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
              player.settings.particles ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Platforma Tili</h4>
              <p className="text-xs text-slate-400">Interfeys va o'yin ko'rsatmalari tili</p>
            </div>
          </div>

          <select
            value={player.settings.language}
            onChange={(e) => updateSettings('language', e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="uz">O'zbekcha</option>
            <option value="en">English (Coming)</option>
            <option value="ru">Русский (Coming)</option>
          </select>
        </div>

      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-red-500/30 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-gaming font-bold text-base text-white">Xavfli Hudud</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          O'yin progressi, to'plangan XP, Level, tangalar va rekordlarni tozalash. Bu amalni ortga qaytarib bo'lmaydi.
        </p>

        {showConfirmReset ? (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
            <p className="text-xs text-red-300 font-semibold">
              Rostdan ham barcha progressni tozalab boshlang'ich holatga qaytarmoqchimisiz?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetProgress();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-gaming"
              >
                Ha, Barchasini O'chirish
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Bekor Qilish
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold font-gaming flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            O'yin Progressini Qayta O'rnatish
          </button>
        )}
      </div>

    </div>
  );
}
