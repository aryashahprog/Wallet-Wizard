declare module 'cedar-os/react' {
  import type { ReactNode } from 'react'
  export function CedarProvider(props: { children: ReactNode }): JSX.Element
  export function useRegisterState<T>(
    key: string,
    initial: T,
    setters: Record<string, (prev: T, args: any) => T>
  ): [T, Record<string, (args?: any) => void>]
  export function useDiffState<T>(
    key: string,
    initial: T,
    options?: { description?: string; diffMode?: 'holdAccept' | 'auto' }
  ): [T, (val: T) => void]
  export function useDiffStateOperations(key: string): {
    acceptAllDiffs: () => void
    rejectAllDiffs: () => void
    undo: () => void
    redo: () => void
  }
}

declare module 'canvas-confetti' {
  type Options = { particleCount?: number; spread?: number; origin?: { x?: number; y?: number } }
  export default function confetti(opts?: Options): void
}

// Provide a global cedar shim for setState calls in components
interface Window { cedar?: { setState?: (target: string, args: any) => void } }

