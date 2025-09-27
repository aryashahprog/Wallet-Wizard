import { RULE_CATALOG } from './rules'
import { estimateSavings } from './savings'

export function demoActionBundle() {
  const today = new Date().toISOString().slice(0, 10)
  const rule = RULE_CATALOG[0]
  const savings = estimateSavings(rule.id)
  return [
    {
      kind: 'setState',
      target: 'rules.addRule',
      args: { ...rule, activeForDate: today },
    },
    {
      kind: 'setState',
      target: 'reminders.addReminder',
      args: { id: `rem-${today}`, date: `${today}T19:30:00`, message: `${rule.emoji} ${rule.name} today!` },
    },
    {
      kind: 'setState',
      target: 'simResult.setSimResult',
      args: { todaySavingsEstimate: savings, overdraftProb: undefined },
    },
    {
      kind: 'frontendTool',
      target: 'openDiffs',
      args: { open: true },
    },
  ] as const
}

