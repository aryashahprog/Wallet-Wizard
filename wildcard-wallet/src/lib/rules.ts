export type CatalogRule = {
  id: string
  name: string
  emoji: string
  params: Record<string, any>
}

export const RULE_CATALOG: CatalogRule[] = [
  { id: 'no-delivery-8', name: 'Cinderella Snack Ban', emoji: '🕗', params: { cutoff: '20:00' } },
  { id: 'fridge-first', name: 'Fridge First', emoji: '🧊', params: { minIngredients: 2 } },
  { id: 'walk-1mi', name: 'Walkies Wallet', emoji: '🚶', params: { miles: 1 } },
  { id: 'leftover', name: 'Leftover Lottery', emoji: '🎲', params: {} },
  { id: 'ride-breaker', name: 'Ride Chain Breaker', emoji: '🛞', params: {} },
  { id: 'brew-first', name: 'BYO Brew', emoji: '☕', params: {} },
  { id: 'store-brand', name: 'Swap & Save', emoji: '🏷️', params: {} },
  { id: 'snack-cap', name: 'Snack Stack Cap', emoji: '🍿', params: { max: 2 } },
  { id: 'unsubscribe1', name: 'Inbox Ice Bath', emoji: '🧊📧', params: {} },
  { id: 'cash-only1', name: 'Cash-Only Challenge', emoji: '💵', params: {} },
]

