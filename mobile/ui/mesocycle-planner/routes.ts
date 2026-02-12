import { MuscleGroup, MuscleGroupPreference } from '@/mobile/domain'

export type MesocyclePlannerStackParamList = {
  PlanningHome: undefined
  ActivePlanDetail: undefined
  TrainingDays: undefined
  MusclePreferences: {
    trainingDays: number
  }
  VolumePreferences: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
  }
  SplitTypeSelection: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
    volumePreferences: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
  }
  SplitSelection: {
    trainingDays: number
    muscleGroupPreference: MuscleGroupPreference
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
