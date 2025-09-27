import { NextRequest } from "next/server";

// naive local estimator to keep moving; later swap to real Nessie-based calc
function estimate(ruleId: string) {
  const base: Record<string, number> = {
    "no-delivery-after-8": 7.5,
    "walkies-wallet": 3,
    "fridge-first": 6,
    "ride-chain-breaker": 8,
    "byo-brew": 4,
    "leftover-lottery": 5,
    "swap-and-save": 2,
    "inbox-ice-bath": 0.5,
    "snack-stack-cap": 2,
    "cash-only-challenge": 3,
  };
  const s = base[ruleId] ?? 2;
  return { todaySavingsEstimate: s, overdraftProb: Math.max(0, 0.05 - s / 500) };
}

export async function POST(req: NextRequest) {
  // optional: current state could be posted in the body for smarter decisions
  const body = await req.json().catch(() => ({} as any));
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const reminderAt = new Date(
    `${todayISO}T19:30:00`
  ).toISOString(); // 7:30pm local; adjust later if needed

  // pick a rule server-side (later you can swap this to a real LLM call)
  const preset = [
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
  const pick = preset[Math.floor(Math.random() * preset.length)];
  const sim = estimate(pick.id);

  const actions = [
    {
      type: "setState",
      stateKey: "rules",
      setterKey: "addRule",
      args: { ...pick, activeForDate: todayISO },
    },
    {
      type: "setState",
      stateKey: "simResult",
      setterKey: "setSimResult",
      args: sim,
    },
    {
      type: "setState",
      stateKey: "reminders",
      setterKey: "addReminder",
      args: { date: reminderAt, message: `Reminder: ${pick.name} tonight` },
    },
    {
      type: "frontendTool",
      toolName: "showToast",
      args: { message: `Rule ready: ${pick.name}. Est. save $${sim.todaySavingsEstimate.toFixed(2)}.` },
    },
  ];

  // mimic Cedar diff mode by returning actions without applying them
  return Response.json({ actions, diffMode: "holdAccept" });
}
