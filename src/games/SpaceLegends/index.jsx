import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Rocket, Trophy, Coins, Fuel, Sparkles, Zap } from 'lucide-react';
import MobileControls from '../../components/MobileControls';

export default function SpaceLegends({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [fuel, setFuel] = useState(100);
  const [score, setScore] = useState(0);
  const [crystals, setCrystals] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);

  const stateRef = useRef({
    x: 180,
    y: 350,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    fuel: 100,
    crystals: 0,
    score: 0,
    lasers: [],
    asteroids: [],
    minerals: [],
    particles: [],
    stars: Array.from({ length: 60 }, () => ({
      x: Math.random() * 360,
      y: Math.random() * 420,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1
    })),
    planets: [
      { x: 75, y: 85, r: 42, color: '#9d4edd', aura: 'rgba(157, 78, 221, 0.4)', name: 'Neptun-X' },
      { x: 295, y: 135, r: 48, color: '#00f2fe', aura: 'rgba(0, 242, 254, 0.4)', name: 'Aura-9' }
    ],
    gameOver: false,
    keys: {}
  });

  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      stateRef.current.asteroids.push({
        x: Math.random() * 360,
        y: Math.random() * 200,
        r: 12 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6
      });
    }

    for (let i = 0; i < 4; i++) {
      stateRef.current.minerals.push({
        x: 40 + Math.random() * 280,
        y: 60 + Math.random() * 260
      });
    }
  }, []);

  const shootLaser = () => {
    const s = stateRef.current;
    if (s.gameOver) return;
    soundManager.playShoot();
    s.lasers.push({
      x: s.x + Math.cos(s.angle) * 18,
      y: s.y + Math.sin(s.angle) * 18,
      vx: Math.cos(s.angle) * 9,
      vy: Math.sin(s.angle) * 9
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const loop = () => {
      const s = stateRef.current;
      if (s.gameOver) return;

      // Controls
      if (s.keys['ArrowLeft'] || s.keys['a']) s.angle -= 0.07;
      if (s.keys['ArrowRight'] || s.keys['d']) s.angle += 0.07;
      if ((s.keys['ArrowUp'] || s.keys['w']) && s.fuel > 0) {
        s.vx += Math.cos(s.angle) * 0.18;
        s.vy += Math.sin(s.angle) * 0.18;
        s.fuel = Math.max(0, s.fuel - 0.1);
        setFuel(Math.round(s.fuel));

        // Thruster flame particles
        s.particles.push({
          x: s.x - Math.cos(s.angle) * 14,
          y: s.y - Math.sin(s.angle) * 14,
          vx: -Math.cos(s.angle) * 3 + (Math.random() - 0.5) * 2,
          vy: -Math.sin(s.angle) * 3 + (Math.random() - 0.5) * 2,
          color: Math.random() > 0.5 ? '#00f2fe' : '#ff007f',
          life: 1
        });
      }

      // Physics
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.988;
      s.vy *= 0.988;

      if (s.x < 15) { s.x = 15; s.vx *= -0.5; }
      if (s.x > canvas.width - 15) { s.x = canvas.width - 15; s.vx *= -0.5; }
      if (s.y < 15) { s.y = 15; s.vy *= -0.5; }
      if (s.y > canvas.height - 15) { s.y = canvas.height - 15; s.vy *= -0.5; }

      // Clear Space
      ctx.fillStyle = '#040410';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax Stars
      s.stars.forEach(st => {
        st.y += st.speed;
        if (st.y > canvas.height) st.y = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(st.x, st.y, st.size, st.size);
      });

      // Draw Planets with Atmospheric Glow
      s.planets.forEach(p => {
        ctx.save();
        const grad = ctx.createRadialGradient(p.x, p.y, p.r * 0.6, p.x, p.y, p.r * 1.5);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.7, p.aura);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Gravity pull
        const pdx = p.x - s.x;
        const pdy = p.y - s.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < p.r + 80 && pdist > p.r) {
          s.vx += (pdx / pdist) * 0.05;
          s.vy += (pdy / pdist) * 0.05;
        }

        // Landing
        if (pdist < p.r + 12 && Math.hypot(s.vx, s.vy) < 1.3 && s.crystals >= 3) {
          soundManager.playVictory();
          s.gameOver = true;
          setMissionComplete(true);
          const finalScore = s.score + 550;
          setScore(finalScore);
          onGameOver(finalScore, 160, 260);
        }
      });

      // Update & Draw Thruster Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.05;
        if (pt.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Update & Draw Lasers
      for (let i = s.lasers.length - 1; i >= 0; i--) {
        const l = s.lasers[i];
        l.x += l.vx;
        l.y += l.vy;

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.vx * 1.5, l.y - l.vy * 1.5);
        ctx.stroke();

        // Hit asteroid
        for (let j = s.asteroids.length - 1; j >= 0; j--) {
          const a = s.asteroids[j];
          if (Math.hypot(l.x - a.x, l.y - a.y) < a.r) {
            soundManager.playHit();
            s.score += 70;
            setScore(s.score);
            for (let k = 0; k < 8; k++) {
              s.particles.push({
                x: a.x, y: a.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#ffbe0b', life: 1
              });
            }
            s.asteroids.splice(j, 1);
            s.lasers.splice(i, 1);
            break;
          }
        }

        if (l.x < 0 || l.x > canvas.width || l.y < 0 || l.y > canvas.height) {
          s.lasers.splice(i, 1);
        }
      }

      // Update & Draw Minerals
      for (let i = s.minerals.length - 1; i >= 0; i--) {
        const m = s.minerals[i];
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.font = '18px sans-serif';
        ctx.fillText('💎', m.x - 9, m.y + 7);
        ctx.shadowBlur = 0;

        if (Math.hypot(m.x - s.x, m.y - s.y) < 24) {
          soundManager.playCoin();
          s.crystals += 1;
          s.score += 100;
          setCrystals(s.crystals);
          setScore(s.score);
          s.minerals.splice(i, 1);
        }
      }

      // Update & Draw Asteroids
      for (let i = s.asteroids.length - 1; i >= 0; i--) {
        const a = s.asteroids[i];
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

        ctx.fillStyle = '#666677';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        if (Math.hypot(a.x - s.x, a.y - s.y) < a.r + 10) {
          soundManager.playHit();
          s.gameOver = true;
          setIsGameOver(true);
          onGameOver(s.score, s.crystals * 25, Math.floor(s.score / 5));
          break;
        }
      }

      // Draw Sci-Fi Spaceship
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(-12, -9);
      ctx.lineTo(-7, 0);
      ctx.lineTo(-12, 9);
      ctx.closePath();
      ctx.fill();

      // Cyan Cockpit
      ctx.fillStyle = '#00f2fe';
      ctx.beginPath();
      ctx.arc(3, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      if (!s.gameOver) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    const handleDown = (e) => {
      stateRef.current.keys[e.key] = true;
      if (e.key === ' ') shootLaser();
    };
    const handleUp = (e) => { stateRef.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const handleThrust = () => {
    const s = stateRef.current;
    if (s.fuel > 0) {
      soundManager.playJump();
      s.vx += Math.cos(s.angle) * 1.5;
      s.vy += Math.sin(s.angle) * 1.5;
      s.fuel = Math.max(0, s.fuel - 5);
      setFuel(Math.round(s.fuel));
    }
  };

  const handleRotate = (dir) => {
    stateRef.current.angle += dir * 0.45;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex items-center justify-between gap-4 w-full max-w-sm mb-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
          <Fuel className="w-4 h-4 animate-pulse" />
          <span>{fuel}% Yonilg'i</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400 font-bold text-xs">
          <span>💎 {crystals}/3</span>
        </div>
        <div className="text-yellow-400 font-gaming text-xs font-bold">
          {score} Ball
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/25 bg-[#040410]">
        <canvas
          ref={canvasRef}
          width={360}
          height={420}
          className="block"
        />

        {missionComplete && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl animate-bounce">🛸🪐✨</span>
            <h3 className="font-gaming text-2xl font-black text-cyan-400 text-glow-cyan">SAYYORAGA QO'NDINGIZ!</h3>
            <p className="text-xs text-slate-300">Barcha kristallar yig'ildi va yangi galaktika kashf qilindi!</p>
            <p className="text-yellow-400 font-gaming font-bold text-lg">Ball: {score}</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-gaming font-bold text-xs shadow-lg shadow-cyan-500/40"
            >
              YANGI MISSIYA
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl">💥☄️</span>
            <h3 className="font-gaming text-2xl font-black text-rose-500">KOSMIK AVARIYA</h3>
            <p className="text-xs text-slate-300">Lazer to'pi bilan asteroidlarni yo'q qilib parvoz qiling!</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-gaming font-bold text-xs"
            >
              QAYTA BOSHLASH
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex gap-2 mt-2 w-full max-w-sm justify-center">
        <button
          onClick={shootLaser}
          className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-gaming font-bold text-xs flex items-center gap-1 shadow-lg shadow-cyan-500/30"
        >
          <Zap className="w-4 h-4 fill-black" /> LAZER
        </button>
      </div>

      <MobileControls
        onDirection={(dir) => {
          if (dir === 'left') handleRotate(-1);
          if (dir === 'right') handleRotate(1);
          if (dir === 'up') handleThrust();
        }}
        onAction={shootLaser}
        actionLabel="LAZER"
      />
    </div>
  );
}
