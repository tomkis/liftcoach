import { MicrocycleWorkout, OnboardedUser } from '@/mobile/domain'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PaginationDots } from '@/mobile/ui/components/pagination-dots'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { ExerciseCard } from '@/mobile/ui/workout/components/exercise-card'
import { LifestyleFeedbackModal } from '@/mobile/ui/workout/components/ux/lifestyle-feedback-modal'
import { WorkoutStart } from '@/mobile/ui/workout/components/workout-start/workout-start'
import {
  useCreateWorkoutContext,
  WorkoutContext,
  WorkoutLifestyleFeedbackModal,
} from '@/mobile/ui/workout/hooks/use-workout-context'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'

const WorkoutSwiperWithFetchedWorkout = (props: { workout: MicrocycleWorkout; onboardingInfo: OnboardedUser }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const workoutContext = useCreateWorkoutContext(props.workout, props.onboardingInfo, pagerRef)
  const insets = useSafeAreaInsets()

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    setActiveIndex(e.nativeEvent.position)
  }, [])

  return (
    <WorkoutContext.Provider value={workoutContext}>
      <View style={styles.pagination}>
        <View style={{ height: insets.top }} />
        <PaginationDots count={props.workout.exercises.length} activeIndex={activeIndex} />
      </View>
      <PagerView
        style={styles.pager}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={onPageSelected}
      >
        {props.workout.exercises.map((_, index) => {
          return (
            <View key={index} style={styles.slide}>
              <ExerciseCard exerciseIndex={index} active={activeIndex === index} />
            </View>
          )
        })}
      </PagerView>
      <LifestyleFeedbackModal
        visible={workoutContext.lifestyleFeedbackModal !== WorkoutLifestyleFeedbackModal.NotNeeded}
        reason={workoutContext.lifestyleFeedbackModal}
        onConfirm={workoutContext.onLifestyleFeedbackConfirm}
      />
    </WorkoutContext.Provider>
  )
}

export const WorkoutStack = () => {
  const { data: onboardingInfo, isPending: isOnboardingInfoLoading } = trpc.user.getOnboardingInfo.useQuery()
  const { data: workout, isPending: isWorkoutLoading } = trpc.workout.getWorkout.useQuery()
  const { data: workoutStats, isPending: isWorkoutStatsLoading } = trpc.workout.getWorkoutStats.useQuery()
  const { mutateAsync: startWorkout } = trpc.workout.startWorkout.useMutation()
  const trpcUtils = trpc.useUtils()
  const tracking = useTracking()

  const onStartWorkout = async () => {
    tracking.workoutStarted()
    await startWorkout()
    await trpcUtils.workout.getWorkout.invalidate()
  }

  if (isOnboardingInfoLoading || isWorkoutLoading || isWorkoutStatsLoading) {
    return <EmptyWrapper />
  }

  if (!onboardingInfo) {
    throw new Error('Onboarding info not found')
  }

  if (!workout && workoutStats) {
    return <WorkoutStart workoutStats={workoutStats} onStartWorkout={onStartWorkout} />
  } else if (workout) {
    return <WorkoutSwiperWithFetchedWorkout workout={workout} onboardingInfo={onboardingInfo} />
  } else {
    throw new Error("There's no available workout or workout stats")
  }
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: theme.colors.background,
  },
  pagination: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 'auto',
    paddingBottom: 4,
  },
})
