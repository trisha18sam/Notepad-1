import fs from 'fs';

// Read the task log to extract character name -> URL mappings
const logPath = 'C:/Users/tmana/.gemini/antigravity-ide/brain/10f39244-b298-4345-ac59-fd8a810bcf2c/.system_generated/tasks/task-138.log';
const log = fs.readFileSync(logPath, 'utf8');

const charMap = {};
for (const line of log.split('\n')) {
  const m = line.match(/^Result: (.+?) -> (.+)$/);
  if (m) {
    charMap[m[1].trim()] = m[2].trim();
  }
}

// Original character names with show info (from the ANIME_CHAR_OPTIONS we created)
const CHAR_NAMES = [
  'Aki Hayakawa (Chainsaw Man)',
  'Akira Toriyama (Creator - Dragon Ball)',
  'All Might (My Hero Academia)',
  'Alphonse Elric (Fullmetal Alchemist)',
  'Alucard (Hellsing)',
  'Amuro Ray (Mobile Suit Gundam)',
  'Anya Forger (Spy x Family)',
  'Asuka Langley Soryu (Neon Genesis Evangelion)',
  'Asuna Yuuki (Sword Art Online)',
  'Ayato Kirishima (Tokyo Ghoul)',
  'Bakugo Katsuki (My Hero Academia)',
  'Ban (The Seven Deadly Sins)',
  'Bulma (Dragon Ball)',
  'Byakuya Kuchiki (Bleach)',
  'Char Aznable (Mobile Suit Gundam)',
  'Chika Fujiwara (Kaguya-sama: Love is War)',
  'Chuuya Nakahara (Bungo Stray Dogs)',
  'Ciel Phantomhive (Black Butler)',
  'Dazai Osamu (Bungo Stray Dogs)',
  'Denji (Chainsaw Man)',
  'Dio Brando (JoJo\\'s Bizarre Adventure)',
  'Edward Elric (Fullmetal Alchemist)',
  'Eiichiro Oda (Creator - One Piece)',
  'Eren Yeager (Attack on Titan)',
  'Erza Scarlet (Fairy Tail)',
  'Esdeath (Akame ga Kill!)',
  'Faye Valentine (Cowboy Bebop)',
  'Frieren (Frieren: Beyond Journey\\'s End)',
  'Frieza (Dragon Ball)',
  'Gaara (Naruto)',
  'Gege Akutami (Creator - Jujutsu Kaisen)',
  'Gintoki Sakata (Gintama)',
  'Gohan (Dragon Ball)',
  'Gojo Satoru (Jujutsu Kaisen)',
  'Gon Freecss (Hunter x Hunter)',
  'Gryphon Griffith (Berserk)',
  'Guts (Berserk)',
  'Hajime Isayama (Creator - Attack on Titan)',
  'Haku (Spirited Away)',
  'Haruka Nanase (Free!)',
  'Hayao Miyazaki (Director - Studio Ghibli)',
  'Heisuke Toudou (Hakuoki)',
  'Hideaki Anno (Director - Neon Genesis Evangelion)',
  'Hikaru Hitachiin (Ouran High School Host Club)',
  'Hinata Hyuga (Naruto)',
  'Hinata Shoyo (Haikyuu!!)',
  'Hirohiko Araki (Creator - JoJo\\'s Bizarre Adventure)',
  'Hiroshi Kamiya (Voice Actor)',
  'Hisoka Morow (Hunter x Hunter)',
  'Howl Jenkins Pendragon (Howl\\'s Moving Castle)',
  'Ichigo Kurosaki (Bleach)',
  'Inosuke Hashibira (Demon Slayer)',
  'InuYasha (InuYasha)',
  'Issei Hyoudou (High School DxD)',
  'Itachi Uchiha (Naruto)',
  'Izuku Midoriya (My Hero Academia)',
  'Izumi Miyamura (Horimiya)',
  'Jigen Daisuke (Lupin III)',
  'Johan Liebert (Monster)',
  'Jotaro Kujo (JoJo\\'s Bizarre Adventure)',
  'Jun Fukuyama (Voice Actor)',
  'Juuzou Suzuya (Tokyo Ghoul)',
  'Kageyama Tobio (Haikyuu!!)',
  'Kaguya Shinomiya (Kaguya-sama: Love is War)',
  'Kakashi Hatake (Naruto)',
  'Kamina (Gurren Lagann)',
  'Kana Hanazawa (Voice Actor)',
  'Kanon (Saint Seiya)',
  'Karamatsu Matsuno (Osomatsu-san)',
  'Katsuhiro Otomo (Director - Akira)',
  'Katsuki Bakugo (My Hero Academia)',
  'Kenshin Himura (Rurouni Kenshin)',
  'Kenshiro (Fist of the North Star)',
  'Kentaro Miura (Creator - Berserk)',
  'Kenzo Tenma (Monster)',
  'Killua Zoldyck (Hunter x Hunter)',
  'Kirishima Eijiro (My Hero Academia)',
  'Kirito (Sword Art Online)',
  'Koyoharu Gotouge (Creator - Demon Slayer)',
  'Kurama (Yu Yu Hakusho)',
  'Kurapika (Hunter x Hunter)',
  'Kuroo Tetsurou (Haikyuu!!)',
  'Kyo Sohma (Fruits Basket)',
  'Kyojuro Rengoku (Demon Slayer)',
  'Kyoko Kirigiri (Danganronpa)',
  'L Lawliet (Death Note)',
  'Lelouch Lamperouge (Code Geass)',
  'Levi Ackerman (Attack on Titan)',
  'Light Yagami (Death Note)',
  'Loid Forger (Spy x Family)',
  'Lucy Heartfilia (Fairy Tail)',
  'Madara Uchiha (Naruto)',
  'Makima (Chainsaw Man)',
  'Makoto Shinkai (Director - Your Name)',
  'Mamoru Hosoda (Director - The Girl Who Leapt Through Time)',
  'Mamoru Miyano (Voice Actor)',
  'Marin Kitagawa (My Dress-Up Darling)',
  'Masako Nozawa (Voice Actor)',
  'Masashi Kishimoto (Creator - Naruto)',
  'Mayumi Tanikawa (Voice Actor)',
  'Megumi Fushiguro (Jujutsu Kaisen)',
  'Megumin (KonoSuba)',
  'Mikasa Ackerman (Attack on Titan)',
  'Mikazuki Munechika (Touken Ranbu)',
  'Miku Nakano (The Quintessential Quintuplets)',
  'Minato Namikaze (Naruto)',
  'Mitsuha Miyamizu (Your Name)',
  'Monkey D. Luffy (One Piece)',
  'Motoko Kusanagi (Ghost in the Shell)',
  'Nami (One Piece)',
  'Naoki Urasawa (Creator - Monster)',
  'Naoko Takeuchi (Creator - Sailor Moon)',
  'Naruto Uzumaki (Naruto)',
  'Natsu Dragneel (Fairy Tail)',
  'Nezuko Kamado (Demon Slayer)',
  'Nezumi (No. 6)',
  'Nico Robin (One Piece)',
  'Nobara Kugisaki (Jujutsu Kaisen)',
  'Ochaco Uraraka (My Hero Academia)',
  'Oikawa Tooru (Haikyuu!!)',
  'Osamu Dazai (Bungo Stray Dogs)',
  'Osamu Tezuka (Creator - Astro Boy)',
  'Piccolo (Dragon Ball)',
  'Portgas D. Ace (One Piece)',
  'Raye Penber (Death Note)',
  'Rei Ayanami (Neon Genesis Evangelion)',
  'Rem (Re:Zero)',
  'Rerugend (Saga of Tanya the Evil)',
  'Revy (Black Lagoon)',
  'Rias Gremory (High School DxD)',
  'Rie Kugimiya (Voice Actor)',
  'Rimuru Tempest (That Time I Got Reincarnated as a Slime)',
  'Rin Matsuoka (Free!)',
  'Rin Tohsaka (Fate/stay night)',
  'Roronoa Zoro (One Piece)',
  'Roy Mustang (Fullmetal Alchemist)',
  'Ryota Kise (Kuroko\\'s Basketball)',
  'Ryuk (Death Note)',
  'Sabito (Demon Slayer)',
  'Sabo (One Piece)',
  'Sadao Maou (The Devil is a Part-Timer!)',
  'Sailor Moon (Sailor Moon)',
  'Saitama (One Punch Man)',
  'Sanji (One Piece)',
  'Saori Hayami (Voice Actor)',
  'Sasuke Uchiha (Naruto)',
  'Satoshi Kon (Director - Perfect Blue)',
  'Sebastian Michaelis (Black Butler)',
  'Sesshomaru (InuYasha)',
  'Shigeo "Mob" Kageyama (Mob Psycho 100)',
  'Shikamaru Nara (Naruto)',
  'Shinichiro Watanabe (Director - Cowboy Bebop)',
  'Shinji Ikari (Neon Genesis Evangelion)',
  'Shinya Kogami (Psycho-Pass)',
  'Shiraishi (Golden Kamuy)',
  'Shoko Nishimiya (A Silent Voice)',
  'Shotaro Kaneda (Akira)',
  'Shoto Todoroki (My Hero Academia)',
  'Shoya Ishida (A Silent Voice)',
  'Sinbad (Magi: The Labyrinth of Magic)',
  'Son Goku (Dragon Ball)',
  'Sora (No Game No Life)',
  'Sougo Okita (Gintama)',
  'Spike Spiegel (Cowboy Bebop)',
  'Suga Koushi (Haikyuu!!)',
  'Sukuna (Jujutsu Kaisen)',
  'Suzune Horikita (Classroom of the Elite)',
  'Taiga Aisaka (Toradora!)',
  'Taki Tachibana (Your Name)',
  'Tamaki Suoh (Ouran High School Host Club)',
  'Tanjiro Kamado (Demon Slayer)',
  'Tengen Uzui (Demon Slayer)',
  'Tetsuo Shima (Akira)',
  'Tite Kubo (Creator - Bleach)',
  'Tomoe (Kamisama Kiss)',
  'Tomokazu Sugita (Voice Actor)',
  'Tony Tony Chopper (One Piece)',
  'Toya Todoroki / Dabi (My Hero Academia)',
  'Trafalgar Law (One Piece)',
  'Trunks (Dragon Ball)',
  'Tsukishima Kei (Haikyuu!!)',
  'Tsunade (Naruto)',
  'Uryu Ishida (Bleach)',
  'Uta (Tokyo Ghoul)',
  'Vash the Stampede (Trigun)',
  'Vegeta (Dragon Ball)',
  'Violet Evergarden (Violet Evergarden)',
  'Wolfgang Grimmer (Monster)',
  'Xenovia Quarta (High School DxD)',
  'Yami Sukehiro (Black Clover)',
  'Yato (Noragami)',
  'Yoko Littner (Gurren Lagann)',
  'Yor Forger (Spy x Family)',
  'Yoshihiro Togashi (Creator - Hunter x Hunter)',
  'Yuji Itadori (Jujutsu Kaisen)',
  'Yuki Kaji (Voice Actor)',
  'Yuki Sohma (Fruits Basket)',
  'Yuno Gasai (Future Diary)',
  'Yuri Katsuki (Yuri!!! on Ice)',
  'Yuri Plisetsky (Yuri!!! on Ice)',
  'Yusuke Urameshi (Yu Yu Hakusho)',
  'Zen Wistaria (Snow White with the Red Hair)',
  'Zenitsu Agatsuma (Demon Slayer)',
  'Zero Two (Darling in the Franxx)',
];

// Build ANIME_CHAR_OPTIONS lines
let charLines = '';
for (const fullName of CHAR_NAMES) {
  const cleanName = fullName.split('(')[0].trim().replace(/"/g, '');
  // Also try with quotes for "Mob"
  let url = charMap[cleanName];
  if (!url) {
    // Try the full log name which may include quotes
    for (const [k, v] of Object.entries(charMap)) {
      if (k.startsWith(cleanName.substring(0, 10))) {
        url = v;
        break;
      }
    }
  }
  if (!url) {
    // fallback to a seed-based picsum (shouldn't happen)
    const seed = cleanName.toLowerCase().replace(/\s+/g, '_');
    url = `https://picsum.photos/seed/${seed}/96`;
  }
  const escapedName = fullName.replace(/'/g, "\\'");
  charLines += `  { name: '${escapedName}', url: '${url}' },\n`;
}

console.log(`Mapped ${CHAR_NAMES.length} characters`);
console.log('Missing MAL URLs (using fallback):');
for (const fullName of CHAR_NAMES) {
  const cleanName = fullName.split('(')[0].trim().replace(/"/g, '');
  if (!charMap[cleanName]) {
    let found = false;
    for (const [k] of Object.entries(charMap)) {
      if (k.startsWith(cleanName.substring(0, 10))) { found = true; break; }
    }
    if (!found) console.log('  -', fullName);
  }
}

// Write the complete Notepad.jsx
const output = `import { useEffect, useState, useRef } from 'react'
import './Notepad.css'

const GROQ_ENDPOINT = import.meta.env.VITE_GROQ_ENDPOINT || ''
const SERVER_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:4000'

async function fetchTranslationsViaGROQ(lang) {
  if (!GROQ_ENDPOINT) return null
  const query = encodeURIComponent(\`*[_type == "translation" && language == "\${lang}"]{key, text}\`)
  const url = \`\${GROQ_ENDPOINT}?query=\${query}\`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const translations = {}
    if (data.result && Array.isArray(data.result)) {
      data.result.forEach(item => { translations[item.key] = item.text })
    }
    return translations
  } catch (e) {
    console.warn('GROQ fetch error', e)
    return null
  }
}

function svgSticker(svg) {
  return \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`
}

function makeSticker({ bg, face, accent, accent2, accessory }) {
  return svgSticker(\`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="28" fill="\${bg}"/>
      <circle cx="60" cy="60" r="36" fill="\${face}"/>
      <ellipse cx="46" cy="56" rx="7" ry="10" fill="#10203b"/>
      <ellipse cx="74" cy="56" rx="7" ry="10" fill="#10203b"/>
      <path d="M42 78c8 8 28 8 36 0" stroke="\${accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="45" cy="67" rx="5" ry="3" fill="\${accent2}" opacity="0.38"/>
      <ellipse cx="75" cy="67" rx="5" ry="3" fill="\${accent2}" opacity="0.38"/>
      \${accessory}
    </svg>
  \`)
}

const ANIME_CHAR_OPTIONS = [
${charLines}]

const STICKERS = [
  {
    name: 'Spark',
    url: makeSticker({
      bg: '#eff6ff', face: '#fff7fb', accent: '#2563eb', accent2: '#f472b6',
      accessory: '<path d="M29 24l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="#f59e0b"/><path d="M88 26l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#a78bfa"/>',
    }),
  },
  {
    name: 'Cat',
    url: makeSticker({
      bg: '#fff1f2', face: '#fffaf5', accent: '#e11d48', accent2: '#fb7185',
      accessory: '<path d="M36 40L26 24l16 6 6 16z" fill="#fb7185"/><path d="M84 40l10-16-16 6-6 16z" fill="#fb7185"/>',
    }),
  },
  {
    name: 'Bunny',
    url: makeSticker({
      bg: '#fef3c7', face: '#fffdf8', accent: '#d97706', accent2: '#f59e0b',
      accessory: '<path d="M42 38c-4-13 2-22 8-22s8 9 6 22" fill="#fde68a"/><path d="M78 38c4-13-2-22-8-22s-8 9-6 22" fill="#fde68a"/>',
    }),
  },
  {
    name: 'Bear',
    url: makeSticker({
      bg: '#ecfccb', face: '#fefce8', accent: '#65a30d', accent2: '#84cc16',
      accessory: '<circle cx="36" cy="36" r="9" fill="#bef264"/><circle cx="84" cy="36" r="9" fill="#bef264"/>',
    }),
  },
  {
    name: 'Moon',
    url: makeSticker({
      bg: '#e0f2fe', face: '#f8fbff', accent: '#0284c7', accent2: '#38bdf8',
      accessory: '<path d="M84 26c-9 4-15 14-15 24 0 13 10 24 23 26-6 5-13 8-22 8-18 0-33-14-33-32 0-16 11-29 27-32 8-1 14 1 20 6z" fill="#7dd3fc" opacity="0.55"/><circle cx="30" cy="30" r="3" fill="#38bdf8"/><circle cx="92" cy="34" r="2.5" fill="#38bdf8"/>',
    }),
  },
  {
    name: 'Flower',
    url: makeSticker({
      bg: '#fce7f3', face: '#fff7fb', accent: '#db2777', accent2: '#f472b6',
      accessory: '<path d="M60 18c4 7 7 9 14 10-6 4-9 7-10 14-4-6-7-9-14-10 6-4 9-7 10-14z" fill="#fb7185"/><circle cx="60" cy="26" r="5" fill="#fde68a"/>',
    }),
  },
  {
    name: 'Robot',
    url: makeSticker({
      bg: '#f1f5f9', face: '#eef2ff', accent: '#475569', accent2: '#94a3b8',
      accessory: '<rect x="29" y="20" width="62" height="18" rx="9" fill="#cbd5e1"/><circle cx="60" cy="29" r="4" fill="#0f172a"/><rect x="52" y="14" width="16" height="6" rx="3" fill="#94a3b8"/>',
    }),
  },
  {
    name: 'Star',
    url: makeSticker({
      bg: '#fef9c3', face: '#fffef3', accent: '#ca8a04', accent2: '#eab308',
      accessory: '<path d="M60 16l6 12 13 2-10 9 2 13-11-6-11 6 2-13-10-9 13-2z" fill="#facc15"/><path d="M21 38l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#fde68a"/>',
    }),
  },
  {
    name: 'Cloud',
    url: makeSticker({
      bg: '#dbeafe', face: '#f8fbff', accent: '#0369a1', accent2: '#60a5fa',
      accessory: '<path d="M29 72c0-7 6-12 13-12 2-11 12-19 24-19 11 0 20 7 23 17 9 0 16 7 16 16 0 10-8 18-18 18H43c-8 0-14-6-14-14z" fill="#bfdbfe"/>',
    }),
  },
  {
    name: 'Heart',
    url: makeSticker({
      bg: '#ffe4e6', face: '#fff7f8', accent: '#be123c', accent2: '#fb7185',
      accessory: '<path d="M60 22c4-8 12-11 18-8 6 3 8 11 3 17-6 7-14 14-21 21-7-7-15-14-21-21-5-6-3-14 3-17 6-3 14 0 18 8z" fill="#f43f5e"/>',
    }),
  },
]

const DEFAULT_ANIME_CHAR = ANIME_CHAR_OPTIONS[0]

const BASE_TEXT = {
  en: {
    appTitle: 'Notepad',
    newNote: 'New',
    notesLabel: 'Notes',
    avatar: 'Anime Character',
    background: 'Background',
    fontFamily: 'Font style',
    language: 'Language',
    save: 'Save to MongoDB',
    autosave: 'Ready to sync with MongoDB',
    selectNote: 'Create or select a note to start typing.',
    textPlaceholder: 'Start typing your note here...',
    titlePlaceholder: 'Title',
    personalization: 'Personalize',
    customLanguage: 'Custom language code',
    customFont: 'Custom font-family',
    animeUrl: 'Anime character image URL',
    closePanel: 'Close personalization panel',
    languageCodePrefix: 'Language:',
    subtitle: 'Minimal editor with anime character upload, palette controls, and MongoDB sync.',
    saving: 'Saving to MongoDB...',
    savedSuccess: 'Saved to MongoDB successfully',
    savedError: 'Unable to save to MongoDB; check backend settings',
    newNoteCreated: 'New note created',
    avatarApplied: 'Anime character image applied',
    untitled: 'Untitled',
    colorPalette: 'Color palette',
    paletteBlue: 'Blue',
    paletteRose: 'Rose',
    paletteEmerald: 'Emerald',
    paletteAmber: 'Amber',
    paletteViolet: 'Violet',
    paletteTeal: 'Teal',
    paletteCoral: 'Coral',
    paletteLime: 'Lime',
    paletteSky: 'Sky',
    paletteFuchsia: 'Fuchsia',
    stickerLibrary: 'Sticker library',
    chooseSticker: 'Choose a built-in sticker',
    stickerSpark: 'Spark',
    stickerCat: 'Cat',
    stickerBunny: 'Bunny',
    stickerBear: 'Bear',
    stickerMoon: 'Moon',
    stickerFlower: 'Flower',
    stickerRobot: 'Robot',
    stickerStar: 'Star',
    stickerCloud: 'Cloud',
    stickerHeart: 'Heart',
    languageEnglish: 'English',
    languageSpanish: 'Spanish',
    languageFrench: 'French',
    languageChinese: 'Chinese',
    languageArabic: 'Arabic',
    languageHindi: 'Hindi',
    languageRussian: 'Russian',
    languageJapanese: 'Japanese',
    languageGerman: 'German',
    languagePortuguese: 'Portuguese',
    languageOther: 'Other / custom',
    fontInter: 'Inter / Sans serif',
    fontGeorgia: 'Georgia / Serif',
    fontCourier: 'Courier New / Monospace',
    fontBrush: 'Brush Script / Cursive',
    fontSegoe: 'Segoe UI',
    fontArial: 'Arial',
    fontTahoma: 'Tahoma',
    fontPalatino: 'Palatino',
    fontVerdana: 'Verdana',
    fontOpenSans: 'Open Sans',
    backgroundNature: 'Nature',
    backgroundOcean: 'Ocean',
    backgroundSunset: 'Sunset',
    backgroundNight: 'Night',
    backgroundForest: 'Forest',
    backgroundBeach: 'Beach',
    backgroundRain: 'Rainy city',
    backgroundAurora: 'Aurora',
    backgroundDesert: 'Desert',
  },
}

const LANGUAGE_OPTIONS = [
  { value: 'en', labelKey: 'languageEnglish' },
  { value: 'es', labelKey: 'languageSpanish' },
  { value: 'fr', labelKey: 'languageFrench' },
  { value: 'zh', labelKey: 'languageChinese' },
  { value: 'ar', labelKey: 'languageArabic' },
  { value: 'hi', labelKey: 'languageHindi' },
  { value: 'ru', labelKey: 'languageRussian' },
  { value: 'ja', labelKey: 'languageJapanese' },
  { value: 'de', labelKey: 'languageGerman' },
  { value: 'pt', labelKey: 'languagePortuguese' },
  { value: 'custom', labelKey: 'languageOther' },
]

const FONT_OPTIONS = [
  { labelKey: 'fontInter', value: 'Inter, sans-serif' },
  { labelKey: 'fontGeorgia', value: 'Georgia, serif' },
  { labelKey: 'fontCourier', value: 'Courier New, monospace' },
  { labelKey: 'fontBrush', value: 'Brush Script MT, cursive' },
  { labelKey: 'fontSegoe', value: 'Segoe UI, sans-serif' },
  { labelKey: 'fontArial', value: 'Arial, sans-serif' },
  { labelKey: 'fontTahoma', value: 'Tahoma, sans-serif' },
  { labelKey: 'fontPalatino', value: 'Palatino Linotype, serif' },
  { labelKey: 'fontVerdana', value: 'Verdana, sans-serif' },
  { labelKey: 'fontOpenSans', value: 'Open Sans, sans-serif' },
]

const COLOR_PALETTE_OPTIONS = [
  { key: 'blue', labelKey: 'paletteBlue', accent: '#5b8cff', accentStrong: '#2563eb', accentSoft: 'rgba(91, 140, 255, 0.18)', bgStart: 'rgba(91, 140, 255, 0.22)', bgEnd: 'rgba(11, 17, 33, 0.96)', surface: 'rgba(8, 14, 24, 0.92)', surfaceStrong: 'rgba(11, 18, 33, 0.96)', surfaceMuted: 'rgba(8, 14, 24, 0.82)', line: 'rgba(148, 163, 184, 0.16)', textMain: '#f8fafc', textSoft: '#9fb0c6', shadowLg: '0 30px 90px rgba(2, 6, 23, 0.48)' },
  { key: 'rose', labelKey: 'paletteRose', accent: '#fb7185', accentStrong: '#e11d48', accentSoft: 'rgba(251, 113, 133, 0.18)', bgStart: 'rgba(251, 113, 133, 0.20)', bgEnd: 'rgba(18, 8, 22, 0.97)', surface: 'rgba(17, 10, 20, 0.92)', surfaceStrong: 'rgba(24, 12, 26, 0.96)', surfaceMuted: 'rgba(17, 10, 20, 0.82)', line: 'rgba(244, 114, 182, 0.18)', textMain: '#fff7fb', textSoft: '#f1b9ca', shadowLg: '0 30px 90px rgba(34, 10, 24, 0.5)' },
  { key: 'emerald', labelKey: 'paletteEmerald', accent: '#34d399', accentStrong: '#059669', accentSoft: 'rgba(52, 211, 153, 0.18)', bgStart: 'rgba(52, 211, 153, 0.20)', bgEnd: 'rgba(8, 20, 18, 0.97)', surface: 'rgba(8, 18, 16, 0.92)', surfaceStrong: 'rgba(10, 24, 20, 0.96)', surfaceMuted: 'rgba(8, 18, 16, 0.82)', line: 'rgba(52, 211, 153, 0.16)', textMain: '#f4fffb', textSoft: '#9bd8ca', shadowLg: '0 30px 90px rgba(5, 44, 38, 0.48)' },
  { key: 'amber', labelKey: 'paletteAmber', accent: '#fbbf24', accentStrong: '#d97706', accentSoft: 'rgba(251, 191, 36, 0.2)', bgStart: 'rgba(251, 191, 36, 0.18)', bgEnd: 'rgba(23, 14, 6, 0.97)', surface: 'rgba(20, 14, 8, 0.92)', surfaceStrong: 'rgba(27, 18, 10, 0.96)', surfaceMuted: 'rgba(20, 14, 8, 0.82)', line: 'rgba(251, 191, 36, 0.16)', textMain: '#fffaf0', textSoft: '#f3d49c', shadowLg: '0 30px 90px rgba(45, 24, 4, 0.48)' },
  { key: 'violet', labelKey: 'paletteViolet', accent: '#a78bfa', accentStrong: '#7c3aed', accentSoft: 'rgba(167, 139, 250, 0.18)', bgStart: 'rgba(167, 139, 250, 0.20)', bgEnd: 'rgba(14, 10, 28, 0.97)', surface: 'rgba(13, 10, 28, 0.92)', surfaceStrong: 'rgba(18, 14, 38, 0.96)', surfaceMuted: 'rgba(13, 10, 28, 0.82)', line: 'rgba(167, 139, 250, 0.16)', textMain: '#faf7ff', textSoft: '#cbc3ef', shadowLg: '0 30px 90px rgba(20, 10, 52, 0.48)' },
  { key: 'teal', labelKey: 'paletteTeal', accent: '#2dd4bf', accentStrong: '#0f766e', accentSoft: 'rgba(45, 212, 191, 0.18)', bgStart: 'rgba(45, 212, 191, 0.18)', bgEnd: 'rgba(7, 22, 24, 0.97)', surface: 'rgba(8, 20, 22, 0.92)', surfaceStrong: 'rgba(10, 26, 28, 0.96)', surfaceMuted: 'rgba(8, 20, 22, 0.82)', line: 'rgba(45, 212, 191, 0.16)', textMain: '#f3fffd', textSoft: '#9dded6', shadowLg: '0 30px 90px rgba(4, 42, 45, 0.48)' },
  { key: 'coral', labelKey: 'paletteCoral', accent: '#fb7185', accentStrong: '#f97316', accentSoft: 'rgba(251, 113, 133, 0.16)', bgStart: 'rgba(251, 113, 133, 0.18)', bgEnd: 'rgba(28, 10, 14, 0.97)', surface: 'rgba(24, 11, 16, 0.92)', surfaceStrong: 'rgba(30, 14, 20, 0.96)', surfaceMuted: 'rgba(24, 11, 16, 0.82)', line: 'rgba(251, 113, 133, 0.14)', textMain: '#fff7f8', textSoft: '#f0b7bf', shadowLg: '0 30px 90px rgba(52, 15, 22, 0.48)' },
  { key: 'lime', labelKey: 'paletteLime', accent: '#a3e635', accentStrong: '#65a30d', accentSoft: 'rgba(163, 230, 53, 0.18)', bgStart: 'rgba(163, 230, 53, 0.16)', bgEnd: 'rgba(11, 21, 8, 0.97)', surface: 'rgba(12, 20, 10, 0.92)', surfaceStrong: 'rgba(15, 26, 12, 0.96)', surfaceMuted: 'rgba(12, 20, 10, 0.82)', line: 'rgba(163, 230, 53, 0.16)', textMain: '#fbfff2', textSoft: '#cfe39b', shadowLg: '0 30px 90px rgba(21, 42, 10, 0.48)' },
  { key: 'sky', labelKey: 'paletteSky', accent: '#38bdf8', accentStrong: '#0284c7', accentSoft: 'rgba(56, 189, 248, 0.18)', bgStart: 'rgba(56, 189, 248, 0.18)', bgEnd: 'rgba(6, 16, 28, 0.97)', surface: 'rgba(8, 16, 26, 0.92)', surfaceStrong: 'rgba(10, 20, 34, 0.96)', surfaceMuted: 'rgba(8, 16, 26, 0.82)', line: 'rgba(56, 189, 248, 0.16)', textMain: '#f5fbff', textSoft: '#9dc8dd', shadowLg: '0 30px 90px rgba(4, 24, 40, 0.48)' },
  { key: 'fuchsia', labelKey: 'paletteFuchsia', accent: '#e879f9', accentStrong: '#c026d3', accentSoft: 'rgba(232, 121, 249, 0.18)', bgStart: 'rgba(232, 121, 249, 0.18)', bgEnd: 'rgba(22, 10, 26, 0.97)', surface: 'rgba(20, 10, 25, 0.92)', surfaceStrong: 'rgba(27, 13, 34, 0.96)', surfaceMuted: 'rgba(20, 10, 25, 0.82)', line: 'rgba(232, 121, 249, 0.15)', textMain: '#fff6ff', textSoft: '#dfb1ea', shadowLg: '0 30px 90px rgba(46, 12, 56, 0.48)' },
]

const BACKGROUND_OPTIONS = [
  { key: 'nature', labelKey: 'backgroundNature' },
  { key: 'ocean', labelKey: 'backgroundOcean' },
  { key: 'sunset', labelKey: 'backgroundSunset' },
  { key: 'night', labelKey: 'backgroundNight' },
  { key: 'forest', labelKey: 'backgroundForest' },
  { key: 'beach', labelKey: 'backgroundBeach' },
  { key: 'rain', labelKey: 'backgroundRain' },
  { key: 'aurora', labelKey: 'backgroundAurora' },
  { key: 'desert', labelKey: 'backgroundDesert' },
]

const INITIAL_NOTE = { id: 1, title: '', body: '', avatar: DEFAULT_ANIME_CHAR.url, isDefaultTitle: true }

export default function Notepad() {
  const [notes, setNotes] = useState([INITIAL_NOTE])
  const [activeId, setActiveId] = useState(INITIAL_NOTE.id)
  const [language, setLanguage] = useState('en')
  const [customLanguageCode, setCustomLanguageCode] = useState('')
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [customFontFamily, setCustomFontFamily] = useState('')
  const [colorPalette, setColorPalette] = useState(COLOR_PALETTE_OPTIONS[0].key)
  const [backgroundTheme, setBackgroundTheme] = useState('nature')
  const [uiText, setUiText] = useState(BASE_TEXT.en)
  const [showSettings, setShowSettings] = useState(false)
  const [showCharacters, setShowCharacters] = useState(false)
  const [statusMessageKey, setStatusMessageKey] = useState('autosave')
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessageKey, setLoaderMessageKey] = useState('')
  const textareaRef = useRef(null)

  function t(key) {
    return uiText[key] || BASE_TEXT.en[key] || key
  }

  function getEffectiveFont() {
    return customFontFamily.trim() || fontFamily
  }

  function getNoteTitle(note) {
    if (!note) return t('untitled')
    return note.title?.trim() ? note.title : t('untitled')
  }

  function getPaletteVars() {
    const palette = COLOR_PALETTE_OPTIONS.find((o) => o.key === colorPalette) || COLOR_PALETTE_OPTIONS[0]
    return {
      '--accent': palette.accent,
      '--accent-strong': palette.accentStrong,
      '--accent-soft': palette.accentSoft,
      '--app-bg-start': palette.bgStart,
      '--app-bg-end': palette.bgEnd,
      '--surface': palette.surface,
      '--surface-strong': palette.surfaceStrong,
      '--surface-muted': palette.surfaceMuted,
      '--line': palette.line,
      '--text-main': palette.textMain,
      '--text-soft': palette.textSoft,
      '--shadow-lg': palette.shadowLg,
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    async function loadLanguage() {
      const requested = language === 'custom' ? customLanguageCode.trim() : language
      if (!requested || requested === 'en') { setUiText(BASE_TEXT.en); return }
      if (GROQ_ENDPOINT) {
        const tr = await fetchTranslationsViaGROQ(requested)
        if (tr) { setUiText({ ...BASE_TEXT.en, ...tr }); return }
        setUiText(BASE_TEXT.en)
        return
      }
      try {
        const response = await fetch(\`\${SERVER_ORIGIN}/api/translate\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ targetLanguage: requested, sourceText: BASE_TEXT.en }),
        })
        if (!response.ok) throw new Error('translation_failed')
        const data = await response.json()
        if (data?.translations && typeof data.translations === 'object') {
          setUiText({ ...BASE_TEXT.en, ...data.translations })
        } else {
          setUiText(BASE_TEXT.en)
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        setUiText(BASE_TEXT.en)
      }
    }
    loadLanguage()
    return () => controller.abort()
  }, [language, customLanguageCode])

  function createNote() {
    const note = { id: Date.now(), title: '', body: '', avatar: DEFAULT_ANIME_CHAR.url, isDefaultTitle: true }
    setNotes((current) => [note, ...current])
    setActiveId(note.id)
    setStatusMessageKey('newNoteCreated')
  }

  function updateActive(changes) {
    setNotes((current) => current.map((note) => (note.id === activeId ? { ...note, ...changes } : note)))
  }

  function onEdit(field, value) {
    updateActive({ [field]: value, ...(field === 'title' ? { isDefaultTitle: false } : {}) })
  }

  function setStickerForActive(sticker) {
    updateActive({ avatar: sticker.avatar })
  }

  async function saveToServer(note) {
    if (!note) return
    setIsLoading(true)
    setLoaderMessageKey('saving')
    try {
      const title = getNoteTitle(note)
      const payload = { id: note.id, title, body: note.body, avatar: note.avatar }
      const response = await fetch(\`\${SERVER_ORIGIN}/api/notes\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('save_failed')
      setStatusMessageKey('savedSuccess')
    } catch (error) {
      console.error(error)
      setStatusMessageKey('savedError')
    } finally {
      setLoaderMessageKey('')
      setIsLoading(false)
    }
  }

  const active = notes.find((note) => note.id === activeId) || notes[0]

  const editorStyle = {
    fontFamily: getEffectiveFont(),
  }

  return (
    <div
      className={\`notepad app-shell bg-\${backgroundTheme}\`}
      style={getPaletteVars()}
    >
      <header className="app-header">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          {language === 'custom' && customLanguageCode ? <p className="subtitle small">{t('languageCodePrefix')} {customLanguageCode}</p> : null}
        </div>
        <div className="app-actions">
          <button className="btn primary" type="button" onClick={createNote}>{t('newNote')}</button>
          <button className="btn" type="button" onClick={() => setShowCharacters((c) => !c)}>{t('avatar')}</button>
          <button className="btn" type="button" onClick={() => setShowSettings((c) => !c)}>{t('personalization')}</button>
        </div>
      </header>

      <main className="editor">
        <div className="phone-frame">
          <div className="phone-statusbar">
            <span className="status-label">{t('notesLabel')}</span>
            <span className="status-label">12:48 \\u2022 100%</span>
          </div>

          <div className="phone-screen">
            <div className="editor-inner">
              <div className="editor-top">
                <div className="active-avatar">
                  {active?.avatar ? (
                    <img src={active.avatar} alt={t('avatar')} width={96} height={96} />
                  ) : (
                    <div className="avatar-placeholder">{t('avatar')}</div>
                  )}
                </div>

                <div className="title-group">
                  <input
                    className="title"
                    value={active?.title || ''}
                    onChange={(e) => onEdit('title', e.target.value)}
                    placeholder={t('titlePlaceholder')}
                    style={{ fontFamily: getEffectiveFont() }}
                  />
                  <select
                    className="note-selector"
                    value={active?.id || ''}
                    onChange={(e) => setActiveId(Number(e.target.value))}
                  >
                    {notes.map((note) => (
                      <option key={note.id} value={note.id}>{getNoteTitle(note)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                className="body"
                value={active?.body || ''}
                onChange={(e) => onEdit('body', e.target.value)}
                placeholder={t('textPlaceholder')}
                style={editorStyle}
              />

              <div className="editor-footer">
                <div className="footer-actions">
                  <button className="btn primary" type="button" onClick={() => saveToServer(active)}>{t('save')}</button>
                  <button className="btn" type="button" onClick={() => setShowCharacters(true)}>{t('avatar')}</button>
                  <button className="btn" type="button" onClick={() => setShowSettings(true)}>{t('personalization')}</button>
                </div>
                <small>{t(statusMessageKey)}</small>
              </div>
            </div>
          </div>
        </div>

        {showCharacters && (
          <aside className="personalization-card">
            <div className="panel-header">
              <h2>{t('avatar')}</h2>
              <button className="btn icon" type="button" aria-label="Close anime characters panel" onClick={() => setShowCharacters(false)}>\\u00d7</button>
            </div>
            <div className="setting-group">
              <div className="sticker-preview">
                <img src={active?.avatar || DEFAULT_ANIME_CHAR.url} alt={t('avatar')} />
                <div>
                  <strong>{t('avatar')}</strong>
                  <p>{t('chooseSticker')}</p>
                </div>
              </div>
              <div className="sticker-grid">
                {ANIME_CHAR_OPTIONS.map((char) => (
                  <button
                    key={char.name}
                    type="button"
                    className={\`sticker-chip \${active?.avatar === char.url ? 'active' : ''}\`}
                    onClick={() => setStickerForActive({ avatar: char.url })}
                    aria-pressed={active?.avatar === char.url}
                  >
                    <img src={char.url} alt={char.name} />
                    <span>{char.name}</span>
                  </button>
                ))}
              </div>
              <input
                className="text-input"
                type="url"
                value={active?.avatar || ''}
                onChange={(e) => onEdit('avatar', e.target.value)}
                placeholder={t('animeUrl')}
                style={{ marginTop: '12px' }}
              />
            </div>
          </aside>
        )}

        {showSettings && (
          <aside className="personalization-card">
            <div className="panel-header">
              <h2>{t('personalization')}</h2>
              <button className="btn icon" type="button" aria-label="Close personalization panel" onClick={() => setShowSettings(false)}>\\u00d7</button>
            </div>

            <div className="setting-group">
              <label>{t('stickerLibrary')}</label>
              <div className="sticker-grid">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker.name}
                    type="button"
                    className={\`sticker-chip \${active?.avatar === sticker.url ? 'active' : ''}\`}
                    onClick={() => setStickerForActive({ avatar: sticker.url })}
                    aria-pressed={active?.avatar === sticker.url}
                  >
                    <img src={sticker.url} alt={t(\`sticker\${sticker.name}\`)} />
                    <span>{t(\`sticker\${sticker.name}\`)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label>{t('fontFamily')}</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                {FONT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                ))}
              </select>
              <input
                className="text-input"
                value={customFontFamily}
                onChange={(e) => setCustomFontFamily(e.target.value)}
                placeholder={t('customFont')}
              />
            </div>

            <div className="setting-group">
              <label>{t('colorPalette')}</label>
              <div className="palette-grid">
                {COLOR_PALETTE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={\`palette-chip \${colorPalette === option.key ? 'active' : ''}\`}
                    onClick={() => setColorPalette(option.key)}
                    style={{ '--chip-color': option.accent, '--chip-color-strong': option.accentStrong }}
                    aria-pressed={colorPalette === option.key}
                  >
                    <span className="palette-swatch" aria-hidden="true" />
                    <span>{t(option.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label>{t('language')}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                ))}
              </select>
              <input
                className="text-input"
                value={customLanguageCode}
                onChange={(e) => setCustomLanguageCode(e.target.value)}
                placeholder={t('customLanguage')}
              />
            </div>

            <div className="setting-group">
              <label>{t('background')}</label>
              <div className="background-grid">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={\`background-card \${backgroundTheme === option.key ? 'active' : ''}\`}
                    type="button"
                    onClick={() => setBackgroundTheme(option.key)}
                    aria-pressed={backgroundTheme === option.key}
                  >
                    <span className={\`background-preview bg-\${option.key}\`} aria-hidden="true" />
                    <span>{t(option.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {isLoading && (
          <div className="loader-overlay">
            <div className="loader-card">
              <div className="loader-ring" />
              <p>{t(loaderMessageKey)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
`;

fs.writeFileSync('./src/Notepad.jsx', output, 'utf8');
console.log('Notepad.jsx rebuilt successfully!');
