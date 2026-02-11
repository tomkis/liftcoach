import { LiftingExperience, MuscleGroupPreference, OnboardedUser, TrainingFrequency, Unit } from '@/mobile/domain'
import React, { useCallback } from 'react'

import { useTracking } from '@/mobile/ui/tracking/tracking'
import { trpc } from '@/mobile/trpc'

import { useOnboardingNavigation } from './use-onboarding-navigation'

interface OnboardingContextType {
  user: Partial<OnboardedUser>
  start: () => void
  setGender: (gender: 'male' | 'female') => void
  setLiftingExperience: (experience: LiftingExperience) => void
  unitsProvided: (unit: Unit) => void
  setTrainingFrequency: (frequency: TrainingFrequency, days: number) => void
  prepareWellBalancedPlan: () => void
  goWithMusclePreferences: () => void
  selectMuscleGroupPreferences: (data: MuscleGroupPreference) => void
  changeMicrocycle: () => void
  cycleReviewed: () => void
  cycleAdjusted: () => void
  finalize: () => void
}

export const OnboardingContext = React.createContext<null | OnboardingContextType>(null)

export const useCreateOnboardingContext = (): OnboardingContextType => {
  const trpcUtils = trpc.useUtils()
  const tracking = useTracking()
  const { mutateAsync: confirmMesocycle } = trpc.user.confirmMesocycle.useMutation()
  const navigation = useOnboardingNavigation()

  const invalidateUser = trpcUtils.user.invalidate
  const invalidateWorkout = trpcUtils.workout.invalidate

  const invalidateCacheAfterOnboarding = useCallback(async () => {
    await Promise.all([invalidateUser(), invalidateWorkout()])

    return await trpcUtils.user.me.getData()
  }, [invalidateUser, invalidateWorkout, trpcUtils.user.me])

  const [user, setUser] = React.useState<Partial<OnboardedUser>>({
    // TODO: ask user
    unit: Unit.Metric,
  })

  const start = useCallback(() => {
    navigation.navigate('Gender')
    tracking.onboarding.funnel.onboardingStarted()
  }, [navigation, tracking])

  const setGender = useCallback(
    (gender: 'male' | 'female') => {
      setUser(prev => ({ ...prev, gender }))
      navigation.navigate('LiftingExperience')
      tracking.onboarding.funnel.genderSelected()
    },
    [navigation, tracking]
  )

  const setLiftingExperience = useCallback(
    (experience: LiftingExperience) => {
      setUser(prev => ({ ...prev, liftingExperience: experience }))
      tracking.onboarding.funnel.liftingExperienceSelected({ liftingExperience: experience })
      navigation.navigate('TrainingFrequencyCardView')
    },
    [navigation, tracking]
  )

  const setTrainingFrequency = useCallback(
    (frequency: TrainingFrequency, days: number) => {
      setUser(prev => ({ ...prev, trainingFrequency: frequency, trainingDays: days }))

      navigation.navigate('MuscleGroupPreferencesFirst')
      tracking.onboarding.funnel.trainingFrequencyProvided()
    },
    [navigation, tracking]
  )

  const prepareWellBalancedPlan = useCallback(() => {
    setUser(prev => ({ ...prev, muscleGroupPreference: null }))

    navigation.navigate('Finalization')
    tracking.onboarding.funnel.musclePreferencesProvided({ type: 'well-balanced' })
  }, [navigation, tracking])

  const goWithMusclePreferences = useCallback(() => {
    navigation.navigate('MuscleGroupPreferencesSecond')
  }, [navigation])

  const selectMuscleGroupPreferences = useCallback(
    (muscleGroupPreference: MuscleGroupPreference) => {
      setUser(prev => ({ ...prev, muscleGroupPreference }))

      navigation.navigate('Finalization')
      tracking.onboarding.funnel.musclePreferencesProvided({ type: 'custom' })
    },
    [navigation, tracking]
  )

  const finalize = useCallback(async () => {
    const data = await invalidateCacheAfterOnboarding()
    if (data && !data.isOnboarded) {
      navigation.navigate('ApproveCycle')
    }

  }, [invalidateCacheAfterOnboarding, navigation])

  const changeMicrocycle = useCallback(() => {
    navigation.navigate('ChangeMicrocycle')
    tracking.onboarding.funnel.changeMesocycle()
  }, [tracking, navigation])

  const cycleReviewed = useCallback(async () => {
    await confirmMesocycle()
    await trpcUtils.user.me.invalidate()
    tracking.onboarding.funnel.mesocycleApproved()
  }, [confirmMesocycle, trpcUtils.user.me, tracking])

  const cycleAdjusted = useCallback(async () => {
    await confirmMesocycle()
    await trpcUtils.user.me.invalidate()
    tracking.onboarding.funnel.changesToMesoApproved()
  }, [confirmMesocycle, trpcUtils.user.me, tracking])

  const unitsProvided = useCallback(
    (unit: Unit) => {
      tracking.onboarding.systemOfMeasureChanged({ unit })
      setUser(prev => ({ ...prev, unit }))
    },
    [tracking.onboarding]
  )

  return {
    user,
    start,
    setGender,
    setLiftingExperience,
    unitsProvided,
    setTrainingFrequency,
    prepareWellBalancedPlan,
    goWithMusclePreferences,
    selectMuscleGroupPreferences,
    changeMicrocycle,
    cycleReviewed,
    cycleAdjusted,
    finalize,
  }
}

export const useOnboardingContext = () => {
  const ctx = React.useContext(OnboardingContext)
  if (!ctx) {
    throw new Error('Missing OnboardingContext')
  }
  return ctx
}
