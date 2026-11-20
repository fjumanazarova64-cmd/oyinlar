import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Ghost, Key, Lock, Eye, Trophy, Heart, Sparkles, Volume2 } from 'lucide-react';
import MobileControls from '../../components/MobileControls';

export default function DarkHouse({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [player, setPlayer] = useState({ x: 60, y: 60, angle: 0 });
  const [hasKey, setHasKey] = useState(false);
  const [hasCodePaper, setHasCodePaper] = useState(false);
  const [safeOpened, setSafeOpened] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [sanity, setSanity] = useState(100);

  const SAFE_CODE = '739';

  // Dust particles floating in air
  const dustRef = useRef(
    Array.from({ length: 30 }, () => ({
      x: Math.random() * 350,
      y: Math.random() * 370,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1
    }))
  );

  const movePlayer = (dx, dy) => {
    if (gameWon) return;
    setPlayer(prev => {
      const nx = Math.max(30, Math.min(320, prev.x + dx));
      const ny = Math.max(30, Math.min(330, prev.y + dy));
      const angle = Math.atan2(dy, dx);
      return { x: nx, y: ny, angle: (dx !== 0 || dy !== 0) ? angle : prev.angle };
    });
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setPlayer(prev => ({
      ...prev,
      angle: Math.atan2(my - prev.y, mx - prev.x)
    }));
  };

  const interact = () => {
    // Key
    if (!hasKey && Math.hypot(player.x - 260, player.y - 70) < 45) {
      soundManager.playCoin();
      setHasKey(true);
      setInventory(prev => [...prev, 'Zanglagan Kalit']);
      setScore(s => s + 100);
      return;
    }

    // Code Paper
    if (!hasCodePaper && Math.hypot(player.x - 70, player.y - 280) < 45) {
      soundManager.playCoin();
      setHasCodePaper(true);
      setInventory(prev => [...prev, 'Shifr: 7-3-9']);
      setScore(s => s + 100);
      return;
    }

    // Safe
    if (!safeOpened && Math.hypot(player.x - 270, player.y - 270) < 45) {
      setShowSafeModal(true);
      return;
    }

    // Exit Gate
    if (Math.hypot(player.x - 170, player.y - 340) < 50) {
      if (safeOpened) {
        soundManager.playVictory();
        setGameWon(true);
        const finalScore = score + 450 + sanity * 2;
        setScore(finalScore);
        onGameOver(finalScore, 120, 220);
      } else {
        soundManager.playHit();
      }
    }
  };

  const handleSafeSubmit = (e) => {
    e.preventDefault();
    if (enteredCode === SAFE_CODE) {
      soundManager.playVictory();
      setSafeOpened(true);
      setShowSafeModal(false);
      setScore(s => s + 200);
      setInventory(prev => [...prev, 'Chiqish Kaliti']);
    } else {
      soundManager.playHit();
      alert('Noto\'g\'ri kod! Qog\'ozdagi shifrni tekshiring.');
      setEnteredCode('');
    }
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') movePlayer(0, -18);
      if (e.key === 's' || e.key === 'ArrowDown') movePlayer(0, 18);
      if (e.key === 'a' || e.key === 'ArrowLeft') movePlayer(-18, 0);
      if (e.key === 'd' || e.key === 'ArrowRight') movePlayer(18, 0);
      if (e.key === 'f' || e.key === 'e' || e.key === ' ') interact();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, hasKey, hasCodePaper, safeOpened, gameWon]);

  // Main Render with Volumetric Flashlight Cone
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      // 1. Draw lit creepy house scene
      ctx.fillStyle = '#0f0f1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Blood-tinted floor boards
      ctx.strokeStyle = '#18182e';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Walls
      ctx.fillStyle = '#22223c';
      ctx.fillRect(160, 20, 12, 140);
      ctx.fillRect(20, 170, 310, 12);
      ctx.fillRect(160, 240, 12, 120);

      // Items
      ctx.font = '22px sans-serif';
      if (!hasKey) ctx.fillText('🔑', 250, 75);
      if (!hasCodePaper) ctx.fillText('📜', 60, 285);
      ctx.fillText(safeOpened ? '🔓' : '🔒', 260, 275);
      ctx.fillText('🚪', 160, 345);

      // Creepy Red Eyes in Darkness
      const time = Date.now() * 0.003;
      if (Math.sin(time) > 0.7) {
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(310, 45, 3, 0, Math.PI * 2);
        ctx.arc(322, 45, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Detective Player Character
      ctx.font = '24px sans-serif';
      ctx.fillText('🕵️', player.x - 12, player.y + 10);

      // 2. Darkness Mask with Dynamic Cone Flashlight
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tctx = tempCanvas.getContext('2d');

      tctx.fillStyle = 'rgba(3, 3, 8, 0.96)';
      tctx.fillRect(0, 0, canvas.width, canvas.height);

      tctx.globalCompositeOperation = 'destination-out';

      // 360-degree close aura
      const closeGrad = tctx.createRadialGradient(player.x, player.y, 5, player.x, player.y, 45);
      closeGrad.addColorStop(0, 'rgba(0,0,0,1)');
      closeGrad.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = closeGrad;
      tctx.beginPath();
      tctx.arc(player.x, player.y, 45, 0, Math.PI * 2);
      tctx.fill();

      // Flashlight Directional Cone
      const coneLength = 150;
      const coneAngle = 0.55; // spread in radians
      const angle = player.angle || 0;

      tctx.beginPath();
      tctx.moveTo(player.x, player.y);
      tctx.arc(player.x, player.y, coneLength, angle - coneAngle, angle + coneAngle);
      tctx.closePath();

      const coneGrad = tctx.createRadialGradient(player.x, player.y, 20, player.x, player.y, coneLength);
      coneGrad.addColorStop(0, 'rgba(0,0,0,1)');
      coneGrad.addColorStop(0.75, 'rgba(0,0,0,0.85)');
      coneGrad.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = coneGrad;
      tctx.fill();

      // Draw darkness over canvas
      ctx.drawImage(tempCanvas, 0, 0);

      // 3. Floating Dust Particles in flashlight beam
      dustRef.current.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        // Check if illuminated
        const dist = Math.hypot(d.x - player.x, d.y - player.y);
        const ang = Math.atan2(d.y - player.y, d.x - player.x);
        let angDiff = Math.abs(ang - angle);
        if (angDiff > Math.PI) angDiff = Math.PI * 2 - angDiff;

        if (dist < coneLength && angDiff < coneAngle) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (!gameWon) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [player, hasKey, hasCodePaper, safeOpened, gameWon]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-sm mb-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-purple-500/40 shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
          <Ghost className="w-4 h-4 animate-pulse" />
          <span>Qorong'i Uy</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 animate-ping" />
          <span>Aql: {sanity}%</span>
        </div>
        <div className="text-emerald-400 font-gaming text-xs font-bold">
          {score} Ball
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="relative rounded-2xl overflow-hidden border-2 border-purple-500/60 shadow-2xl shadow-purple-500/25 bg-black cursor-crosshair"
        onMouseMove={handlePointerMove}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={370}
          className="block"
        />

        {gameWon && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl animate-bounce">🗝️✨</span>
            <h3 className="font-gaming text-2xl font-black text-cyan-400 text-glow-cyan">UYDAN OMON CHIQDINGIZ!</h3>
            <p className="text-xs text-slate-300">Shifrlarni ochib, bosh darvozadan qochishga muvaffaq bo'ldingiz.</p>
            <p className="text-amber-400 font-gaming font-bold text-lg">Yakuniy Ball: {score}</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-gaming font-bold text-xs shadow-lg shadow-cyan-500/40"
            >
              QAYTA O'YNASH
            </button>
          </div>
        )}

        {showSafeModal && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
            <h4 className="font-gaming text-base font-bold text-white">Seyf 3 Xonali Shifri:</h4>
            <p className="text-xs text-slate-400">Uyda yashiringan qog'ozdagi kodni kiriting:</p>
            <form onSubmit={handleSafeSubmit} className="space-y-3">
              <input
                type="text"
                maxLength={3}
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="---"
                className="bg-slate-900 border-2 border-amber-500 text-center text-2xl font-black font-gaming text-amber-400 w-32 py-2 rounded-xl focus:outline-none"
              />
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs font-gaming shadow-lg shadow-amber-500/30"
                >
                  OCHISH
                </button>
                <button
                  type="button"
                  onClick={() => setShowSafeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  YOPISH
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Inventory Bar */}
      <div className="mt-3 flex items-center gap-2 max-w-sm w-full overflow-x-auto text-xs">
        <span className="text-slate-500 font-bold text-[10px] uppercase">Xalta:</span>
        {inventory.length === 0 ? (
          <span className="text-slate-600 text-xs">Bo'sh</span>
        ) : (
          inventory.map((it, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[11px] font-semibold">
              {it}
            </span>
          ))
        )}
      </div>

      {/* Mobile Controls */}
      <MobileControls
        onDirection={(dir) => {
          if (dir === 'up') movePlayer(0, -20);
          if (dir === 'down') movePlayer(0, 20);
          if (dir === 'left') movePlayer(-20, 0);
          if (dir === 'right') movePlayer(20, 0);
        }}
        onAction={interact}
        actionLabel="TEKSHIRISH"
      />
    </div>
  );
}
