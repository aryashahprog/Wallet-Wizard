import { create } from 'zustand'

type UIState = {
  diffOpen: boolean
  toast: { id: number; message: string } | null
  pending: { rule?: any; reminder?: any; simResult?: any } | null
  openDiffs: (open: boolean) => void
  showToast: (message: string) => void
  stageProposal: (p: { rule?: any; reminder?: any; simResult?: any }) => void
  clearProposal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  diffOpen: false,
  toast: null,
  pending: null,
  openDiffs: (open: boolean) => set({ diffOpen: open }),
  showToast: (message: string) => set({ toast: { id: Date.now(), message } }),
  stageProposal: (p) => set({ pending: p }),
  clearProposal: () => set({ pending: null }),
}))

export function registerFrontendTools() {
  // In a real Cedar environment, you would call registerFrontendTools from cedar-os
  // For local demo wiring, export functions that components can call
  return {
    showToast: ({ message }: { message: string }) => {
      useUIStore.getState().showToast(message)
    },
    openDiffs: ({ open }: { open: boolean }) => {
      useUIStore.getState().openDiffs(open)
    },
  }
}

