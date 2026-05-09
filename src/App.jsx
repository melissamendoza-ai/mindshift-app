import { useEffect, useState } from 'react';

const translations = {
  en: {
    welcome:
      'Welcome to your daily momentum dashboard. Build better habits one small win at a time.',
    language: 'Language',
    cards: ['Daily Missions', 'Emergency Mode', 'Progress', 'Rewards'],
  },
  es: {
    welcome:
      'Bienvenido a tu panel de impulso diario. Construye mejores hábitos con pequeñas victorias cada día.',
    language: 'Idioma',
    cards: ['Misiones diarias', 'Modo emergencia', 'Progreso', 'Recompensas'],
  },
};

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const STORAGE_KEY = 'mindshift-language';

function App() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-12">
        <header className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 shadow-[0_0_25px_rgba(16,185,129,0.12)] backdrop-blur-sm sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">MindShift</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">MindShift</h1>
          <p className="mt-2 text-base text-slate-300 sm:text-lg">Small choices. Big change.</p>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">{t.welcome}</p>

          <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
            <label htmlFor="language" className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              {t.language}
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="rounded-xl border border-amber-400/40 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {t.cards.map((card) => (
            <article
              key={card}
              className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 shadow-[0_10px_30px_rgba(2,6,23,0.45)] transition hover:border-emerald-500/40 hover:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-100">{card}</h2>
              <p className="mt-2 text-sm text-slate-400">Coming soon.</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
