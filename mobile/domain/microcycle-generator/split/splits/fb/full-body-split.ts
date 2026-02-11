import { MuscleGroup, SplitResult, SplitType, VolumePerMuscleGroup } from '../../../../muscle-group'

export const fullBodySplit = (volume: VolumePerMuscleGroup, trainingDays: number): SplitResult => {
  if (trainingDays < 2 || trainingDays > 6) {
    throw new Error('Invalid training days for full body split')
  }

  const split = Array.from({ length: trainingDays }, () => ({
    exercises: [] as { muscleGroup: MuscleGroup; sets: number }[],
  }))

  Object.entries(volume).forEach(([muscleGroup, sets]) => {
    const baseSets = Math.floor(sets / trainingDays)
    const remainder = sets % trainingDays
    for (let day = 0; day < trainingDays; day++) {
      const setsForDay = baseSets + (day < remainder ? 1 : 0)
      if (setsForDay > 0) {
        split[day].exercises.push({
          muscleGroup: muscleGroup as MuscleGroup,
          sets: setsForDay,
        })
      }
    }
  })

  return { type: SplitType.FULL_BODY, split }
}
