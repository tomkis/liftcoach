import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Unit, WorkingExercise } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'
import { DashboardCard } from '@/mobile/ui/home/dashboard/dashboard-card'

import { WorkoutCard } from './workout-card'

interface VerticalWorkoutCardsProps {
  scrollViewRef: React.RefObject<ScrollView>
  unit: Unit
  workouts: Array<{
    id: string
    title: string
    exercises: WorkingExercise[]
  }>
}

const PlaceholderCard = () => {
  const customHeader = (
    <View style={styles.placeholderHeaderContainer}>
      <Title style={styles.placeholderTitle}>Next Up Coming</Title>
      <View style={styles.placeholderSubTitleContainer}></View>
    </View>
  )

  return (
    <View style={styles.placeholderCard}>
      <DashboardCard customHeader={customHeader} style={styles.card}>
        <View style={styles.placeholderContent}>
          <Paragraph style={styles.placeholderText}>
            New workouts will appear here once you complete the remaining sessions. Liftcoach needs to analyse your
            performance and adjust the training plan based on your results.
          </Paragraph>
        </View>
      </DashboardCard>
    </View>
  )
}

export const VerticalWorkoutCards = ({ scrollViewRef, workouts, unit }: VerticalWorkoutCardsProps) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null)

  const handleWorkoutPress = (workoutId: string) => {
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId)
  }

  return (
    <View style={styles.container}>
      {workouts.map((workout, index) => {
        return (
          <View key={workout.id} style={styles.workoutCard}>
            <WorkoutCard
              title={workout.title}
              exercises={workout.exercises}
              isUpcoming={index === 0}
              unit={unit}
              isExpanded={expandedWorkoutId === workout.id}
              onPress={() => handleWorkoutPress(workout.id)}
              isFirstCard={index === 0}
              scrollViewRef={scrollViewRef}
            />
          </View>
        )
      })}
      <PlaceholderCard />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  workoutCard: {
    marginBottom: 16, // Space between cards
  },
  placeholderCard: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 0,
    width: '100%',
  },
  placeholderHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  placeholderTitle: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  placeholderSubTitleContainer: {
    paddingBottom: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.newUi.primary.main,
  },
  placeholderSubTitle: {
    fontSize: theme.fontSize.extraSmall,
    fontWeight: 'bold',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.newUi.primary.main,
  },
  placeholderContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  placeholderText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 20,
  },
})
