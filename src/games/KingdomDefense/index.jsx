import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Shield, Swords, Coins, Heart, Play, RotateCcw, Sparkles, Zap } from 'lucide-react';

export default function KingdomDefense({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [gold, setGold] = useState(150);
  const [health, setHealth] = useState(10);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedTower, setSelectedTower] = useState('laser'); // 'laser' | 'frost' | 'mortar'
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const [slots, setSlots] = useState([
    { id: 1, x: 90, y: 80, tower: null },
    { id: 2, x: 230, y: 80, tower: null },
    { id: 3, x: 160, y: 190, tower: null },
    { id: 4, x: 90, y: 300, tower: null },
    { id: 5, x: 230, y: 300, tower: null },
  ]);

  const path = [
    { x: 30, y: 20 },
    { x: 30, y: 140 },
    { x: 290, y: 140 },
    { x: 290, y: 250 },
    { x: 30, y: 250 },
    { x: 30, y: 380 },
    { x: 310, y: 380 }
  ];

  const gameState = useRef({
    enemies: [],
    projectiles: [],
    particles: [],
    wave: 1,
    gold: 150,
    health: 10,
    score: 0,
    shake: 0
  });

  // Spawn enemies per wave
  useEffect(() => {
    let count = 0;
    const maxEnemies = 7 + wave * 3;
    const interval = setInterval(() => {
      if (count < maxEnemies && !isGameOver && !isVictory) {
        count++;
        const isBoss = count === maxEnemies;
        gameState.current.enemies.push({
          id: Math.random(),
          x: path[0].x,
          y: path[0].y,
          pathIndex: 0,
          hp: isBoss ? 200 + wave * 100 : 45 + wave * 30,
          maxHp: isBoss ? 200 + wave * 100 : 45 + wave * 30,
          speed: isBoss ? 0.9 : 1.3 + wave * 0.12,
          reward: isBoss ? 45 : 18,
          isFrozen: 0,
          type: isBoss ? 'boss' : count % 4 === 0 ? 'golem' : 'cyber-bug'
        });
      } else if (count >= maxEnemies) {
        clearInterval(interval);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [wave, isGameOver, isVictory]);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const loop = () => {
      const state = gameState.current;

      ctx.save();
      if (state.shake > 0) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
        state.shake *= 0.88;
      }

      // Dark Sci-Fi Ground
      ctx.fillStyle = '#0a0d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Path
      ctx.strokeStyle = '#1b2238';
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      path.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Path Neon Center Line
      ctx.strokeStyle = '#00f2fe33';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Castle Base Core at End
      ctx.fillStyle = '#ffbe0b';
      ctx.shadowColor = '#ffbe0b';
      ctx.shadowBlur = 18;
      ctx.fillRect(295, 360, 40, 40);
      ctx.shadowBlur = 0;
      ctx.font = '22px sans-serif';
      ctx.fillText('🏰', 300, 390);

      // Towers attack logic
      slots.forEach(slot => {
        if (!slot.tower) return;

        const range = slot.tower.range || 105;
        let target = null;
        let minDist = range;

        state.enemies.forEach(en => {
          const d = Math.hypot(en.x - slot.x, en.y - slot.y);
          if (d < minDist) {
            minDist = d;
            target = en;
          }
        });

        if (target && (!slot.lastShot || Date.now() - slot.lastShot > slot.tower.rate)) {
          slot.lastShot = Date.now();
          soundManager.playShoot();

          if (slot.tower.type === 'frost') {
            target.isFrozen = 40; // slowed
          }

          state.projectiles.push({
            x: slot.x,
            y: slot.y,
            tx: target.x,
            ty: target.y,
            targetId: target.id,
            color: slot.tower.color,
            damage: slot.tower.damage,
            isAoe: slot.tower.type === 'mortar'
          });
        }
      });

      // Update & Draw Projectiles
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 12) {
          // Impact
          if (p.isAoe) {
            state.shake = 8;
            // Area of Effect damage
            state.enemies.forEach(en => {
              if (Math.hypot(en.x - p.tx, en.y - p.ty) < 45) {
                en.hp -= p.damage;
              }
            });
            for (let k = 0; k < 12; k++) {
              state.particles.push({
                x: p.tx, y: p.ty,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#ffbe0b', life: 1
              });
            }
          } else {
            const hitEnemy = state.enemies.find(e => e.id === p.targetId);
            if (hitEnemy) hitEnemy.hp -= p.damage;
            for (let k = 0; k < 6; k++) {
              state.particles.push({
                x: p.tx, y: p.ty,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: p.color, life: 1
              });
            }
          }
          state.projectiles.splice(i, 1);
        } else {
          p.x += (dx / dist) * 11;
          p.y += (dy / dist) * 11;

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.isAoe ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Update & Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.06;
        if (pt.life <= 0) {
          state.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.fillRect(pt.x, pt.y, 3, 3);
        ctx.globalAlpha = 1;
      }

      // Update & Draw Enemies
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const en = state.enemies[i];

        if (en.hp <= 0) {
          soundManager.playCoin();
          state.gold += en.reward;
          state.score += 60;
          setGold(state.gold);
          setScore(state.score);
          state.enemies.splice(i, 1);
          continue;
        }

        const targetPt = path[en.pathIndex + 1];
        if (!targetPt) {
          soundManager.playHit();
          state.health -= 1;
          state.shake = 12;
          setHealth(state.health);
          state.enemies.splice(i, 1);

          if (state.health <= 0) {
            setIsGameOver(true);
            onGameOver(state.score, state.gold, Math.floor(state.score / 5));
          }
          continue;
        }

        const effectiveSpeed = en.isFrozen > 0 ? en.speed * 0.5 : en.speed;
        if (en.isFrozen > 0) en.isFrozen--;

        const dx = targetPt.x - en.x;
        const dy = targetPt.y - en.y;
        const d = Math.hypot(dx, dy);

        if (d < effectiveSpeed) {
          en.pathIndex += 1;
        } else {
          en.x += (dx / d) * effectiveSpeed;
          en.y += (dy / d) * effectiveSpeed;
        }

        // Draw Enemy
        ctx.save();
        ctx.fillStyle = en.isFrozen > 0 ? '#00f2fe' : en.type === 'boss' ? '#ff0055' : en.type === 'golem' ? '#ffbe0b' : '#00ff88';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const r = en.type === 'boss' ? 15 : en.type === 'golem' ? 11 : 8;
        ctx.arc(en.x, en.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Health Bar
        const hpPct = Math.max(0, en.hp / en.maxHp);
        ctx.fillStyle = '#ff0033';
        ctx.fillRect(en.x - 14, en.y - 18, 28, 3.5);
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(en.x - 14, en.y - 18, 28 * hpPct, 3.5);
      }

      // Slots & Towers
      slots.forEach(slot => {
        if (slot.tower) {
          ctx.save();
          ctx.fillStyle = slot.tower.color;
          ctx.shadowColor = slot.tower.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(slot.x, slot.y, 17, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.font = '16px sans-serif';
          ctx.fillText(slot.tower.icon, slot.x - 8, slot.y + 6);
        } else {
          ctx.strokeStyle = '#00f2fe44';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(slot.x - 14, slot.y - 14, 28, 28);
          ctx.setLineDash([]);
        }
      });

      ctx.restore(); // end shake

      if (state.enemies.length === 0 && wave >= 5 && !isGameOver && !isVictory) {
        soundManager.playVictory();
        setIsVictory(true);
        onGameOver(state.score + 600, state.gold, 300);
      }

      if (!isGameOver && !isVictory) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [slots, isGameOver, isVictory, wave]);

  const handleSlotClick = (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.tower) return;

    const costs = { laser: 50, frost: 80, mortar: 120 };
    const cost = costs[selectedTower];

    if (gold >= cost) {
      soundManager.playCoin();
      setGold(g => {
        const nextG = g - cost;
        gameState.current.gold = nextG;
        return nextG;
      });

      const config = {
        laser: { type: 'laser', name: 'Laser Beam', color: '#00f2fe', icon: '⚡', damage: 32, range: 110, rate: 650 },
        frost: { type: 'frost', name: 'Frost Nova', color: '#9d4edd', icon: '❄️', damage: 25, range: 90, rate: 1000 },
        mortar: { type: 'mortar', name: 'Plasma Mortar', color: '#ffbe0b', icon: '💣', damage: 85, range: 80, rate: 1700 }
      }[selectedTower];

      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, tower: config } : s));
    } else {
      soundManager.playHit();
    }
  };

  const nextWave = () => {
    if (wave < 5) {
      soundManager.playLevelUp();
      setWave(w => w + 1);
      gameState.current.wave += 1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-sm mb-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-yellow-500/40 shadow-lg shadow-yellow-500/10">
        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>{health} HP</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
          <Coins className="w-4 h-4" />
          <span>{gold} Oltin</span>
        </div>
        <div className="text-cyan-400 font-gaming text-xs font-bold">
          To'lqin: {wave}/5
        </div>
        <div className="text-emerald-400 font-gaming text-xs font-bold">
          {score} Ball
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/60 shadow-2xl shadow-yellow-500/25 bg-[#0a0d16]">
        <canvas
          ref={canvasRef}
          width={350}
          height={410}
          className="block"
        />

        {/* Slot click targets */}
        <div className="absolute inset-0 pointer-events-auto">
          {slots.map(s => (
            <button
              key={s.id}
              onClick={() => handleSlotClick(s.id)}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg hover:scale-110 transition-transform"
              style={{ left: s.x, top: s.y }}
              title={s.tower ? s.tower.name : 'Minora qurish'}
            >
              {!s.tower && (
                <span className="w-6 h-6 rounded-md bg-yellow-500/30 border border-yellow-400/80 flex items-center justify-center text-[10px] text-yellow-300 font-bold animate-pulse">
                  +
                </span>
              )}
            </button>
          ))}
        </div>

        {isVictory && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl animate-bounce">👑✨</span>
            <h3 className="font-gaming text-2xl font-black text-amber-400 text-glow-purple">QIROLLIK HIMOYALANDI!</h3>
            <p className="text-xs text-slate-300">Barcha 5 to'lqin dushmanlar yo'q qilindi! Buyuk g'alaba!</p>
            <p className="text-cyan-400 font-gaming font-bold text-lg">Ball: {score + 600}</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-gaming font-bold text-xs shadow-lg shadow-amber-500/40"
            >
              QAYTA O'YNASH
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl">🏰💔</span>
            <h3 className="font-gaming text-2xl font-black text-rose-500">QIROLLIK QULADI</h3>
            <p className="text-xs text-slate-300">Dushmanlar reydidan omon qolish uchun minoralarni kuchaytiring.</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-gaming font-bold text-xs"
            >
              QAYTADAN BOSHLASH
            </button>
          </div>
        )}
      </div>

      {/* Modern Sci-Fi Tower Selector */}
      <div className="mt-4 flex items-center justify-between gap-2 max-w-sm w-full">
        <button
          onClick={() => setSelectedTower('laser')}
          className={`flex-1 p-2 rounded-xl border text-center transition-all ${
            selectedTower === 'laser'
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30 scale-105'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-lg block">⚡</span>
          <span className="text-[11px] font-bold block">Laser Beam</span>
          <span className="text-[10px] text-yellow-400">50g</span>
        </button>

        <button
          onClick={() => setSelectedTower('frost')}
          className={`flex-1 p-2 rounded-xl border text-center transition-all ${
            selectedTower === 'frost'
              ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/30 scale-105'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-lg block">❄️</span>
          <span className="text-[11px] font-bold block">Frost Nova</span>
          <span className="text-[10px] text-yellow-400">80g</span>
        </button>

        <button
          onClick={() => setSelectedTower('mortar')}
          className={`flex-1 p-2 rounded-xl border text-center transition-all ${
            selectedTower === 'mortar'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/30 scale-105'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <span className="text-lg block">💣</span>
          <span className="text-[11px] font-bold block">Plasma Mortar</span>
          <span className="text-[10px] text-yellow-400">120g</span>
        </button>

        <button
          onClick={nextWave}
          disabled={wave >= 5}
          className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-black font-gaming font-bold text-xs disabled:opacity-40 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
          title="Keyingi to'lqin"
        >
          WAVE ▶
        </button>
      </div>

    </div>
  );
}
