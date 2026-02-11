import { z } from 'zod'

import { Unit } from './onboarding'

const InsightTypeSchema = z.enum([
  'LIFTED_WEIGHT',
  'PERFORMED_SETS',
  'TESTING_WEEK',
  'FIRST_WEEK',
  'LAST_WEEK',
  'SECOND_WEEK',
  'THIRD_WEEK',
  'FOURTH_WEEK',
  'PROGRESS_STALLED_FAILURE',
  'PROGRESS_STALLED_SUBOPTIMAL_LIFESTYLE',
])
const LiftedWeightInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.LIFTED_WEIGHT),
  liftedWeight: z.number(),
  totalWeight: z.number(),
})
export type LiftedWeightInsight = z.infer<typeof LiftedWeightInsightSchema>

const PerformedSetsInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.PERFORMED_SETS),
  performedSets: z.number(),
  totalSets: z.number(),
})

const TestingWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.TESTING_WEEK),
})
const LastWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.LAST_WEEK),
})
const SecondWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.SECOND_WEEK),
})
const ThirdWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.THIRD_WEEK),
})
const FourthWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.FOURTH_WEEK),
})
const FirstWeekInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.FIRST_WEEK),
})
export type PerformedSetsInsight = z.infer<typeof PerformedSetsInsightSchema>

const FailureSetsInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.PROGRESS_STALLED_FAILURE),
})
export type FailureSetsInsight = z.infer<typeof FailureSetsInsightSchema>

const ProgressStalledSuboptimalLifestyleInsightSchema = z.object({
  type: z.literal(InsightTypeSchema.enum.PROGRESS_STALLED_SUBOPTIMAL_LIFESTYLE),
})
export type ProgressStalledSuboptimalLifestyleInsight = z.infer<typeof ProgressStalledSuboptimalLifestyleInsightSchema>

const LiftCoachInsightSchema = z.discriminatedUnion('type', [
  LiftedWeightInsightSchema,
  PerformedSetsInsightSchema,
  TestingWeekInsightSchema,
  LastWeekInsightSchema,
  SecondWeekInsightSchema,
  ThirdWeekInsightSchema,
  FourthWeekInsightSchema,
  FirstWeekInsightSchema,
  FailureSetsInsightSchema,
  ProgressStalledSuboptimalLifestyleInsightSchema,
])
export type LiftCoachInsight = z.infer<typeof LiftCoachInsightSchema>

const LiftCoachInsightsSchema = z.object({
  subtitle: z.string(),
  insights: z.array(LiftCoachInsightSchema),
})
export type LiftCoachInsights = z.infer<typeof LiftCoachInsightsSchema>

const CalendarDataSchema = z.object({
  date: z.string(),
  feeling: z.number().optional(),
  successRate: z.number().optional(),
})
export const DashboardDataSchema = z.object({
  calendarData: z.array(CalendarDataSchema),
  insights: LiftCoachInsightsSchema,
  cycleProgress: z.number(),
  weeklyAvgSets: z.number(),
  expectedWeeklyVolume: z.number(),
  unit: z.nativeEnum(Unit),
})
export type DashboardData = z.infer<typeof DashboardDataSchema>
