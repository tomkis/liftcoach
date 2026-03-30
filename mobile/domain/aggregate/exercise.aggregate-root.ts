import type { ExerciseLibraryData, ExerciseLibraryItem, ProgressState } from '../exercise-library'
import { calculate1RMEplay } from '../microcycle-generator/calculate-weight-from-loaded-exercise'

export class ExerciseAggregateRoot {
  constructor(private readonly data: ExerciseLibraryData) {}

  toLibraryItem(): ExerciseLibraryItem {
    const base = {
      id: this.data.id,
      name: this.data.name,
      muscleGroup: this.data.muscleGroup,
    }

    const activeHistory = this.selectBestHistory()
    if (!activeHistory) {
      return { ...base, doneInPast: false }
    }

    const latest = activeHistory[0]
    return {
      ...base,
      doneInPast: true,
      estimatedOneRepMax: Math.round(calculate1RMEplay(latest.weight, latest.reps)),
      progressState: this.calculateProgressState(activeHistory),
    }
  }

  private selectBestHistory(): Array<{ weight: number; reps: number }> | null {
    const loading = this.data.loadingHistory
    const working = this.data.workingSetHistory

    if (loading.length === 0 && working.length === 0) return null
    if (loading.length === 0) return working
    if (working.length === 0) return loading

    const loadingE1rm = calculate1RMEplay(loading[0].weight, loading[0].reps)
    const workingE1rm = calculate1RMEplay(working[0].weight, working[0].reps)
    return workingE1rm > loadingE1rm ? working : loading
  }

  private calculateProgressState(
    history: Array<{ weight: number; reps: number }>
  ): ProgressState | null {
    if (history.length < 2) return null

    const latest1RM = calculate1RMEplay(history[0].weight, history[0].reps)
    const previous1RM = calculate1RMEplay(history[1].weight, history[1].reps)
    const ratio = latest1RM / previous1RM

    if (ratio > 1.01) return 'progressing'
    if (ratio < 0.99) return 'regressing'
    return 'stalled'
  }
}
