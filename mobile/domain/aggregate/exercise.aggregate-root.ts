import type { ExerciseLibraryData, ExerciseLibraryItem, ProgressState } from '../exercise-library'
import { calculate1RMEplay } from '../microcycle-generator/calculate-weight-from-loaded-exercise'

export class ExerciseAggregateRoot {
  constructor(private readonly data: ExerciseLibraryData) {}

  toLibraryItem(): ExerciseLibraryItem {
    const base = {
      id: this.data.id,
      name: this.data.name,
      muscleGroup: this.data.muscleGroup,
      movementPattern: this.data.movementPattern,
    }

    const history = this.data.loadingHistory
    if (history.length === 0) {
      return { ...base, doneInPast: false }
    }

    const latest = history[0]
    return {
      ...base,
      doneInPast: true,
      estimatedOneRepMax: Math.round(calculate1RMEplay(latest.weight, latest.reps)),
      progressState: this.calculateProgressState(history),
    }
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
