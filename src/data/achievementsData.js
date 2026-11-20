export const ACHIEVEMENTS_DATA = [
  {
    id: 'first_step',
    title: 'Birinchi Qadam',
    description: 'GAMEVERSE platformasida istalgan bir o\'yinni o\'ynang',
    icon: 'Footprints',
    color: '#00f2fe',
    xpReward: 50,
    coinReward: 30,
    maxProgress: 1,
    checkUnlock: (stats) => (stats.totalGamesPlayed || 0) >= 1
  },
  {
    id: 'speed_demon',
    title: 'Tezlik Demoni',
    description: 'Neon Rush poygasida 1000 dan yuqori ball to\'plang',
    icon: 'Gauge',
    color: '#ff007f',
    xpReward: 150,
    coinReward: 100,
    maxProgress: 1000,
    checkUnlock: (stats) => (stats.highScores?.['neon-rush'] || 0) >= 1000
  },
  {
    id: 'island_explorer',
    title: 'Orol Fotihi',
    description: 'Mystic Island o\'yinida ibodatxona xazinasini oching',
    icon: 'MapPin',
    color: '#00ff88',
    xpReward: 200,
    coinReward: 150,
    maxProgress: 1,
    checkUnlock: (stats) => (stats.highScores?.['mystic-island'] || 0) >= 500
  },
  {
    id: 'master_strategist',
    title: 'Bosh Strateg',
    description: 'Kingdom Defense o\'yinida 5-to\'lqinni muvaffaqiyatli qaytaring',
    icon: 'Crown',
    color: '#ffbe0b',
    xpReward: 250,
    coinReward: 200,
    maxProgress: 5,
    checkUnlock: (stats) => (stats.highScores?.['kingdom-defense'] || 0) >= 500
  },
  {
    id: 'harvest_king',
    title: 'Hosil Qiroli',
    description: 'Dream Farm fermasida 20 ta ekin hosilini yig\'ing',
    icon: 'Wheat',
    color: '#00ff88',
    xpReward: 150,
    coinReward: 250,
    maxProgress: 20,
    checkUnlock: (stats) => (stats.highScores?.['dream-farm'] || 0) >= 200
  },
  {
    id: 'galaxy_voyager',
    title: 'Galaktika Sayyohi',
    description: 'Space Legends da 5 ta kosmik kristal yig\'ing',
    icon: 'Orbit',
    color: '#00c6ff',
    xpReward: 200,
    coinReward: 120,
    maxProgress: 5,
    checkUnlock: (stats) => (stats.highScores?.['space-legends'] || 0) >= 300
  },
  {
    id: 'fearless_runner',
    title: 'Qo\'rqmas Yuguruvchi',
    description: 'Crazy Run da 1500 metr masofani bosib o\'ting',
    icon: 'Zap',
    color: '#ff0055',
    xpReward: 180,
    coinReward: 110,
    maxProgress: 1500,
    checkUnlock: (stats) => (stats.highScores?.['crazy-run'] || 0) >= 1500
  },
  {
    id: 'dark_survivor',
    title: 'Zulmatdan Najot',
    description: 'Dark House da yashirin kalit va seyf kodini toping',
    icon: 'Key',
    color: '#9d4edd',
    xpReward: 220,
    coinReward: 150,
    maxProgress: 1,
    checkUnlock: (stats) => (stats.highScores?.['dark-house'] || 0) >= 400
  },
  {
    id: 'level_master_5',
    title: 'Tajribali Geymer',
    description: 'GAMEVERSE da 5-darajaga (Level 5) ko\'tariling',
    icon: 'Trophy',
    color: '#ffbe0b',
    xpReward: 300,
    coinReward: 300,
    maxProgress: 5,
    checkUnlock: (stats) => (stats.level || 1) >= 5
  },
  {
    id: 'all_rounder',
    title: 'Universal O\'yinchi',
    description: 'Barcha 7 ta o\'yinning har birini kamida 1 martadan o\'ynang',
    icon: 'Sparkles',
    color: '#9d4edd',
    xpReward: 500,
    coinReward: 500,
    maxProgress: 7,
    checkUnlock: (stats) => {
      const played = Object.keys(stats.highScores || {}).length;
      return played >= 7;
    }
  }
];
