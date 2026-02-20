import { WorkoutStats } from '@/mobile/domain'
import { formatWeight } from '@/mobile/domain/utils/format-weight'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { WorkoutStartTemplate } from '@/mobile/ui/workout/components/workout-start/workout-start-template'
import {
  isWithCompleteWorkoutStats,
  WorkoutStartWithCompleteStats,
} from '@/mobile/ui/workout/components/workout-start/workout-start-with-complete-stats'
import { theme } from '@/mobile/theme/theme'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 0,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  exerciseInfo: {
    flex: 1,
    marginTop: -5,
  },
  exerciseName: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.medium,
    fontFamily: theme.font.sairaBold,
    marginBottom: 4,
  },
  exerciseDetails: {
    color: theme.colors.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
  },
})

export const WorkoutStart = (props: { workoutStats: WorkoutStats; onStartWorkout: () => void }) => {
  if (isWithCompleteWorkoutStats(props.workoutStats.exercises)) {
    return (
      <WorkoutStartTemplate onStartWorkout={props.onStartWorkout} workoutStats={props.workoutStats}>
        <WorkoutStartWithCompleteStats exercises={props.workoutStats.exercises} />
      </WorkoutStartTemplate>
    )
  }

  return (
    <WorkoutStartTemplate onStartWorkout={props.onStartWorkout} workoutStats={props.workoutStats}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {props.workoutStats.exercises.map((exercise, index) => {
          return (
            <View key={index} style={styles.exerciseCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: CARD_PADDING }}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    <Text style={styles.emphasized}>{exercise.sets}</Text> sets of{' '}
                    <Text style={styles.emphasized}>{exercise.reps}</Text> reps{' '}
                    {exercise.weight && `@ ${formatWeight(exercise.weight)} kg`}
                  </Text>
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </WorkoutStartTemplate>
  )
}
