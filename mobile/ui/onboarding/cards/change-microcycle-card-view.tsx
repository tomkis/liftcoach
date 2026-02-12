import { getTrainingFrequencyCount } from '@/mobile/domain'
import { useState } from 'react'
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { ProposeExerciseReplacementModal } from '@/mobile/ui/workout/components/ux/adjust-exercise-overlay'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { BodyText } from '@/mobile/ui/ds/typography'
import Pencil from '@/mobile/ui/icons/pencil'

const getWorkoutTitle = (index: number) => {
  if (index === 0) {
    return 'First Workout'
  } else if (index === 1) {
    return 'Second Workout'
  } else if (index === 2) {
    return 'Third Workout'
  } else if (index === 3) {
    return 'Fourth Workout'
  } else if (index === 4) {
    return 'Fifth Workout'
  } else if (index === 5) {
    return 'Sixth Workout'
  }
}

const Foobar = (props: {
  exerciseId: string
  exerciseName: string
  onExerciseReplace: (exerciseId: string, replacementExerciseId: string) => void
  onCancel: () => void
  handleReplaceExerciseCancel: () => void
}) => {
  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ProposeExerciseReplacementModal
            exerciseId={props.exerciseId}
            exerciseName={props.exerciseName}
            onExerciseReplace={props.onExerciseReplace}
            onCancel={props.onCancel}
            handleReplaceExerciseCancel={props.handleReplaceExerciseCancel}
          />
        </View>
      </View>
    </Modal>
  )
}

export const ChangeMicrocycleCardView = () => {
  const trpcUtils = trpc.useUtils()
  const replaceExercise = trpc.workout.replaceExercise.useMutation()
  const { data: onboardingInfo, isLoading: isOnboardingInfoLoading } = trpc.user.getOnboardingInfo.useQuery()
  const { data: microcycle, isLoading: isMicrocycleLoading } = trpc.workout.getCurrentMicrocycle.useQuery()
  const insets = useSafeAreaInsets()
  const onboardingContext = useOnboardingContext()
  const tracking = useTracking()

  const [selectedExercise, setSelectedExercise] = useState<{
    id: string
    name: string
    workoutId: string
  } | null>(null)

  if (isOnboardingInfoLoading || isMicrocycleLoading || !microcycle || !onboardingInfo) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.loadingText}>Loading microcycle...</Text>
      </View>
    )
  }

  const trainingFrequencyDays = getTrainingFrequencyCount(onboardingInfo.trainingFrequency)
  const realNumberOfTrainings = microcycle.workouts.length

  const handleEditExercise = (exercise: { id: string; name: string; workoutId: string }) => {
    setSelectedExercise(exercise)
  }

  const handleCloseAdjustOverlay = () => {
    setSelectedExercise(null)
  }

  const handleExerciseReplace = async (exerciseId: string, replacementExerciseId: string) => {
    if (!selectedExercise) {
      throw new Error('Illegal State')
    }

    await replaceExercise.mutateAsync({
      workoutExerciseId: exerciseId,
      replacementExerciseId,
      workoutId: selectedExercise.workoutId,
    })
    await trpcUtils.workout.getCurrentMicrocycle.invalidate()

    handleCloseAdjustOverlay()
    tracking.onboarding.exerciseReplaced(exerciseId, replacementExerciseId)
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ScreenHeading style={styles.title}>Adjust The Plan</ScreenHeading>
              <BodyText style={styles.subtitle}>
                Feel free to swap out individual exercises for ones you like more.
              </BodyText>
              {(onboardingInfo.trainingDays !== trainingFrequencyDays ||
                realNumberOfTrainings !== onboardingInfo.trainingDays) && (
                <>
                  <BodyText style={styles.subtitle}>
                    You chose {onboardingInfo.trainingDays} days/week, but we optimized the plan for{' '}
                    {realNumberOfTrainings} days.
                  </BodyText>
                  <BodyText style={styles.subtitle}>Train as often as you like, the plan adapts.</BodyText>
                </>
              )}
            </View>
            <View style={styles.workoutsSection}>
              {microcycle.workouts
                .sort((a, b) => a.index - b.index)
                .map(workout => (
                  <View key={workout.id} style={styles.workoutCard}>
                    <View style={styles.workoutHeader}>
                      <Text style={styles.dayTitle}>{getWorkoutTitle(workout.index)}</Text>
                    </View>

                    <View style={styles.exercisesContainer}>
                      <FlatList
                        data={workout.exercises}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index: exerciseIndex }) => (
                          <View
                            style={[
                              styles.exerciseItem,
                              exerciseIndex === workout.exercises.length - 1 && styles.exerciseItemLast,
                            ]}
                          >
                            <View style={styles.exerciseContent}>
                              <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                            </View>
                            <Pressable
                              style={styles.editButton}
                              onPress={() => {
                                handleEditExercise({
                                  id: item.id,
                                  name: item.exercise.name,
                                  workoutId: workout.id,
                                })
                              }}
                            >
                              <Pencil color={theme.colors.gray.light} />
                            </Pressable>
                          </View>
                        )}
                        scrollEnabled={false}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 20 }]}>
          <PrimaryButton
            title="Confirm Training Plan"
            onPress={onboardingContext.cycleAdjusted}
            style={styles.confirmButton}
          />
        </View>
      </View>
      {selectedExercise && (
        <Foobar
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.name}
          onExerciseReplace={handleExerciseReplace}
          onCancel={handleCloseAdjustOverlay}
          handleReplaceExerciseCancel={handleCloseAdjustOverlay}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontSize: theme.fontSize.medium,
    fontFamily: theme.font.sairaRegular,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
  },
  workoutsSection: {
    marginBottom: 24,
  },
  workoutCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  dayTitle: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.main,
  },
  workoutTitle: {
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  exercisesContainer: {
    paddingHorizontal: 18,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  exerciseItemLast: {
    borderBottomWidth: 0,
  },
  exerciseContent: {
    flex: 1,
  },
  editButton: {},
  exerciseName: {
    fontSize: 14,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.text.primary,
  },
  exerciseDetails: {
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.gray.light,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: theme.font.sairaBold,
    color: theme.colors.text.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.gray.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomButtonContainer: {
    paddingTop: 20,
  },
  confirmButton: {
    width: '100%',
  },
})
