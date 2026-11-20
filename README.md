# 🌌 GAMEVERSE — Ultimate Gaming Universe

**GAMEVERSE** — bu zamonaviy, premium darajadagi 7 ta mini-o'yinni o'zida birlashtirgan, yagona XP, Level, tangalar, yutuqlar (Achievements) va o'yinchi profili ekotizimiga ega web gaming platformasi.

---

## 🎮 Platformadagi 7 ta O'yin

1. **Mystic Island** — *Adventure / Puzzle*: Sirli orol xaritasi bo'ylab harakatlanish, yashirin kalit va kristallarni yig'ish, qadimiy ibodatxona eshigini ochish.
2. **Neon Rush** — *Cyberpunk Racing*: 3 qatorli yuqori tezlikdagi trassada to'siqlardan qochish, neon tangalar va nitro boost yig'ish.
3. **Dark House** — *Mystery / Puzzle*: Zulmat qoplagan xonalarni dinamik chiroq (flashlight) nuri ostida tekshirish, shifrli seyfni ochib bosh darvozadan qochish.
4. **Kingdom Defense** — *Strategy / Tower Defense*: Kamonchi, muz sehrgari va tosh otar zambarak minoralari yordamida qirollikni dushmanlar to'lqinidan himoya qilish.
5. **Dream Farm** — *Farming Simulator*: Ekin ekish (bug'doy, sabzi, pomidor, qulupnay), sug'orish, hosil yig'ish, tovuq boqish va bozorda sotish.
6. **Space Legends** — *Space Exploration*: Gravitatsion maydonlar, kosmik kema inertsiyasi, asteroidlardan qochish, minerallarni yig'ib sayyoraga qo'nish.
7. **Crazy Run** — *Endless Runner*: Tikanlar va dronlar ustidan sakrash (Double Jump) va sirpanish (Slide), tangalar yig'ish.

---

## 🛠️ Texnologiyalar

- **React 19**
- **Vite 6**
- **Tailwind CSS**
- **React Router DOM v7**
- **Lucide React** (Zamonaviy gaming ikonkalar)
- **HTML5 Canvas API** (2D o'yin fizikasi va grafikalari)
- **Web Audio API Synthesizer** (Hech qanday tashqi fayllarsiz 100% ishlaydigan audio effektlar)
- **LocalStorage** (Xotirada avtomatik saqlash)
- **Canvas Confetti** (Yutuq va Level Up bayram effektlari)

---

## 🚀 Ishga Tushirish (Local Development)

```bash
# 1. Kutubxonalarni o'rnatish
npm install

# 2. Dasturni ishga tushirish
npm run dev
```

Brauzerda `http://localhost:3000` manzilini oching.

---

## 📦 Loyihani Build Qilish

```bash
npm run build
```

---

## 🌐 GitHub va Vercel'ga Joylash

### 1. Git va GitHub:
```bash
git init
git add .
git commit -m "feat: initial commit - GAMEVERSE complete gaming platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/gameverse.git
git push -u origin main
```

### 2. Vercel'da Deploy:
1. [vercel.com](https://vercel.com) ga kiring.
2. **Add New Project** tugmasini bosing va GitHub'dagi `gameverse` omborini tanlang.
3. Framework: **Vite**
4. **Deploy** tugmasini bosing.
Loyiha `vercel.json` SPA rewrite konfiguratsiyasiga ega bo'lgani uchun barcha sahifalar va marshrutlar xatosiz ishlaydi.
