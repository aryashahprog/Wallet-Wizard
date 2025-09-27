"use client";

import { useEffect, useState } from "react";
import { PRESET_RULES } from "@/constants/rules";
import SpinWheel from "@/components/SpinWheel";
import { useAppStore } from "@/app/state/store";

type SimResult = { todaySavingsEstimate: number; overdraftProb?: number | null };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function SpinPage() {
  // global store (Cedar-style)
  const {
    reminders, streak, diff,
    setDiff, acceptDiff, rejectDiff
  } = useAppStore();

  // optional: keep the wheel for visuals
  const [lastPickedIdx, setLastPickedIdx] = useState<number | null>(null);
  const wheelItems = PRESET_RULES.map(r => ({ label: `${r.emoji} ${r.name}` }));

  // local estimator fallback (kept in case you want non-AI spin)
  const estimate = (ruleId: string): SimResult => {
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
  };

  // AI: ask server to propose actions (Cedar-like), convert to diff buffer
  const askCopilot = async () => {
    const res = await fetch("/api/propose-rule", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: {} }),
    });
    const { actions } = await res.json();

    let rule: any = null;
    let sim: SimResult | null = null;
    let reminder: { date: string; message: string } | null = null;

    for (const a of actions) {
      if (a.type === "setState" && a.stateKey === "rules" && a.setterKey === "addRule") {
        rule = a.args; // { id, name, params, activeForDate, emoji? }
      }
      if (a.type === "setState" && a.stateKey === "simResult" && a.setterKey === "setSimResult") {
        sim = a.args;
      }
      if (a.type === "setState" && a.stateKey === "reminders" && a.setterKey === "addReminder") {
        reminder = a.args;
      }
    }

    setDiff({
      rule: rule ?? undefined,
      sim: sim ?? (rule ? estimate(rule.id) : undefined),
      reminder: reminder ?? undefined,
    });

    // optional: sync wheel to the chosen rule
    if (rule) {
      const idx = PRESET_RULES.findIndex(r => r.id === rule.id);
      if (idx >= 0) setLastPickedIdx(idx);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl">Wildcard Wallet</h1>
        <div className="text-sm rounded-full px-3 py-1 bg-gray-100">Streak: {streak.days}</div>
      </header>

      {/* Visual wheel (kept; not required for AI). You can still spin locally if you want. */}
      <div className="flex flex-col items-center gap-3">
        <SpinWheel
          items={wheelItems}
          onFinish={(idx) => {
            // local (non-AI) spin: stage a diff using the chosen preset
            const pick = PRESET_RULES[idx];
            setDiff({
              rule: { ...pick, activeForDate: todayISO() },
              sim: estimate(pick.id),
              reminder: { date: `${todayISO()}T19:30:00`, message: `Reminder: ${pick.name} tonight` },
            });
            setLastPickedIdx(idx);
          }}
        />
        <button
          onClick={askCopilot}
          className="rounded-xl px-5 py-3 bg-black text-white hover:opacity-90"
        >
          Ask Copilot
        </button>
      </div>

      {/* Diff panel (Accept/Reject) */}
      {diff && (diff.rule || diff.sim || diff.reminder) && (
        <div className="border rounded-xl p-4">
          {diff.rule && (
            <div className="text-xl mb-1">
              {diff.rule.emoji ? <span className="mr-2">{diff.rule.emoji}</span> : null}
              {diff.rule.name}
            </div>
          )}
          {diff.sim && (
            <div className="mb-2">
              Estimated save: ${diff.sim.todaySavingsEstimate.toFixed(2)}{" "}
              {diff.sim.overdraftProb != null && (
                <span className="text-sm text-gray-600">
                  · Risk {(diff.sim.overdraftProb * 100).toFixed(1)}%
                </span>
              )}
            </div>
          )}
          {diff.reminder && (
            <div className="text-sm text-gray-700">
              Will schedule: {new Date(diff.reminder.date).toLocaleString()} – {diff.reminder.message}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => acceptDiff(todayISO())}
              className="rounded-lg px-4 py-2 bg-green-600 text-white"
            >
              Accept
            </button>
            <button
              onClick={rejectDiff}
              className="rounded-lg px-4 py-2 bg-gray-200"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Reminders list */}
      <section>
        <h2 className="text-lg mb-2">Reminders</h2>
        {reminders.length === 0 ? (
          <p className="text-sm text-gray-600">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {reminders.map((r, i) => (
              <li key={i} className="border rounded-lg p-3">
                <div className="text-sm">{new Date(r.date).toLocaleString()}</div>
                <div>{r.message}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
