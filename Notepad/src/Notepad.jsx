import React, { useEffect, useState, useRef } from 'react'
import './Notepad.css'

const SERVER_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:4000'

const DEFAULT_AVATARS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="24" fill="%23f5f1ff"/><circle cx="60" cy="54" r="34" fill="%23fff8f0"/><path d="M34 76c8 10 24 10 36 0" stroke="%233963ff" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="46" cy="50" rx="8" ry="12" fill="%23022e5c"/><ellipse cx="74" cy="50" rx="8" ry="12" fill="%23022e5c"/><path d="M30 32c12-12 36-12 48 0" stroke="%23ff9cdb" stroke-width="8" fill="none" stroke-linecap="round"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="24" fill="%23e8f7ff"/><circle cx="60" cy="56" r="34" fill="%23fffdf0"/><path d="M30 72c10 12 40 12 50 0" stroke="%23205773" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="50" rx="7" ry="13" fill="%23071c2c"/><ellipse cx="76" cy="50" rx="7" ry="13" fill="%23071c2c"/><path d="M34 30c10-10 40-10 48 0" stroke="%23ffb44b" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
]

const TRANSLATIONS = {
  en: {
    appTitle: 'Notepad',
    newNote: 'New',
    avatar: 'Anime Character',
    themeMode: 'Theme mode',
    normal: 'Normal',
    cute: 'Stylized',
    background: 'Background',
    fontFamily: 'Font style',
    numberStyle: 'Number style',
    language: 'Language',
    save: 'Save to MySQL',
    autosave: 'Ready to save to database',
    selectNote: 'Create a note to start typing.',
    textPlaceholder: 'Start typing your note here...',
    personalization: 'Personalize',
    customLanguage: 'Custom language code',
    customFont: 'Custom font-family',
    animeUrl: 'Anime character image URL',
  },
  es: {
    appTitle: 'Bloc de notas',
    newNote: 'Nueva',
    avatar: 'Personaje Anime',
    themeMode: 'Tema',
    normal: 'Normal',
    cute: 'Estilizado',
    background: 'Fondo',
    fontFamily: 'Estilo de letra',
    numberStyle: 'Estilo numérico',
    language: 'Idioma',
    save: 'Guardar en MySQL',
    autosave: 'Listo para guardar en la base de datos',
    selectNote: 'Crea una nota para comenzar.',
    textPlaceholder: 'Empieza a escribir tu nota aquí...',
    personalization: 'Personalizar',
    customLanguage: 'Código de idioma personalizado',
    customFont: 'Fuente personalizada',
    animeUrl: 'URL de imagen del personaje anime',
  },
  fr: {
    appTitle: 'Bloc-notes',
    newNote: 'Nouveau',
    avatar: 'Personnage animé',
    themeMode: 'Thème',
    normal: 'Normal',
    cute: 'Stylisé',
    background: 'Fond',
    fontFamily: 'Style de police',
    numberStyle: 'Style numérique',
    language: 'Langue',
    save: 'Enregistrer dans MySQL',
    autosave: 'Prêt à enregistrer dans la base de données',
    selectNote: 'Créez une note pour commencer.',
    textPlaceholder: 'Commencez à écrire votre note ici...',
    personalization: 'Personnaliser',
    customLanguage: 'Code de langue personnalisé',
    customFont: 'Police personnalisée',
    animeUrl: 'URL de l’image de personnage anime',
  },
}

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ru', label: 'Русский' },
  { value: 'ja', label: '日本語' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'custom', label: 'Other / custom' },
]

const FONT_OPTIONS = [
  { label: 'Inter / Sans serif', value: 'Inter, sans-serif' },
  { label: 'Georgia / Serif', value: 'Georgia, serif' },
  { label: 'Courier New / Monospace', value: 'Courier New, monospace' },
  { label: 'Brush Script / Cursive', value: 'Brush Script MT, cursive' },
  { label: 'Segoe UI', value: 'Segoe UI, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Palatino', value: 'Palatino Linotype, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
]

const NUMBER_STYLES = [
  { label: 'Default', value: 'normal' },
  { label: 'Tabular', value: 'tabular-nums' },
  { label: 'Oldstyle', value: 'oldstyle-nums' },
]

const BACKGROUND_OPTIONS = [
  { key: 'nature', label: 'Nature' },
  { key: 'ocean', label: 'Ocean' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'night', label: 'Night' },
]

export default function Notepad() {
  const [notes, setNotes] = useState([
    { id: Date.now(), title: 'Untitled', body: '', avatar: DEFAULT_AVATARS[0] },
  ])
  const [activeId, setActiveId] = useState(notes[0]?.id)
  const [language, setLanguage] = useState('en')
  const [customLanguageCode, setCustomLanguageCode] = useState('')
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [customFontFamily, setCustomFontFamily] = useState('')
  const [numberStyle, setNumberStyle] = useState(NUMBER_STYLES[0].value)
  const [themeMode, setThemeMode] = useState('normal')
  const [backgroundTheme, setBackgroundTheme] = useState('nature')
  const [showSettings, setShowSettings] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('')
  const [avatarUrlInput, setAvatarUrlInput] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!activeId && notes.length) setActiveId(notes[0].id)
  }, [notes, activeId])

  function t(key) {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key
  }

  function getEffectiveFont() {
    return customFontFamily.trim() || fontFamily
  }

  function createNote() {
    const note = { id: Date.now(), title: 'Untitled', body: '', avatar: DEFAULT_AVATARS[0] }
    setNotes((current) => [note, ...current])
    setActiveId(note.id)
    setStatusMessage('New note created')
  }

  function updateActive(changes) {
    setNotes((current) => current.map((note) => (note.id === activeId ? { ...note, ...changes } : note)))
  }

  function onEdit(field, value) {
    updateActive({ [field]: value })
  }

  function setAvatarForActive(url) {
    updateActive({ avatar: url })
  }

  function handleAvatarUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) setAvatarForActive(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function applyAvatarUrl() {
    if (!avatarUrlInput.trim()) return
    setAvatarForActive(avatarUrlInput.trim())
    setAvatarUrlInput('')
    setStatusMessage('Anime character image applied')
  }

  async function saveToServer(note) {
    if (!note) return
    setIsLoading(true)
    setLoaderMessage('Saving to MySQL...')
    try {
      const payload = {
        id: note.id,
        title: note.title,
        body: note.body,
        avatar: note.avatar,
      }
      const response = await fetch(`${SERVER_ORIGIN}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('save_failed')
      setStatusMessage('Saved to MySQL successfully')
    } catch (error) {
      console.error(error)
      setStatusMessage('Unable to save to MySQL; check backend settings')
    } finally {
      setIsLoading(false)
    }
  }

  const active = notes.find((note) => note.id === activeId) || notes[0]

  const editorStyle = {
    fontFamily: getEffectiveFont(),
    fontVariantNumeric: numberStyle,
  }

  return (
    <div className={`notepad app-shell ${themeMode === 'normal' ? 'normal' : backgroundTheme}`}>
      <header className="app-header">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="subtitle">Minimal editor with anime character upload and MySQL save.</p>
          {customLanguageCode ? <p className="subtitle small">Language: {customLanguageCode}</p> : null}
        </div>
        <div className="app-actions">
          <button className="btn primary" onClick={createNote}>{t('newNote')}</button>
          <button className="btn" onClick={() => setShowSettings((current) => !current)}>{t('personalization')}</button>
        </div>
      </header>

      <main className="editor">
        <div className="phone-frame">
          <div className="phone-statusbar">
            <span className="status-label">Notes</span>
            <span className="status-label">12:48 • 100%</span>
          </div>

          <div className="phone-screen">
            <div className="editor-inner">
              <div className="editor-top">
                <div className="active-avatar">
                  {active?.avatar ? (
                    <img src={active.avatar} alt="Anime character" width={96} height={96} />
                  ) : (
                    <div className="avatar-placeholder">Anime</div>
                  )}
                </div>

                <div className="title-group">
                  <input
                    className="title"
                    value={active?.title || ''}
                    onChange={(e) => onEdit('title', e.target.value)}
                    placeholder="Title"
                    style={{ fontFamily: getEffectiveFont() }}
                  />
                  <select
                    className="note-selector"
                    value={active?.id || ''}
                    onChange={(e) => setActiveId(Number(e.target.value))}
                  >
                    {notes.map((note) => (
                      <option key={note.id} value={note.id}>{note.title || 'Untitled'}</option>
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
                  <button className="btn primary" onClick={() => saveToServer(active)}>{t('save')}</button>
                  <button className="btn" onClick={() => setShowSettings(true)}>{t('personalization')}</button>
                </div>
                <small>{statusMessage || t('autosave')}</small>
              </div>
            </div>
          </div>
        </div>

        {showSettings && (
          <aside className="personalization-card">
            <div className="panel-header">
              <h2>{t('personalization')}</h2>
              <button className="btn icon" onClick={() => setShowSettings(false)}>×</button>
            </div>

            <div className="setting-group">
              <label>{t('avatar')}</label>
              <div className="avatar-upload-row">
                <label className="upload-label small">Upload image
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                </label>
              </div>
              <input
                className="text-input"
                value={avatarUrlInput}
                onChange={(e) => setAvatarUrlInput(e.target.value)}
                placeholder={t('animeUrl')}
              />
              <button className="btn" onClick={applyAvatarUrl}>Apply image URL</button>
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
              <label>{t('language')}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
              <div className="theme-row">
                {BACKGROUND_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={`theme-chip ${backgroundTheme === option.key ? 'active' : ''}`}
                    onClick={() => setBackgroundTheme(option.key)}
                  >
                    {option.label}
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
              <p>{loaderMessage}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
