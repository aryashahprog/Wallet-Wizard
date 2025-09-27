import { create } from "zustand";

export type Rule = { id: string; name: string; params?: Record<string, any>; emoji: string; activeForDate?: string };
export type Reminder = { date: string; message: string };
export type SimResult = { todaySavingsEstimate: number; overdraftProb?: number | null };
export type Streak = { days: number; lastAcceptedDate: string | null };

type DiffBuffer = {
  rule?: Rule;
  sim?: SimResult;
  reminder?: Reminder;
};

type State = {
  rules: Rule[];
  reminders: Reminder[];
  simResult: SimResult | null;
  streak: Streak;
  diff: DiffBuffer | null;

  // Cedar-style typed setters
  addRule: (r: Rule) => void;
  addReminder: (r: Reminder) => void;
  setSimResult: (s: SimResult) => void;
  incrementStreak: (todayISO: string) => void;

  // Diff controls
  setDiff: (d: DiffBuffer | null) => void;
  acceptDiff: (todayISO: string) => void;
  rejectDiff: () => void;
};

export const useAppStore = create<State>((set, get) => ({
  rules: [],
  reminders: [],
  simResult: null,
  streak: { days: 0, lastAcceptedDate: null },
  diff: null,

  addRule: (r) => set((s) => ({ rules: [r, ...s.rules] })),
  addReminder: (r) => set((s) => ({ reminders: [r, ...s.reminders] })),
  setSimResult: (sim) => set({ simResult: sim }),
  incrementStreak: (todayISO) =>
    set((s) =>
      s.streak.lastAcceptedDate === todayISO
        ? s
        : { streak: { days: s.streak.days + 1, lastAcceptedDate: todayISO } }
    ),

  setDiff: (d) => set({ diff: d }),
  acceptDiff: (todayISO) => {
    const d = get().diff;
    if (!d) return;
    if (d.rule) get().addRule({ ...d.rule, activeForDate: todayISO });
    if (d.reminder) get().addReminder(d.reminder);
    if (d.sim) get().setSimResult(d.sim);
    get().incrementStreak(todayISO);
    set({ diff: null });
  },
  rejectDiff: () => set({ diff: null }),
}));
