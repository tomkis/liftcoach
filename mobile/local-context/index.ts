import type { ContractContext } from '@/mobile/api'

import { createLocalExerciseLibraryContext } from './exercise-library-context.local'
import { createLocalMesoPlannerContext } from './meso-planner-context.local'
import { createLocalUserContext } from './user-context.local'
import { createLocalWorkoutContext } from './workout-context.local'

export const createLocalContext = (): ContractContext => ({
  user: createLocalUserContext(),
  workout: createLocalWorkoutContext(),
  mesoPlanner: createLocalMesoPlannerContext(),
  exerciseLibrary: createLocalExerciseLibraryContext(),
})
