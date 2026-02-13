import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Unit, WorkingExercise } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'
import { BodyText } from '@/mobile/ui/ds/typography'
import { CardTitle } from '@/mobile/ui/ds/typography'
import { AccentCard } from '@/mobile/ui/ds/surfaces'

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
      <CardTitle style={styles.placeholderTitle}>Next Up Coming</CardTitle>
      <View style={styles.placeholderSubTitleContainer}></View>
    </View>
  )

  return (
    <View style={styles.placeholderCard}>
      <AccentCard customHeader={customHeader} style={styles.card}>
        <View style={styles.placeholderContent}>
          <BodyText style={styles.placeholderText}>
            New workouts will appear here once you complete the remaining sessions. Liftcoach needs to analyse your
            performance and adjust the training plan based on your results.
          </BodyText>
        </View>
      </AccentCard>
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
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  placeholderSubTitleContainer: {
    paddingBottom: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.main,
  },
  placeholderSubTitle: {
    fontSize: theme.fontSize.extraSmall,
    fontWeight: 'bold',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.primary.main,
  },
  placeholderContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  placeholderText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
})
