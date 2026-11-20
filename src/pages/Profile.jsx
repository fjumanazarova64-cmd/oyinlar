import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GAMES_DATA } from '../data/gamesData';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { 
  User, 
  Trophy, 
  Coins, 
  Flame, 
  Gamepad2, 
  Award, 
  Check, 
  Sparkles,
  Edit2
} from 'lucide-react';

const AVATARS = ['🚀', '⚡', '👑', '🐉', '💎', '🥷', '🤖', '👾', '🔥', '🦁', '🦊', '⭐'];

export default function Profile() {
  const { player, updateProfile } = useGame();
  const [editing, setEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(player.username);
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar);

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));

  const handleSave = () => {
    updateProfile(tempUsername, selectedAvatar);
    setEditing(false);
  };

  const unlockedCount = player.unlockedAchievements?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Profile Card Header */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar Big */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 p-1 shadow-2xl shadow-cyan-500/30">
              <div className="w-full h-full bg-[#0c0c1e] rounded-[22px] flex items-center justify-center text-5xl sm:text-6xl">
                {selectedAvatar}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs font-gaming shadow-lg">
              LVL {player.level}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      maxLength={18}
                      className="bg-slate-900 border border-cyan-500 px-3 py-1.5 rounded-xl text-lg font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs font-gaming flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Saqlash
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl font-black font-gaming text-white">
                      {player.username}
                    </h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Ismni tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-1">GAMEVERSE Ultimate Gamer ID #{Math.floor(player.level * 1843)}</p>
              </div>

              {/* Coins & Status */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-2xl text-yellow-400 font-bold">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="font-gaming text-base">{player.coins.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-400">XP Progress</span>
                <span className="text-slate-300">{player.xp} / {player.xpToNextLevel} XP ({xpPercent}%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                Keyingi darajaga: <span className="text-white font-bold">{player.xpToNextLevel - player.xp} XP</span> qoldi
              </p>
            </div>

            {/* Avatar Selector if editing */}
            {editing && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-300">Avatar tanlang:</p>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        selectedAvatar === av
                          ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110'
                          : 'bg-slate-800/80 hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center space-y-1">
          <Gamepad2 className="w-6 h-6 text-cyan-400 mx-auto" />
          <p className="text-2xl font-black font-gaming text-white">{player.totalGamesPlayed}</p>
          <p className="text-xs text-slate-400">Jami O'ynalgan</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center space-y-1">
          <Flame className="w-6 h-6 text-pink-400 mx-auto" />
          <p className="text-2xl font-black font-gaming text-white">{player.totalScore.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Umumiy Ballar</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center space-y-1">
          <Award className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-2xl font-black font-gaming text-white">{unlockedCount} / {ACHIEVEMENTS_DATA.length}</p>
          <p className="text-xs text-slate-400">Yutuqlar</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 text-center space-y-1">
          <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
          <p className="text-2xl font-black font-gaming text-white">Level {player.level}</p>
          <p className="text-xs text-slate-400">Tajriba Darajasi</p>
        </div>
      </div>

      {/* High Scores per Game */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-gaming text-xl font-bold text-white">Har Bir O'yindagi Natijalar</h3>
            <p className="text-xs text-slate-400">Sizning shaxsiy rekordlaringiz ro'yxati</p>
          </div>
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES_DATA.map(game => {
            const score = player.highScores?.[game.id] || 0;
            return (
              <div 
                key={game.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-sm text-white">{game.title}</h4>
                  <p className="text-[11px] text-slate-400">{game.genre}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-gaming text-cyan-400">
                    {score.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-slate-500">ball</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
