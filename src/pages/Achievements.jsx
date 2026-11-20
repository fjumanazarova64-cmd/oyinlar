import React from 'react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Coins, 
  Sparkles,
  Footprints,
  Gauge,
  MapPin,
  Crown,
  Wheat,
  Orbit,
  Zap,
  Key
} from 'lucide-react';

const ICON_MAP = {
  Footprints,
  Gauge,
  MapPin,
  Crown,
  Wheat,
  Orbit,
  Zap,
  Key,
  Trophy,
  Sparkles
};

export default function Achievements() {
  const { player } = useGame();

  const unlockedList = player.unlockedAchievements || [];
  const completedCount = unlockedList.length;
  const totalCount = ACHIEVEMENTS_DATA.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold font-gaming uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              Yutuqlar va Mukofotlar
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-gaming text-white">
              BADGES & REWARDS
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              O'yinlarda topshiriqlarni bajaring, yangi yutuqlarni oching va har bir yutuq uchun qimmatbaho XP va tangalarga ega bo'ling!
            </p>
          </div>

          {/* Progress Dial */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 text-center min-w-[200px]">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Yutuqlar Jarayoni</p>
            <p className="text-4xl font-black font-gaming text-amber-400 my-1">
              {completedCount} <span className="text-lg text-slate-500">/ {totalCount}</span>
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-300 font-semibold mt-1.5">{progressPercent}% Yakunlandi</p>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACHIEVEMENTS_DATA.map(ach => {
          const isUnlocked = unlockedList.includes(ach.id);
          const IconComponent = ICON_MAP[ach.icon] || Trophy;

          return (
            <div
              key={ach.id}
              className={`p-6 rounded-3xl transition-all duration-300 border flex items-start gap-4 ${
                isUnlocked
                  ? 'glass-panel border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-75'
              }`}
            >
              {/* Badge Icon */}
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform ${
                  isUnlocked 
                    ? 'shadow-lg scale-105' 
                    : 'bg-slate-800 text-slate-600'
                }`}
                style={isUnlocked ? {
                  backgroundColor: `${ach.color}20`,
                  border: `2px solid ${ach.color}`,
                  color: ach.color
                } : {}}
              >
                {isUnlocked ? (
                  <IconComponent className="w-7 h-7" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-500" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className={`font-gaming font-bold text-base ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {ach.title}
                  </h3>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ochilgan
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {ach.description}
                </p>

                {/* Reward pill */}
                <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
                  <span className="text-cyan-400">+{ach.xpReward} XP</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> +{ach.coinReward}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
