import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/sound';
import { Flame, Trophy, Coins, RotateCcw, Zap, Magnet } from 'lucide-react';
import MobileControls from '../../components/MobileControls';

export default function CrazyRun({ onGameOver, onRestart }) {
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasMagnet, setHasMagnet] = useState(false);

  const stateRef = useRef({
    playerY: 280,
    vy: 0,
    isJumping: false,
    doubleJumpAvailable: true,
    isSliding: false,
    slideTimer: 0,
    magnetTimer: 0,
    ghostTrail: [],
    obstacles: [],
    coinsList: [],
    powerups: [],
    groundY: 280,
    speed: 6,
    score: 0,
    coins: 0,
    gameOver: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const spawnObstacle = () => {
      const type = Math.random() > 0.45 ? 'spike' : 'drone';
      stateRef.current.obstacles.push({
        x: canvas.width + 30,
        y: type === 'spike' ? stateRef.current.groundY : stateRef.current.groundY - 52,
        type,
        w: type === 'spike' ? 24 : 34,
        h: type === 'spike' ? 28 : 24
      });
    };

    const spawnCoin = () => {
      stateRef.current.coinsList.push({
        x: canvas.width + 40,
        y: stateRef.current.groundY - 25 - Math.random() * 45
      });
    };

    const spawnPowerup = () => {
      if (Math.random() > 0.5) {
        stateRef.current.powerups.push({
          x: canvas.width + 50,
          y: stateRef.current.groundY - 35,
          type: 'magnet'
        });
      }
    };

    let obsInterval = setInterval(spawnObstacle, 1400);
    let coinInterval = setInterval(spawnCoin, 900);
    let powInterval = setInterval(spawnPowerup, 9000);

    const loop = () => {
      const s = stateRef.current;
      if (s.gameOver) return;

      // Gravity
      s.playerY += s.vy;
      s.vy += 0.72;

      if (s.playerY >= s.groundY) {
        s.playerY = s.groundY;
        s.vy = 0;
        s.isJumping = false;
        s.doubleJumpAvailable = true;
      }

      if (s.isSliding) {
        s.slideTimer--;
        if (s.slideTimer <= 0) s.isSliding = false;
      }

      if (s.magnetTimer > 0) {
        s.magnetTimer--;
        if (s.magnetTimer === 0) setHasMagnet(false);
      }

      // Record Ghost Trail
      s.ghostTrail.push({ x: 70, y: s.playerY, sliding: s.isSliding, alpha: 0.6 });
      if (s.ghostTrail.length > 6) s.ghostTrail.shift();

      // Clear Canvas
      ctx.fillStyle = '#070716';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyberpunk Neon City Skyline in Background
      ctx.fillStyle = '#101026';
      ctx.fillRect(30, 110, 45, 170);
      ctx.fillRect(110, 80, 55, 200);
      ctx.fillRect(200, 130, 40, 150);
      ctx.fillRect(280, 95, 60, 185);

      // Neon Windows
      ctx.fillStyle = '#00f2fe44';
      for (let w = 0; w < 4; w++) {
        ctx.fillRect(120, 100 + w * 25, 6, 8);
        ctx.fillRect(295, 115 + w * 25, 6, 8);
      }

      // Neon Cyber Ground
      ctx.fillStyle = '#161632';
      ctx.fillRect(0, s.groundY + 24, canvas.width, canvas.height - s.groundY - 24);
      ctx.strokeStyle = '#ff007f';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY + 24);
      ctx.lineTo(canvas.width, s.groundY + 24);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Update & Draw Powerups
      for (let i = s.powerups.length - 1; i >= 0; i--) {
        const p = s.powerups[i];
        p.x -= s.speed;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.font = '20px sans-serif';
        ctx.fillText('🧲', p.x, p.y);
        ctx.shadowBlur = 0;

        if (Math.hypot(p.x - 70, p.y - s.playerY) < 30) {
          soundManager.playPowerup();
          s.magnetTimer = 350; // ~6 seconds
          setHasMagnet(true);
          s.powerups.splice(i, 1);
          continue;
        }
        if (p.x < -30) s.powerups.splice(i, 1);
      }

      // Update & Draw Coins with Magnet Effect
      for (let i = s.coinsList.length - 1; i >= 0; i--) {
        const c = s.coinsList[i];

        // Magnet attraction
        if (s.magnetTimer > 0) {
          const dx = 70 - c.x;
          const dy = s.playerY - c.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            c.x += (dx / dist) * 8;
            c.y += (dy / dist) * 8;
          } else {
            c.x -= s.speed;
          }
        } else {
          c.x -= s.speed;
        }

        ctx.fillStyle = '#ffbe0b';
        ctx.shadowColor = '#ffbe0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (Math.hypot(c.x - 70, c.y - s.playerY) < 32) {
          soundManager.playCoin();
          s.coins += 1;
          s.score += 45;
          setCoins(s.coins);
          setScore(s.score);
          s.coinsList.splice(i, 1);
          continue;
        }

        if (c.x < -20) s.coinsList.splice(i, 1);
      }

      // Update & Draw Obstacles
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed;

        ctx.save();
        if (obs.type === 'spike') {
          ctx.fillStyle = '#ff0055';
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + 24);
          ctx.lineTo(obs.x + obs.w / 2, obs.y + 24 - obs.h);
          ctx.lineTo(obs.x + obs.w, obs.y + 24);
          ctx.closePath();
          ctx.fill();
        } else {
          // Cyber Flying Drone
          ctx.fillStyle = '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 6);
          ctx.fill();
          ctx.fillStyle = '#ff0055';
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Hitbox collision
        const playerHitboxH = s.isSliding ? 14 : 32;
        const playerHitboxY = s.isSliding ? s.playerY + 14 : s.playerY;

        if (
          70 < obs.x + obs.w &&
          70 + 20 > obs.x &&
          playerHitboxY < obs.y + obs.h &&
          playerHitboxY + playerHitboxH > obs.y
        ) {
          soundManager.playHit();
          s.gameOver = true;
          setIsGameOver(true);
          onGameOver(s.score, s.coins, Math.floor(s.score / 5));
          break;
        }

        if (obs.x < -30) {
          s.obstacles.splice(i, 1);
          s.score += 30;
          setScore(s.score);
        }
      }

      // Draw Ghost Trails (After-Image)
      s.ghostTrail.forEach((g, idx) => {
        ctx.fillStyle = `rgba(0, 242, 254, ${idx * 0.08})`;
        if (g.sliding) {
          ctx.fillRect(g.x - (6 - idx) * 3, g.y + 12, 32, 12);
        } else {
          ctx.fillRect(g.x - (6 - idx) * 3, g.y - 4, 18, 28);
        }
      });

      // Draw Cyber Runner
      const px = 70;
      const py = s.playerY;

      ctx.save();
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 14;

      if (s.isSliding) {
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(px, py + 12, 34, 12);
        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(px + 24, py + 14, 10, 8);
      } else {
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.roundRect(px, py - 4, 18, 28, 4);
        ctx.fill();

        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.roundRect(px + 3, py - 16, 14, 12, 4);
        ctx.fill();
      }
      ctx.restore();

      s.speed += 0.001;

      if (!s.gameOver) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(obsInterval);
      clearInterval(coinInterval);
      clearInterval(powInterval);
    };
  }, []);

  const jump = () => {
    const s = stateRef.current;
    if (!s.isJumping) {
      soundManager.playJump();
      s.vy = -13.5;
      s.isJumping = true;
    } else if (s.doubleJumpAvailable) {
      soundManager.playJump();
      s.vy = -11.5;
      s.doubleJumpAvailable = false;
    }
  };

  const slide = () => {
    const s = stateRef.current;
    if (!s.isJumping) {
      s.isSliding = true;
      s.slideTimer = 38;
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Top HUD */}
      <div className="flex items-center justify-between gap-4 w-full max-w-sm mb-3 bg-slate-900/90 px-4 py-2.5 rounded-2xl border border-rose-500/40 shadow-lg shadow-rose-500/10">
        <div className="flex items-center gap-1.5 text-rose-400 font-black font-gaming text-xs">
          <Flame className="w-4 h-4 fill-rose-500 animate-pulse" />
          <span>CYBER RUN</span>
        </div>
        {hasMagnet && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/40 animate-pulse">
            🧲 MAGNIT AKTIV
          </span>
        )}
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
          <Coins className="w-4 h-4" />
          <span>{coins}</span>
        </div>
        <div className="text-cyan-400 font-gaming text-xs font-bold">
          {score} m
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/60 shadow-2xl shadow-rose-500/25 bg-[#070716]">
        <canvas
          ref={canvasRef}
          width={380}
          height={340}
          className="block"
        />

        {isGameOver && (
          <div className="absolute inset-0 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <span className="text-5xl animate-bounce">🏃‍♂️💥</span>
            <h3 className="font-gaming text-2xl font-black text-rose-500 text-glow-pink">TO'SIQQA URILDINGIZ!</h3>
            <p className="text-xs text-slate-300">Tezlik va reflekslar sinovi. Double Jump va Slide bilan rekord o'rnating!</p>
            <p className="text-yellow-400 font-gaming font-bold text-lg">Masofa: {score} metr</p>
            <button
              onClick={onRestart}
              className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-gaming font-bold text-xs shadow-lg shadow-rose-500/40"
            >
              QAYTA YUGURISH
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <MobileControls
        onDirection={(dir) => {
          if (dir === 'up') jump();
          if (dir === 'down') slide();
        }}
        onAction={jump}
        actionLabel="SAKRASH"
      />
    </div>
  );
}
