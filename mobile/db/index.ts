import { drizzle } from 'drizzle-orm/expo-sqlite'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { openDatabaseSync } from 'expo-sqlite'
import { v4 } from 'uuid'

import migrations from '../../drizzle/migrations'
import * as schema from './schema'
import { exerciseSeedData } from './seed/exercises'

const expoDb = openDatabaseSync('liftcoach.db')
export const db = drizzle(expoDb, { schema })

export const initDb = async () => {
  await migrate(db, migrations)
  await seedExercises()
  await ensureLocalUser()
}

const seedExercises = async () => {
  const existing = await db.select({ id: schema.exercise.id }).from(schema.exercise).limit(1)
  if (existing.length > 0) return

  const now = Date.now()
  for (const ex of exerciseSeedData) {
    await db.insert(schema.exercise).values({
      id: v4(),
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      movementPattern: ex.movementPattern,
      movementPatternPriority: ex.movementPatternPriority,
      minimumLiftingExperience: ex.minimumLiftingExperience,
      createdAt: now,
      updatedAt: now,
    })
  }
}

const ensureLocalUser = async () => {
  const existing = await db.select({ id: schema.user.id }).from(schema.user).limit(1)
  if (existing.length > 0) return

  await db.insert(schema.user).values({
    id: 'local-user',
    createdAt: Date.now(),
  })
}
