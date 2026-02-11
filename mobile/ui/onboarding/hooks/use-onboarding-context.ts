import { LiftingExperience, MuscleGroupPreference, OnboardedUser, TrainingFrequency, Unit } from '@/mobile/domain'
import React, { useCallback } from 'react'

import { useMixpanel } from '@/mobile/ui/tracking/with-mixpanel'
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
  const mixpanel = useMixpanel()
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
    mixpanel.onboarding.funnel.onboardingStarted()
  }, [navigation, mixpanel])

  const setGender = useCallback(
    (gender: 'male' | 'female') => {
      setUser(prev => ({ ...prev, gender }))
      navigation.navigate('LiftingExperience')
      mixpanel.onboarding.funnel.genderSelected()
    },
    [navigation, mixpanel]
  )

  const setLiftingExperience = useCallback(
    (experience: LiftingExperience) => {
      setUser(prev => ({ ...prev, liftingExperience: experience }))
      mixpanel.onboarding.funnel.liftingExperienceSelected({ liftingExperience: experience })
      navigation.navigate('TrainingFrequencyCardView')
    },
    [navigation, mixpanel]
  )

  const setTrainingFrequency = useCallback(
    (frequency: TrainingFrequency, days: number) => {
      setUser(prev => ({ ...prev, trainingFrequency: frequency, trainingDays: days }))

      navigation.navigate('MuscleGroupPreferencesFirst')
      mixpanel.onboarding.funnel.trainingFrequencyProvided()
    },
    [navigation, mixpanel]
  )

  const prepareWellBalancedPlan = useCallback(() => {
    setUser(prev => ({ ...prev, muscleGroupPreference: null }))

    navigation.navigate('Finalization')
    mixpanel.onboarding.funnel.musclePreferencesProvided({ type: 'well-balanced' })
  }, [navigation, mixpanel])

  const goWithMusclePreferences = useCallback(() => {
    navigation.navigate('MuscleGroupPreferencesSecond')
  }, [navigation])

  const selectMuscleGroupPreferences = useCallback(
    (muscleGroupPreference: MuscleGroupPreference) => {
      setUser(prev => ({ ...prev, muscleGroupPreference }))

      navigation.navigate('Finalization')
      mixpanel.onboarding.funnel.musclePreferencesProvided({ type: 'custom' })
    },
    [navigation, mixpanel]
  )

  const finalize = useCallback(async () => {
    const data = await invalidateCacheAfterOnboarding()
    if (data && !data.isOnboarded) {
      navigation.navigate('ApproveCycle')
    }

    // TODO: add mixpanel pipeline
    // mixpanel.onboardingFinished()
  }, [invalidateCacheAfterOnboarding, navigation])

  const changeMicrocycle = useCallback(() => {
    navigation.navigate('ChangeMicrocycle')
    mixpanel.onboarding.funnel.changeMesocycle()
  }, [mixpanel, navigation])

  const cycleReviewed = useCallback(async () => {
    await confirmMesocycle()
    await trpcUtils.user.me.invalidate()
    mixpanel.onboarding.funnel.mesocycleApproved()
  }, [confirmMesocycle, trpcUtils.user.me, mixpanel])

  const cycleAdjusted = useCallback(async () => {
    await confirmMesocycle()
    await trpcUtils.user.me.invalidate()
    mixpanel.onboarding.funnel.changesToMesoApproved()
  }, [confirmMesocycle, trpcUtils.user.me, mixpanel])

  const unitsProvided = useCallback(
    (unit: Unit) => {
      mixpanel.onboarding.systemOfMeasureChanged({ unit })
      setUser(prev => ({ ...prev, unit }))
    },
    [mixpanel.onboarding]
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
