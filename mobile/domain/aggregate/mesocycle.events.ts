import {
  ExerciseAssesment,
  LifestyleFeedback,
  LoadingSet,
  Microcycle,
  WorkingExercise,
  WorkingSet,
  WorkingSetState,
} from '../index'

export interface WorkoutFinished {
  type: 'WorkoutFinished'
  payload: {
    workoutId: string
    when: string
    microcycleId: string
  }
}

export interface LifestyleFeedbackProvided {
  type: 'LifestyleFeedbackProvided'
  payload: {
    lifestyleFeedback: LifestyleFeedback
    microcycleId: string
    workoutId: string
  }
}

export interface MicrocycleFinished {
  type: 'MicrocycleFinished'
  payload: {
    microcycleId: string
    when: string
  }
}

export interface MicrocycleExtended {
  type: 'MicrocycleExtended'
  payload: {
    newMicrocycle: Microcycle
  }
}

export interface MesocycleTerminated {
  type: 'MesocycleTerminated'
  payload: {
    id: string
    when: string
  }
}

export interface MesocycleInitialized {
  type: 'MesocycleInitialized'
  payload: {
    microcycle: Microcycle
    mesocycleId: string
    when: string
    isConfirmed: boolean
  }
}

export interface MesocycleFinished {
  type: 'MesocycleFinished'
  payload: {
    mesocycleId: string
    when: string
  }
}

export interface ExerciseLoaded {
  type: 'ExerciseLoaded'
  payload: {
    microcycleId: string
    workoutId: string
    exerciseId: string
    loadingSet: LoadingSet
  }
}

export interface ExerciseTested {
  type: 'ExerciseTested'
  payload: {
    microcycleId: string
    workoutId: string
    exerciseId: string
    loadingSet: LoadingSet
  }
}

export interface ExerciseFinished {
  type: 'ExerciseFinished'
  payload: {
    microcycleId: string
    workoutId: string
    exerciseId: string
    when: string
    exerciseAssesment: ExerciseAssesment
  }
}

export interface ExerciseReplaced {
  type: 'ExerciseReplaced'
  payload: {
    workoutExerciseId: string
    newExercise: WorkingExercise
    microcycleId: string
    workoutId: string
  }
}

export interface SetStateHasChanged {
  type: 'SetStateHasChanged'
  payload: {
    workoutExerciseId: string
    setId: string
    state: WorkingSetState
    workoutId: string
    microcycleId: string
  }
}
export interface ExerciseWeightChangedTesting {
  type: 'ExerciseWeightChangedTesting'
  payload: {
    workoutExerciseId: string
    weight: number
    workoutId: string
    microcycleId: string
  }
}

export interface ExerciseWeightChangedPending {
  type: 'ExerciseWeightChangedPending'
  payload: {
    workoutExerciseId: string
    weight: number
    workoutId: string
    microcycleId: string
  }
}

export interface ExerciseRepsChangedDueToWeightChange {
  type: 'ExerciseRepsChangedDueToWeightChange'
  payload: {
    workoutExerciseId: string
    newReps: number
    workoutId: string
    microcycleId: string
  }
}

export interface WorkoutStarted {
  type: 'WorkoutStarted'
  payload: {
    workoutId: string
    microcycleId: string
  }
}

export interface ExerciseUpdated {
  type: 'ExerciseUpdated'
  payload: {
    workoutExerciseId: string
    workoutId: string
    microcycleId: string
  }
}

export interface MesocycleConfirmed {
  type: 'MesocycleConfirmed'
  payload: {
    mesocycleId: string
  }
}

export interface TestingSetsGenerated {
  type: 'TestingSetsGenerated'
  payload: {
    exerciseId: string
    sets: Array<WorkingSet>
    workoutId: string
    microcycleId: string
  }
}

export type MesocycleEvent =
  | WorkoutFinished
  | MicrocycleExtended
  | MicrocycleFinished
  | MesocycleTerminated
  | MesocycleInitialized
  | ExerciseLoaded
  | ExerciseTested
  | MesocycleFinished
  | ExerciseFinished
  | LifestyleFeedbackProvided
  | ExerciseReplaced
  | SetStateHasChanged
  | ExerciseWeightChangedTesting
  | ExerciseWeightChangedPending
  | ExerciseRepsChangedDueToWeightChange
  | WorkoutStarted
  | ExerciseUpdated
  | MesocycleConfirmed
  | TestingSetsGenerated
