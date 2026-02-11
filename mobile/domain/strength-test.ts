import { z } from 'zod'

export enum Reps {
  Low = 'low',
  Intermediate = 'intermediate',
  High = 'high',
}

export const strengthTestSchema = z.object({
  upperFrontIndex: z.number(),
  upperFrontReps: z.nativeEnum(Reps),
  upperBackIndex: z.number(),
  upperBackReps: z.nativeEnum(Reps),
  lowerFrontIndex: z.number(),
  lowerFrontReps: z.nativeEnum(Reps),
  lowerBackIndex: z.number(),
  lowerBackReps: z.nativeEnum(Reps),
})
export type StrengthTest = z.infer<typeof strengthTestSchema>
