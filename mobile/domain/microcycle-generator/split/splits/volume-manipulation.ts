import { MicrocycleWorkoutsTemplate, MuscleGroup } from '../../../index'

interface Exercise {
  muscleGroup: MuscleGroup
  sets: number
}

const ONE_EXERCISE_IDEAL_VOLUME = 4

export const ensureIdealSetsPerExercise = (template: MicrocycleWorkoutsTemplate): MicrocycleWorkoutsTemplate => {
  return template.map(day => {
    const muscleGroupMerged = day.exercises.reduce(
      (acc, curr) => {
        acc[curr.muscleGroup] = (acc[curr.muscleGroup] || 0) + curr.sets
        return acc
      },
      {} as Record<MuscleGroup, number>
    )

    const mergedExercises = Object.entries(muscleGroupMerged).map(([muscleGroup, sets]) => ({
      muscleGroup: muscleGroup as MuscleGroup,
      sets,
    }))

    const exercises = mergedExercises.flatMap(muscleGroupExercise => {
      const totalSets = muscleGroupExercise.sets

      const numberOfExercises = Math.floor(totalSets / ONE_EXERCISE_IDEAL_VOLUME)
      const exerciseRemainder = totalSets % ONE_EXERCISE_IDEAL_VOLUME

      const splitted: Array<Exercise> = []
      for (let i = 0; i < numberOfExercises; i++) {
        splitted.push({ muscleGroup: muscleGroupExercise.muscleGroup, sets: ONE_EXERCISE_IDEAL_VOLUME })
      }

      if (exerciseRemainder > 0) {
        splitted.push({ muscleGroup: muscleGroupExercise.muscleGroup, sets: exerciseRemainder })
      }

      return splitted
    })

    exercises.forEach((exercise, index) => {
      if (exercise.sets === 1) {
        const indexOfSameMuscleGroup = exercises.findIndex(
          (e, i) => e.muscleGroup === exercise.muscleGroup && i !== index
        )

        if (indexOfSameMuscleGroup !== -1) {
          exercises[indexOfSameMuscleGroup].sets += 1
          exercises[index].sets = 0
        } else {
          exercises[index].sets = 2
        }
      }
    })

    return {
      exercises: exercises.filter(e => e.sets > 0),
    }
  })
}

export function distributeVolumeEvenly(
  exercises: Array<{ muscleGroup: MuscleGroup; sets: number }>,
  days: number,
  coeff: number
) {
  return new Array(days).fill(null).map(() => {
    return exercises.map(exercise => {
      return {
        ...exercise,
        sets: Math.round(exercise.sets * coeff),
      }
    })
  })
}

export const calculateTotalSets = (sets: { muscleGroup: MuscleGroup; sets: number }[]) =>
  sets.reduce((acc, curr) => acc + curr.sets, 0)
