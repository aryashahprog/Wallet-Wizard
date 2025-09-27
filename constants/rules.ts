export type Rule = {
  id: string;
  name: string;
  params?: Record<string, any>;
  emoji: string;
};

export const PRESET_RULES: Rule[] = [
  { id: "no-delivery-after-8", name: "Cinderella Snack Ban", params: { cutoff: "20:00" }, emoji: "🕗" },
  { id: "walkies-wallet", name: "Walkies Wallet", params: { maxMiles: 1 }, emoji: "🚶‍♀️" },
  { id: "fridge-first", name: "Fridge First", params: { minIngredients: 2 }, emoji: "🥫" },
  { id: "ride-chain-breaker", name: "Ride Chain Breaker", params: { backToBackMinutes: 60 }, emoji: "🚗" },
  { id: "byo-brew", name: "BYO Brew", params: { minHomeBrews: 1 }, emoji: "☕️" },
  { id: "leftover-lottery", name: "Leftover Lottery", params: { minMeals: 1 }, emoji: "🍱" },
  { id: "swap-and-save", name: "Swap & Save", params: { items: 1 }, emoji: "🔁" },
  { id: "inbox-ice-bath", name: "Inbox Ice Bath", params: { unsubCount: 1 }, emoji: "🧊" },
  { id: "snack-stack-cap", name: "Snack Stack Cap", params: { maxSnacks: 2 }, emoji: "🍪" },
  { id: "cash-only-challenge", name: "Cash-Only Challenge", params: { cashPurchases: 1 }, emoji: "💵" },
];
