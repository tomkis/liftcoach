import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Unit, WorkingExercise, WorkoutExerciseState } from '@/mobile/domain'
import React, { useEffect, useRef } from 'react'
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { match } from 'ts-pattern'

import { DashboardCard } from '@/mobile/ui/home/dashboard/dashboard-card'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useMixpanel } from '@/mobile/ui/tracking/with-mixpanel'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'

interface WorkoutCardProps {
  title: string
  exercises: WorkingExercise[]
  unit: Unit
  isUpcoming?: boolean
  isExpanded?: boolean
  onPress?: () => void
  isFirstCard?: boolean
  scrollViewRef?: React.RefObject<ScrollView>
}

const ExerciseItem = ({ exercise, unit }: { exercise: WorkingExercise; unit: Unit }) => {
  return (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseInfo}>
        <Paragraph style={styles.exerciseName}>{exercise.exercise.name}</Paragraph>
        {match(exercise)
          .with({ state: WorkoutExerciseState.pending }, exercise => {
            const firstSet = exercise.sets[0]
            if (!firstSet) {
              throw new Error('Illegal State')
            }

            return (
              <Paragraph style={styles.exerciseDetails}>
                {exercise.sets.length} sets × {firstSet.reps} reps × {firstSet.weight}{' '}
                {unit === Unit.Metric ? 'kg' : 'lbs'}
              </Paragraph>
            )
          })
          .with({ state: WorkoutExerciseState.testing }, exercise => {
            return (
              <Paragraph style={styles.exerciseDetails}>
                Performance Testing with{' '}
                <Text style={styles.emphasized}>
                  {exercise.testingWeight} {unit === Unit.Metric ? 'kg' : 'lbs'}
                </Text>
              </Paragraph>
            )
          })
          .with({ state: WorkoutExerciseState.loading }, () => {
            return (
              <Paragraph style={styles.exerciseDetails}>
                Performance Testing for <Text style={styles.emphasized}>{exercise.targetReps} reps</Text> in{' '}
                <Text style={styles.emphasized}>{exercise.targetSets} sets</Text>
              </Paragraph>
            )
          })
          .otherwise(() => (
            <></>
          ))}
      </View>
    </View>
  )
}

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <View style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
      <Paragraph style={styles.chevronText}>▼</Paragraph>
    </View>
  )
}

const CustomHeader = ({
  title,
  subTitle,
  isExpanded,
  showChevron,
  onPress,
}: {
  title: string
  subTitle: string
  isExpanded: boolean
  showChevron: boolean
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!showChevron}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>{title}</Title>
        {showChevron && <ChevronIcon isExpanded={isExpanded} />}
      </View>
      <View style={styles.subTitleContainer}>
        <Paragraph style={styles.subTitle}>{subTitle}</Paragraph>
      </View>
    </TouchableOpacity>
  )
}

export const WorkoutCard = ({
  title,
  exercises,
  unit,
  isUpcoming = true,
  isExpanded = false,
  onPress,
  scrollViewRef,
}: WorkoutCardProps) => {
  const animatedHeight = useRef(new Animated.Value(0)).current
  const headerRef = useRef<View>(null)
  const isFirstRender = useRef(true)
  const mixpanel = useMixpanel()

  const navigation = useNavigation<NativeStackNavigationProp<{ Workout: undefined }>>()

  const exerciseItemHeight = 73 // More accurate based on actual rendering
  const moreExercisesHeight = 40 // More accurate for the "more exercises" button
  const gapBetweenItems = 10 // From exercisesContainer gap
  const collapsedHeight = exercises.length > 0 ? exerciseItemHeight : 0
  const expandedHeight = exercises.length * exerciseItemHeight + (exercises.length - 1) * gapBetweenItems
  const finalCollapsedHeight =
    exercises.length > 1 ? collapsedHeight + gapBetweenItems + moreExercisesHeight : collapsedHeight

  useEffect(() => {
    const targetHeight = isExpanded ? expandedHeight : finalCollapsedHeight

    // On first render, set the height immediately without animation
    if (isFirstRender.current) {
      animatedHeight.setValue(targetHeight)
      isFirstRender.current = false
      return
    }

    // For subsequent renders, animate the height change
    Animated.timing(animatedHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [isExpanded, expandedHeight, finalCollapsedHeight, animatedHeight, scrollViewRef])

  const displayExercises = isExpanded ? exercises : exercises.slice(0, 1) // Show only first exercise when collapsed
  const showChevron = false // Remove chevron completely

  const workoutQuery = trpc.workout.getWorkout.useQuery()
  const startWorkoutMutation = trpc.workout.startWorkout.useMutation()
  const trpcUtils = trpc.useUtils()

  const startWorkout = async () => {
    if (!workoutQuery.data) {
      mixpanel.workoutStarted()
      await startWorkoutMutation.mutateAsync()
      await trpcUtils.workout.invalidate()
    }

    navigation.navigate('Workout')
  }

  const customHeader = (
    <CustomHeader
      title={title}
      subTitle={isUpcoming ? 'Upcoming Next' : 'Later in the cycle'}
      isExpanded={isExpanded}
      showChevron={showChevron}
      onPress={undefined}
    />
  )

  return (
    <View ref={headerRef}>
      <View>
        <DashboardCard customHeader={customHeader} style={styles.card}>
          <Animated.View style={[styles.exercisesContainer, { height: animatedHeight, overflow: 'hidden' }]}>
            {displayExercises.map(exercise => (
              <ExerciseItem key={exercise.id} exercise={exercise} unit={unit} />
            ))}
            <View>
              {!isExpanded && exercises.length > 1 ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.moreExercises}>
                  <Paragraph style={styles.moreExercisesText}>+{exercises.length - 1} more exercises</Paragraph>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </Animated.View>
          {isUpcoming && (
            <View style={styles.buttonContainer}>
              <PrimaryButton title={workoutQuery.data ? 'Resume Workout' : 'Start Workout'} onPress={startWorkout} />
            </View>
          )}
        </DashboardCard>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  title: {
    flex: 1,
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
  },
  subTitleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.newUi.primary.main,
  },
  subTitle: {
    fontSize: theme.fontSize.extraSmall,
    fontWeight: 'bold',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.newUi.primary.main,
  },
  exercisesContainer: {
    gap: 10, // Slightly reduced gap for more compact layout
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Slightly increased padding for better touch targets
    paddingHorizontal: 12,
    backgroundColor: theme.colors.newUi.background,
    borderRadius: theme.borderRadius.small,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.newUi.primary.main,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.newUi.text.primary,
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: theme.fontSize.extraSmall,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.newUi.gray.light,
    marginBottom: 0,
  },
  moreExercises: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.newUi.background,
    borderRadius: theme.borderRadius.small,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.newUi.gray.light,
  },
  moreExercisesText: {
    fontSize: theme.fontSize.extraSmall,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.newUi.gray.light,
    fontStyle: 'italic',
    marginBottom: 0,
  },
  chevron: {
    marginLeft: 12,
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  chevronText: {
    fontSize: 16,
    color: theme.colors.newUi.primary.main,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
})
