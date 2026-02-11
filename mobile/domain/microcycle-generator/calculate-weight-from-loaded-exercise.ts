const rpeChart: Record<number, number[]> = {
  1: [100, 97.8, 95.5, 93.9, 92.2, 90.7, 89.2, 87.7, 86.3],
  2: [95.5, 93.9, 92.2, 90.7, 89.2, 87.8, 86.3, 85, 83.7],
  3: [92.2, 90.7, 89.2, 87.8, 86.3, 85, 83.7, 82.4, 81.1],
  4: [89.2, 87.8, 86.3, 84.9, 83.7, 82.4, 81.1, 79.8, 78.6],
  5: [86.3, 84.9, 83.7, 82.5, 81.4, 79.9, 78.6, 77.4, 76.2],
  6: [83.7, 82.5, 81.4, 80.3, 79.3, 78.6, 77.4, 76.2, 75.1],
  7: [81.4, 80.3, 79.3, 78.6, 77.4, 76.2, 75.1, 73.9, 72.8],
  8: [78.6, 77.4, 76.2, 75.1, 73.9, 72.3, 70.7, 69.4, 68.2],
  9: [76.2, 75.1, 73.9, 72.3, 70.7, 69.4, 68.0, 66.7, 65.3],
  10: [73.9, 72.3, 70.7, 69.4, 68.2, 66.7, 65.3, 64, 62.6],
  11: [70.7, 69.4, 68.0, 66.7, 65.3, 62.6, 61.3, 60, 58.7],
  12: [68.0, 66.7, 65.3, 64.1, 62.6, 61.3, 60, 58.7, 57.4],
  13: [65.3, 64.1, 62.6, 61.3, 60, 58.7, 57.4, 56.1, 54.8],
  14: [62.6, 61.3, 60, 58.7, 57.4, 56.1, 54.8, 53.5, 52.2],
  15: [59.8, 58.7, 57.4, 56.1, 54.8, 53.5, 52.2, 50.9, 49.6],
  16: [57.4, 56.1, 54.8, 53.5, 52.2, 50.9, 49.6, 48.3, 47],
  17: [54.8, 53.5, 52.2, 50.9, 49.6, 48.3, 47, 45.7, 44.4],
  18: [52.2, 50.9, 49.6, 48.3, 47, 45.7, 44.4, 43.1, 41.8],
  19: [49.6, 48.3, 47, 45.7, 44.4, 43.1, 41.8, 40.5, 39.2],
}

const rpeToRpeIndex: Record<number, number> = {
  10: 0,
  9: 2,
  8: 4,
  7: 6,
  6: 8,
}

export const calculate1RMEplay = (weight: number, reps: number) => {
  return weight * (1 + reps / 30)
}

export const calculateWeightFromLoadedExercise = (
  exercise: {
    loadingSet: { weight: number; reps: number }
    targetReps: number
  },
  targetRpe: number,
  userCoefficient: number
) => {
  if (targetRpe < 6 || targetRpe > 10) {
    throw new Error('Invalid target rpe')
  }

  const { weight, reps } = exercise.loadingSet
  const estimatedOneRm = calculate1RMEplay(weight, reps)
  const rpeCoeff = rpeChart[exercise.targetReps][rpeToRpeIndex[targetRpe]]

  return Math.floor(estimatedOneRm * (rpeCoeff / 100) * userCoefficient)
}

export const calculateRepsFromLoadedExercise = (
  exercise: {
    loadingSet: { weight: number; reps: number }
    targetWeight: number
  },
  targetRpe: number
) => {
  const { weight, reps } = exercise.loadingSet
  const estimatedOneRm = calculate1RMEplay(weight, reps)
  const percentOfOneRm = (exercise.targetWeight / estimatedOneRm) * 100

  let lowestDiff = Number.MAX_SAFE_INTEGER
  let foundReps = null
  for (let i = 1; i <= 19; i++) {
    const percentDiff = Math.abs(percentOfOneRm - rpeChart[i][rpeToRpeIndex[targetRpe]])

    if (percentDiff < lowestDiff) {
      lowestDiff = percentDiff
      foundReps = i
    }
  }

  return foundReps
}

