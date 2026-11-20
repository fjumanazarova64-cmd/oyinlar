import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Zap, Trophy, Coins, RotateCcw, Flame, Shield, Sparkles } from 'lucide-react';
import MobileControls from '../../components/MobileControls';

export default function NeonRush({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [speed, setSpeed] = useState(120);
  const [nitro, setNitro] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  // Lanes: 0: Left (70), 1: Middle (180), 2: Right (290)
  const LANE_X = [70, 180, 290];
  const [lane, setLane] = useState(1);

  const stateRef = useRef({
    currentX: 180,
    targetX: 180,
    playerY: 380,
    obstacles: [],
    coinsList: [],
    particles: [],
    speed: 7,
    score: 0,
    coins: 0,
    nitroActive: false,
    nitroEnergy: 100,
    gameOver: false,
    shake: 0,
    gridOffset: 0,
    dodgeStreak: 0
  });

  useEffect(() => {
    stateRef.current.targetX = LANE_X[lane];
  }, [lane]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const spawnObstacle = () => {
      const randomLane = Math.floor(Math.random() * 3);
      const types = ['cyber-car', 'plasma-barrier', 'truck'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      stateRef.current.obstacles.push({
        lane: randomLane,
        x: LANE_X[randomLane],
        y: -70,
        type: chosen,
        color: chosen === 'cyber-car' ? '#ff007f' : chosen === 'plasma-barrier' ? '#9d4edd' : '#ffbe0b'
      });
    };

    const spawnCoin = () => {
      const randomLane = Math.floor(Math.random() * 3);
      stateRef.current.coinsList.push({
        lane: randomLane,
        x: LANE_X[randomLane],
        y: -40,
        rot: 0
      });
    };

    let obsInterval = setInterval(spawnObstacle, 1100);
    let coinInterval = setInterval(spawnCoin, 850);

    const updateAndDraw = () => {
      const state = stateRef.current;
      if (state.gameOver) return;

      const currentSpeed = state.nitroActive ? state.speed * 1.75 : state.speed;

      // Screen Shake
      ctx.save();
      if (state.shake > 0) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
        state.shake *= 0.9;
      }

      // 1. Synthwave Cyberpunk Horizon & Background
      ctx.fillStyle = '#060613';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Neon Sun
      const sunGrad = ctx.createRadialGradient(180, 70, 10, 180, 70, 60);
      sunGrad.addColorStop(0, '#ff007f');
      sunGrad.addColorStop(0.7, '#9d4edd');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(180, 70, 60, 0, Math.PI * 2);
      ctx.fill();

      // Sun horizontal stripes
      ctx.fillStyle = '#060613';
      for (let s = 45; s < 100; s += 7) {
        ctx.fillRect(120, s, 120, 2);
      }

      // 3D Perspective Road Grid
      state.gridOffset = (state.gridOffset + currentSpeed) % 40;
      ctx.strokeStyle = '#00f2fe33';
      ctx.lineWidth = 1.5;

      // Road border rails
      ctx.strokeStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(30, 0); ctx.lineTo(30, canvas.height);
      ctx.moveTo(330, 0); ctx.lineTo(330, canvas.height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving Grid Horizontal Lines
      ctx.strokeStyle = '#282855';
      for (let y = state.gridOffset; y < canvas.height; y += 35) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(330, y);
        ctx.stroke();
      }

      // Neon Lane Dividers
      ctx.strokeStyle = '#ff007f55';
      ctx.setLineDash([25, 25]);
      ctx.lineDashOffset = -state.gridOffset * 1.5;
      ctx.beginPath();
      ctx.moveTo(125, 0); ctx.lineTo(125, canvas.height);
      ctx.moveTo(235, 0); ctx.lineTo(235, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Speed lines when Nitro
      if (state.nitroActive) {
        ctx.strokeStyle = '#ffffff88';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const rx = 40 + Math.random() * 280;
          const ry = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx, ry + 40);
          ctx.stroke();
        }
      }

      // Smooth Car X interpolation (Lerp)
      state.currentX += (state.targetX - state.currentX) * 0.22;

      // Spawn Exhaust Thruster Particles
      state.particles.push({
        x: state.currentX + (Math.random() - 0.5) * 12,
        y: state.playerY + 28,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 3 + Math.random() * 4,
        size: state.nitroActive ? 6 : 3.5,
        life: 1,
        color: state.nitroActive ? '#00f2fe' : '#ff007f'
      });

      // Update & Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        p.size *= 0.94;

        if (p.life <= 0) {
          state.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & Draw Coins (Glowing 3D Neon Rings)
      for (let i = state.coinsList.length - 1; i >= 0; i--) {
        const c = state.coinsList[i];
        c.y += currentSpeed;
        c.rot += 0.08;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(Math.cos(c.rot), 1);
        ctx.fillStyle = '#ffbe0b';
        ctx.shadowColor = '#ffbe0b';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Magnet / Collision with Player
        if (Math.hypot(c.x - state.currentX, c.y - state.playerY) < 36) {
          soundManager.playCoin();
          state.coins += 1;
          state.score += 50 * state.dodgeStreak;
          setCoins(state.coins);
          setScore(state.score);

          // Coin explosion particles
          for (let k = 0; k < 8; k++) {
            state.particles.push({
              x: c.x, y: c.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: 4, life: 1, color: '#ffbe0b'
            });
          }

          state.coinsList.splice(i, 1);
          continue;
        }

        if (c.y > canvas.height + 30) state.coinsList.splice(i, 1);
      }

      // Update & Draw Obstacles (Cyber Cars & Drones)
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.y += currentSpeed;

        ctx.save();
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 14;

        if (obs.type === 'plasma-barrier') {
          // Electric Plasma Barrier
          ctx.strokeStyle = obs.color;
          ctx.lineWidth = 4;
          ctx.strokeRect(obs.x - 28, obs.y - 12, 56, 24);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x - 20, obs.y - 4, 40, 8);
        } else {
          // Futuristic Cyber Enemy Vehicle
          ctx.fillStyle = obs.color;
          ctx.beginPath();
          ctx.roundRect(obs.x - 18, obs.y - 30, 36, 60, 8);
          ctx.fill();
          // Windshield
          ctx.fillStyle = '#050512';
          ctx.fillRect(obs.x - 12, obs.y - 12, 24, 18);
          // Neon Tail Lights
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(obs.x - 14, obs.y - 28, 6, 4);
          ctx.fillRect(obs.x + 8, obs.y - 28, 6, 4);
        }
        ctx.restore();

        // Collision Check
        if (Math.hypot(obs.x - state.currentX, obs.y - state.playerY) < 46) {
          soundManager.playHit();
          state.shake = 22;
          state.gameOver = true;
          setIsGameOver(true);
          onGameOver(state.score, state.coins, Math.floor(state.score / 5));
          break;
        }

        // Successfully dodged
        if (obs.y > canvas.height + 60) {
          state.obstacles.splice(i, 1);
          state.score += 25;
          state.dodgeStreak = Math.min(4, state.dodgeStreak + 0.2);
          setMultiplier(Math.floor(state.dodgeStreak));
          setScore(state.score);
        }
      }

      // Draw Player's Cyber Hypercar
      ctx.save();
      const px = state.currentX;
      const py = state.playerY;

      // Headlight Beams projecting forward
      const lightGrad = ctx.createLinearGradient(px, py - 30, px, py - 180);
      lightGrad.addColorStop(0, 'rgba(0, 242, 254, 0.4)');
      lightGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(px - 14, py - 25);
      ctx.lineTo(px - 45, py - 180);
      ctx.lineTo(px + 45, py - 180);
      ctx.lineTo(px + 14, py - 25);
      ctx.closePath();
      ctx.fill();

      // Car Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(px, py + 12, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sleek Cyber Body
      ctx.shadowColor = state.nitroActive ? '#00f2fe' : '#ff007f';
      ctx.shadowBlur = state.nitroActive ? 25 : 15;
      ctx.fillStyle = state.nitroActive ? '#00f2fe' : '#14142e';
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px - 20, py - 32, 40, 64, 10);
      ctx.fill();
      ctx.stroke();

      // Cockpit glass
      const glassGrad = ctx.createLinearGradient(px, py - 16, px, py + 8);
      glassGrad.addColorStop(0, '#00f2fe');
      glassGrad.addColorStop(1, '#9d4edd');
      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.roundRect(px - 13, py - 14, 26, 22, 5);
      ctx.fill();

      // Rear Neon Spoilers
      ctx.fillStyle = '#ff007f';
      ctx.fillRect(px - 22, py + 22, 44, 4);

      ctx.restore();
      ctx.restore(); // end shake

      // Speed Progression
      state.speed += 0.0012;
      setSpeed(Math.round(state.speed * 18));

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(obsInterval);
      clearInterval(coinInterval);
    };
  }, []);

  const triggerNitro = () => {
    const s = stateRef.current;
    if (nitro > 20 && !s.nitroActive) {
      soundManager.playShoot();
      s.nitroActive = true;
      s.shake = 10;
      setNitro(n => Math.max(0, n - 35));
      setTimeout(() => {
        s.nitroActive = false;
      }, 1800);
    }
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setLane(l => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane(l => Math.min(2, l + 1));
      } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        triggerNitro();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGameOver, nitro]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex items-center justify-between gap-4 w-full max-w-sm mb-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-pink-500/40 shadow-lg shadow-pink-500/10">
        <div className="flex items-center gap-1.5 text-pink-400 font-black font-gaming text-xs">
          <Zap className="w-4 h-4 fill-pink-500 animate-pulse" />
          <span>{speed} KM/H</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
          <Coins className="w-4 h-4" />
          <span>{coins}</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-gaming font-black text-xs">
          <span className="text-[10px] text-purple-400">x{multiplier}</span>
          <Trophy className="w-3.5 h-3.5" />
          <span>{score}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/60 shadow-2xl shadow-pink-500/25 bg-[#060613]">
        <canvas
          ref={canvasRef}
          width={360}
          height={480}
          className="block"
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <span className="text-5xl animate-bounce">💥</span>
            <h3 className="font-gaming text-2xl font-black text-pink-500 text-glow-pink">AVARIYA! GAME OVER</h3>
            <p className="text-xs text-slate-300">Tezlik yuqori edi! Ko'proq neon tangalar yig'ib yangi rekord o'rnating.</p>
            <div className="bg-slate-900/90 px-6 py-3 rounded-2xl border border-pink-500/30 space-y-1">
              <p className="text-xs text-slate-400">Yakuniy Ball: <span className="font-bold text-cyan-400 font-gaming">{score}</span></p>
              <p className="text-xs text-slate-400">To'plangan Neon Tangalar: <span className="font-bold text-yellow-400 font-gaming">{coins}</span></p>
            </div>
            <button
              onClick={onRestart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-gaming font-bold text-xs shadow-lg shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              QAYTA POYGA
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <MobileControls
        onDirection={(dir) => {
          if (dir === 'left') setLane(l => Math.max(0, l - 1));
          if (dir === 'right') setLane(l => Math.min(2, l + 1));
          if (dir === 'up') triggerNitro();
        }}
        onAction={triggerNitro}
        actionLabel="NITRO"
      />
    </div>
  );
}
