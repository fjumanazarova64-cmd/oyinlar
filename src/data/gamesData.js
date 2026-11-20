export const GAMES_DATA = [
  {
    id: 'mystic-island',
    title: 'Mystic Island',
    tagline: 'Sirli orol sirlarini oching va xazinalarni toping',
    genre: 'Adventure / Puzzle',
    category: 'adventure',
    difficulty: 'O\'rta',
    rating: 4.9,
    players: '12.4k',
    xpReward: 150,
    coinReward: 80,
    accentColor: '#00f2fe',
    badgeText: 'HOT',
    iconName: 'Compass',
    description: 'Sirli orolda qolib ketgan qahramon rolidasiz. Yashirin kalitlarni, sehrli kristallarni toping, eshiklarni oching, jumboqlarni yeching va orolning qadimiy ibodatxonasiga yetib boring!',
    controls: [
      { key: 'W A S D / Arrow Keys', action: 'Harakatlanish' },
      { key: 'E / Space', action: 'Buyum olish / Eshik ochish' },
      { key: 'Sensorli tugmalar', action: 'Mobil boshqaruv' }
    ]
  },
  {
    id: 'neon-rush',
    title: 'Neon Rush',
    tagline: 'Cyberpunk shahrida yuqori tezlikdagi neon poygasi',
    genre: 'Racing',
    category: 'action',
    difficulty: 'Qiyin',
    rating: 4.8,
    players: '24.1k',
    xpReward: 200,
    coinReward: 120,
    accentColor: '#ff007f',
    badgeText: 'POPULAR',
    iconName: 'Zap',
    description: 'Futuristik Cyberpunk trassasida neon mashinani boshqaring. Yo\'ldagi transport va to\'siqlardan qoching, neon tangalar va nitro boostlarni yig\'ing. Tezlik ortib boradi!',
    controls: [
      { key: 'A / D yoki Chap / O\'ng', action: 'Qatorni almashtirish' },
      { key: 'W / Yuqoriga', action: 'Nitro Tezlanish' },
      { key: 'S / Pastga', action: 'Tormoz' },
      { key: 'Tugmalar', action: 'Mobil boshqaruv' }
    ]
  },
  {
    id: 'dark-house',
    title: 'Dark House',
    tagline: 'Zulmat qoplagan uydan sirli yo\'l topib qoching',
    genre: 'Mystery / Puzzle',
    category: 'puzzle',
    difficulty: 'Qiyin',
    rating: 4.7,
    players: '9.8k',
    xpReward: 180,
    coinReward: 90,
    accentColor: '#9d4edd',
    badgeText: 'SPOOKY',
    iconName: 'Ghost',
    description: 'Qorong\'i va sirli uyda uyg\'ondingiz. Qo\'lingizdagi chiroq (fonar) nuri ostida xonalarni tekshiring, yashirin buyumlar va shifrli seyflarni toping, kalitlar bilan eshiklarni ochib qoching!',
    controls: [
      { key: 'Sichqoncha / Barmoq', action: 'Fonar nuri yo\'nalishi' },
      { key: 'W A S D / Arrows', action: 'Qadam tashlash' },
      { key: 'F / Click', action: 'Tekshirish va yig\'ish' }
    ]
  },
  {
    id: 'kingdom-defense',
    title: 'Kingdom Defense',
    tagline: 'Qirollikni yovuz yirtqichlar to\'lqinidan himoya qiling',
    genre: 'Strategy / Tower Defense',
    category: 'strategy',
    difficulty: 'Strategik',
    rating: 4.9,
    players: '18.7k',
    xpReward: 250,
    coinReward: 150,
    accentColor: '#ffbe0b',
    badgeText: 'FEATURED',
    iconName: 'Shield',
    description: 'Strategik nuqtalarga kamonchi, muz sehrgari va tosh otar minoralarni quring. Resurslarni to\'g\'ri taqsimlab, qirollik darvozasiga yetib kelayotgan dushmanlar to\'lqinini qaytaring!',
    controls: [
      { key: 'Sichqoncha / Tap', action: 'Minora tanlash va joylashtirish' },
      { key: 'Upgrade tugmasi', action: 'Minorani kuchaytirish' },
      { key: 'Start Wave', action: 'Yangi to\'lqinni boshlash' }
    ]
  },
  {
    id: 'dream-farm',
    title: 'Dream Farm',
    tagline: 'O\'z orzuingizdagi gullab-yashnagan fermani yarating',
    genre: 'Farming Simulator',
    category: 'simulation',
    difficulty: 'Oson / Dam olish',
    rating: 4.9,
    players: '31.5k',
    xpReward: 120,
    coinReward: 200,
    accentColor: '#00ff88',
    badgeText: 'RELAX',
    iconName: 'Sprout',
    description: 'Bug\'doy, pomidor, makkajo\'xori va qulupnay eking. Hosilni vaqtida sug\'oring va terib oling. Jonivorlarni boqing, bozorda sotib tangalar ishlang va fermangiz hududini kengaytiring!',
    controls: [
      { key: 'Katakchani bosish', action: 'Ekish / Sug\'orish / Hosil yig\'ish' },
      { key: 'Do\'kon menyusi', action: 'Urug\' va texnika xarid qilish' },
      { key: 'Avtomatik saqlash', action: 'Hosil har doim saqlanadi' }
    ]
  },
  {
    id: 'space-legends',
    title: 'Space Legends',
    tagline: 'Galaktika bo\'ylab uching va yangi sayyoralarni kashf eting',
    genre: 'Space Exploration',
    category: 'adventure',
    difficulty: 'O\'rta',
    rating: 4.8,
    players: '15.3k',
    xpReward: 220,
    coinReward: 130,
    accentColor: '#00c6ff',
    badgeText: 'EXPLORE',
    iconName: 'Rocket',
    description: 'Kosmik kema va jasur astronavt bilan no\'malum galaktikani kashf qiling. Gravitatsion maydonlardan foydalaning, asteroidlardan omon qoling, qimmatbaho kosmik minerallarni yig\'ing!',
    controls: [
      { key: 'W / Yuqoriga', action: 'Raketa dvigateli (Thrust)' },
      { key: 'A / D / Chap / O\'ng', action: 'Kemani burish' },
      { key: 'Space', action: 'Lazer to\'pi bilan asteroidni parchalash' },
      { key: 'Sensorli pult', action: 'Mobil boshqaruv' }
    ]
  },
  {
    id: 'crazy-run',
    title: 'Crazy Run',
    tagline: 'Cheksiz to\'siqlar yo\'lida tez va epchil yuguring',
    genre: 'Endless Runner',
    category: 'action',
    difficulty: 'Tezkor',
    rating: 4.8,
    players: '29.0k',
    xpReward: 170,
    coinReward: 100,
    accentColor: '#ff0055',
    badgeText: 'ENDLESS',
    iconName: 'Flame',
    description: 'Epchil va chaqqon yuguruvchi bilan to\'siqlar, tikanlar va chuqurliklar ustidan sakrab o\'ting, sirpaning, oltin tangalar va quvvatlantiruvchi qalqonlarni yig\'ib rekord o\'rnating!',
    controls: [
      { key: 'Space / Yuqoriga', action: 'Sakrash (Jump / Double Jump)' },
      { key: 'Pastga / S', action: 'Sirpanish (Slide)' },
      { key: 'Ekranga teginish', action: 'Mobil sakrash va sirpanish' }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Barcha O\'yinlar' },
  { id: 'action', label: 'Action & Racing' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'puzzle', label: 'Puzzle & Mystery' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'simulation', label: 'Simulation' }
];
