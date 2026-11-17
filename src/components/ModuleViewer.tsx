import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  ChatCircleText,
  Clock,
  Lightning,
  ListChecks,
  MagnifyingGlass,
  Play,
  SpeakerHigh,
  TextAa,
  Translate,
} from "@phosphor-icons/react";
import {
  ALPHABET,
  DIALOGUES,
  GRAMMAR_RULES,
  MODULES,
  VOCAB,
  VOCAB_CATEGORIES,
  getLevelMeta,
} from "@/data/learningData";
import { speak, speakSlow } from "@/utils/speech";
import SkillsLab from "@/components/SkillsLab";
import type { Level, ModuleId } from "@/types";

interface ModuleViewerProps {
  moduleId: ModuleId;
  level: Level;
  mastered: string[];
  onBack: () => void;
  onComplete: (moduleId: ModuleId) => void;
  onToggleMastered: (wordId: string) => void;
  onQuizFinish: (score: number, total: number) => void;
}

const CARD =
  "rounded-2xl border border-emerald-900/10 bg-white dark:border-white/10 dark:bg-zinc-900";

function SpeakButtons({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => speak(text)}
        aria-label={`Listen to ${text}`}
        className="flex size-8 items-center justify-center rounded-lg bg-emerald-800 text-white transition hover:bg-emerald-700 active:scale-95"
      >
        <SpeakerHigh size={14} weight="fill" />
      </button>
      <button
        onClick={() => speakSlow(text)}
        aria-label={`Listen slowly to ${text}`}
        className="flex size-8 items-center justify-center rounded-lg border border-emerald-800/20 text-emerald-800 transition hover:bg-emerald-50 active:scale-95 dark:border-white/15 dark:text-emerald-200 dark:hover:bg-white/5"
      >
        <Clock size={14} />
      </button>
    </div>
  );
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-emerald-50 p-1 dark:bg-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition active:scale-[0.98] ${
            active === tab.id
              ? "bg-white text-emerald-900 shadow-sm dark:bg-zinc-800 dark:text-emerald-100"
              : "text-emerald-800/60 dark:text-emerald-300/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function ModuleViewer({
  moduleId,
  level,
  mastered,
  onBack,
  onComplete,
  onToggleMastered,
  onQuizFinish,
}: ModuleViewerProps) {
  const meta = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];
  const levelMeta = getLevelMeta(level);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 px-3 py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-[0.98] dark:border-white/10 dark:text-emerald-100 dark:hover:bg-white/5"
        >
          <ArrowLeft size={14} weight="bold" /> Dashboard
        </button>
        <div className="mr-auto">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-emerald-950 dark:text-emerald-50">
            {meta.title}
          </h1>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400" lang="am">
            {meta.titleAm} · {levelMeta.labelAm}
          </p>
        </div>
        <button
          onClick={() => onComplete(moduleId)}
          className="rounded-xl bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Mark lesson complete
        </button>
      </div>

      <div className="mt-5">
        {moduleId === "alphabet" && (
          <AlphabetAndVocab mastered={mastered} onToggleMastered={onToggleMastered} />
        )}
        {moduleId === "dialogue" && <DialogueLab level={level} />}
        {moduleId === "grammar" && <GrammarStudio level={level} />}
        {(moduleId === "skills" || moduleId === "listening" || moduleId === "quiz") && (
          <SkillsLab
            moduleId={moduleId}
            level={level}
            onQuizFinish={onQuizFinish}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Alphabet + Vocabulary ---------------- */

function AlphabetAndVocab({
  mastered,
  onToggleMastered,
}: {
  mastered: string[];
  onToggleMastered: (wordId: string) => void;
}) {
  const [tab, setTab] = useState("alphabet");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [showAmharic, setShowAmharic] = useState(true);

  const words = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VOCAB.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        (!q ||
          item.english.toLowerCase().includes(q) ||
          item.amharic.includes(q)),
    );
  }, [category, query]);

  return (
    <div className="space-y-4">
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "alphabet", label: "Alphabet A to Z" },
          { id: "vocab", label: "Vocabulary" },
        ]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "alphabet" ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {ALPHABET.map((card) => (
                <div key={card.letter} className={`${CARD} p-3.5`}>
                  <div className="flex items-start justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-900 text-base font-bold text-amber-300">
                      {card.letter}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" lang="am">
                      {card.sound}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-bold text-emerald-950 dark:text-emerald-50">
                    {card.word}
                  </p>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400" lang="am">
                    {card.amharic}
                  </p>
                  <div className="mt-2.5">
                    <SpeakButtons text={card.word} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-zinc-900">
                  <MagnifyingGlass size={15} className="text-emerald-800/50 dark:text-emerald-300/50" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search English or አማርኛ"
                    className="w-44 bg-transparent text-sm text-emerald-950 outline-none placeholder:text-emerald-800/40 dark:text-emerald-50 dark:placeholder:text-emerald-300/40"
                  />
                </div>
                <button
                  onClick={() => setShowAmharic((v) => !v)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-900/10 px-3 py-2 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-[0.98] dark:border-white/10 dark:text-emerald-100 dark:hover:bg-white/5"
                >
                  <Translate size={14} />
                  {showAmharic ? "Hide Amharic" : "Show Amharic"}
                </button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {["All", ...VOCAB_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
                      category === cat
                        ? "bg-emerald-800 text-white"
                        : "bg-emerald-50 text-emerald-800/70 hover:bg-emerald-100 dark:bg-white/5 dark:text-emerald-300/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {words.length === 0 ? (
                <p className={`${CARD} p-8 text-center text-sm font-medium text-emerald-800/60 dark:text-emerald-300/60`}>
                  No words match this search yet. Try another English or Amharic
                  word.
                </p>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {words.map((word) => {
                    const isMastered = mastered.includes(word.id);
                    return (
                      <div key={word.id} className={`${CARD} p-3.5`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
                              {word.english}
                            </p>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-800/50 dark:text-emerald-300/50">
                              {word.phonetic} · {word.category}
                            </p>
                          </div>
                          <button
                            onClick={() => onToggleMastered(word.id)}
                            aria-label="Toggle mastered"
                            className={`shrink-0 rounded-lg p-1 transition active:scale-90 ${
                              isMastered
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-emerald-900/20 hover:text-emerald-700 dark:text-white/20"
                            }`}
                          >
                            <CheckCircle size={20} weight={isMastered ? "fill" : "regular"} />
                          </button>
                        </div>
                        {showAmharic && (
                          <p className="mt-1 text-sm font-semibold text-amber-700 dark:text-amber-400" lang="am">
                            {word.amharic}
                          </p>
                        )}
                        <p className="mt-2 text-xs leading-relaxed text-emerald-900/60 dark:text-emerald-200/60">
                          {word.example}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <SpeakButtons text={word.english} />
                          <button
                            onClick={() => speak(word.example)}
                            className="text-[11px] font-bold text-emerald-800/60 underline-offset-2 hover:underline dark:text-emerald-300/60"
                          >
                            hear in sentence
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Dialogues ---------------- */

function DialogueLab({ level }: { level: Level }) {
  const pool = DIALOGUES.filter((d) => d.level === level);
  const list = pool.length ? pool : DIALOGUES;
  const [activeId, setActiveId] = useState(list[0].id);
  const [roleplay, setRoleplay] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const timers = useRef<number[]>([]);

  const active = list.find((d) => d.id === activeId) ?? list[0];

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  const playAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    active.turns.forEach((turn, i) => {
      const id = window.setTimeout(() => speak(turn.english), i * 3200);
      timers.current.push(id);
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        {list.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setActiveId(d.id);
              setRevealed([]);
            }}
            className={`w-full rounded-xl border p-3 text-left transition active:scale-[0.99] ${
              d.id === activeId
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-emerald-900/10 bg-white text-emerald-950 hover:border-emerald-800/40 dark:border-white/10 dark:bg-zinc-900 dark:text-emerald-50"
            }`}
          >
            <span className="flex items-center gap-1.5 text-[13px] font-bold">
              <ChatCircleText size={14} weight="fill" /> {d.title}
            </span>
            <span
              className={`mt-0.5 block text-[11px] ${
                d.id === activeId ? "text-amber-300" : "text-emerald-800/60 dark:text-emerald-300/60"
              }`}
              lang="am"
            >
              {d.titleAm}
            </span>
            <span
              className={`mt-1 block text-[11px] ${
                d.id === activeId ? "text-white/60" : "text-emerald-800/40 dark:text-emerald-300/40"
              }`}
            >
              {d.place}
            </span>
          </button>
        ))}
      </div>

      <div className={`${CARD} p-4 sm:p-5`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={playAll}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            <Play size={13} weight="fill" /> Play dialogue
          </button>
          <button
            onClick={() => {
              setRoleplay((v) => !v);
              setRevealed([]);
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
              roleplay
                ? "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                : "border-emerald-900/15 text-emerald-900 dark:border-white/15 dark:text-emerald-100"
            }`}
          >
            {roleplay ? "Role-play on" : "Role-play off"}
          </button>
          <span className="ml-auto text-[11px] font-semibold text-emerald-800/50 dark:text-emerald-300/50">
            {active.turns.length} turns
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {active.turns.map((turn, i) => {
            const isYou = turn.speaker === "You";
            const hidden = roleplay && isYou && !revealed.includes(i);
            return (
              <motion.div
                key={`${active.id}-${i}`}
                initial={{ opacity: 0, x: isYou ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`max-w-[92%] rounded-2xl p-3 ${
                  isYou
                    ? "ml-auto bg-emerald-800 text-white"
                    : "bg-emerald-50 text-emerald-950 dark:bg-white/5 dark:text-emerald-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isYou ? "text-amber-300" : "text-emerald-700/70 dark:text-emerald-300/70"}`}>
                    {turn.speaker}
                  </span>
                  <button
                    onClick={() => speak(turn.english)}
                    aria-label="Listen to line"
                    className={`rounded p-1 transition active:scale-90 ${isYou ? "text-amber-300" : "text-emerald-800/60 dark:text-emerald-300/60"}`}
                  >
                    <SpeakerHigh size={14} weight="fill" />
                  </button>
                </div>
                {hidden ? (
                  <button
                    onClick={() => setRevealed((r) => [...r, i])}
                    className="mt-1 w-full rounded-lg border border-dashed border-white/40 py-1.5 text-left text-xs font-semibold text-white/70"
                  >
                    Tap to reveal your line
                  </button>
                ) : (
                  <p className="mt-1 text-sm font-semibold leading-snug">{turn.english}</p>
                )}
                <p
                  className={`mt-1 text-xs leading-snug ${isYou ? "text-white/75" : "text-amber-700 dark:text-amber-400"}`}
                  lang="am"
                >
                  {turn.amharic}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Grammar ---------------- */

function GrammarStudio({ level }: { level: Level }) {
  const pool = GRAMMAR_RULES.filter((r) => r.level === level);
  const rules = pool.length ? pool : GRAMMAR_RULES;
  const [activeId, setActiveId] = useState(rules[0].id);
  const rule = rules.find((r) => r.id === activeId) ?? rules[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div className="space-y-2">
        {rules.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveId(r.id)}
            className={`flex w-full items-center gap-2 rounded-xl border p-3 text-left transition active:scale-[0.99] ${
              r.id === activeId
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-zinc-900 dark:text-emerald-50"
            }`}
          >
            <ListChecks size={16} weight="fill" className="shrink-0" />
            <span>
              <span className="block text-[13px] font-bold">{r.title}</span>
              <span
                className={`block text-[11px] ${r.id === activeId ? "text-amber-300" : "text-emerald-800/60 dark:text-emerald-300/60"}`}
                lang="am"
              >
                {r.titleAm}
              </span>
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={rule.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className={`${CARD} p-4`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/50 dark:text-emerald-300/50">
            Formula
          </p>
          <p className="mt-1.5 rounded-lg bg-emerald-900 px-3 py-2.5 font-mono text-[13px] font-semibold text-amber-300">
            {rule.formula}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-emerald-900/75 dark:text-emerald-100/75">
            {rule.explanation}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400" lang="am">
            {rule.explanationAm}
          </p>
        </div>

        <div className={`${CARD} p-4`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/50 dark:text-emerald-300/50">
            Examples
          </p>
          <div className="mt-2 space-y-2">
            {rule.examples.map((ex) => (
              <div
                key={ex.en}
                className="flex items-start justify-between gap-3 rounded-xl bg-emerald-50/70 p-2.5 dark:bg-white/5"
              >
                <div>
                  <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                    {ex.en}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400" lang="am">
                    {ex.am}
                  </p>
                </div>
                <SpeakButtons text={ex.en} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            <Lightning size={14} weight="fill" /> Watch out
          </p>
          <p className="mt-1.5 text-sm font-medium text-rose-900 dark:text-rose-100">
            {rule.pitfall}
          </p>
          <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-300/80" lang="am">
            {rule.pitfallAm}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { TabBar, CARD, SpeakButtons, TextAa };