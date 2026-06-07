import { useEffect, useState, useRef } from 'react'
import './Notepad.css'
import { ANIME_CHAR_OPTIONS } from './animeCharacters'

const SERVER_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:4000'

function svgSticker(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function makeSticker({ bg, face, accent, accent2, accessory }) {
  return svgSticker(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="28" fill="${bg}"/>
      <circle cx="60" cy="60" r="36" fill="${face}"/>
      <ellipse cx="46" cy="56" rx="7" ry="10" fill="#10203b"/>
      <ellipse cx="74" cy="56" rx="7" ry="10" fill="#10203b"/>
      <path d="M42 78c8 8 28 8 36 0" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="45" cy="67" rx="5" ry="3" fill="${accent2}" opacity="0.38"/>
      <ellipse cx="75" cy="67" rx="5" ry="3" fill="${accent2}" opacity="0.38"/>
      ${accessory}
    </svg>
  `)
}

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

const DEFAULT_ANIME_CHAR = ANIME_CHAR_OPTIONS[0] || { name: 'Default', url: STICKERS[0].url }

const TRANSLATIONS = {
  en: {
    appTitle: 'Notepad',
    newNote: 'New',
    notesLabel: 'Notes',
    avatar: 'Anime Characters',
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
    closePanel: 'Close',
    languageCodePrefix: 'Language:',
    subtitle: 'Minimal editor with anime character upload, palette controls, and MongoDB sync.',
    saving: 'Saving to MongoDB...',
    savedSuccess: 'Saved to MongoDB successfully',
    savedError: 'Unable to save to MongoDB; check backend settings',
    newNoteCreated: 'New note created',
    avatarApplied: 'Anime character image applied',
    untitled: 'Untitled',
    colorPalette: 'Color palette',
    searchPlaceholder: 'Search characters...',
    uploadImage: 'Upload image',
    applyImage: 'Apply image URL',
    stickerLibrary: 'Sticker library',
    chooseSticker: 'Choose a built-in sticker',
    themeMode: 'Theme mode',
    normal: 'Normal',
    cute: 'Stylized',
    numberStyle: 'Number style',
    defaultNumber: 'Default',
    tabularNumber: 'Tabular',
    oldstyleNumber: 'Oldstyle',
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
    backgroundNature: 'Nature',
    backgroundOcean: 'Ocean',
    backgroundSunset: 'Sunset',
    backgroundNight: 'Night',
    backgroundForest: 'Forest',
    backgroundBeach: 'Beach',
    backgroundRain: 'Rainy city',
    backgroundAurora: 'Aurora',
    backgroundDesert: 'Desert',
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
  },
  es: {
    appTitle: 'Bloc de notas',
    newNote: 'Nuevo',
    notesLabel: 'Notas',
    avatar: 'Personajes Anime',
    background: 'Fondo',
    fontFamily: 'Estilo de letra',
    language: 'Idioma',
    save: 'Guardar en MongoDB',
    autosave: 'Listo para sincronizar con MongoDB',
    selectNote: 'Crea o selecciona una nota para comenzar.',
    textPlaceholder: 'Empieza a escribir tu nota aquí...',
    titlePlaceholder: 'Título',
    personalization: 'Personalizar',
    customLanguage: 'Código de idioma personalizado',
    customFont: 'Fuente personalizada',
    animeUrl: 'URL de imagen del personaje anime',
    closePanel: 'Cerrar',
    languageCodePrefix: 'Idioma:',
    subtitle: 'Editor minimalista con carga de personajes de anime, controles de paleta y sincronización con MongoDB.',
    saving: 'Guardando en MongoDB...',
    savedSuccess: 'Guardado en MongoDB con éxito',
    savedError: 'No se puede guardar en MongoDB; verifique la configuración',
    newNoteCreated: 'Nueva nota creada',
    avatarApplied: 'Imagen de personaje anime aplicada',
    untitled: 'Sin título',
    colorPalette: 'Paleta de colores',
    searchPlaceholder: 'Buscar personajes...',
    uploadImage: 'Subir imagen',
    applyImage: 'Aplicar URL de imagen',
    stickerLibrary: 'Biblioteca de stickers',
    chooseSticker: 'Elige un sticker integrado',
    themeMode: 'Modo de tema',
    normal: 'Normal',
    cute: 'Estilizado',
    numberStyle: 'Estilo numérico',
    defaultNumber: 'Por defecto',
    tabularNumber: 'Tabular',
    oldstyleNumber: 'Estilo antiguo',
    paletteBlue: 'Azul',
    paletteRose: 'Rosa',
    paletteEmerald: 'Esmeralda',
    paletteAmber: 'Ámbar',
    paletteViolet: 'Violeta',
    paletteTeal: 'Cian',
    paletteCoral: 'Coral',
    paletteLime: 'Lima',
    paletteSky: 'Celeste',
    paletteFuchsia: 'Fucsia',
    backgroundNature: 'Naturaleza',
    backgroundOcean: 'Océano',
    backgroundSunset: 'Atardecer',
    backgroundNight: 'Noche',
    backgroundForest: 'Bosque',
    backgroundBeach: 'Playa',
    backgroundRain: 'Ciudad lluviosa',
    backgroundAurora: 'Aurora',
    backgroundDesert: 'Desierto',
    stickerSpark: 'Chispa',
    stickerCat: 'Gato',
    stickerBunny: 'Conejo',
    stickerBear: 'Oso',
    stickerMoon: 'Luna',
    stickerFlower: 'Flor',
    stickerRobot: 'Robot',
    stickerStar: 'Estrella',
    stickerCloud: 'Nube',
    stickerHeart: 'Corazón',
    languageEnglish: 'Inglés',
    languageSpanish: 'Español',
    languageFrench: 'Francés',
    languageChinese: 'Chino',
    languageArabic: 'Árabe',
    languageHindi: 'Hindi',
    languageRussian: 'Ruso',
    languageJapanese: 'Japonés',
    languageGerman: 'Alemán',
    languagePortuguese: 'Português',
    languageOther: 'Otro / personalizado',
  },
  fr: {
    appTitle: 'Bloc-notes',
    newNote: 'Nouveau',
    notesLabel: 'Notes',
    avatar: 'Personnages Animés',
    background: 'Fond',
    fontFamily: 'Style de police',
    language: 'Langue',
    save: 'Enregistrer dans MongoDB',
    autosave: 'Prêt à synchroniser avec MongoDB',
    selectNote: 'Créez ou sélectionnez une note pour commencer.',
    textPlaceholder: 'Commencez à écrire votre note ici...',
    titlePlaceholder: 'Titre',
    personalization: 'Personnaliser',
    customLanguage: 'Code de langue personnalisé',
    customFont: 'Police personnalisée',
    animeUrl: 'URL de l\'image du personnage anime',
    closePanel: 'Fermer',
    languageCodePrefix: 'Langue:',
    subtitle: 'Éditeur minimaliste avec téléchargement de personnages d\'anime, contrôles de palette et synchronisation MongoDB.',
    saving: 'Enregistrement dans MongoDB...',
    savedSuccess: 'Enregistré dans MongoDB avec succès',
    savedError: 'Impossible d\'enregistrer dans MongoDB; vérifiez les paramètres',
    newNoteCreated: 'Nouvelle note créée',
    avatarApplied: 'Image de personnage anime appliquée',
    untitled: 'Sans titre',
    colorPalette: 'Palette de couleurs',
    searchPlaceholder: 'Rechercher des personnages...',
    uploadImage: 'Télécharger une image',
    applyImage: 'Appliquer l\'URL de l\'image',
    stickerLibrary: 'Bibliothèque de stickers',
    chooseSticker: 'Choisissez un sticker intégré',
    themeMode: 'Mode de thème',
    normal: 'Normal',
    cute: 'Stylisé',
    numberStyle: 'Style numérique',
    defaultNumber: 'Par défaut',
    tabularNumber: 'Tabulaire',
    oldstyleNumber: 'Ancien style',
    paletteBlue: 'Bleu',
    paletteRose: 'Rose',
    paletteEmerald: 'Émeraude',
    paletteAmber: 'Ambre',
    paletteViolet: 'Violet',
    paletteTeal: 'Turquoise',
    paletteCoral: 'Corail',
    paletteLime: 'Lime',
    paletteSky: 'Ciel',
    paletteFuchsia: 'Fuchsia',
    backgroundNature: 'Nature',
    backgroundOcean: 'Océan',
    backgroundSunset: 'Coucher de soleil',
    backgroundNight: 'Nuit',
    backgroundForest: 'Forêt',
    backgroundBeach: 'Plage',
    backgroundRain: 'Ville pluvieuse',
    backgroundAurora: 'Aurore',
    backgroundDesert: 'Désert',
    stickerSpark: 'Étincelle',
    stickerCat: 'Chat',
    stickerBunny: 'Lapin',
    stickerBear: 'Ours',
    stickerMoon: 'Lune',
    stickerFlower: 'Fleur',
    stickerRobot: 'Robot',
    stickerStar: 'Étoile',
    stickerCloud: 'Nuage',
    stickerHeart: 'Cœur',
    languageEnglish: 'Anglais',
    languageSpanish: 'Espagnol',
    languageFrench: 'Français',
    languageChinese: 'Chinois',
    languageArabic: 'Arabe',
    languageHindi: 'Hindi',
    languageRussian: 'Russe',
    languageJapanese: 'Japonais',
    languageGerman: 'Allemand',
    languagePortuguese: 'Portugais',
    languageOther: 'Autre / personnalisé',
  },
  zh: {
    appTitle: '记事本',
    newNote: '新建',
    notesLabel: '笔记',
    avatar: '动漫角色',
    background: '背景',
    fontFamily: '字体样式',
    language: '语言',
    save: '保存到 MongoDB',
    autosave: '准备与 MongoDB 同步',
    selectNote: '创建或选择笔记以开始输入。',
    textPlaceholder: '在此处开始输入您的笔记...',
    titlePlaceholder: '标题',
    personalization: '个性化',
    customLanguage: '自定义语言代码',
    customFont: '自定义字体系列',
    animeUrl: '动漫角色图片 URL',
    closePanel: '关闭',
    languageCodePrefix: '语言:',
    subtitle: '具有动漫角色上传、调色板控制和 MongoDB 同步功能的极简编辑器。',
    saving: '正在保存到 MongoDB...',
    savedSuccess: '成功保存到 MongoDB',
    savedError: '无法保存到 MongoDB；请检查后端设置',
    newNoteCreated: '新建笔记已创建',
    avatarApplied: '已应用动漫角色图片',
    untitled: '无标题',
    colorPalette: '色彩面板',
    searchPlaceholder: '搜索角色...',
    uploadImage: '上传图片',
    applyImage: '应用图片 URL',
    stickerLibrary: '贴纸库',
    chooseSticker: '选择内置贴纸',
    themeMode: '主题模式',
    normal: '普通',
    cute: '风格化',
    numberStyle: '数字样式',
    defaultNumber: '默认',
    tabularNumber: '等宽',
    oldstyleNumber: '复古',
    paletteBlue: '蓝色',
    paletteRose: '玫瑰红',
    paletteEmerald: '祖母绿',
    paletteAmber: '琥珀色',
    paletteViolet: '紫罗兰',
    paletteTeal: '水鸭蓝',
    paletteCoral: '珊瑚红',
    paletteLime: '青柠绿',
    paletteSky: '天蓝色',
    paletteFuchsia: '洋红色',
    backgroundNature: '自然',
    backgroundOcean: '海洋',
    backgroundSunset: '日落',
    backgroundNight: '夜晚',
    backgroundForest: '森林',
    backgroundBeach: '沙滩',
    backgroundRain: '雨城',
    backgroundAurora: '极光',
    backgroundDesert: '沙漠',
    stickerSpark: '闪烁',
    stickerCat: '猫咪',
    stickerBunny: '兔子',
    stickerBear: '小熊',
    stickerMoon: '月亮',
    stickerFlower: '花朵',
    stickerRobot: '机器人',
    stickerStar: '星星',
    stickerCloud: '云朵',
    stickerHeart: '爱心',
    languageEnglish: '英文',
    languageSpanish: '西班牙文',
    languageFrench: '法文',
    languageChinese: '中文',
    languageArabic: '阿拉伯文',
    languageHindi: '印地文',
    languageRussian: '俄文',
    languageJapanese: '日文',
    languageGerman: '德文',
    languagePortuguese: '葡萄牙文',
    languageOther: '其他 / 自定义',
  },
  ar: {
    appTitle: 'المفكرة',
    newNote: 'جديد',
    notesLabel: 'ملاحظات',
    avatar: 'شخصيات الأنمي',
    background: 'الخلفية',
    fontFamily: 'نمط الخط',
    language: 'اللغة',
    save: 'حفظ في MongoDB',
    autosave: 'جاهز للمزامنة مع MongoDB',
    selectNote: 'أنشئ أو اختر ملاحظة لبدء الكتابة.',
    textPlaceholder: 'ابدأ بكتابة ملاحظتك هنا...',
    titlePlaceholder: 'العنوان',
    personalization: 'تخصيص',
    customLanguage: 'رمز لغة مخصص',
    customFont: 'عائلة خطوط مخصصة',
    animeUrl: 'رابط صورة شخصية الأنمي',
    closePanel: 'إغلاق',
    languageCodePrefix: 'اللغة:',
    subtitle: 'محرر بسيط مع رفع شخصيات الأنمي، ضوابط لوحة الألوان، ومزامنة MongoDB.',
    saving: 'جاري الحفظ في MongoDB...',
    savedSuccess: 'تم الحفظ في MongoDB بنجاح',
    savedError: 'تعذر الحفظ في MongoDB؛ تحقق من إعدادات الخادم',
    newNoteCreated: 'تم إنشاء ملاحظة جديدة',
    avatarApplied: 'تم تطبيق صورة شخصية الأنمي',
    untitled: 'بدون عنوان',
    colorPalette: 'لوحة الألوان',
    searchPlaceholder: 'بحث عن شخصيات...',
    uploadImage: 'رفع صورة',
    applyImage: 'تطبيق رابط الصورة',
    stickerLibrary: 'مكتبة الملصقات',
    chooseSticker: 'اختر ملصقًا مدمجًا',
    themeMode: 'وضع المظهر',
    normal: 'عادي',
    cute: 'مميز',
    numberStyle: 'نمط الأرقام',
    defaultNumber: 'افتراضي',
    tabularNumber: 'جدولي',
    oldstyleNumber: 'نمط قديم',
    paletteBlue: 'أزرق',
    paletteRose: 'وردي',
    paletteEmerald: 'زمردي',
    paletteAmber: 'كهرماني',
    paletteViolet: 'بنفسجي',
    paletteTeal: 'كحلي',
    paletteCoral: 'مرجاني',
    paletteLime: 'ليموني',
    paletteSky: 'سماوي',
    paletteFuchsia: 'فوشيا',
    backgroundNature: 'طبيعة',
    backgroundOcean: 'محيط',
    backgroundSunset: 'غروب',
    backgroundNight: 'ليل',
    backgroundForest: 'غابة',
    backgroundBeach: 'شاطئ',
    backgroundRain: 'مدينة ممطرة',
    backgroundAurora: 'شفق قطبي',
    backgroundDesert: 'صحراء',
    stickerSpark: 'شرارة',
    stickerCat: 'قطة',
    stickerBunny: 'أرنب',
    stickerBear: 'دب',
    stickerMoon: 'قمر',
    stickerFlower: 'زهرة',
    stickerRobot: 'روبوت',
    stickerStar: 'نجمة',
    stickerCloud: 'سحابة',
    stickerHeart: 'قلب',
    languageEnglish: 'الإنجليزية',
    languageSpanish: 'الإسبانية',
    languageFrench: 'الفرنسية',
    languageChinese: 'الصينية',
    languageArabic: 'العربية',
    languageHindi: 'الهندية',
    languageRussian: 'الروسية',
    languageJapanese: 'اليابانية',
    languageGerman: 'الألمانية',
    languagePortuguese: 'البرتغالية',
    languageOther: 'أخرى / مخصص',
  },
  hi: {
    appTitle: 'नोटपैड',
    newNote: 'नया',
    notesLabel: 'नोट्स',
    avatar: 'एनिमे पात्र',
    background: 'पृष्ठभूमि',
    fontFamily: 'फ़ॉन्ट शैली',
    language: 'भाषा',
    save: 'MongoDB में सहेजें',
    autosave: 'MongoDB के साथ सिंक करने के लिए तैयार',
    selectNote: 'लिखना शुरू करने के लिए एक नोट बनाएं या चुनें।',
    textPlaceholder: 'यहाँ अपना नोट लिखना शुरू करें...',
    titlePlaceholder: 'शीर्षक',
    personalization: 'व्यक्तिगत करें',
    customLanguage: 'कस्टम भाषा कोड',
    customFont: 'कस्टम फ़ॉन्ट-फ़ैमिली',
    animeUrl: 'एनिमे पात्र छवि URL',
    closePanel: 'बंद करें',
    languageCodePrefix: 'भाषा:',
    subtitle: 'एनिमे चरित्र अपलोड, पैलेट नियंत्रण और MongoDB सिंक के साथ न्यूनतम संपादक।',
    saving: 'MongoDB में सहेजा जा रहा है...',
    savedSuccess: 'MongoDB में सफलतापूर्वक सहेजा गया',
    savedError: 'MongoDB में सहेजने में असमर्थ; बैकएंड सेटिंग्स की जांच करें',
    newNoteCreated: 'नया नोट बनाया गया',
    avatarApplied: 'एनिमे पात्र छवि लागू की गई',
    untitled: 'बिना शीर्षक',
    colorPalette: 'रंग पैलेट',
    searchPlaceholder: 'पात्र खोजें...',
    uploadImage: 'छवि अपलोड करें',
    applyImage: 'छवि URL लागू करें',
    stickerLibrary: 'स्टिकर लाइब्रेरी',
    chooseSticker: 'एक अंतर्निहित स्टिकर चुनें',
    themeMode: 'थीम मोड',
    normal: 'सामान्य',
    cute: 'थीमयुक्त',
    numberStyle: 'संख्या शैली',
    defaultNumber: 'डिफ़ॉल्ट',
    tabularNumber: 'सारणीबद्ध',
    oldstyleNumber: 'ओल्डस्टाइल',
    paletteBlue: 'नीला',
    paletteRose: 'गुलाबी',
    paletteEmerald: 'पन्ना',
    paletteAmber: 'अंबर',
    paletteViolet: 'बैंगनी',
    paletteTeal: 'टीला नीला',
    paletteCoral: 'मूंगा',
    paletteLime: 'नींबू',
    paletteSky: 'आकाशी',
    paletteFuchsia: 'मैजेंटा',
    backgroundNature: 'प्रकृति',
    backgroundOcean: 'समुद्र',
    backgroundSunset: 'सूर्यास्त',
    backgroundNight: 'रात',
    backgroundForest: 'वन',
    backgroundBeach: 'तट',
    backgroundRain: 'बरसाती शहर',
    backgroundAurora: 'ध्रुवीय ज्योति',
    backgroundDesert: 'रेगिस्तान',
    stickerSpark: 'चमक',
    stickerCat: 'बिल्ली',
    stickerBunny: 'खरगोश',
    stickerBear: 'भालू',
    stickerMoon: 'चाँद',
    stickerFlower: 'फूल',
    stickerRobot: 'रोबोट',
    stickerStar: 'तारा',
    stickerCloud: 'बादल',
    stickerHeart: 'दिल',
    languageEnglish: 'अंग्रेज़ी',
    languageSpanish: 'स्पैनिश',
    languageFrench: 'फ़्रेंच',
    languageChinese: 'चीनी',
    languageArabic: 'अरबी',
    languageHindi: 'हिन्दी',
    languageRussian: 'रूसी',
    languageJapanese: 'जापानी',
    languageGerman: 'जर्मन',
    languagePortuguese: 'पुर्तगाली',
    languageOther: 'अन्य / कस्टम',
  },
  ru: {
    appTitle: 'Блокнот',
    newNote: 'Новый',
    notesLabel: 'Заметки',
    avatar: 'Аниме Персонажи',
    background: 'Фон',
    fontFamily: 'Стиль шрифта',
    language: 'Язык',
    save: 'Сохранить в MongoDB',
    autosave: 'Готов к синхронизации с MongoDB',
    selectNote: 'Создайте или выберите заметку, чтобы начать писать.',
    textPlaceholder: 'Начните вводить заметку здесь...',
    titlePlaceholder: 'Заголовок',
    personalization: 'Персонализация',
    customLanguage: 'Код языка',
    customFont: 'Шрифт пользователя',
    animeUrl: 'URL аниме-персонажа',
    closePanel: 'Закрыть',
    languageCodePrefix: 'Язык:',
    subtitle: 'Минималистичный редактор с загрузкой аниме-персонажей, управлением палитрой и синхронизацией с MongoDB.',
    saving: 'Сохранение в MongoDB...',
    savedSuccess: 'Сохранено в MongoDB',
    savedError: 'Не удалось сохранить в MongoDB; проверьте настройки',
    newNoteCreated: 'Создана новая заметка',
    avatarApplied: 'Изображение аниме-персонажа применено',
    untitled: 'Без названия',
    colorPalette: 'Цветовая палитра',
    searchPlaceholder: 'Поиск персонажей...',
    uploadImage: 'Загрузить фото',
    applyImage: 'Применить URL',
    stickerLibrary: 'Библиотека стикеров',
    chooseSticker: 'Выберите стикер',
    themeMode: 'Режим темы',
    normal: 'Обычный',
    cute: 'Стилизованный',
    numberStyle: 'Стиль цифр',
    defaultNumber: 'Стандарт',
    tabularNumber: 'Табличный',
    oldstyleNumber: 'Старостильный',
    paletteBlue: 'Синий',
    paletteRose: 'Розовый',
    paletteEmerald: 'Изумрудный',
    paletteAmber: 'Янтарный',
    paletteViolet: 'Фиолетовый',
    paletteTeal: 'Бирюзовый',
    paletteCoral: 'Коралловый',
    paletteLime: 'Лаймовый',
    paletteSky: 'Небесный',
    paletteFuchsia: 'Фуксия',
    backgroundNature: 'Природа',
    backgroundOcean: 'Океан',
    backgroundSunset: 'Закат',
    backgroundNight: 'Ночь',
    backgroundForest: 'Лес',
    backgroundBeach: 'Пляж',
    backgroundRain: 'Дождливый город',
    backgroundAurora: 'Сияние',
    backgroundDesert: 'Пустыня',
    stickerSpark: 'Искра',
    stickerCat: 'Кот',
    stickerBunny: 'Заяц',
    stickerBear: 'Мишка',
    stickerMoon: 'Луна',
    stickerFlower: 'Цветок',
    stickerRobot: 'Робот',
    stickerStar: 'Звезда',
    stickerCloud: 'Облако',
    stickerHeart: 'Сердце',
    languageEnglish: 'Английский',
    languageSpanish: 'Испанский',
    languageFrench: 'Французский',
    languageChinese: 'Китайский',
    languageArabic: 'Арабский',
    languageHindi: 'Хинди',
    languageRussian: 'Русский',
    languageJapanese: 'Японский',
    languageGerman: 'Немецкий',
    languagePortuguese: 'Португальский',
    languageOther: 'Другой / свой',
  },
  ja: {
    appTitle: 'メモ帳',
    newNote: '新規作成',
    notesLabel: 'メモ一覧',
    avatar: 'アニメキャラクター',
    background: '背景テーマ',
    fontFamily: 'フォントスタイル',
    language: '表示言語',
    save: 'MongoDBに保存',
    autosave: 'MongoDBと同期準備完了',
    selectNote: 'メモを作成または選択して入力を開始してください。',
    textPlaceholder: 'ここにメモを入力してください...',
    titlePlaceholder: 'タイトル',
    personalization: 'カスタマイズ',
    customLanguage: 'カスタム言語コード',
    customFont: 'カスタムフォント名',
    animeUrl: 'キャラクター画像URL',
    closePanel: '閉じる',
    languageCodePrefix: '言語:',
    subtitle: 'キャラクター選択、カラーパレット制御、MongoDB同期を備えたエディタ。',
    saving: 'MongoDBに保存中...',
    savedSuccess: 'MongoDBに保存しました',
    savedError: '保存できませんでした。設定を確認してください',
    newNoteCreated: '新しいメモが作成されました',
    avatarApplied: 'キャラクター画像を適用しました',
    untitled: '無題のメモ',
    colorPalette: 'カラーパレット',
    searchPlaceholder: 'キャラを検索...',
    uploadImage: '画像をアップロード',
    applyImage: '画像URLを適用',
    stickerLibrary: 'ステッカー',
    chooseSticker: 'ステッカーを選択',
    themeMode: 'テーマモード',
    normal: '通常',
    cute: 'デコ',
    numberStyle: '数字表示',
    defaultNumber: 'デフォルト',
    tabularNumber: '等幅数字',
    oldstyleNumber: 'オールドスタイル',
    paletteBlue: 'ブルー',
    paletteRose: 'ローズ',
    paletteEmerald: 'エメラルド',
    paletteAmber: 'アンバー',
    paletteViolet: 'バイオレット',
    paletteTeal: 'ティール',
    paletteCoral: 'コーラル',
    paletteLime: 'ライム',
    paletteSky: 'スカイ',
    paletteFuchsia: 'フューシャ',
    backgroundNature: '自然',
    backgroundOcean: '海',
    backgroundSunset: '夕暮れ',
    backgroundNight: '夜空',
    backgroundForest: '森',
    backgroundBeach: '砂浜',
    backgroundRain: '雨の街',
    backgroundAurora: 'オーロラ',
    backgroundDesert: '砂漠',
    stickerSpark: 'スパーク',
    stickerCat: 'ねこ',
    stickerBunny: 'うさぎ',
    stickerBear: 'くま',
    stickerMoon: 'つき',
    stickerFlower: 'はな',
    stickerRobot: 'ロボット',
    stickerStar: 'ほし',
    stickerCloud: 'くも',
    stickerHeart: 'ハート',
    languageEnglish: '英語',
    languageSpanish: 'スペイン語',
    languageFrench: 'フランス語',
    languageChinese: '中国語',
    languageArabic: 'アラビア語',
    languageHindi: 'ヒンディー語',
    languageRussian: 'ロシア語',
    languageJapanese: '日本語',
    languageGerman: 'ドイツ語',
    languagePortuguese: 'ポルトガル語',
    languageOther: 'その他 / カスタム',
  },
  de: {
    appTitle: 'Notizen',
    newNote: 'Neu',
    notesLabel: 'Notizen',
    avatar: 'Anime-Charaktere',
    background: 'Hintergrund',
    fontFamily: 'Schriftart',
    language: 'Sprache',
    save: 'Speichern in MongoDB',
    autosave: 'Bereit zur Synchronisierung',
    selectNote: 'Erstellen oder wählen Sie eine Notiz aus.',
    textPlaceholder: 'Schreiben Sie Ihre Notiz...',
    titlePlaceholder: 'Titel',
    personalization: 'Anpassen',
    customLanguage: 'Sprachcode',
    customFont: 'Schriftfamilie',
    animeUrl: 'Anime-Charakter Bild-URL',
    closePanel: 'Schließen',
    languageCodePrefix: 'Sprache:',
    subtitle: 'Minimaler Editor mit Anime-Charakter-Upload, Farbpalettensteuerung und MongoDB-Synchronisierung.',
    saving: 'Speichert in MongoDB...',
    savedSuccess: 'In MongoDB gespeichert',
    savedError: 'Speichern fehlgeschlagen; Backendeinstellungen prüfen',
    newNoteCreated: 'Neue Notiz erstellt',
    avatarApplied: 'Anime-Charakterbild angewendet',
    untitled: 'Unbenannt',
    colorPalette: 'Farbpalette',
    searchPlaceholder: 'Suchen...',
    uploadImage: 'Bild hochladen',
    applyImage: 'URL anwenden',
    stickerLibrary: 'Sticker-Bibliothek',
    chooseSticker: 'Wähle einen Sticker',
    themeMode: 'Themenmodus',
    normal: 'Normal',
    cute: 'Stylisiert',
    numberStyle: 'Zahlenformat',
    defaultNumber: 'Standard',
    tabularNumber: 'Tabellarisch',
    oldstyleNumber: 'Klassisch',
    paletteBlue: 'Blau',
    paletteRose: 'Rosa',
    paletteEmerald: 'Smaragd',
    paletteAmber: 'Bernstein',
    paletteViolet: 'Violett',
    paletteTeal: 'Teal',
    paletteCoral: 'Koralle',
    paletteLime: 'Limette',
    paletteSky: 'Himmel',
    paletteFuchsia: 'Fuchsia',
    backgroundNature: 'Natur',
    backgroundOcean: 'Ozean',
    backgroundSunset: 'Sonnenuntergang',
    backgroundNight: 'Nacht',
    backgroundForest: 'Wald',
    backgroundBeach: 'Strand',
    backgroundRain: 'Regnerische Stadt',
    backgroundAurora: 'Polarlicht',
    backgroundDesert: 'Wüste',
    stickerSpark: 'Funke',
    stickerCat: 'Katze',
    stickerBunny: 'Hase',
    stickerBear: 'Bär',
    stickerMoon: 'Mond',
    stickerFlower: 'Blume',
    stickerRobot: 'Roboter',
    stickerStar: 'Stern',
    stickerCloud: 'Wolke',
    stickerHeart: 'Herz',
    languageEnglish: 'Englisch',
    languageSpanish: 'Spanisch',
    languageFrench: 'Französisch',
    languageChinese: 'Chinesisch',
    languageArabic: 'Arabisch',
    languageHindi: 'Hindi',
    languageRussian: 'Russisch',
    languageJapanese: 'Japanisch',
    languageGerman: 'Deutsch',
    languagePortuguese: 'Portugiesisch',
    languageOther: 'Andere / Eigene',
  },
  pt: {
    appTitle: 'Bloco de Notas',
    newNote: 'Novo',
    notesLabel: 'Notas',
    avatar: 'Personagens de Anime',
    background: 'Plano de Fundo',
    fontFamily: 'Estilo da fonte',
    language: 'Idioma',
    save: 'Salvar no MongoDB',
    autosave: 'Pronto para sincronizar com o MongoDB',
    selectNote: 'Crie ou selecione uma nota para digitar.',
    textPlaceholder: 'Comece a digitar...',
    titlePlaceholder: 'Título',
    personalization: 'Personalizar',
    customLanguage: 'Código do idioma',
    customFont: 'Fonte personalizada',
    animeUrl: 'URL da imagem de anime',
    closePanel: 'Fechar',
    languageCodePrefix: 'Idioma:',
    subtitle: 'Editor minimalista com upload de personagens de anime, controles de paleta e sincronização com o MongoDB.',
    saving: 'Salvando no MongoDB...',
    savedSuccess: 'Salvo com sucesso',
    savedError: 'Erro ao salvar; verifique as configurações',
    newNoteCreated: 'Nova nota criada',
    avatarApplied: 'Imagem aplicada',
    untitled: 'Sem título',
    colorPalette: 'Paleta de cores',
    searchPlaceholder: 'Pesquisar...',
    uploadImage: 'Enviar imagem',
    applyImage: 'Aplicar URL',
    stickerLibrary: 'Biblioteca de adesivos',
    chooseSticker: 'Escolha um adesivo',
    themeMode: 'Modo de tema',
    normal: 'Normal',
    cute: 'Estilizado',
    numberStyle: 'Estilo de números',
    defaultNumber: 'Padrão',
    tabularNumber: 'Tabular',
    oldstyleNumber: 'Estilo antigo',
    paletteBlue: 'Azul',
    paletteRose: 'Rosa',
    paletteEmerald: 'Esmeralda',
    paletteAmber: 'Âmbar',
    paletteViolet: 'Violeta',
    paletteTeal: 'Ciano',
    paletteCoral: 'Coral',
    paletteLime: 'Lima',
    paletteSky: 'Celeste',
    paletteFuchsia: 'Fúcsia',
    backgroundNature: 'Natureza',
    backgroundOcean: 'Oceano',
    backgroundSunset: 'Pôr do sol',
    backgroundNight: 'Noite',
    backgroundForest: 'Floresta',
    backgroundBeach: 'Praia',
    backgroundRain: 'Cidade chuvosa',
    backgroundAurora: 'Aurora',
    backgroundDesert: 'Deserto',
    stickerSpark: 'Brilho',
    stickerCat: 'Gato',
    stickerBunny: 'Coelho',
    stickerBear: 'Urso',
    stickerMoon: 'Lua',
    stickerFlower: 'Flor',
    stickerRobot: 'Robô',
    stickerStar: 'Estrela',
    stickerCloud: 'Nuvem',
    stickerHeart: 'Coração',
    languageEnglish: 'Inglés',
    languageSpanish: 'Espanhol',
    languageFrench: 'Francês',
    languageChinese: 'Chinês',
    languageArabic: 'Árabe',
    languageHindi: 'Hindi',
    languageRussian: 'Russo',
    languageJapanese: 'Japonês',
    languageGerman: 'Alemão',
    languagePortuguese: 'Português',
    languageOther: 'Outro / personalizado',
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

const NUMBER_STYLES = [
  { labelKey: 'defaultNumber', value: 'normal' },
  { labelKey: 'tabularNumber', value: 'tabular-nums' },
  { labelKey: 'oldstyleNumber', value: 'oldstyle-nums' },
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
  const [uiText, setUiText] = useState(TRANSLATIONS.en)
  const [showSettings, setShowSettings] = useState(false)
  const [showCharacters, setShowCharacters] = useState(false)
  const [statusMessageKey, setStatusMessageKey] = useState('autosave')
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessageKey, setLoaderMessageKey] = useState('')
  const [avatarUrlInput, setAvatarUrlInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [themeMode, setThemeMode] = useState('normal')
  const [numberStyle, setNumberStyle] = useState(NUMBER_STYLES[0].value)
  const textareaRef = useRef(null)

  function t(key) {
    return uiText[key] || TRANSLATIONS.en[key] || key
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

  // Multi-Language loader
  useEffect(() => {
    const controller = new AbortController()
    async function loadLanguage() {
      const requested = language === 'custom' ? customLanguageCode.trim() : language
      if (!requested) return
      
      // If default language exists in local translations catalog, set it immediately
      if (TRANSLATIONS[requested]) {
        setUiText(TRANSLATIONS[requested])
        return
      }
      
      // Try fetching custom language from translation API fallback
      try {
        const response = await fetch(`${SERVER_ORIGIN}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ targetLanguage: requested, sourceText: TRANSLATIONS.en }),
        })
        if (!response.ok) throw new Error('translation_failed')
        const data = await response.json()
        if (data?.translations && typeof data.translations === 'object') {
          setUiText({ ...TRANSLATIONS.en, ...data.translations })
        } else {
          setUiText(TRANSLATIONS.en)
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        setUiText(TRANSLATIONS.en)
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

  function setStickerForActive(url) {
    updateActive({ avatar: url })
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        setStickerForActive(reader.result)
        setStatusMessageKey('avatarApplied')
      }
    }
    reader.readAsDataURL(file)
  }

  function applyAvatarUrl() {
    if (!avatarUrlInput.trim()) return
    setStickerForActive(avatarUrlInput.trim())
    setAvatarUrlInput('')
    setStatusMessageKey('avatarApplied')
  }

  async function saveToServer(note) {
    if (!note) return
    setIsLoading(true)
    setLoaderMessageKey('saving')
    try {
      const title = getNoteTitle(note)
      const payload = { id: note.id, title, body: note.body, avatar: note.avatar }
      const response = await fetch(`${SERVER_ORIGIN}/api/notes`, {
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
    fontVariantNumeric: numberStyle,
  }

  const filteredCharacters = ANIME_CHAR_OPTIONS.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const hasSettings = showSettings
  const hasCharacters = showCharacters
  const panelLayoutClass = hasSettings && hasCharacters 
    ? 'has-both-panels' 
    : (hasSettings || hasCharacters ? 'has-one-panel' : 'has-no-panels')

  return (
    <div
      className={`notepad app-shell bg-${backgroundTheme} ${themeMode === 'normal' ? 'normal' : backgroundTheme}`}
      style={getPaletteVars()}
    >
      <header className="app-header">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          {language === 'custom' && customLanguageCode ? (
            <p className="subtitle small">{t('languageCodePrefix')} {customLanguageCode}</p>
          ) : null}
        </div>
        <div className="app-actions">
          <button className="btn primary" type="button" onClick={createNote}>{t('newNote')}</button>
          <button className={`btn ${showCharacters ? 'active' : ''}`} type="button" onClick={() => setShowCharacters((c) => !c)}>{t('avatar')}</button>
          <button className={`btn ${showSettings ? 'active' : ''}`} type="button" onClick={() => setShowSettings((c) => !c)}>{t('personalization')}</button>
        </div>
      </header>

      <main className={`editor ${panelLayoutClass}`}>
        <div className="phone-frame">
          <div className="phone-statusbar">
            <span className="status-label">{t('notesLabel')}</span>
            <span className="status-label">12:48 • 100%</span>
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
                  <button className="btn" type="button" onClick={() => setShowCharacters((c) => !c)}>{t('avatar')}</button>
                  <button className="btn" type="button" onClick={() => setShowSettings((c) => !c)}>{t('personalization')}</button>
                </div>
                <small>{t(statusMessageKey)}</small>
              </div>
            </div>
          </div>
        </div>

        {/* Anime Characters panel beside personalization */}
        {showCharacters && (
          <aside className="personalization-card anime-characters-card">
            <div className="panel-header">
              <h2>{t('avatar')}</h2>
              <button className="btn icon" type="button" aria-label={t('closePanel')} onClick={() => setShowCharacters(false)}>×</button>
            </div>

            {/* Custom Character Upload / URL (removed from personalization) */}
            <div className="setting-group">
              <label>{t('uploadImage')}</label>
              <div className="avatar-upload-row">
                <label className="upload-label small">
                  {t('uploadImage')}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <input
                className="text-input"
                type="url"
                value={avatarUrlInput}
                onChange={(e) => setAvatarUrlInput(e.target.value)}
                placeholder={t('animeUrl')}
                style={{ marginTop: '6px' }}
              />
              <button className="btn" type="button" onClick={applyAvatarUrl}>{t('applyImage')}</button>
            </div>

            {/* Scrollable, Searchable list of 204 Anime Characters */}
            <div className="setting-group">
              <label>{t('avatar')}</label>
              <input
                className="text-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                style={{ marginBottom: '10px' }}
              />
              <div className="anime-char-scroll-area">
                <div className="sticker-grid">
                  {filteredCharacters.map((char) => (
                    <button
                      key={char.name}
                      type="button"
                      className={`sticker-chip ${active?.avatar === char.url ? 'active' : ''}`}
                      onClick={() => setStickerForActive(char.url)}
                      aria-pressed={active?.avatar === char.url}
                    >
                      <img src={char.url} alt={char.name} loading="lazy" />
                      <span>{char.name}</span>
                    </button>
                  ))}
                  {filteredCharacters.length === 0 && (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-soft)', margin: '20px 0' }}>
                      No characters found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Personalization panel */}
        {showSettings && (
          <aside className="personalization-card">
            <div className="panel-header">
              <h2>{t('personalization')}</h2>
              <button className="btn icon" type="button" aria-label={t('closePanel')} onClick={() => setShowSettings(false)}>×</button>
            </div>

            <div className="setting-group">
              <label>{t('stickerLibrary')}</label>
              <div className="sticker-grid">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker.name}
                    type="button"
                    className={`sticker-chip ${active?.avatar === sticker.url ? 'active' : ''}`}
                    onClick={() => setStickerForActive(sticker.url)}
                    aria-pressed={active?.avatar === sticker.url}
                  >
                    <img src={sticker.url} alt={t(`sticker${sticker.name}`)} />
                    <span>{t(`sticker${sticker.name}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label>{t('fontFamily')}</label>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                {FONT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
              <label>{t('numberStyle')}</label>
              <select value={numberStyle} onChange={(e) => setNumberStyle(e.target.value)}>
                {NUMBER_STYLES.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.labelKey)}</option>
                ))}
              </select>
            </div>

            <div className="setting-group">
              <label>{t('colorPalette')}</label>
              <div className="palette-grid">
                {COLOR_PALETTE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`palette-chip ${colorPalette === option.key ? 'active' : ''}`}
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
              <label>{t('themeMode')}</label>
              <div className="theme-row">
                <button className={`theme-chip ${themeMode === 'normal' ? 'active' : ''}`} onClick={() => setThemeMode('normal')}>{t('normal')}</button>
                <button className={`theme-chip ${themeMode === 'cute' ? 'active' : ''}`} onClick={() => setThemeMode('cute')}>{t('cute')}</button>
              </div>
              <label className="mt-12">{t('background')}</label>
              <div className="background-grid">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={`background-card ${backgroundTheme === option.key ? 'active' : ''}`}
                    type="button"
                    onClick={() => setBackgroundTheme(option.key)}
                    aria-pressed={backgroundTheme === option.key}
                  >
                    <span className={`background-preview bg-${option.key}`} aria-hidden="true" />
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
