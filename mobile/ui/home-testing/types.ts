import { Reps } from '@/mobile/domain'
import { ReactNode } from 'react'

export interface ExerciseTestDescription {
  exercise: string
  intro: ReactNode
  technique: ReactNode
  next: ReactNode
}

export interface ProgressionSchema {
  title: string
  muscleGroup: HomeTestingMuscleGroup
  exercises: ExerciseTestDescription[]
}

export enum HomeTestingMuscleGroup {
  FrontLegs = 'FrontLegs',
  BackLegs = 'BackLegs',
  Chest = 'Chest',
  Back = 'Back',
}

export interface Result {
  progression: number
  reps: Reps
}

export type TestingResults = Record<HomeTestingMuscleGroup, Result>
