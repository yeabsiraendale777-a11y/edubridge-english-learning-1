import { motion } from "framer-motion";
import {
  Fire,
  Moon,
  SpeakerHigh,
  Sun,
  GraduationCap,
} from "@phosphor-icons/react";
import { LEVELS } from "@/data/learningData";
import type { Level } from "@/types";

interface HeaderNavProps {
  level: Level;
  onLevelChange: (level: Level) => void;
  progressPct: number;
  streak: number;
  dark: boolean;
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onHome: () => void;
}

export default function HeaderNav({
  level,
  onLevelChange,
  progressPct,
  streak,
  dark,
  onToggleTheme,
  soundOn,
  onToggleSound,
  onHome,
}: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onHome}
          className="flex items-center gap-2.5 rounded-xl pr-2 text-left transition active:scale-[0.98]"
          aria-label="EduBridge Ethiopia home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-900 text-amber-400 shadow-sm dark:bg-emerald-800">
            <GraduationCap size={22} weight="fill" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-[15px] font-semibold leading-tight tracking-tight text-emerald-950 dark:text-emerald-50">
              EduBridge Ethiopia
            </span>
            <span className="block text-[11px] leading-tight text-emerald-700/70 dark:text-emerald-300/70">
              English for Amharic speakers
            </span>
          </span>
        </button>

        <div className="ml-auto hidden items-center gap-1 rounded-full bg-emerald-50 p-1 lg:flex dark:bg-white/5">
          {LEVELS.map((item) => {
            const active = item.id === level;
            return (
              <button
                key={item.id}
                onClick={() => onLevelChange(item.id)}
                className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-[0.97] ${
                  active
                    ? "text-white"
                    : "text-emerald-800/70 hover:text-emerald-900 dark:text-emerald-300/70 dark:hover:text-emerald-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="level-pill"
                    className="absolute inset-0 rounded-full bg-emerald-800 dark:bg-emerald-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
                <span className="relative ml-1 text-[10px] font-normal opacity-80">
                  {item.labelAm}
                </span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <span
            className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
            title="Daily streak"
          >
            <Fire size={14} weight="fill" />
            {streak}
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 sm:flex dark:bg-white/5 dark:text-emerald-200">
            {progressPct}%
          </span>
          <button
            onClick={onToggleSound}
            aria-label={soundOn ? "Mute audio" : "Unmute audio"}
            className={`flex size-9 items-center justify-center rounded-xl border border-emerald-900/10 text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.96] dark:border-white/10 dark:text-emerald-200 dark:hover:bg-white/5 ${
              soundOn ? "" : "opacity-45"
            }`}
          >
            <SpeakerHigh size={18} weight={soundOn ? "fill" : "regular"} />
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="flex size-9 items-center justify-center rounded-xl border border-emerald-900/10 text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.96] dark:border-white/10 dark:text-emerald-200 dark:hover:bg-white/5"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-emerald-900/5 px-3 py-2 lg:hidden dark:border-white/5">
        {LEVELS.map((item) => {
          const active = item.id === level;
          return (
            <button
              key={item.id}
              onClick={() => onLevelChange(item.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition active:scale-[0.97] ${
                active
                  ? "bg-emerald-800 text-white dark:bg-emerald-600"
                  : "bg-emerald-50 text-emerald-800/80 dark:bg-white/5 dark:text-emerald-200/80"
              }`}
            >
              {item.label} · {item.labelAm}
            </button>
          );
        })}
      </div>

      <div className="h-0.5 w-full bg-emerald-900/5 dark:bg-white/5">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </header>
  );
}