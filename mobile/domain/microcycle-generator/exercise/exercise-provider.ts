import {
  BodyPart,
  MovementPattern,
  MovementPatternPriorities,
  MuscleGroup,
  ProvidedExercise,
} from '../../muscle-group'
import { LiftingExperience } from '../../onboarding'

const bodyPartsToMuscleGroup = {
  [BodyPart.Arms]: [MuscleGroup.Biceps, MuscleGroup.Triceps],
  [BodyPart.Legs]: [MuscleGroup.Quads, MuscleGroup.Hamstrings, MuscleGroup.Glutes],
  [BodyPart.Shoulders]: [MuscleGroup.RearDelts, MuscleGroup.SideDelts],
}

const expandMuscleGroupToWholeBodyPart = (muscleGroup: MuscleGroup) => {
  const entries = Object.entries(bodyPartsToMuscleGroup)
    .flatMap(([, muscleGroups]) => {
      if (muscleGroups.includes(muscleGroup)) {
        return muscleGroups
      }

      return null
    })
    .filter(Boolean) as MuscleGroup[]

  if (entries.length === 0) {
    return [muscleGroup]
  } else {
    return entries
  }
}

const movementPatternsPriorities: MovementPatternPriorities = {
  [MuscleGroup.Quads]: [MovementPattern.QuadsSquat, MovementPattern.QuadsExtension, MovementPattern.QuadsPress],
  [MuscleGroup.Hamstrings]: [MovementPattern.HamstringsCurl, MovementPattern.HamstringsHipHinge],
  [MuscleGroup.Glutes]: [MovementPattern.GlutesThrust, MovementPattern.GlutesAbduction, MovementPattern.GlutesSquat],
  [MuscleGroup.Biceps]: [
    MovementPattern.BicepsLengthenedCurl,
    MovementPattern.BicepsShorthenedCurl,
    MovementPattern.BicepsBrachialis,
  ],
  [MuscleGroup.Triceps]: [MovementPattern.TricepsLonghead, MovementPattern.TricepsShorthead],
  [MuscleGroup.Abs]: [MovementPattern.AbsUpper, MovementPattern.AbsLower],
  [MuscleGroup.Back]: [MovementPattern.BackVerticalPull, MovementPattern.BackHorizontalPull],
  [MuscleGroup.Chest]: [MovementPattern.ChestUpper, MovementPattern.ChestMiddle, MovementPattern.ChestFly],
  [MuscleGroup.RearDelts]: [MovementPattern.RearDeltsReverseFly, MovementPattern.RearDeltsRow],
  [MuscleGroup.SideDelts]: [
    MovementPattern.SideDeltsDumbellLateralRaise,
    MovementPattern.SideDeltsCableLateralRaise,
    MovementPattern.SideDeltsDumbellIsolatedLateralRaise,
    MovementPattern.SideDeltsPress,
  ],
}

const experienceToNumber = (experience: LiftingExperience) => {
  switch (experience) {
    case LiftingExperience.None:
      return 0
    case LiftingExperience.Beginner:
      return 1
    case LiftingExperience.Intermediate:
      return 2
    case LiftingExperience.Advanced:
      return 3
    case LiftingExperience.Expert:
      return 4
    default:
      throw new Error('Invalid lifting experience')
  }
}

export class ExerciseProvider {
  constructor(private readonly exercises: ProvidedExercise[]) {
    this.exercises = exercises
  }

  getExercises(): ProvidedExercise[] {
    return this.exercises
  }

  replaceExercise(originalExerciseId: string, muscleGroup: MuscleGroup, selectedExercisesId: string[]) {
    const expandedMuscleGroup = expandMuscleGroupToWholeBodyPart(muscleGroup)
    const originalExercise = this.exercises.find(e => e.id === originalExerciseId)
    if (!originalExercise) {
      throw new Error('Original exercise not found')
    }

    const originalExerciseMovementPattern = originalExercise.movementPattern
    if (!originalExerciseMovementPattern) {
      throw new Error('Original exercise not found in the muscle group')
    }

    const currentMovementPatternExercises = this.exercises.filter(
      e => e.movementPattern === originalExerciseMovementPattern && e.muscleGroup === muscleGroup
    )
    const sameMuscleGroupExercises = this.exercises.filter(e => e.muscleGroup === muscleGroup)

    const allBodyPartExercises = expandedMuscleGroup.flatMap(muscleGroup =>
      Object.values(this.exercises.filter(e => e.muscleGroup === muscleGroup)).flat()
    )

    const orderedExercises = [
      ...new Set([...currentMovementPatternExercises, ...sameMuscleGroupExercises, ...allBodyPartExercises]),
    ]

    return orderedExercises.filter(e => ![...selectedExercisesId, originalExerciseId].some(ee => ee === e.id))
  }

  provideExercise(
    muscleGroup: MuscleGroup,
    exerciseNumber: number,
    selectedExercises: ProvidedExercise[],
    userExperience: LiftingExperience
  ): ProvidedExercise {
    const movementPattern =
      movementPatternsPriorities[muscleGroup][exerciseNumber % movementPatternsPriorities[muscleGroup].length]

    const exercisesForPattern = this.exercises.filter(
      e => e.muscleGroup === muscleGroup && e.movementPattern === movementPattern
    )

    const expercisesForExperience = exercisesForPattern.filter(
      e => experienceToNumber(e.minimumLiftingExperience) <= experienceToNumber(userExperience)
    )

    if (!expercisesForExperience || expercisesForExperience.length === 0) {
      throw new Error(`No exercises found for the given movement pattern - ${movementPattern}`)
    }

    const selectedExercise = expercisesForExperience.filter(
      e => !selectedExercises.some(selected => selected.id === e.id)
    )[0]

    if (!selectedExercise) {
      throw new Error('No exercise found')
    }

    return selectedExercise
  }
}
