import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { create } from 'zustand'

type DiffRecord<T = any> = { committed: T; pending: T | null }

type CedarInternalStore = {
  states: Record<string, any>
  setStateFor: (key: string, value: any) => void
  diffs: Record<string, DiffRecord>
  setDiffPending: (key: string, value: any) => void
  acceptDiff: (key: string) => void
  rejectDiff: (key: string) => void
}

const useCedarInternal = create<CedarInternalStore>((set) => ({
  states: {},
  setStateFor: (key, value) => set(s => ({ states: { ...s.states, [key]: value } })),
  diffs: {},
  setDiffPending: (key, value) => set(s => ({
    diffs: {
      ...s.diffs,
      [key]: { committed: s.diffs[key]?.committed ?? null, pending: value },
    },
  })),
  acceptDiff: (key) => set(s => {
    const d = s.diffs[key] ?? { committed: null, pending: null }
    return { diffs: { ...s.diffs, [key]: { committed: d.pending ?? d.committed, pending: null } } }
  }),
  rejectDiff: (key) => set(s => {
    const d = s.diffs[key] ?? { committed: null, pending: null }
    return { diffs: { ...s.diffs, [key]: { committed: d.committed, pending: null } } }
  }),
}))

export function CedarProvider({ children }: { children: ReactNode }) {
  // expose a minimal setState for demo calls
  ;(window as any).cedar = {
    setState: (target: string, args: any) => {
      // target: "slice.setter"; we map a few known ones
      if (target === 'reminders.addReminder') {
        const [, setters] = useRegisterState<any[]>('reminders', [], { addReminder: (prev, a) => [...(prev ?? []), a] })
        setters.addReminder(args)
      }
      if (target === 'simResult.setSimResult') {
        const [, set] = useDiffState<any>('simResult', null as any, { diffMode: 'holdAccept' })
        set(args)
      }
    },
  }
  return children as any
}

export function useRegisterState<T>(
  key: string,
  initial: T,
  setters: Record<string, (prev: T, args: any) => T>
): [T, Record<string, (args?: any) => void>] {
  const state = useCedarInternal(s => s.states[key]) as T | undefined
  const setStateFor = useCedarInternal(s => s.setStateFor)
  useEffect(() => {
    if (state === undefined) setStateFor(key, initial)
  }, [state, setStateFor, key])

  const wrapperSetters = useMemo(() => {
    const entries = Object.entries(setters).map(([name, fn]) => {
      return [name, (args?: any) => {
        const prev = useCedarInternal.getState().states[key] as T
        const next = fn(prev, args)
        setStateFor(key, next)
      }]
    })
    return Object.fromEntries(entries) as Record<string, (args?: any) => void>
  }, [key, setters, setStateFor])

  return [(state ?? initial) as T, wrapperSetters]
}

export function useDiffState<T>(
  key: string,
  initial: T,
  _options?: { description?: string; diffMode?: 'holdAccept' | 'auto' }
): [T, (val: T) => void] {
  const record = useCedarInternal(s => s.diffs[key]) as DiffRecord<T> | undefined
  const setPending = useCedarInternal(s => s.setDiffPending)
  useEffect(() => {
    if (!record) {
      useCedarInternal.setState(s => ({ diffs: { ...s.diffs, [key]: { committed: initial as any, pending: null } } }))
    }
  }, [record, key, initial])
  const current = (record?.pending ?? record?.committed ?? initial) as T
  return [current, (val: T) => setPending(key, val)]
}

export function useDiffStateOperations(_key: string) {
  return {
    acceptAllDiffs: () => {
      const keys = Object.keys(useCedarInternal.getState().diffs)
      keys.forEach(k => useCedarInternal.getState().acceptDiff(k))
    },
    rejectAllDiffs: () => {
      const keys = Object.keys(useCedarInternal.getState().diffs)
      keys.forEach(k => useCedarInternal.getState().rejectDiff(k))
    },
    undo: () => {},
    redo: () => {},
  }
}

