import { Reps } from '@/mobile/domain'

import { HomeTestingMuscleGroup } from '@/mobile/ui/home-testing/types'

type Percentiles = Record<HomeTestingMuscleGroup, Record<'1' | '2' | '3' | '4', Record<Reps, number>>>

export const percentiles: Percentiles = {
  [HomeTestingMuscleGroup.FrontLegs]: {
    '1': {
      low: 10,
      intermediate: 42,
      high: 66,
    },
    '2': {
      low: 25,
      intermediate: 53,
      high: 75,
    },
    '3': {
      low: 75,
      intermediate: 78,
      high: 85,
    },
    '4': {
      low: 60,
      intermediate: 85,
      high: 95,
    },
  },
  [HomeTestingMuscleGroup.BackLegs]: {
    '1': {
      low: 10,
      intermediate: 40,
      high: 65,
    },
    '2': {
      low: 25,
      intermediate: 55,
      high: 75,
    },
    '3': {
      low: 40,
      intermediate: 72,
      high: 75,
    },
    '4': {
      low: 80,
      intermediate: 85,
      high: 95,
    },
  },
  [HomeTestingMuscleGroup.Chest]: {
    '1': {
      low: 10,
      intermediate: 40,
      high: 65,
    },
    '2': {
      low: 25,
      intermediate: 55,
      high: 75,
    },
    '3': {
      low: 40,
      intermediate: 70,
      high: 85,
    },
    '4': {
      low: 60,
      intermediate: 85,
      high: 95,
    },
  },
  [HomeTestingMuscleGroup.Back]: {
    '1': {
      low: 10,
      intermediate: 40,
      high: 65,
    },
    '2': {
      low: 25,
      intermediate: 55,
      high: 75,
    },
    '3': {
      low: 40,
      intermediate: 70,
      high: 85,
    },
    '4': {
      low: 60,
      intermediate: 85,
      high: 90,
    },
  },
}
