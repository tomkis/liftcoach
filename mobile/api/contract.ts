import {
  ActivePlanSummary,
  CycleProgress,
  DashboardData,
  ExerciseAssesment,
  LifestyleFeedback,
  LoadingSet,
  Microcycle,
  MicrocycleWorkout,
  MicrocycleWorkoutsTemplate,
  MicrocycleWorkoutsTemplateWithExercises,
  MuscleGroup,
  MuscleGroupPreference,
  OnboardedUser,
  ProvidedExercise,
  StrengthTest,
  VolumePerMuscleGroup,
  WorkingExercise,
  WorkingSetState,
  WorkoutStats,
} from '@/mobile/domain'

export interface Session {
  userId: string
}

export interface UserFlags {
  askedForStrengthTest: boolean
  hasStrengthTest: boolean
  isConfirmedMicrocycle: boolean
}

export interface UserContext {
  me: (session: Session) => Promise<{
    userId: string
    hasStrengthTest: boolean
    isOnboarded: boolean
    hasActiveWorkout: boolean
    hasPendingMesocycle: boolean
  }>
  getOnboardingInfo: (session: Session) => Promise<OnboardedUser | null>
  getDashboardData: (session: Session) => Promise<DashboardData>
  getUserFlags: (session: Session) => Promise<UserFlags>
  storeStrengthTest: (session: Session, strengthTest: StrengthTest) => Promise<void>
  skipStrengthTest: (session: Session) => Promise<void>
}

export interface WorkoutContext {
  getCurrentMicrocycle: (session: Session) => Promise<Microcycle | null>
  getActivePlanSummary: (session: Session) => Promise<ActivePlanSummary | null>
  getWorkout: (session: Session) => Promise<MicrocycleWorkout | null>
  getWorkoutStats: (session: Session) => Promise<WorkoutStats | null>
  startWorkout: (session: Session) => Promise<void>
  confirmMesocycle: (session: Session) => Promise<void>
  getCycleProgress: (session: Session, exerciseId: string) => Promise<CycleProgress>
  changeMicrocycle: (session: Session, template: MicrocycleWorkoutsTemplateWithExercises) => Promise<Microcycle>
  finishWorkout: (session: Session, workoutId: string, lifestyleFeedback?: LifestyleFeedback) => Promise<Microcycle>
  generateMicrocycle: (session: Session, onboardedUser: OnboardedUser) => Promise<Microcycle>
  getBalancedMuscleGroupPreference: (session: Session) => Promise<MuscleGroupPreference>
  proposeExerciseReplacement: (
    sesison: Session,
    workoutExerciseId: string
  ) => Promise<Array<{ id: string; name: string; muscleGroup: MuscleGroup }>>
  replaceExercise: (
    session: Session,
    workoutExerciseId: string,
    replacementExerciseId: string,
    workoutId: string
  ) => Promise<WorkingExercise>
  exerciseLoaded: (
    session: Session,
    workoutId: string,
    workoutExerciseId: string,
    loadingSet: LoadingSet,
    reachedFailure: boolean
  ) => Promise<void>
  exerciseTested: (
    session: Session,
    workoutId: string,
    workoutExerciseId: string,
    loadingSet: LoadingSet
  ) => Promise<void>
  exerciseFinished: (
    session: Session,
    workoutId: string,
    workingExerciseId: string,
    exerciseAssesment: ExerciseAssesment
  ) => Promise<void>
  exerciseSetStateChanged: (
    session: Session,
    workoutId: string,
    workoutExerciseId: string,
    setId: string,
    state: WorkingSetState
  ) => Promise<void>
  exerciseChangeWeight: (
    session: Session,
    workoutId: string,
    workingExerciseId: string,
    weight: number
  ) => Promise<void>
}

export interface MesoPlannerContext {
  proposeSplit: (session: Session, volumePerMuscleGroup: VolumePerMuscleGroup, trainingDays: number) => Promise<any>
  proposeVolume: (
    session: Session,
    muscleGroupPreference: MuscleGroupPreference,
    trainingDays: number
  ) => Promise<Record<MuscleGroup, number>>
  getAvailableExercises: (session: Session) => Promise<ProvidedExercise[]>
  getExercises: (
    session: Session,
    template: MicrocycleWorkoutsTemplate
  ) => Promise<MicrocycleWorkoutsTemplateWithExercises>
}

export interface ContractContext {
  user: UserContext
  workout: WorkoutContext
  mesoPlanner: MesoPlannerContext
}
