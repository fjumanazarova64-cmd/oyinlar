import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CircleDot, Play } from 'lucide-react';

export default function MobileControls({ onDirection, onAction, actionLabel = "ACTION" }) {
  const handleTouch = (dir) => {
    if (onDirection) onDirection(dir);
  };

  return (
    <div className="md:hidden select-none touch-none mt-4 p-4 rounded-2xl glass-panel border border-cyan-500/20">
      <div className="flex items-center justify-between gap-4 max-w-sm mx-auto">
        
        {/* D-Pad */}
        <div className="relative w-36 h-36">
          {/* Up */}
          <button
            onTouchStart={() => handleTouch('up')}
            onMouseDown={() => handleTouch('up')}
            className="absolute top-0 left-12 w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md"
          >
            <ArrowUp className="w-6 h-6" />
          </button>

          {/* Left */}
          <button
            onTouchStart={() => handleTouch('left')}
            onMouseDown={() => handleTouch('left')}
            className="absolute top-12 left-0 w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Center */}
          <div className="absolute top-12 left-12 w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-center text-slate-500">
            <CircleDot className="w-5 h-5" />
          </div>

          {/* Right */}
          <button
            onTouchStart={() => handleTouch('right')}
            onMouseDown={() => handleTouch('right')}
            className="absolute top-12 right-0 w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Down */}
          <button
            onTouchStart={() => handleTouch('down')}
            onMouseDown={() => handleTouch('down')}
            className="absolute bottom-0 left-12 w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-500 active:text-black border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onTouchStart={() => onAction && onAction()}
            onMouseDown={() => onAction && onAction()}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 active:scale-95 flex flex-col items-center justify-center text-white font-gaming font-bold text-xs shadow-lg shadow-cyan-500/40 border-2 border-white/30"
          >
            <Play className="w-6 h-6 fill-white mb-0.5" />
            <span className="text-[10px] tracking-wider">{actionLabel}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
