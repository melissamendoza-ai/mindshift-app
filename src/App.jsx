import { useEffect, useMemo, useState } from 'react';

const sections = ['dashboard', 'dailyMissions', 'emergencyMode', 'progress', 'rewards'];

const missionDefinitions = [
  { id: 'half-cigarette', points: 20 },
  { id: 'wait-3-hours', points: 30 },
  { id: 'drink-water', points: 10 },
  { id: 'walk-10-min', points: 15 },
  { id: 'write-feelings', points: 10 },
];

const translations = {
  en: {
    language: 'Language',
    welcome:
      'Welcome to your daily momentum dashboard. Build better habits one small win at a time.',
    nav: {
      dashboard: 'Dashboard',
      dailyMissions: 'Daily Missions',
      emergencyMode: 'Emergency Mode',
      progress: 'Progress',
      rewards: 'Rewards',
    },
    placeholders: {
      dashboard: 'Your daily mindset dashboard will appear here.',
      emergencyMode: 'Emergency support tools will appear here.',
      progress: 'Your progress and streaks will appear here.',
      rewards: 'Your rewards will appear here.',
    },
    dailyMissions: {
      summaryPoints: "Today's Points",
      summaryCompleted: 'Missions Completed',
      pointsLabel: 'points',
      complete: 'Complete',
      completed: 'Completed',
      titles: {
        'half-cigarette': 'Smoke only half a cigarette',
        'wait-3-hours': 'Wait 3 hours before the next cigarette',
        'drink-water': 'Drink water when a craving starts',
        'walk-10-min': 'Walk for 10 minutes',
        'write-feelings': 'Write how I felt today',
      },
    },
  },
  es: {
    language: 'Idioma',
    welcome:
      'Bienvenido a tu panel de impulso diario. Construye mejores hábitos con pequeñas victorias cada día.',
    nav: {
      dashboard: 'Inicio',
      dailyMissions: 'Misiones diarias',
      emergencyMode: 'Modo emergencia',
      progress: 'Progreso',
      rewards: 'Recompensas',
    },
    placeholders: {
      dashboard: 'Tu panel diario de mentalidad aparecerá aquí.',
      emergencyMode: 'Tus herramientas de apoyo de emergencia aparecerán aquí.',
      progress: 'Tu progreso y rachas aparecerán aquí.',
      rewards: 'Tus recompensas aparecerán aquí.',
    },
    dailyMissions: {
      summaryPoints: 'Puntos de hoy',
      summaryCompleted: 'Misiones completadas',
      pointsLabel: 'puntos',
      complete: 'Completar',
      completed: 'Completada',
      titles: {
        'half-cigarette': 'Fumar solo medio cigarro',
        'wait-3-hours': 'Esperar 3 horas antes del siguiente cigarro',
        'drink-water': 'Tomar agua cuando empiece un antojo',
        'walk-10-min': 'Caminar 10 minutos',
        'write-feelings': 'Escribir cómo me sentí hoy',
      },
    },
  },
};

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const LANGUAGE_STORAGE_KEY = 'mindshift-language';
const DAILY_MISSIONS_STORAGE_PREFIX = 'mindshift-daily-missions';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getStorageKeyForDate = (dateKey) => `${DAILY_MISSIONS_STORAGE_PREFIX}-${dateKey}`;

const loadDailyProgress = (dateKey) => {
  const raw = localStorage.getItem(getStorageKeyForDate(dateKey));
  if (!raw) {
    return { completedMissionIds: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.completedMissionIds)) {
      return { completedMissionIds: parsed.completedMissionIds };
    }
  } catch {
    return { completedMissionIds: [] };
  }

  return { completedMissionIds: [] };
};

function App() {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [completedMissionIds, setCompletedMissionIds] = useState([]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const loaded = loadDailyProgress(todayKey);
    setCompletedMissionIds(loaded.completedMissionIds);
  }, [todayKey]);

  useEffect(() => {
    localStorage.setItem(
      getStorageKeyForDate(todayKey),
      JSON.stringify({ completedMissionIds }),
    );
  }, [todayKey, completedMissionIds]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextTodayKey = getTodayKey();
      setTodayKey((current) => (current === nextTodayKey ? current : nextTodayKey));
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  };

  const t = translations[language];

  const completedMissionSet = useMemo(() => new Set(completedMissionIds), [completedMissionIds]);

  const todayPoints = useMemo(
    () =>
      missionDefinitions.reduce(
        (total, mission) => (completedMissionSet.has(mission.id) ? total + mission.points : total),
        0,
      ),
    [completedMissionSet],
  );

  const completeMission = (missionId) => {
    setCompletedMissionIds((current) => {
      if (current.includes(missionId)) {
        return current;
      }
      return [...current, missionId];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-12">
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

        <nav className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2 sm:p-3">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {sections.map((section) => {
              const isActive = activeSection === section;
              return (
                <li key={section}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(section)}
                    className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'border border-emerald-400/70 bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'border border-transparent bg-slate-800/80 text-slate-300 hover:border-amber-400/40 hover:text-amber-200'
                    }`}
                  >
                    {t.nav[section]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="rounded-2xl border border-slate-800 bg-slate-900/75 p-6 shadow-[0_10px_30px_rgba(2,6,23,0.45)] sm:p-8">
          {activeSection === 'dailyMissions' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">{t.nav.dailyMissions}</h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-200/80">{t.dailyMissions.summaryPoints}</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-200">{todayPoints}</p>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-amber-200/80">{t.dailyMissions.summaryCompleted}</p>
                  <p className="mt-1 text-2xl font-bold text-amber-200">
                    {completedMissionIds.length}/{missionDefinitions.length}
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {missionDefinitions.map((mission) => {
                  const isCompleted = completedMissionSet.has(mission.id);
                  return (
                    <li
                      key={mission.id}
                      className={`rounded-xl border p-4 transition ${
                        isCompleted
                          ? 'border-emerald-400/45 bg-emerald-500/10'
                          : 'border-slate-800 bg-slate-900/70'
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-medium text-slate-100">{t.dailyMissions.titles[mission.id]}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            +{mission.points} {t.dailyMissions.pointsLabel}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isCompleted}
                          onClick={() => completeMission(mission.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            isCompleted
                              ? 'cursor-not-allowed border border-emerald-500/40 bg-emerald-500/20 text-emerald-200'
                              : 'border border-amber-400/50 bg-amber-500/15 text-amber-100 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-100'
                          }`}
                        >
                          {isCompleted ? t.dailyMissions.completed : t.dailyMissions.complete}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">{t.nav[activeSection]}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {t.placeholders[activeSection]}
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
