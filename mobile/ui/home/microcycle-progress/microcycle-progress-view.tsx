import React, { useRef } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { WorkoutState } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'
import { CardTitle } from '@/mobile/ui/ds/typography'
import { getTrainingTitle } from '@/mobile/ui/ux/get-training-title'

import { VerticalWorkoutCards } from './swipeable-workout-card'

export const MicrocycleProgressView = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = trpc.user.getDashboardData.useQuery()
  const { data: microcycle, isLoading } = trpc.workout.getCurrentMicrocycle.useQuery()
  const scrollViewRef = useRef<ScrollView>(null)

  const insets = useSafeAreaInsets()

  if (isLoading || !microcycle || isDashboardLoading || !dashboardData) {
    return <EmptyWrapper />
  }

  const upcomingWorkouts = microcycle.workouts.filter(
    workout => workout.state === WorkoutState.pending && !workout.active
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <CardTitle style={styles.title}>Coming Up</CardTitle>
          </View>

          <View style={styles.workoutsSection}>
            <VerticalWorkoutCards
              scrollViewRef={scrollViewRef}
              unit={dashboardData.dashboardData.unit}
              workouts={upcomingWorkouts.map(workout => ({
                id: workout.id,
                title: getTrainingTitle(workout),
                exercises: workout.exercises,
              }))}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: theme.fontSize.large + 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colors.gray.light,
    marginBottom: 0,
  },
  workoutsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: theme.fontSize.medium,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.extraSmall,
    color: theme.colors.gray.light,
    marginBottom: 0,
  },
})
