import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChatCircleText,
  CheckCircle,
  Fire,
  Headphones,
  Lightning,
  ListChecks,
  Sparkle,
  Star,
  Target,
  TextAa,
  Trophy,
} from "@phosphor-icons/react";
import { LEVELS, MODULES, getLevelMeta } from "@/data/learningData";
import type { Level, ModuleId, QuizResult } from "@/types";

interface DashboardProps {
  level: Level;
  onLevelChange: (level: Level) => void;
  completed: string[];
  streak: number;
  masteredWords: number;
  quizResults: QuizResult[];
  progressPct: number;
  dailyDone: number;
  dailyGoal: number;
  onOpenModule: (id: ModuleId) => void;
}

const ICONS: Record<ModuleId, typeof BookOpen> = {
  alphabet: TextAa,
  dialogue: ChatCircleText,
  grammar: ListChecks,
  skills: Sparkle,
  listening: Headphones,
  quiz: Trophy,
};

function Stat({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white p-3.5 dark:border-white/10 dark:bg-zinc-900">
      <span className={`flex size-9 items-center justify-center rounded-xl ${tint}`}>
        <Icon size={18} weight="fill" />
      </span>
      <span>
        <span className="block text-lg font-bold leading-none text-emerald-950 dark:text-emerald-50">
          {value}
        </span>
        <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-emerald-800/60 dark:text-emerald-300/60">
          {label}
        </span>
      </span>
    </div>
  );
}

export default function Dashboard({
  level,
  onLevelChange,
  completed,
  streak,
  masteredWords,
  quizResults,
  progressPct,
  dailyDone,
  dailyGoal,
  onOpenModule,
}: DashboardProps) {
  const meta = getLevelMeta(level);
  const avgScore = quizResults.length
    ? Math.round(
        (quizResults.reduce((sum, r) => sum + r.score / r.total, 0) /
          quizResults.length) *
          100,
      )
    : 0;
  const levelModules = MODULES;
  const doneCount = levelModules.filter((m) =>
    completed.includes(`${level}:${m.id}`),
  ).length;
  const todayPct = Math.min(100, Math.round((dailyDone / dailyGoal) * 100));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-emerald-950 text-emerald-50 dark:border-white/10">
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-amber-400/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
              <Sparkle size={13} weight="fill" />
              {meta.label} · {meta.labelAm}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl">
              Welcome back. Let us learn English today.
            </h1>
            <p className="mt-2 text-lg font-medium text-amber-300" lang="am">
              እንኳን ደህና መጡ! ዛሬ እንግሊዝኛ እንማር።
            </p>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-emerald-100/75">
              {meta.tagline}. Short lessons, dual Amharic support and audio you
              can replay as often as you need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenModule("alphabet")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                Start today's lesson <ArrowRight size={16} weight="bold" />
              </button>
              <button
                onClick={() => onOpenModule("quiz")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.98]"
              >
                <Target size={16} /> Take a quick quiz
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <Donut value={progressPct} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
                  Pathway progress
                </p>
                <p className="mt-1 text-2xl font-bold leading-none">
                  {doneCount}/{levelModules.length} modules
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-amber-300">
                  <Fire size={13} weight="fill" /> {streak} day streak
                </p>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-200/70">
                <span>Daily goal</span>
                <span>
                  {dailyDone}/{dailyGoal} activities
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full rounded-full bg-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${todayPct}%` }}
                  transition={{ type: "spring", stiffness: 110, damping: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={BookOpen}
          label="Words mastered"
          value={String(masteredWords)}
          tint="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
        />
        <Stat
          icon={Trophy}
          label="Quizzes done"
          value={String(quizResults.length)}
          tint="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
        />
        <Stat
          icon={Star}
          label="Average score"
          value={`${avgScore}%`}
          tint="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
        />
        <Stat
          icon={Lightning}
          label="Streak days"
          value={String(streak)}
          tint="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
        />
      </section>

      {/* Level selector */}
      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
          Choose your pathway
        </h2>
        <p className="mt-1 text-sm text-emerald-800/60 dark:text-emerald-300/60">
          Switch levels anytime. Your progress is saved per level.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LEVELS.map((item) => {
            const active = item.id === level;
            return (
              <button
                key={item.id}
                onClick={() => onLevelChange(item.id)}
                className={`rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                  active
                    ? "border-emerald-800 bg-emerald-800 text-white shadow-lg shadow-emerald-900/15"
                    : "border-emerald-900/10 bg-white text-emerald-950 hover:border-emerald-800/40 dark:border-white/10 dark:bg-zinc-900 dark:text-emerald-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{item.label}</span>
                  {active ? (
                    <CheckCircle size={18} weight="fill" className="text-amber-300" />
                  ) : (
                    <span className="text-xs font-semibold text-emerald-800/40 dark:text-emerald-300/40">
                      {item.labelAm}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1 block text-xs font-medium ${
                    active
                      ? "text-amber-300"
                      : "text-emerald-800/60 dark:text-emerald-300/60"
                  }`}
                  lang="am"
                >
                  {item.labelAm}
                </span>
                <span
                  className={`mt-2 block text-xs leading-relaxed ${
                    active ? "text-white/80" : "text-emerald-900/60 dark:text-emerald-200/60"
                  }`}
                >
                  {item.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Modules */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
            Learning modules
          </h2>
          <span className="text-xs font-medium text-emerald-800/50 dark:text-emerald-300/50">
            {meta.label} pathway
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {levelModules.map((mod) => {
            const Icon = ICONS[mod.id];
            const isDone = completed.includes(`${level}:${mod.id}`);
            return (
              <motion.button
                key={mod.id}
                onClick={() => onOpenModule(mod.id)}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group flex h-full flex-col rounded-2xl border border-emerald-900/10 bg-white p-5 text-left transition hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-900/5 dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-amber-300 dark:bg-white/5 dark:text-emerald-300">
                    <Icon size={21} weight="fill" />
                  </span>
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <CheckCircle size={11} weight="fill" /> Done
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800/70 dark:bg-white/5 dark:text-emerald-300/70">
                      {mod.lessons} lessons
                    </span>
                  )}
                </div>
                <h3 className="mt-3.5 text-[15px] font-bold leading-tight text-emerald-950 dark:text-emerald-50">
                  {mod.title}
                </h3>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400" lang="am">
                  {mod.titleAm}
                </p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-emerald-900/60 dark:text-emerald-200/60">
                  {mod.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Open module
                  <ArrowRight
                    size={13}
                    weight="bold"
                    className="transition group-hover:translate-x-0.5"
                  />
                  <span className="ml-auto font-medium text-emerald-800/40 dark:text-emerald-300/40">
                    ~{mod.minutes} min
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Donut({ value }: { value: number }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="8"
      />
      <motion.circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#fbbf24"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        transform="rotate(-90 40 40)"
      />
      <text
        x="40"
        y="45"
        textAnchor="middle"
        className="fill-white text-[15px] font-bold"
      >
        {value}%
      </text>
    </svg>
  );
}