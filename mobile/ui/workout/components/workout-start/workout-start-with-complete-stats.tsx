import { ProgressionType, WorkoutStatsExercise } from '@/mobile/domain'
import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { match } from 'ts-pattern'

import { theme } from '@/mobile/theme/theme'
import ChevronDown from '@/mobile/ui/icons/chevron-down'
import ChevronUp from '@/mobile/ui/icons/chevron-up'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 0,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  exerciseIcon: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.newUi.primary.main,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginTop: -5,
  },
  exerciseName: {
    color: theme.colors.newUi.text.primary,
    fontSize: theme.fontSize.medium,
    fontFamily: theme.font.sairaBold,
    marginBottom: 4,
  },
  exerciseDetails: {
    color: theme.colors.newUi.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
  },
  progressionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  progressionText: {
    fontSize: theme.fontSize.extraSmall,
    fontFamily: theme.font.sairaSemiBold,
    textTransform: 'uppercase',
  },
  redPill: {
    backgroundColor: theme.colors.newUi.primary.negative,
  },
  greenPill: {
    backgroundColor: '#4caf50',
  },
  bluePill: {
    backgroundColor: '#2196f3',
  },
  whiteText: {
    color: '#fff',
  },
  expandedContent: {
    backgroundColor: theme.colors.newUi.primary.main,
    borderBottomLeftRadius: theme.borderRadius.medium,
    borderBottomRightRadius: theme.borderRadius.medium,
    minHeight: 0,
  },
  barsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  bar: {
    height: 22,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    minWidth: 4,
  },
  projectedBar: {
    backgroundColor: theme.colors.newUi.primary.contrastText,
  },
  testedBar: {
    backgroundColor: theme.colors.newUi.primary.contrastText,
  },
  barLabel: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: theme.fontSize.extraSmall,
    fontFamily: theme.font.sairaBold,
    minWidth: 150,
  },
  barPercentage: {
    color: theme.colors.newUi.primary.main,
    fontFamily: theme.font.sairaBold,
    textAlign: 'center',
  },
})

const progressionMessages = {
  [ProgressionType.KeepProgressSuboptimalLifestyle]: [
    'Recovery matters more than progression right now.',
    'External stress is a valid training factor.',
    'Sometimes less is more.',
    'Your body needs a break beyond the gym.',
    'Pushing now would risk overtraining.',
    'Stress levels are impacting performance.',
    'Lifestyle factors are slowing recovery.',
    'You can’t build on a shaky foundation.',
    'Training adapts to your whole life, not just the gym.',
    'Rest is part of the process, too.',
  ],
  [ProgressionType.ProgressedReps]: [
    'You’ve been consistent and it’s showing.',
    'Performance has been trending up.',
    'Let’s keep the momentum going.',
    'Your recent sessions have been solid.',
    'Strong effort leads to more challenge.',
    'You’ve earned a little more volume.',
    'Your form and consistency have been great.',
    'Time to push the envelope a bit.',
    'That last block showed real progress.',
    'Everything points to steady improvement.',
  ],
  [ProgressionType.NoProgressFailure]: [
    'Progress slowed a bit last week.',
    'Your body might need some extra time to recover.',
    'Recent sessions didn’t go as planned.',
    'Performance dipped slightly.',
    'We’re adjusting the pace to support your recovery.',
    'Some inconsistency was detected.',
    'Not every session is a win — that’s normal.',
    'Training has been demanding lately.',
    'Taking a step back to reset things.',
    'You’ve been pushing hard — time to pull back a bit.',
  ],
  [ProgressionType.LoweredWeightTooHeavy]: [
    'Last set looked too close to failure.',
    'You were grinding too early in the set.',
    'The weight seemed beyond target effort.',
    'Movement quality started to break down.',
    'There was too much strain in the previous session.',
    'Effort was higher than intended.',
    'Load exceeded current recovery capacity.',
    'That was pushing too far for this phase.',
    'Form started to suffer under the load.',
    'Better to pull back than push past the limit.',
  ],
  [ProgressionType.LoweredWeightBadForm]: [
    'Form was off in recent sets.',
    'Some movement patterns need cleanup.',
    'Technique started to break under load.',
    'Reps were a bit shaky last session.',
    'Let’s refocus on movement quality.',
    'Form slipped under pressure.',
    'Clean technique builds better strength.',
    'Execution was inconsistent last time.',
    'Focus shifts to control and precision.',
  ],
  [ProgressionType.LoweredWeightTooManyFailures]: [
    'You missed several reps recently.',
    'Failure rate was higher than usual.',
    'We’re keeping things sustainable.',
    'The goal is consistency, not burnout.',
    'Missed reps are a sign to adjust.',
    'Failed lifts are part of learning.',
    'Better to reset than stall out.',
    'The plan adapts when failure stacks up.',
    'Volume without quality holds progress back.',
    'Backtracking now prevents hitting a wall later.',
  ],
  [ProgressionType.RegressTooMuchVolume]: [
    'You’ve been doing a lot of work lately.',
    'Fatigue may be building up.',
    'Volume was too high to recover well.',
    'Overreaching affects quality and recovery.',
    'We’re reducing demand to support adaptation.',
    'Training load was a little too aggressive.',
    'Taking pressure off so you can come back stronger.',
    'You’ve earned a lighter session.',
    'Let’s give your body time to recharge.',
    'The last phase was more than enough stimulus.',
  ],
}

const getChartData = (projected1Rm: number, lastTested1Rm: number) => {
  const minValue = Math.min(projected1Rm, lastTested1Rm)
  const zoom = Math.floor(minValue * 0.9)

  const zoomedInProjected = projected1Rm - zoom
  const zoomedInTested = lastTested1Rm - zoom

  const projectedPercentage = zoomedInProjected > zoomedInTested ? 100 : (zoomedInProjected / zoomedInTested) * 100
  const testedPercentage = zoomedInTested > zoomedInProjected ? 100 : (zoomedInTested / zoomedInProjected) * 100

  return {
    projected1Rm,
    lastTested1Rm,
    projectedPercentage,
    testedPercentage,
  }
}

interface CompleteWorkoutStatsExercise extends WorkoutStatsExercise {
  weight: number
  projected1Rm: number
  lastTested1Rm: number
  exerciseStatus: ProgressionType
}

export const isWithCompleteWorkoutStats = (
  workoutStats: WorkoutStatsExercise[]
): workoutStats is Array<CompleteWorkoutStatsExercise> => {
  return workoutStats.every(
    stat =>
      stat.projected1Rm !== null && stat.lastTested1Rm !== null && stat.weight !== null && stat.exerciseStatus !== null
  )
}

export const WorkoutStartWithCompleteStats = (props: { exercises: CompleteWorkoutStatsExercise[] }) => {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)
  const animatedValues = useRef<{ [key: number]: Animated.Value }>({})
  const barWidthValues = useRef<{ [key: number]: { projected: Animated.Value; tested: Animated.Value } }>({})
  const barOpacityValues = useRef<{ [key: number]: { projected: Animated.Value; tested: Animated.Value } }>({})

  // Effect to animate bar widths when exercise is expanded
  useEffect(() => {
    if (expandedExercise !== null && barWidthValues.current[expandedExercise]) {
      const chartData = getChartData(
        props.exercises[expandedExercise].projected1Rm,
        props.exercises[expandedExercise].lastTested1Rm
      )

      // Initialize opacity values if they don't exist
      if (!barOpacityValues.current[expandedExercise]) {
        barOpacityValues.current[expandedExercise] = {
          projected: new Animated.Value(0),
          tested: new Animated.Value(0),
        }
      }

      // Start bar animation after a delay to let the toggle animation complete
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(barWidthValues.current[expandedExercise].projected, {
            toValue: chartData.projectedPercentage,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barWidthValues.current[expandedExercise].tested, {
            toValue: chartData.testedPercentage,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacityValues.current[expandedExercise].projected, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacityValues.current[expandedExercise].tested, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start()
      }, 300) // 300ms delay to match the toggle animation duration
    }
  }, [expandedExercise, props.exercises])

  const toggleExercise = (index: number) => {
    if (!animatedValues.current[index]) {
      animatedValues.current[index] = new Animated.Value(0)
    }

    // Initialize bar width animated values if they don't exist
    if (!barWidthValues.current[index]) {
      barWidthValues.current[index] = {
        projected: new Animated.Value(0),
        tested: new Animated.Value(0),
      }
    }

    // Initialize bar opacity animated values if they don't exist
    if (!barOpacityValues.current[index]) {
      barOpacityValues.current[index] = {
        projected: new Animated.Value(0),
        tested: new Animated.Value(0),
      }
    }

    const isExpanded = expandedExercise === index

    if (isExpanded) {
      // Collapse animation
      Animated.timing(animatedValues.current[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start()

      // Animate bar widths to 0 after collapse animation completes
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(barWidthValues.current[index].projected, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barWidthValues.current[index].tested, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacityValues.current[index]?.projected || new Animated.Value(0), {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barOpacityValues.current[index]?.tested || new Animated.Value(0), {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start()
      }, 300) // 300ms delay to match the collapse animation duration

      setExpandedExercise(null)
    } else {
      // Collapse previously expanded exercise if any
      if (expandedExercise !== null && animatedValues.current[expandedExercise]) {
        Animated.timing(animatedValues.current[expandedExercise], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start()

        // Animate previous exercise's bar widths to 0 after collapse animation completes
        if (barWidthValues.current[expandedExercise]) {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(barWidthValues.current[expandedExercise].projected, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(barWidthValues.current[expandedExercise].tested, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(barOpacityValues.current[expandedExercise]?.projected || new Animated.Value(0), {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(barOpacityValues.current[expandedExercise]?.tested || new Animated.Value(0), {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
            ]).start()
          }, 300) // 300ms delay to match the collapse animation duration
        }
      }

      // Expand animation
      Animated.timing(animatedValues.current[index], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start()

      setExpandedExercise(index)
    }
  }

  return props.exercises.map((exercise, index) => {
    const isExpanded = expandedExercise === index

    // Initialize animated value for this exercise if it doesn't exist
    if (!animatedValues.current[index]) {
      animatedValues.current[index] = new Animated.Value(isExpanded ? 1 : 0)
    }

    return (
      <View key={index} style={styles.exerciseCard}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'flex-start', padding: CARD_PADDING }}
          onPress={() => toggleExercise(index)}
          activeOpacity={1}
        >
          <View style={styles.exerciseIcon}>
            {isExpanded ? (
              <ChevronDown color={theme.colors.newUi.primary.contrastText} style={{ marginTop: -5 }} />
            ) : (
              <ChevronUp color={theme.colors.newUi.primary.contrastText} style={{ marginTop: -5 }} />
            )}
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              <Text style={styles.emphasized}>{exercise.sets}</Text> sets of{' '}
              <Text style={styles.emphasized}>{exercise.reps}</Text> reps {exercise.weight && `@ ${exercise.weight} kg`}
            </Text>
          </View>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.expandedContent,
            {
              height:
                animatedValues.current[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 180],
                }) || 0,
              opacity: animatedValues.current[index] || 0,
              overflow: 'hidden',
            },
          ]}
        >
          <View style={{ padding: CARD_PADDING, flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.barLabel}>
                {
                  progressionMessages[exercise.exerciseStatus][
                    Math.floor(Math.random() * progressionMessages[exercise.exerciseStatus].length)
                  ]
                }
              </Text>
              <Text style={styles.barLabel}>
                {match(exercise.exerciseStatus)
                  .with(ProgressionType.ProgressedReps, () => 'LiftCoach is increasing the reps for this session.')
                  .with(
                    ProgressionType.NoProgressFailure,
                    () => 'LiftCoach is slowing down the progression due to recent struggles.'
                  )
                  .with(
                    ProgressionType.LoweredWeightTooHeavy,
                    () => 'LiftCoach is lowering the weight for this session.'
                  )
                  .with(
                    ProgressionType.LoweredWeightBadForm,
                    () => 'LiftCoach is lowering the weight for this session.'
                  )
                  .with(
                    ProgressionType.LoweredWeightTooManyFailures,
                    () => 'LiftCoach is lowering the weight due to recent failures.'
                  )
                  .with(
                    ProgressionType.RegressTooMuchVolume,
                    () => 'LiftCoach is lowering the weight due to recent overreaching.'
                  )
                  .with(
                    ProgressionType.KeepProgressSuboptimalLifestyle,
                    () => 'LiftCoach is holding off progression for now.'
                  )
                  .exhaustive()}
              </Text>
            </View>
            <View>
              {(() => {
                if (exercise.projected1Rm === null || exercise.lastTested1Rm === null) {
                  return <></>
                }

                const chartData = getChartData(exercise.projected1Rm, exercise.lastTested1Rm)

                // Initialize bar width animated values if they don't exist
                if (!barWidthValues.current[index]) {
                  barWidthValues.current[index] = {
                    projected: new Animated.Value(0),
                    tested: new Animated.Value(0),
                  }
                }

                return (
                  <>
                    <View style={styles.barsContainer}>
                      <View style={styles.barContainer}>
                        <Text style={styles.barLabel}>Last Tested 1RM</Text>
                        <View style={{ flex: 1 }}>
                          <Animated.View
                            style={[
                              styles.bar,
                              styles.testedBar,
                              {
                                width: barWidthValues.current[index].tested.interpolate({
                                  inputRange: [0, 100],
                                  outputRange: ['0%', '100%'],
                                }),
                                opacity: barOpacityValues.current[index]?.tested || 0,
                              },
                            ]}
                          >
                            <Text style={styles.barPercentage}>{chartData.lastTested1Rm.toFixed(2)} kg</Text>
                          </Animated.View>
                        </View>
                      </View>
                      <View style={styles.barContainer}>
                        <Text style={styles.barLabel}>Training Effort 1RM</Text>
                        <View style={{ flex: 1 }}>
                          <Animated.View
                            style={[
                              styles.bar,
                              styles.projectedBar,
                              {
                                width: barWidthValues.current[index].projected.interpolate({
                                  inputRange: [0, 100],
                                  outputRange: ['0%', '100%'],
                                }),
                                opacity: barOpacityValues.current[index]?.projected || 0,
                              },
                            ]}
                          >
                            <Text style={styles.barPercentage}>{chartData.projected1Rm.toFixed(2)} kg</Text>
                          </Animated.View>
                        </View>
                      </View>
                    </View>
                  </>
                )
              })()}
            </View>
          </View>
        </Animated.View>
      </View>
    )
  })
}
