export function estimateSavings(ruleId: string): number {
  const map: Record<string, number> = {
    'no-delivery-8': 7.5,
    'walk-1mi': 5.0,
    'fridge-first': 4.0,
    'leftover': 3.5,
    'ride-breaker': 6.0,
    'brew-first': 3.0,
    'store-brand': 2.5,
    'snack-cap': 2.0,
    'unsubscribe1': 2.0,
    'cash-only1': 4.5,
  }
  return map[ruleId] ?? 2.0
}

export function simulateRisk({ balanceNow, Bmin, spendHistory }:{ balanceNow:number; Bmin:number; spendHistory:number[] }): number {
  const runs = 2000
  const n = spendHistory.length
  let overdrafts = 0
  for (let i = 0; i < runs; i++) {
    const draw = spendHistory[Math.floor(Math.random() * n)]
    const projected = balanceNow - draw
    if (projected < Bmin) overdrafts++
  }
  const pct = (overdrafts / runs) * 100
  return Math.round(pct * 10) / 10
}

