export type Level = "beginner" | "intermediate" | "advanced";

export type ModuleId =
  | "alphabet"
  | "dialogue"
  | "grammar"
  | "skills"
  | "listening"
  | "quiz";

export interface LevelMeta {
  id: Level;
  label: string;
  labelAm: string;
  tagline: string;
}

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  titleAm: string;
  blurb: string;
  lessons: number;
  minutes: number;
}

export interface AlphabetCard {
  letter: string;
  word: string;
  amharic: string;
  sound: string;
}

export type VocabCategory =
  | "Greetings"
  | "Family"
  | "Market & Food"
  | "Work"
  | "Travel"
  | "Health";

export interface VocabItem {
  id: string;
  english: string;
  amharic: string;
  phonetic: string;
  category: VocabCategory;
  level: Level;
  example: string;
  exampleAm: string;
}

export interface DialogueTurn {
  speaker: string;
  english: string;
  amharic: string;
}

export interface Dialogue {
  id: string;
  title: string;
  titleAm: string;
  place: string;
  level: Level;
  turns: DialogueTurn[];
}

export interface GrammarExample {
  en: string;
  am: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  titleAm: string;
  level: Level;
  formula: string;
  explanation: string;
  explanationAm: string;
  examples: GrammarExample[];
  pitfall: string;
  pitfallAm: string;
}

export interface GlossaryTerm {
  word: string;
  amharic: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: Level;
  text: string;
  glossary: GlossaryTerm[];
  question: string;
  options: string[];
  answer: string;
}

export interface SpellingExercise {
  id: string;
  sentence: string;
  answer: string;
  hintAm: string;
  level: Level;
}

export interface MinimalPair {
  id: string;
  a: string;
  b: string;
  hintAm: string;
}

export type QuestionKind = "multiple-choice" | "translate" | "listening";

export interface QuizQuestion {
  id: string;
  level: Level;
  moduleId: ModuleId;
  kind: QuestionKind;
  prompt: string;
  promptAm: string;
  options: string[];
  answer: string;
  explanationAm: string;
}

export interface QuizResult {
  id: string;
  level: Level;
  moduleId: ModuleId;
  score: number;
  total: number;
  date: string;
}

export interface UserProgress {
  level: Level;
  completed: string[];
  masteredWords: string[];
  quizResults: QuizResult[];
  streak: number;
  lastActive: string;
  dailyGoal: number;
  dailyDone: number;
}