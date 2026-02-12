import { MicrocycleWorkout, OnboardedUser } from '@/mobile/domain'
import React, { useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

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
  const swiperRef = useRef<Swiper>(null)
  const workoutContext = useCreateWorkoutContext(props.workout, props.onboardingInfo, swiperRef)
  const insets = useSafeAreaInsets()

  return (
    <WorkoutContext.Provider value={workoutContext}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        loop={false}
        ref={swiperRef}
        dotColor={theme.colors.text.primary}
        activeDotColor={theme.colors.primary.main}
        onIndexChanged={setActiveIndex}
        paginationStyle={[styles.pagination, { top: insets.top }]}
      >
        {props.workout.exercises.map((_, index) => {
          return (
            <View key={index} style={styles.slide}>
              <ExerciseCard exerciseIndex={index} active={activeIndex === index} />
            </View>
          )
        })}
      </Swiper>
      <LifestyleFeedbackModal
        visible={workoutContext.lifestyleFeedbackModal !== WorkoutLifestyleFeedbackModal.NotNeeded}
        reason={workoutContext.lifestyleFeedbackModal}
        onConfirm={workoutContext.onLifestyleFeedbackConfirm}
      />
    </WorkoutContext.Provider>
  )
}

export const WorkoutStack = () => {
  const { data: onboardingInfo, isLoading: isOnboardingInfoLoading } = trpc.user.getOnboardingInfo.useQuery()
  const { data: workout, isLoading: isWorkoutLoading } = trpc.workout.getWorkout.useQuery()
  const { data: workoutStats, isLoading: isWorkoutStatsLoading } = trpc.workout.getWorkoutStats.useQuery()
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
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  pagination: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    height: 20,
  },
})
