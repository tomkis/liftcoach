import {
  MicrocycleWorkoutsTemplate,
  MicrocycleWorkoutsTemplateWithExercises,
  MuscleGroup,
  ProvidedExercise,
} from '../../muscle-group'
import { LiftingExperience } from '../../onboarding'

import { IExercisePicker } from './exercise-picker-interface'
import { ExerciseProvider } from './exercise-provider'

type PickingExercise = {
  sets: number
  index: number
}
type MuscleGroupGroupedTemplate = Record<MuscleGroup, Record<number, PickingExercise[]>>

export class ExercisePicker implements IExercisePicker {
  constructor(private readonly exerciseProvider: ExerciseProvider) {}

  private getMuscleGroupGroupedTemplate(microcycleTemplate: MicrocycleWorkoutsTemplate) {
    return Object.entries(MuscleGroup).reduce((muscleGroupAcc, [, muscleGroup]) => {
      const exercisesByDay = microcycleTemplate.reduce(
        (exercisesAcc, dayTemplate, dayIndex) => {
          const exercises = dayTemplate.exercises
            .map((e, i) => ({ sets: e.sets, index: i, muscleGroup: e.muscleGroup }))
            .filter(e => e.muscleGroup === muscleGroup)

          exercisesAcc[dayIndex] = exercises

          return exercisesAcc
        },
        {} as Record<number, PickingExercise[]>
      )

      muscleGroupAcc[muscleGroup] = exercisesByDay

      return muscleGroupAcc
    }, {} as MuscleGroupGroupedTemplate)
  }
  async pickExercises(
    microcycleTemplate: MicrocycleWorkoutsTemplate,
    experience: LiftingExperience
  ): Promise<MicrocycleWorkoutsTemplateWithExercises> {
    const mgAcc: Record<MuscleGroup, number> = {
      [MuscleGroup.Abs]: 0,
      [MuscleGroup.Back]: 0,
      [MuscleGroup.Biceps]: 0,
      [MuscleGroup.Chest]: 0,
      [MuscleGroup.Glutes]: 0,
      [MuscleGroup.Hamstrings]: 0,
      [MuscleGroup.Quads]: 0,
      [MuscleGroup.RearDelts]: 0,
      [MuscleGroup.SideDelts]: 0,
      [MuscleGroup.Triceps]: 0,
    }

    const selectedExercises: ProvidedExercise[] = []
    const orphanedSets: Record<MuscleGroup, number> = {
      [MuscleGroup.Abs]: 0,
      [MuscleGroup.Back]: 0,
      [MuscleGroup.Biceps]: 0,
      [MuscleGroup.Chest]: 0,
      [MuscleGroup.Glutes]: 0,
      [MuscleGroup.Hamstrings]: 0,
      [MuscleGroup.Quads]: 0,
      [MuscleGroup.RearDelts]: 0,
      [MuscleGroup.SideDelts]: 0,
      [MuscleGroup.Triceps]: 0,
    }

    const pickedExercises = Object.entries(this.getMuscleGroupGroupedTemplate(microcycleTemplate)).flatMap(
      ([mg, exercisesByDay]) => {
        const muscleGroup = mg as MuscleGroup

        return Object.entries(exercisesByDay).flatMap(([dayIndex, exercises]) => {
          return exercises.flatMap(({ sets, index }) => {
            const exercise = this.exerciseProvider.provideExercise(
              muscleGroup,
              mgAcc[muscleGroup],
              selectedExercises,
              experience
            )
            mgAcc[muscleGroup]++

            if (!exercise) {
              orphanedSets[muscleGroup] += sets
              return []
            }

            selectedExercises.push(exercise)

            return [
              {
                exercise,
                sets,
                muscleGroup,
                exerciseIndex: index,
                dayIndex: parseInt(dayIndex),
              },
            ]
          })
        })
      }
    )

    for (const mg of Object.values(MuscleGroup)) {
      const orphaned = orphanedSets[mg]
      if (orphaned === 0) continue

      const mgExercises = pickedExercises.filter(e => e.muscleGroup === mg)
      if (mgExercises.length === 0) continue

      const perExercise = Math.floor(orphaned / mgExercises.length)
      const remainder = orphaned % mgExercises.length

      for (let i = 0; i < mgExercises.length; i++) {
        mgExercises[i].sets += perExercise + (i < remainder ? 1 : 0)
      }
    }

    return microcycleTemplate
      .map((dayTemplate, dayIndex) => {
        const dayExercises = dayTemplate.exercises.flatMap((exerciseTemplate, exerciseIndex) => {
          const pickedExercise = pickedExercises.find(
            exercise => exercise.exerciseIndex === exerciseIndex && exercise.dayIndex === dayIndex
          )
          if (!pickedExercise) {
            return []
          }

          return [
            {
              ...exerciseTemplate,
              sets: pickedExercise.sets,
              targetReps: 8,
              alternations: [],
              exercise: pickedExercise.exercise,
            },
          ]
        })

        return { exercises: dayExercises }
      })
      .filter(day => day.exercises.length > 0)
  }
}
