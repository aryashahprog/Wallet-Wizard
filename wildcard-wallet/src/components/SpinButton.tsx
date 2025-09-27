import type { MouseEvent } from 'react'
import { RULE_CATALOG } from '../lib/rules'
import { estimateSavings, simulateRisk } from '../lib/savings'
import { useAppState } from '../cedar/registerState'
import { useUIStore } from '../cedar/frontendTools'

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function SpinButton() {
  const { rules } = useAppState()
  const ui = useUIStore()

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    const already = rules.find((r) => r.activeForDate === today)
    if (already) {
      ui.showToast('One rule per day. Try again tomorrow!')
      ui.openDiffs(true)
      return
    }

    // Fallback local proposal
    const rule = pickRandom(RULE_CATALOG)
    const savings = estimateSavings(rule.id)
    const risk = simulateRisk({ balanceNow: 200, Bmin: 50, spendHistory: [10, 12, 8, 25, 4, 17] })
    ui.stageProposal({
      rule: { ...rule, activeForDate: today },
      reminder: { id: `rem-${today}`, date: `${today}T19:30:00`, message: `${rule.emoji} ${rule.name} today!` },
      simResult: { todaySavingsEstimate: savings, overdraftProb: risk },
    })
    ui.openDiffs(true)
  }

  return (
    <button aria-label="Spin to propose rule" onClick={handleClick} className="w-full py-3 rounded-xl bg-indigo-600 text-white text-lg font-semibold active:scale-[.99]">
      Spin
    </button>
  )
}

export default SpinButton

