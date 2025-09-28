import './App.css'
import Providers from './app/providers'
// import { StreakChip } from './components/StreakChip' // Component removed
import { SpinButton } from './components/SpinButton'
import { RuleCard } from './components/RuleCard'
import { DiffPanel } from './components/DiffPanel'
import { useUIStore } from './cedar/frontendTools'
import { demoActionBundle } from './lib/actionExamples'

function Toast() {
  const toast = useUIStore(s => s.toast)
  if (!toast) return null
  return (
    <div className="fixed inset-x-0 top-3 flex justify-center">
      <div className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm shadow-md">{toast.message}</div>
    </div>
  )
}

function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-md mx-auto p-4 space-y-4">
          <header className="flex items-center justify-between py-2">
            <h1 className="text-xl font-bold">Wallet Wizard</h1>
            {/* <StreakChip /> */}
          </header>
          <div>
            <SpinButton />
          </div>
          <RuleCard />
          <div className="pt-2">
            <button
              aria-label="Backup Demo"
              className="w-full py-2 rounded-lg border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              onClick={() => {
                const actions = demoActionBundle()
                const ui = useUIStore.getState()
                ui.stageProposal({
                  rule: actions[0].args,
                  reminder: actions[1].args,
                  simResult: actions[2].args,
                })
                ui.openDiffs(true)
              }}
            >
              Backup Demo
            </button>
          </div>
          <footer className="text-center text-xs text-slate-500 pt-8">Spin-to-Save · Cedar-OS demo</footer>
        </div>
        <DiffPanel />
        <Toast />
      </div>
    </Providers>
  )
}

export default App
