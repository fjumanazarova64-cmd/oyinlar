import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Key, Gem, Compass, Trophy, RotateCcw, Shield, Heart, Sparkles, Ghost } from 'lucide-react';
import MobileControls from '../../components/MobileControls';

const GRID_SIZE = 12;
const CELL_SIZE = 36;

export default function MysticIsland({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [keysCollected, setKeysCollected] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('playing');

  // Map elements: 0: ground, 1: ancient wall, 2: key, 3: gem, 4: locked gate, 5: ancient temple, 6: spike trap
  const [map, setMap] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 3, 1, 0, 0, 0, 3, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0, 1],
    [1, 3, 1, 1, 1, 4, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 6, 1, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 1, 0, 0, 3, 0, 0, 2, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 4, 1, 1],
    [1, 0, 0, 6, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 3, 0, 0, 0, 0, 1, 0, 1, 1, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]);

  // Patrolling shadow guardian
  const [guardian, setGuardian] = useState({ x: 7, y: 7, dir: 1 });
  const particlesRef = useRef([]);

  // Guardian Patrol loop
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setGuardian(prev => {
        let nx = prev.x + prev.dir;
        let ndir = prev.dir;
        if (nx > 9 || nx < 5) {
          ndir = -ndir;
          nx = prev.x + ndir;
        }
        return { x: nx, y: prev.y, dir: ndir };
      });
    }, 600);
    return () => clearInterval(interval);
  }, [status]);

  // Check collision with guardian
  useEffect(() => {
    if (playerPos.x === guardian.x && playerPos.y === guardian.y && status === 'playing') {
      soundManager.playHit();
      setHealth(h => {
        const nextH = h - 1;
        if (nextH <= 0) {
          setStatus('lost');
          onGameOver(score, Math.floor(score / 5), 100);
        }
        return Math.max(0, nextH);
      });
    }
  }, [playerPos, guardian, status]);

  const movePlayer = (dx, dy) => {
    if (status !== 'playing') return;

    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;

      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) return prev;
      const cell = map[newY][newX];

      if (cell === 1) return prev; // Wall

      // Locked gate
      if (cell === 4) {
        if (keysCollected > 0) {
          soundManager.playVictory();
          setKeysCollected(k => k - 1);
          setScore(s => s + 100);
          setMap(old => {
            const next = old.map(row => [...row]);
            next[newY][newX] = 0;
            return next;
          });
          return { x: newX, y: newY };
        } else {
          soundManager.playHit();
          return prev;
        }
      }

      // Collect Key
      if (cell === 2) {
        soundManager.playCoin();
        setKeysCollected(k => k + 1);
        setScore(s => s + 150);
        setMap(old => {
          const next = old.map(row => [...row]);
          next[newY][newX] = 0;
          return next;
        });
      }

      // Collect Gem
      if (cell === 3) {
        soundManager.playCoin();
        setGemsCollected(g => g + 1);
        setScore(s => s + 80);
        setMap(old => {
          const next = old.map(row => [...row]);
          next[newY][newX] = 0;
          return next;
        });
      }

      // Trap
      if (cell === 6) {
        soundManager.playHit();
        setHealth(h => {
          const nextH = h - 1;
          if (nextH <= 0) {
            setStatus('lost');
            onGameOver(score, Math.floor(score / 5), 100);
          }
          return Math.max(0, nextH);
        });
      }

      // Win Temple
      if (cell === 5) {
        soundManager.playVictory();
        setStatus('won');
        const finalScore = score + 500 + health * 100;
        setScore(finalScore);
        onGameOver(finalScore, 100, 200);
        return { x: newX, y: newY };
      }

      return { x: newX, y: newY };
    });
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'playing') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, keysCollected, score, map]);

  // Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tiles
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = map[r][c];
        const px = c * CELL_SIZE;
        const py = r * CELL_SIZE;

        // Ground with subtle mystic pattern
        ctx.fillStyle = (r + c) % 2 === 0 ? '#0b1e15' : '#07160f';
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

        if (val === 1) {
          // Ancient Mossy Stone Wall
          ctx.fillStyle = '#0f2b1d';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.strokeStyle = '#00ff8844';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        } else if (val === 2) {
          // Key
          ctx.font = '22px sans-serif';
          ctx.fillText('🔑', px + 5, py + 27);
        } else if (val === 3) {
          // Gem with Aura
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 10;
          ctx.font = '22px sans-serif';
          ctx.fillText('💎', px + 5, py + 27);
          ctx.shadowBlur = 0;
        } else if (val === 4) {
          // Gate
          ctx.fillStyle = '#5c3a21';
          ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
          ctx.font = '18px sans-serif';
          ctx.fillText('🔒', px + 8, py + 26);
        } else if (val === 5) {
          // Glowing Temple
          ctx.shadowColor = '#9d4edd';
          ctx.shadowBlur = 15;
          ctx.font = '24px sans-serif';
          ctx.fillText('🏛️', px + 4, py + 28);
          ctx.shadowBlur = 0;
        } else if (val === 6) {
          // Trap
          ctx.font = '18px sans-serif';
          ctx.fillText('⚡', px + 8, py + 26);
        }
      }
    }

    // Draw Patrolling Shadow Guardian
    const gx = guardian.x * CELL_SIZE;
    const gy = guardian.y * CELL_SIZE;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 12;
    ctx.font = '24px sans-serif';
    ctx.fillText('👾', gx + 4, gy + 28);
    ctx.shadowBlur = 0;

    // Draw Player
    const playerPx = playerPos.x * CELL_SIZE;
    const playerPy = playerPos.y * CELL_SIZE;
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.font = '26px sans-serif';
    ctx.fillText('🧙‍♂️', playerPx + 3, playerPy + 29);
    ctx.shadowBlur = 0;

  }, [playerPos, guardian, map]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-md mb-4 bg-slate-900/85 px-4 py-3 rounded-2xl border border-cyan-500/30 shadow-lg">
        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>{health} HP</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
          <Key className="w-4 h-4" />
          <span>{keysCollected}</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm">
          <Gem className="w-4 h-4" />
          <span>{gemsCollected}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-gaming text-sm">
          <Trophy className="w-4 h-4" />
          <span>{score}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 bg-[#07160f]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {status === 'won' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl animate-bounce">🏛️✨</span>
            <h3 className="font-gaming text-2xl font-black text-cyan-400 text-glow-cyan">IBODATXONA OCHILDI!</h3>
            <p className="text-xs text-slate-300">Orolning barcha tilsimlari yechildi va g'alaba qozondingiz!</p>
            <p className="text-amber-400 font-gaming font-bold text-lg">Yakuniy Ball: {score}</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-gaming font-bold text-xs shadow-lg shadow-cyan-500/30"
            >
              QAYTA O'YNASH
            </button>
          </div>
        )}

        {status === 'lost' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl">💀</span>
            <h3 className="font-gaming text-2xl font-black text-rose-500">OROLDA HALOK BO'LDINGIZ</h3>
            <p className="text-xs text-slate-300">Patrulchi soyalar yoki tuzoqlar sizni to'xtatdi.</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-gaming font-bold text-xs"
            >
              QAYTADAN BOSHLASH
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <MobileControls
        onDirection={(dir) => {
          if (dir === 'up') movePlayer(0, -1);
          if (dir === 'down') movePlayer(0, 1);
          if (dir === 'left') movePlayer(-1, 0);
          if (dir === 'right') movePlayer(1, 0);
        }}
        actionLabel="OCHISH"
      />
    </div>
  );
}
