import confetti from 'canvas-confetti'
import { useAppState } from '../cedar/registerState'
import { useUIStore } from '../cedar/frontendTools'

export function DiffPanel() {
  const { rulesSetters, ops, streakSetters } = useAppState()
  const ui = useUIStore()

  const acceptAll = () => {
    const pending = ui.pending
    try {
      if (pending?.rule) rulesSetters.addRule(pending.rule)
      if (pending?.reminder) (window as any).cedar?.setState?.('reminders.addReminder', pending.reminder)
      if (pending?.simResult) (window as any).cedar?.setState?.('simResult.setSimResult', pending.simResult)
      ops.acceptAllDiffs()
      streakSetters.incrementStreak()
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })
    } finally {
      ui.clearProposal()
      ui.openDiffs(false)
    }
  }

  const rejectAll = () => {
    try {
      ops.rejectAllDiffs()
    } finally {
      ui.clearProposal()
      ui.openDiffs(false)
    }
  }

  if (!ui.diffOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-md mx-auto flex items-center gap-3">
        <div className="text-sm">Proposed changes pending approval.</div>
        <div className="ml-auto flex gap-2">
          <button aria-label="Reject" onClick={rejectAll} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700">Reject</button>
          <button aria-label="Accept All" onClick={acceptAll} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">Accept All</button>
        </div>
      </div>
    </div>
  )
}

export default DiffPanel

