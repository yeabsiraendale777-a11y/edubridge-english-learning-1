import { useCallback, useEffect, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import HeaderNav from "@/components/HeaderNav";
import ModuleViewer from "@/components/ModuleViewer";
import { MODULES } from "@/data/learningData";
import { playPop, setSoundEnabled } from "@/utils/speech";
import type { Level, ModuleId, QuizResult, UserProgress } from "@/types";

const PROGRESS_KEY = "edubridge-progress-v1";
const THEME_KEY = "edubridge-theme";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultProgress(): UserProgress {
  return {
    level: "beginner",
    completed: [],
    masteredWords: [],
    quizResults: [],
    streak: 1,
    lastActive: todayKey(),
    dailyGoal: 4,
    dailyDone: 0,
  };
}

function loadProgress(): UserProgress {
  const base = defaultProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const merged: UserProgress = {
      ...base,
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      masteredWords: Array.isArray(parsed.masteredWords) ? parsed.masteredWords : [],
      quizResults: Array.isArray(parsed.quizResults) ? parsed.quizResults : [],
    };
    if (merged.lastActive !== todayKey()) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      merged.streak =
        merged.lastActive === yesterday.toISOString().slice(0, 10)
          ? merged.streak + 1
          : 1;
      merged.dailyDone = 0;
      merged.lastActive = todayKey();
    }
    return merged;
  } catch {
    return base;
  }
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [level, setLevel] = useState<Level>(() => loadProgress().level);
  const [view, setView] = useState<ModuleId | "dashboard">("dashboard");
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#09090b" : "#ffffff");
    } catch {
      /* storage unavailable */
    }
  }, [dark]);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  const changeLevel = useCallback((next: Level) => {
    setLevel(next);
    setProgress((prev) => ({ ...prev, level: next }));
    playPop();
  }, []);

  const completeModule = useCallback(
    (moduleId: ModuleId) => {
      setProgress((prev) => {
        const key = `${level}:${moduleId}`;
        if (prev.completed.includes(key)) return prev;
        return {
          ...prev,
          completed: [...prev.completed, key],
          dailyDone: Math.min(prev.dailyGoal, prev.dailyDone + 1),
        };
      });
      playPop();
    },
    [level],
  );

  const toggleMastered = useCallback((wordId: string) => {
    setProgress((prev) => ({
      ...prev,
      masteredWords: prev.masteredWords.includes(wordId)
        ? prev.masteredWords.filter((id) => id !== wordId)
        : [...prev.masteredWords, wordId],
    }));
  }, []);

  const recordQuiz = useCallback(
    (score: number, total: number) => {
      const result: QuizResult = {
        id: `${Date.now()}`,
        level,
        moduleId: "quiz",
        score,
        total,
        date: todayKey(),
      };
      setProgress((prev) => ({
        ...prev,
        quizResults: [...prev.quizResults, result],
        completed: prev.completed.includes(`${level}:quiz`)
          ? prev.completed
          : [...prev.completed, `${level}:quiz`],
        dailyDone: Math.min(prev.dailyGoal, prev.dailyDone + 1),
      }));
    },
    [level],
  );

  const completedForLevel = useMemo(
    () =>
      progress.completed
        .filter((key) => key.startsWith(`${level}:`))
        .map((key) => key.split(":")[1] as ModuleId),
    [progress.completed, level],
  );

  const progressPct = Math.round(
    (completedForLevel.length / MODULES.length) * 100,
  );

  return (
    <div className="min-h-screen bg-stone-50 text-emerald-950 antialiased dark:bg-zinc-950 dark:text-emerald-50">
      <HeaderNav
        level={level}
        onLevelChange={changeLevel}
        progressPct={progressPct}
        streak={progress.streak}
        dark={dark}
        onToggleTheme={() => setDark((d) => !d)}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
        onHome={() => setView("dashboard")}
      />

      <main>
        {view === "dashboard" ? (
          <Dashboard
            level={level}
            onLevelChange={changeLevel}
            completed={progress.completed}
            streak={progress.streak}
            masteredWords={progress.masteredWords.length}
            quizResults={progress.quizResults}
            progressPct={progressPct}
            dailyDone={progress.dailyDone}
            dailyGoal={progress.dailyGoal}
            onOpenModule={setView}
          />
        ) : (
          <ModuleViewer
            moduleId={view}
            level={level}
            mastered={progress.masteredWords}
            onBack={() => setView("dashboard")}
            onComplete={completeModule}
            onToggleMastered={toggleMastered}
            onQuizFinish={recordQuiz}
          />
        )}
      </main>

      <footer className="border-t border-emerald-900/10 bg-white/60 px-4 py-8 dark:border-white/10 dark:bg-zinc-900/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-emerald-900/70 dark:text-emerald-100/70">
            EduBridge Ethiopia · English Learning Pathway
          </p>
          <p className="text-xs text-emerald-800/50 dark:text-emerald-300/50" lang="am">
            እንግሊዝኛን በአማርኛ ይማሩ · በየቀኑ ትንሽ ትንሽ።
          </p>
        </div>
      </footer>
    </div>
  );
}