import { useAppState } from '../cedar/registerState'

export function StreakChip() {
  const { streak } = useAppState()
  const days = streak?.days ?? 0
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 text-sm">
      <span>🔥</span>
      <span>Streak: {days} days</span>
    </div>
  )
}

export default StreakChip

