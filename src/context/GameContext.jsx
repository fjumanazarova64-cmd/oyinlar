import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS_DATA } from '../data/achievementsData';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

const GameContext = createContext();

const LOCAL_STORAGE_KEY = 'GAMEVERSE_PLAYER_DATA_V1';

const INITIAL_STATE = {
  username: 'CyberGamer',
  avatar: '🚀',
  level: 1,
  xp: 0,
  xpToNextLevel: 300,
  coins: 250,
  totalGamesPlayed: 0,
  totalScore: 0,
  highScores: {
    'mystic-island': 0,
    'neon-rush': 0,
    'dark-house': 0,
    'kingdom-defense': 0,
    'dream-farm': 0,
    'space-legends': 0,
    'crazy-run': 0,
  },
  unlockedAchievements: [],
  recentlyPlayed: [],
  settings: {
    sound: true,
    music: true,
    particles: true,
    language: 'uz'
  }
};

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('LocalStorage load error', e);
    }
    return INITIAL_STATE;
  });

  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(player));
    } catch (e) {
      console.error('LocalStorage save error', e);
    }
  }, [player]);

  // Sync sounds
  useEffect(() => {
    soundManager.setSoundEnabled(player.settings.sound);
    soundManager.setMusicEnabled(player.settings.music);
  }, [player.settings.sound, player.settings.music]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Add XP and check for Level Up
  const addXP = (amount) => {
    if (amount <= 0) return;

    setPlayer(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let needed = prev.xpToNextLevel;
      let leveledUp = false;

      while (newXP >= needed) {
        newXP -= needed;
        newLevel += 1;
        needed = Math.floor(needed * 1.35);
        leveledUp = true;
      }

      if (leveledUp) {
        soundManager.playLevelUp();
        triggerConfetti();
        showNotification({
          type: 'level_up',
          title: `TABRIKLAYMIZ! LEVEL ${newLevel}!`,
          message: `Siz yangi darajaga ko'tarildingiz! +${newLevel * 50} Tanga mukofot!`,
          icon: '👑'
        });
      }

      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: needed,
        coins: leveledUp ? prev.coins + (newLevel * 50) : prev.coins
      };

      checkAchievements(updated);
      return updated;
    });
  };

  // Add Coins
  const addCoins = (amount) => {
    if (amount <= 0) return;
    soundManager.playCoin();
    setPlayer(prev => {
      const updated = { ...prev, coins: prev.coins + amount };
      return updated;
    });
  };

  // Spend Coins
  const spendCoins = (amount) => {
    if (player.coins < amount) return false;
    setPlayer(prev => ({ ...prev, coins: prev.coins - amount }));
    return true;
  };

  // Record Game Result
  const recordGameResult = (gameId, score, earnedCoins = 0, earnedXP = 0) => {
    setPlayer(prev => {
      const currentHigh = prev.highScores[gameId] || 0;
      const newHigh = Math.max(currentHigh, score);
      const isNewRecord = score > currentHigh && currentHigh > 0;

      // Update recently played
      const recent = [gameId, ...prev.recentlyPlayed.filter(id => id !== gameId)].slice(0, 5);

      const nextState = {
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalScore: prev.totalScore + score,
        highScores: {
          ...prev.highScores,
          [gameId]: newHigh
        },
        recentlyPlayed: recent
      };

      if (isNewRecord) {
        triggerConfetti();
        showNotification({
          type: 'new_record',
          title: 'YANGI REKORD!',
          message: `${gameId.toUpperCase()} o'yinida rekord o'rnatildi: ${score} ball!`,
          icon: '🔥'
        });
      }

      return nextState;
    });

    if (earnedXP > 0) addXP(earnedXP);
    if (earnedCoins > 0) addCoins(earnedCoins);
  };

  // Check Achievements
  const checkAchievements = (state) => {
    ACHIEVEMENTS_DATA.forEach(ach => {
      if (!state.unlockedAchievements.includes(ach.id)) {
        if (ach.checkUnlock(state)) {
          unlockAchievement(ach.id, ach.title, ach.xpReward, ach.coinReward);
        }
      }
    });
  };

  const unlockAchievement = (id, title, xp, coins) => {
    setPlayer(prev => {
      if (prev.unlockedAchievements.includes(id)) return prev;
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id],
        xp: prev.xp + xp,
        coins: prev.coins + coins
      };
    });

    soundManager.playVictory();
    triggerConfetti();
    showNotification({
      type: 'achievement',
      title: 'YUTUQ OCHILDI!',
      message: `"${title}" yutug'i: +${xp} XP, +${coins} Tanga!`,
      icon: '🏆'
    });
  };

  const showNotification = (data) => {
    setNotification(data);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const updateProfile = (username, avatar) => {
    setPlayer(prev => ({
      ...prev,
      username: username || prev.username,
      avatar: avatar || prev.avatar
    }));
  };

  const updateSettings = (key, val) => {
    setPlayer(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: val
      }
    }));
  };

  const resetProgress = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPlayer(INITIAL_STATE);
    showNotification({
      type: 'info',
      title: 'PROGRESS QAYTA O\'RNATILDI',
      message: 'Barcha ma\'lumotlar boshlang\'ich holatga qaytarildi.',
      icon: '🔄'
    });
  };

  return (
    <GameContext.Provider value={{
      player,
      addXP,
      addCoins,
      spendCoins,
      recordGameResult,
      updateProfile,
      updateSettings,
      resetProgress,
      notification,
      showNotification
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
