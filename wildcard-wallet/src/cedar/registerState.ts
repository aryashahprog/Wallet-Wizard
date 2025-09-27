import { useMemo } from 'react'
import { z } from 'zod'
import {
  useRegisterState,
  useDiffState,
  useDiffStateOperations,
} from './react-shim'

export type Rule = {
  id: string
  name: string
  emoji: string
  params: Record<string, any>
  activeForDate?: string
}

const RuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  params: z.record(z.any()),
  activeForDate: z.string().optional(),
})

const ReminderSchema = z.object({
  id: z.string(),
  date: z.string(),
  message: z.string(),
})

const SimResultSchema = z.object({
  todaySavingsEstimate: z.number(),
  overdraftProb: z.number().optional(),
})

const StreakSchema = z.object({
  days: z.number(),
  lastAcceptedDate: z.string().optional(),
})

export function useAppState() {
  // rules
  const [rules, rulesSetters] = useRegisterState<Rule[]>(
    'rules',
    [],
    {
      addRule: (prev: Rule[], args: Rule): Rule[] => {
        const parsed = RuleSchema.safeParse(args)
        if (!parsed.success) throw new Error('Invalid rule')
        const today = new Date().toISOString().slice(0, 10)
        const filtered = (prev ?? []).filter((r: Rule) => r.activeForDate !== today)
        return [...filtered, { ...args, activeForDate: today }]
      },
    }
  )

  // reminders
  const [reminders] = useRegisterState<z.infer<typeof ReminderSchema>[]>(
    'reminders',
    [],
    {
      addReminder: (prev: z.infer<typeof ReminderSchema>[], args: z.infer<typeof ReminderSchema>) => {
        const parsed = ReminderSchema.safeParse(args)
        if (!parsed.success) throw new Error('Invalid reminder')
        return [...(prev ?? []), args]
      },
    }
  )

  // sim result with holdAccept diff mode
  const [simResult] = useDiffState<z.infer<typeof SimResultSchema> | null>(
    'simResult',
    null,
    { description: 'Savings/risk estimate', diffMode: 'holdAccept' }
  )

  const ops = useDiffStateOperations('simResult')

  const [streak, streakSetters] = useRegisterState<z.infer<typeof StreakSchema>>(
    'streak',
    { days: 0, lastAcceptedDate: undefined },
    {
      incrementStreak: (prev) => {
        const today = new Date().toISOString().slice(0, 10)
        if (prev?.lastAcceptedDate === today) return prev
        const days = (prev?.days ?? 0) + 1
        return { days, lastAcceptedDate: today }
      },
    }
  )

  return useMemo(() => ({
    rules,
    reminders,
    simResult,
    streak: streak ?? { days: 0 },
    rulesSetters,
    streakSetters,
    ops,
    setSimResult: (args: z.infer<typeof SimResultSchema>) => {
      const parsed = SimResultSchema.safeParse(args)
      if (!parsed.success) throw new Error('Invalid sim result')
      return parsed.data
    },
  }), [rules, reminders, simResult, streak, rulesSetters, streakSetters, ops])
}

