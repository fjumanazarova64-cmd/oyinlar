import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/sound';
import { Sprout, Coins, Trophy, Droplets, Sparkles, Wind, Check } from 'lucide-react';

const CROPS = [
  { id: 'wheat', name: 'Bug\'doy', icon: '🌾', cost: 10, sellPrice: 28, growTime: 5, color: '#ffbe0b' },
  { id: 'carrot', name: 'Sabzi', icon: '🥕', cost: 20, sellPrice: 55, growTime: 8, color: '#ff7700' },
  { id: 'tomato', name: 'Pomidor', icon: '🍅', cost: 40, sellPrice: 110, growTime: 12, color: '#ff0055' },
  { id: 'strawberry', name: 'Qulupnay', icon: '🍓', cost: 80, sellPrice: 230, growTime: 18, color: '#ff007f' }
];

export default function DreamFarm({ onGameOver }) {
  const [coins, setCoins] = useState(120);
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [score, setScore] = useState(0);
  const [harvestedCount, setHarvestedCount] = useState(0);
  const [hasSprinkler, setHasSprinkler] = useState(false);

  const [plots, setPlots] = useState([
    { id: 1, crop: null, stage: 0, progress: 0, watered: false },
    { id: 2, crop: null, stage: 0, progress: 0, watered: false },
    { id: 3, crop: null, stage: 0, progress: 0, watered: false },
    { id: 4, crop: null, stage: 0, progress: 0, watered: false },
    { id: 5, crop: null, stage: 0, progress: 0, watered: false },
    { id: 6, crop: null, stage: 0, progress: 0, watered: false },
    { id: 7, crop: null, stage: 0, progress: 0, watered: false },
    { id: 8, crop: null, stage: 0, progress: 0, watered: false },
    { id: 9, crop: null, stage: 0, progress: 0, watered: false },
  ]);

  const [chickens, setChickens] = useState(1);
  const [eggs, setEggs] = useState(0);

  // Growth loop
  useEffect(() => {
    const timer = setInterval(() => {
      setPlots(prev => prev.map(p => {
        if (!p.crop) return p;

        // Auto sprinkler waters all crops
        const isWatered = hasSprinkler || p.watered;
        const speed = isWatered ? 2 : 1;
        const nextProgress = p.progress + speed;
        const ready = nextProgress >= p.crop.growTime;

        return {
          ...p,
          watered: isWatered,
          progress: nextProgress,
          stage: ready ? 2 : 1
        };
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [hasSprinkler]);

  // Chickens egg loop
  useEffect(() => {
    const eggTimer = setInterval(() => {
      if (chickens > 0) {
        setEggs(e => e + chickens);
      }
    }, 7000);
    return () => clearInterval(eggTimer);
  }, [chickens]);

  const handlePlotAction = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot) return;

    // Harvest
    if (plot.crop && plot.stage === 2) {
      soundManager.playCoin();
      const earned = plot.crop.sellPrice;
      const newScore = score + earned;
      setCoins(c => c + earned);
      setScore(newScore);
      setHarvestedCount(h => h + 1);

      onGameOver(newScore, earned, Math.floor(earned / 2));

      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, crop: null, stage: 0, progress: 0, watered: false } : p));
      return;
    }

    // Water
    if (plot.crop && !plot.watered) {
      soundManager.playJump();
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, watered: true } : p));
      return;
    }

    // Plant
    if (!plot.crop) {
      if (coins >= selectedCrop.cost) {
        soundManager.playClick();
        setCoins(c => c - selectedCrop.cost);
        setPlots(prev => prev.map(p => p.id === plotId ? {
          ...p,
          crop: selectedCrop,
          stage: 1,
          progress: 0,
          watered: hasSprinkler
        } : p));
      } else {
        soundManager.playHit();
      }
    }
  };

  const sellEggs = () => {
    if (eggs <= 0) return;
    soundManager.playCoin();
    const earned = eggs * 40;
    setCoins(c => c + earned);
    setEggs(0);
    setScore(s => s + earned);
  };

  const buyChicken = () => {
    if (coins >= 140) {
      soundManager.playVictory();
      setCoins(c => c - 140);
      setChickens(ch => ch + 1);
    } else {
      soundManager.playHit();
    }
  };

  const buySprinkler = () => {
    if (coins >= 250 && !hasSprinkler) {
      soundManager.playLevelUp();
      setCoins(c => c - 250);
      setHasSprinkler(true);
    } else {
      soundManager.playHit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-lg">
      
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full mb-4 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
          <Coins className="w-4 h-4 animate-bounce" />
          <span>{coins} Tanga</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
          <Sprout className="w-4 h-4" />
          <span>Hosil: {harvestedCount}</span>
        </div>
        <div className="text-cyan-400 font-gaming text-xs font-bold">
          {score} Ball
        </div>
      </div>

      {/* 3x3 Isometric Farm Plots */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-[#0e1d13] border-4 border-[#1f3a25] shadow-2xl w-full aspect-square max-w-[360px] relative overflow-hidden">
        {/* Ambient floating fireflies */}
        <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-yellow-300 rounded-full blur-[1px] animate-ping pointer-events-none" />
        <div className="absolute bottom-6 right-8 w-2 h-2 bg-emerald-400 rounded-full blur-[1px] animate-pulse pointer-events-none" />

        {plots.map(p => {
          const isReady = p.crop && p.stage === 2;
          const isGrowing = p.crop && p.stage === 1;

          return (
            <button
              key={p.id}
              onClick={() => handlePlotAction(p.id)}
              className={`relative rounded-2xl flex flex-col items-center justify-center p-2 transition-all transform active:scale-95 shadow-md ${
                p.crop
                  ? isReady
                    ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 border-2 border-yellow-200 animate-pulse shadow-yellow-500/50'
                    : p.watered
                    ? 'bg-[#153420] border-2 border-cyan-400/80'
                    : 'bg-[#221812] border-2 border-[#4a3325]'
                  : 'bg-[#140e0b] hover:bg-[#201712] border-2 border-dashed border-[#38261c]'
              }`}
            >
              {isReady && (
                <>
                  <span className="text-3xl animate-bounce">{p.crop.icon}</span>
                  <span className="text-[9px] font-black text-black font-gaming mt-1 bg-yellow-300 px-2 py-0.5 rounded-full shadow">
                    YIG'ISH!
                  </span>
                </>
              )}

              {isGrowing && (
                <>
                  <span className="text-2xl animate-pulse">🌱</span>
                  <span className="text-[10px] text-slate-200 font-bold mt-1">
                    {p.watered ? '💧 Sug\'orildi' : '🌵 Suv quying!'}
                  </span>
                  <div className="w-12 bg-black/50 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (p.progress / p.crop.growTime) * 100)}%` }}
                    />
                  </div>
                </>
              )}

              {!p.crop && (
                <div className="text-center text-stone-500">
                  <span className="text-xl block">🟫</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider">Bo'sh yer</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Animal Ranch & Sprinkler Bar */}
      <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-full max-w-[360px] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-bounce">🐔</span>
          <div>
            <p className="text-xs font-bold text-white">{chickens} Tovuq</p>
            <p className="text-[10px] text-yellow-400 font-semibold">{eggs} Tuxum tayyor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={sellEggs}
            disabled={eggs === 0}
            className="px-3 py-1.5 rounded-xl bg-yellow-500 disabled:opacity-40 text-black font-bold text-[10px] font-gaming shadow-md"
          >
            SOTISH
          </button>
          <button
            onClick={buyChicken}
            disabled={coins < 140}
            className="px-3 py-1.5 rounded-xl bg-purple-600 disabled:opacity-40 text-white font-bold text-[10px] font-gaming"
            title="Tovuq: 140 Tanga"
          >
            +1 TOVUQ
          </button>
          <button
            onClick={buySprinkler}
            disabled={hasSprinkler || coins < 250}
            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] font-gaming transition-all ${
              hasSprinkler
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400 cursor-default'
                : 'bg-cyan-500 text-black disabled:opacity-40'
            }`}
            title="Avtomatik Sprinkler: 250 Tanga"
          >
            {hasSprinkler ? '💧 AVTO' : '💧 250g'}
          </button>
        </div>
      </div>

      {/* Seed Market Selector */}
      <div className="mt-3 grid grid-cols-4 gap-2 w-full max-w-[360px]">
        {CROPS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c)}
            className={`p-2 rounded-xl border text-center transition-all ${
              selectedCrop.id === c.id
                ? 'bg-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105'
                : 'bg-slate-900/70 border-slate-800 opacity-80'
            }`}
          >
            <span className="text-xl block">{c.icon}</span>
            <span className="text-[10px] font-bold text-white block truncate">{c.name}</span>
            <span className="text-[9px] text-yellow-400 font-bold block">{c.cost}g</span>
          </button>
        ))}
      </div>

    </div>
  );
}
