import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowClockwise,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Headphones,
  Lightning,
  PencilSimple,
  Play,
  Sparkle,
  SpeakerHigh,
  Target,
  Trophy,
  XCircle,
} from "@phosphor-icons/react";
import {
  MINIMAL_PAIRS,
  QUIZ_BANK,
  READINGS,
  SPELLING,
  VOCAB,
} from "@/data/learningData";
import { playError, playSuccess, speak, speakSlow } from "@/utils/speech";
import type { Level, ModuleId } from "@/types";

const CARD =
  "rounded-2xl border border-emerald-900/10 bg-white dark:border-white/10 dark:bg-zinc-900";

interface SkillsLabProps {
  moduleId: ModuleId;
  level: Level;
  onQuizFinish: (score: number, total: number) => void;
}

export default function SkillsLab({ moduleId, level, onQuizFinish }: SkillsLabProps) {
  if (moduleId === "listening") return <ListeningLab level={level} />;
  if (moduleId === "quiz") return <QuizLab level={level} onFinish={onQuizFinish} />;
  return <SkillsSuite level={level} />;
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

/* ---------------- Skills Suite: flashcards / reading / spelling ---------------- */

function SkillsSuite({ level }: { level: Level }) {
  const [tab, setTab] = useState("flashcards");
  return (
    <div className="space-y-4">
      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "flashcards", label: "Flashcards" },
          { id: "reading", label: "Reading" },
          { id: "spelling", label: "Spelling" },
        ]}
      />
      {tab === "flashcards" && <Flashcards level={level} />}
      {tab === "reading" && <ReadingRoom level={level} />}
      {tab === "spelling" && <SpellingDrill level={level} />}
    </div>
  );
}

function Flashcards({ level }: { level: Level }) {
  const deck = useMemo(() => {
    const pool = VOCAB.filter((v) => v.level === level);
    return pool.length ? pool : VOCAB;
  }, [level]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const card = deck[index % deck.length];

  const next = (knew: boolean) => {
    if (knew) {
      setKnown((k) => k + 1);
      playSuccess();
    } else {
      playError();
    }
    setFlipped(false);
    setIndex((i) => (i + 1) % deck.length);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-emerald-800/60 dark:text-emerald-300/60">
        <span>
          Card {(index % deck.length) + 1} of {deck.length}
        </span>
        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
          <CheckCircle size={13} weight="fill" /> {known} known
        </span>
      </div>

      <button
        onClick={() => {
          setFlipped((f) => !f);
          if (!flipped) speak(card.english);
        }}
        className="block w-full text-left"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-52 w-full"
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
              {card.english}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-800/45 dark:text-emerald-300/45">
              {card.phonetic} · {card.category}
            </p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Tap to reveal Amharic
            </p>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-emerald-900 p-6 text-white"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-2xl font-bold" lang="am">
              {card.amharic}
            </p>
            <p className="mt-2 max-w-[42ch] text-center text-xs leading-relaxed text-white/70">
              {card.example}
            </p>
          </div>
        </motion.div>
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => next(false)}
          className="flex-1 rounded-xl border border-emerald-900/15 py-2.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-50 active:scale-[0.98] dark:border-white/15 dark:text-emerald-100 dark:hover:bg-white/5"
        >
          Need more practice
        </button>
        <button
          onClick={() => next(true)}
          className="flex-1 rounded-xl bg-emerald-800 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          I know this
        </button>
      </div>
    </div>
  );
}

function ReadingRoom({ level }: { level: Level }) {
  const pool = READINGS.filter((r) => r.level === level);
  const list = pool.length ? pool : READINGS;
  const [id, setId] = useState(list[0].id);
  const [picked, setPicked] = useState<string | null>(null);
  const [term, setTerm] = useState<string | null>(null);

  const passage = list.find((p) => p.id === id) ?? list[0];
  const tokens = passage.text.split(/(\s+)/);
  const isCorrect = picked === passage.answer;

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <div className="space-y-2">
        {list.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setId(p.id);
              setPicked(null);
              setTerm(null);
            }}
            className={`w-full rounded-xl border p-3 text-left text-[13px] font-bold transition active:scale-[0.99] ${
              p.id === id
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-emerald-900/10 bg-white text-emerald-950 dark:border-white/10 dark:bg-zinc-900 dark:text-emerald-50"
            }`}
          >
            <BookOpen size={14} weight="fill" className="mb-1" />
            {p.title}
          </button>
        ))}
      </div>

      <div className={`${CARD} p-4 sm:p-5`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
            {passage.title}
          </h3>
          <button
            onClick={() => speak(passage.text, 0.9)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-800 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
          >
            <Play size={12} weight="fill" /> Read aloud
          </button>
        </div>

        <p className="mt-3 text-sm leading-[1.85] text-emerald-950/85 dark:text-emerald-50/85">
          {tokens.map((token, i) => {
            const clean = token.replace(/[^a-zA-Z']/g, "").toLowerCase();
            const hit = passage.glossary.find((g) => g.word.toLowerCase() === clean);
            if (!hit) return <span key={i}>{token}</span>;
            return (
              <button
                key={i}
                onClick={() => setTerm(hit.amharic)}
                className="rounded bg-amber-100 px-0.5 font-semibold text-amber-800 underline decoration-amber-400 decoration-dotted underline-offset-2 dark:bg-amber-500/20 dark:text-amber-300"
              >
                {token}
              </button>
            );
          })}
        </p>

        {term && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" lang="am">
            Glossary: {term}
          </p>
        )}

        <div className="mt-4 rounded-xl bg-emerald-50/70 p-3 dark:bg-white/5">
          <p className="text-xs font-bold text-emerald-950 dark:text-emerald-50">
            {passage.question}
          </p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {passage.options.map((opt) => {
              const chosen = picked === opt;
              const correct = opt === passage.answer;
              const state = !picked
                ? "border-emerald-900/15 text-emerald-900 dark:border-white/15 dark:text-emerald-100"
                : correct
                  ? "border-emerald-600 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200"
                  : chosen
                    ? "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200"
                    : "border-emerald-900/10 text-emerald-900/40 dark:border-white/10 dark:text-emerald-100/40";
              return (
                <button
                  key={opt}
                  onClick={() => {
                    setPicked(opt);
                    if (opt === passage.answer) playSuccess();
                    else playError();
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition active:scale-[0.98] ${state}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked && (
            <p className={`mt-2 text-xs font-bold ${isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
              {isCorrect
                ? "Correct — ትክክል ነው!"
                : `Not quite. The answer is: ${passage.answer}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SpellingDrill({ level }: { level: Level }) {
  const pool = SPELLING.filter((s) => s.level === level);
  const list = pool.length ? pool : SPELLING;
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "right" | "wrong">("idle");

  const item = list[index % list.length];

  const check = () => {
    const ok = value.trim().toLowerCase() === item.answer.toLowerCase();
    setStatus(ok ? "right" : "wrong");
    if (ok) playSuccess();
    else playError();
  };

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-800/50 dark:text-emerald-300/50">
        <PencilSimple size={14} weight="fill" /> Drill {(index % list.length) + 1} of{" "}
        {list.length}
      </div>
      <p className="mt-3 text-lg font-semibold leading-snug text-emerald-950 dark:text-emerald-50">
        {item.sentence.replace("___", "_____")}
      </p>
      <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400" lang="am">
        ፍንጭ፦ {item.hintAm}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          placeholder="Type the missing word"
          className="min-w-0 flex-1 rounded-xl border border-emerald-900/15 bg-white px-3 py-2.5 text-sm font-semibold text-emerald-950 outline-none focus:border-emerald-700 dark:border-white/15 dark:bg-zinc-950 dark:text-emerald-50"
        />
        <button
          onClick={check}
          className="rounded-xl bg-emerald-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Check
        </button>
      </div>

      <div className="mt-3 flex min-h-9 items-center gap-2">
        {status === "right" && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <CheckCircle size={16} weight="fill" /> Correct — ጥሩ ሥራ!
          </span>
        )}
        {status === "wrong" && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
            <XCircle size={16} weight="fill" /> Try again. Hint: {item.answer.length} letters
          </span>
        )}
        {status === "right" && (
          <button
            onClick={() => {
              setIndex((i) => i + 1);
              setValue("");
              setStatus("idle");
            }}
            className="ml-auto flex items-center gap-1 rounded-lg border border-emerald-900/15 px-3 py-1.5 text-[11px] font-bold text-emerald-900 transition hover:bg-emerald-50 dark:border-white/15 dark:text-emerald-100 dark:hover:bg-white/5"
          >
            Next drill <ArrowRight size={12} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Listening lab ---------------- */

function ListeningLab({ level }: { level: Level }) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [slow, setSlow] = useState(false);

  const play = (word: string) => (slow ? speakSlow(word) : speak(word));

  return (
    <div className="space-y-4">
      <div className={`${CARD} flex flex-wrap items-center gap-3 p-4`}>
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-900 text-amber-300">
          <Headphones size={19} weight="fill" />
        </span>
        <div className="mr-auto">
          <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">
            Minimal pairs · {level} comparisons
          </p>
          <p className="text-xs text-emerald-800/60 dark:text-emerald-300/60">
            Listen twice, then choose which sound you actually heard.
          </p>
        </div>
        <button
          onClick={() => setSlow((s) => !s)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
            slow
              ? "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
              : "border-emerald-900/15 text-emerald-900 dark:border-white/15 dark:text-emerald-100"
          }`}
        >
          {slow ? "Slow mode on" : "Slow mode off"}
        </button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {MINIMAL_PAIRS.map((pair) => {
          const open = revealed.includes(pair.id);
          return (
            <div key={pair.id} className={`${CARD} p-4`}>
              <div className="grid grid-cols-2 gap-2">
                {[pair.a, pair.b].map((word) => (
                  <button
                    key={word}
                    onClick={() => play(word)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100 active:scale-[0.98] dark:bg-white/5 dark:text-emerald-100 dark:hover:bg-white/10"
                  >
                    <SpeakerHigh size={15} weight="fill" /> {word}
                  </button>
                ))}
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <button
                  onClick={() =>
                    setRevealed((r) =>
                      r.includes(pair.id)
                        ? r.filter((x) => x !== pair.id)
                        : [...r, pair.id],
                    )
                  }
                  className="text-[11px] font-bold text-emerald-800/60 underline-offset-2 hover:underline dark:text-emerald-300/60"
                >
                  {open ? "Hide hint" : "Show Amharic hint"}
                </button>
                <button
                  onClick={() => [play(pair.a), window.setTimeout(() => play(pair.b), 900)]}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:underline dark:text-amber-400"
                >
                  <Lightning size={12} weight="fill" /> compare both
                </button>
              </div>
              {open && (
                <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" lang="am">
                  {pair.hintAm}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Quiz lab ---------------- */

function QuizLab({
  level,
  onFinish,
}: {
  level: Level;
  onFinish: (score: number, total: number) => void;
}) {
  const bank = useMemo(() => {
    const pool = QUIZ_BANK.filter((q) => q.level === level);
    return (pool.length ? pool : QUIZ_BANK).slice(0, 10);
  }, [level]);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = bank[index];
  const isLast = index === bank.length - 1;

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === question.answer) {
      setScore((s) => s + 1);
      playSuccess();
    } else {
      playError();
    }
  };

  const advance = () => {
    if (isLast) {
      setDone(true);
      onFinish(score, bank.length);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / bank.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${CARD} p-8 text-center`}
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-400 text-emerald-950">
          <Trophy size={30} weight="fill" />
        </span>
        <p className="mt-4 text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
          {pct}%
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-800/70 dark:text-emerald-300/70">
          You answered {score} of {bank.length} correctly.
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400" lang="am">
          {pct >= 80 ? "በጣም ጥሩ! ቀጥሉ።" : "ጥሩ ጅምር ነው — እንደገና ይሞክሩ።"}
        </p>
        <button
          onClick={restart}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <ArrowClockwise size={15} /> Retake quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-800 px-2.5 py-1 text-[11px] font-bold text-white">
          <Target size={12} weight="fill" /> {index + 1}/{bank.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-amber-500"
            animate={{ width: `${((index + (picked ? 1 : 0)) / bank.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
        <span className="text-[11px] font-bold text-emerald-800/60 dark:text-emerald-300/60">
          {score} correct
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className={`${CARD} p-5`}
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800/50 dark:text-emerald-300/50">
            <Sparkle size={12} weight="fill" />
            {question.kind === "listening"
              ? "Listening check"
              : question.kind === "translate"
                ? "Translation"
                : "Multiple choice"}
          </div>
          <p className="mt-2 text-base font-bold leading-snug text-emerald-950 dark:text-emerald-50">
            {question.prompt}
          </p>
          <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400" lang="am">
            {question.promptAm}
          </p>

          {question.kind === "listening" && (
            <button
              onClick={() => speak(question.answer)}
              className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              <SpeakerHigh size={14} weight="fill" /> Play the audio
            </button>
          )}

          <div className="mt-4 grid gap-2">
            {question.options.map((option) => {
              const correct = option === question.answer;
              const chosen = picked === option;
              const cls = !picked
                ? "border-emerald-900/15 text-emerald-900 hover:border-emerald-700 hover:bg-emerald-50 dark:border-white/15 dark:text-emerald-100 dark:hover:bg-white/5"
                : correct
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200"
                  : chosen
                    ? "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200"
                    : "border-emerald-900/10 text-emerald-900/35 dark:border-white/10 dark:text-emerald-100/35";
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  disabled={picked !== null}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition active:scale-[0.99] ${cls}`}
                >
                  {option}
                  {picked && correct && <CheckCircle size={16} weight="fill" />}
                  {picked && chosen && !correct && <XCircle size={16} weight="fill" />}
                </button>
              );
            })}
          </div>

          {picked && (
            <div className="mt-3 rounded-xl bg-emerald-50/80 p-3 dark:bg-white/5">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400" lang="am">
                {question.explanationAm}
              </p>
              <button
                onClick={advance}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.97]"
              >
                {isLast ? "See results" : "Next question"}
                <ArrowRight size={13} weight="bold" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}