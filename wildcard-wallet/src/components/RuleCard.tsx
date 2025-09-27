import { useAppState } from '../cedar/registerState'
import { useUIStore } from '../cedar/frontendTools'

export function RuleCard() {
  const { rules, simResult } = useAppState()
  const pending = useUIStore(s => s.pending)
  const today = new Date().toISOString().slice(0, 10)
  const rule = pending?.rule ?? rules.find((r) => r.activeForDate === today)

  if (!rule) return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-slate-500 text-sm">
      No rule proposed yet. Tap Spin!
    </div>
  )

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-2xl">{rule.emoji}</div>
        <div className="font-semibold">{rule.name}</div>
        <div className="ml-auto text-xs text-slate-500">{today}</div>
      </div>
      <div className="flex gap-2 text-sm">
        {simResult?.todaySavingsEstimate !== undefined && (
          <div className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Est. saved: ${'{'}simResult.todaySavingsEstimate.toFixed(2){'}'}
          </div>
        )}
        {simResult?.overdraftProb !== undefined && (
          <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            Risk: {simResult.overdraftProb}%
          </div>
        )}
      </div>
    </div>
  )
}

export default RuleCard

