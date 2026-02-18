import type { ExerciseLibraryContext } from '@/mobile/api'
import { ExerciseAggregateRoot } from '@/mobile/domain'

import * as userDao from '../db/user.dao'

export const createLocalExerciseLibraryContext = (): ExerciseLibraryContext => ({
  getExercises: async () => {
    const rows = await userDao.getExerciseLibraryData()
    return rows.map(row => new ExerciseAggregateRoot(row).toLibraryItem())
  },
})
