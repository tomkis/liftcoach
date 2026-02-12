import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { WorkingSetState } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import ChevronLeft from '@/mobile/ui/icons/chevron-left'
import { getTrainingTitle } from '@/mobile/ui/ux/get-training-title'

type DerivedState = 'completed' | 'active' | 'pending'

const stateColor = (state: DerivedState) => {
  if (state === 'completed') return theme.colors.newUi.status.success
  if (state === 'active') return theme.colors.newUi.primary.main
  return theme.colors.newUi.text.muted
}

export const ActivePlanDetailScreen = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const trpcUtils = trpc.useUtils()
  const { data: activePlan, isLoading: isLoadingPlan } = trpc.workout.getActivePlanSummary.useQuery()
  const { data: microcycle, isLoading: isLoadingMicrocycle } = trpc.workout.getCurrentMicrocycle.useQuery()

  useFocusEffect(
    useCallback(() => {
      trpcUtils.workout.getActivePlanSummary.invalidate()
      trpcUtils.workout.getCurrentMicrocycle.invalidate()
    }, [trpcUtils])
  )

  if (isLoadingPlan || isLoadingMicrocycle || !activePlan || !microcycle) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={theme.colors.newUi.primary.main} />
      </View>
    )
  }

  const progress = Math.round((activePlan.workoutsCompleted / activePlan.totalWorkouts) * 100)

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
              <ChevronLeft color={theme.colors.newUi.primary.main} size={24} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{activePlan.splitType}</Text>
              <Text style={styles.headerSub}>
                WEEK {activePlan.currentWeek} OF {activePlan.totalWeeks}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {microcycle.workouts.map((w, wi) => {
          const workoutState: DerivedState = w.state === 'completed' ? 'completed' : w.active ? 'active' : 'pending'
          const color = stateColor(workoutState)
          const isLast = wi === microcycle.workouts.length - 1
          const focus = getTrainingTitle(w)
          const muscles = [...new Set(w.exercises.map(e => e.exercise.muscleGroup))]

          return (
            <View key={w.id} style={styles.timelineItem}>
              <View style={styles.timelineTrack}>
                {workoutState === 'active' ? (
                  <View style={styles.nodeActive}>
                    <View style={styles.nodeActiveRing} />
                    <View style={styles.nodeActiveDot} />
                  </View>
                ) : (
                  <View
                    style={[styles.node, workoutState === 'completed' ? styles.nodeCompleted : styles.nodePending]}
                  />
                )}
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor:
                          workoutState === 'completed'
                            ? theme.colors.newUi.status.success
                            : theme.colors.newUi.border.default,
                      },
                    ]}
                  />
                )}
              </View>

              <View style={styles.content}>
                <View style={styles.dayHeader}>
                  <Text style={[styles.dayFocus, { color }]}>{focus}</Text>
                  <Text style={styles.dayIndex}>DAY {w.index + 1}</Text>
                </View>

                <View style={styles.muscleLine}>
                  {muscles.map(m => (
                    <Text key={m} style={styles.muscleText}>
                      {m.toUpperCase()}
                    </Text>
                  ))}
                </View>

                <View style={styles.exerciseBlock}>
                  {w.exercises.map(ex => {
                    const setsCompleted = ex.sets.filter(s => s.state === WorkingSetState.done).length
                    const done = setsCompleted >= ex.targetSets
                    return (
                      <View key={ex.id} style={styles.exRow}>
                        <View style={styles.exLeftCol}>
                          <View style={[styles.exBar, done && styles.exBarDone]} />
                          <Text style={[styles.exName, done && styles.exNameDone]}>{ex.exercise.name}</Text>
                        </View>
                        <Text style={styles.exRx}>
                          {ex.targetSets}x{ex.targetReps}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.newUi.background,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerCard: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
  },
  headerSub: {
    fontSize: theme.fontSize.extraSmall,
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.newUi.primary.main,
    marginTop: -2,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: theme.colors.newUi.border.default,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: theme.colors.newUi.primary.main,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 14,
    color: theme.colors.newUi.primary.main,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 160,
    paddingHorizontal: 16,
  },
  timelineTrack: {
    width: 32,
    alignItems: 'center',
  },
  node: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  nodeCompleted: {
    backgroundColor: theme.colors.newUi.status.success,
  },
  nodePending: {
    borderWidth: 1.5,
    borderColor: theme.colors.newUi.border.light,
    backgroundColor: 'transparent',
  },
  nodeActive: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActiveRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.newUi.primary.main,
  },
  nodeActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  dayFocus: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 20,
    textTransform: 'uppercase',
  },
  dayIndex: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 10,
    color: theme.colors.newUi.text.secondary,
    letterSpacing: 1,
    marginLeft: 'auto',
  },
  muscleLine: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  muscleText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 8,
    color: theme.colors.newUi.text.tertiary,
    letterSpacing: 1.2,
  },
  exerciseBlock: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: 8,
    padding: 12,
  },
  exRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  exLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  exBar: {
    width: 2,
    height: 14,
    backgroundColor: theme.colors.newUi.text.dim,
    borderRadius: 1,
  },
  exBarDone: {
    backgroundColor: theme.colors.newUi.status.success,
  },
  exName: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 12,
    color: theme.colors.newUi.text.primary,
  },
  exNameDone: {
    color: theme.colors.newUi.text.muted,
  },
  exRx: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 11,
    color: theme.colors.newUi.text.hint,
  },
})
