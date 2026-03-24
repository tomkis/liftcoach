import { MuscleGroup, MuscleGroupPreference, ProgressionMode } from '@/mobile/domain'

export type MesocyclePlannerStackParamList = {
  PlanningHome: undefined
  ActivePlanDetail: undefined
  ProgressionModeSelection: undefined
  TrainingDays: {
    progressionMode: ProgressionMode
  }
  MusclePreferences: {
    trainingDays: number
    progressionMode: ProgressionMode
  }
  VolumePreferences: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    progressionMode: ProgressionMode
  }
  SplitTypeSelection: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    progressionMode: ProgressionMode
    volumePreferences: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
  }
  SplitSelection: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    progressionMode: ProgressionMode
    volumePreferences: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
    splitType: string
    splitByDay: {
      [key: number]: Array<{
        muscleGroup: MuscleGroup
        sets: number
      }>
    }
  }
  ExerciseSelection: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    progressionMode: ProgressionMode
    volumePreferences: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
    splitType: string
    splitByDay: {
      [key: number]: Array<{
        muscleGroup: MuscleGroup
        sets: number
      }>
    }
  }
  WorkoutPlan: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    volumePreferences: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
    splitType: string
    exercises: {
      [key: number]: Array<{
        id: string
        name: string
        muscleGroup: MuscleGroup
      }>
    }
  }
}
