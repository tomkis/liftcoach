export type ActivePlanData = {
  currentWeek: number
  totalWeeks: number
  splitType: string
  trainingDaysPerWeek: number
  workoutsCompleted: number
  totalWorkouts: number
}

export type PlanHubProps = {
  activePlan: ActivePlanData | null
  onViewActivePlan: () => void
  onBuildNewPlan: () => void
  isLoading: boolean
}
