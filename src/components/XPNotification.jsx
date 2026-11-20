import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Trophy, Award, Flame, X } from 'lucide-react';

export default function XPNotification() {
  const { notification } = useGame();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-1000 max-w-sm w-full p-4 rounded-2xl glass-panel border border-cyan-500/40 shadow-2xl shadow-cyan-500/30">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-cyan-500/40">
          {notification.icon || '🎉'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="font-gaming text-sm font-bold text-white tracking-wide">
              {notification.title}
            </h4>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
