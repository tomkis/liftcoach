import type { ExerciseLibraryContext } from '@/mobile/api'

import * as userDao from '../db/user.dao'

export const createLocalExerciseLibraryContext = (): ExerciseLibraryContext => ({
  getExercises: async () => {
    return await userDao.getExerciseLibrary()
  },
})
