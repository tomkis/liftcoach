import {
  ExerciseAssesment,
  ExerciseAssesmentScore,
  HardAssesmentTag,
  PendingWorkingExercise,
  ProgressionMode,
  Unit,
  WorkingSetState,
} from '@/mobile/domain'
import { formatWeight } from '@/mobile/domain/utils/format-weight'
import React, { useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { NumericalInput } from '@/mobile/ui/ds/inputs'
import { CycleProgressCircle } from '@/mobile/ui/workout/components/ux/cycle-progress-circle'
import { HardAssessmentModal } from '@/mobile/ui/workout/components/ux/hard-assessment-modal'
import { IncompleteSetsModal } from '@/mobile/ui/workout/components/ux/incomplete-sets-modal'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { Checkbox } from '@/mobile/ui/ds/controls'
import { CardTitle } from '@/mobile/ui/ds/typography'
import CogwheelFilled from '@/mobile/ui/icons/cogwheel-filled'

const parseDecimal = (value: string) => parseFloat(value.replace(',', '.'))

const CARD_PADDING = 18

const styles = StyleSheet.create({
  paddedContent: {
    paddingTop: CARD_PADDING,
    paddingLeft: CARD_PADDING,
    paddingRight: CARD_PADDING,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleButton: {
    paddingHorizontal: 8,
    marginTop: -5,
  },
  setsCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginTop: CARD_PADDING,
    overflow: 'hidden',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 40,
    borderBottomWidth: 2,
    borderColor: theme.colors.background,
  },
  failedSetRow: {
    backgroundColor: theme.colors.primary.negative,
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  setDetails: {
    fontSize: 13,
    color: '#666',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 0.15,
  },
  completedSetText: {
    color: '#1b4400',
  },
  failedSetText: {
    color: '#4c0000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 8,
    width: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    height: 32,
    lineHeight: 32,
    textAlign: 'right',
  },
  completedStatusText: {
    color: '#1b4400',
  },
  failedStatusText: {
    color: '#4c0000',
  },
  h2: {
    fontSize: theme.fontSize.medium,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.text.primary,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontSize: 16,
    fontFamily: theme.font.sairaRegular,
  },
})

export const ExercisePending = (props: {
  active: boolean
  pendingExercise: PendingWorkingExercise
  hasMoreExercises: boolean
  onSkipped: (pendingExerciseId: string, newExerciseId: string | null) => void
  onNext: (exerciseAssesment: ExerciseAssesment | null) => void
  onExtraActions: () => void
  onSetChanged: (setId: string, state: WorkingSetState) => void
  onWeightChanged: (exerciseId: string, newWeight: number) => void
  onRepsChanged: (exerciseId: string, newReps: number) => void
  unit: Unit
  progressionMode: ProgressionMode
}) => {
  const { pendingExercise } = props
  const [showIncompleteSetsModal, setShowIncompleteSetsModal] = useState(false)
  const [showHardAssessmentModal, setShowHardAssessmentModal] = useState(false)
  const [customWeight, setCustomWeight] = useState('')
  const [customReps, setCustomReps] = useState('')

  const isCustomMode = props.progressionMode === ProgressionMode.Custom
  const hasBlankSets = pendingExercise.sets.some(set => set.state === WorkingSetState.pending && (set.weight === null || set.reps === null))
  const showCustomInputs = isCustomMode && hasBlankSets

  const handleCustomConfirm = () => {
    const parsedWeight = parseDecimal(customWeight)
    const parsedReps = parseInt(customReps, 10)
    if (!isNaN(parsedWeight) && parsedWeight > 0) {
      props.onWeightChanged(pendingExercise.id, parsedWeight)
    }
    if (!isNaN(parsedReps) && parsedReps > 0) {
      props.onRepsChanged(pendingExercise.id, parsedReps)
    }
  }

  const { data: cycleProgress } = trpc.workout.getCycleProgress.useQuery(
    {
      exerciseId: pendingExercise.exercise.id,
    },
    { enabled: props.active }
  )

  const handleSetFailed = (id: string) => {
    const currentSet = pendingExercise.sets.find(set => set.id === id)
    if (!currentSet) {
      throw new Error('Illegal State')
    }

    props.onSetChanged(
      id,
      currentSet.state === WorkingSetState.failed ? WorkingSetState.pending : WorkingSetState.failed
    )
  }

  const handleSetDone = (id: string) => {
    const currentSet = pendingExercise.sets.find(set => set.id === id)
    if (!currentSet) {
      throw new Error('Illegal State')
    }

    props.onSetChanged(id, currentSet.state === WorkingSetState.done ? WorkingSetState.pending : WorkingSetState.done)
  }

  const exerciseName = pendingExercise.exercise.name

  // Check if all sets are completed (either done or failed)
  const pendingSets = pendingExercise.sets.filter(set => set.state === WorkingSetState.pending)
  const failedSets = pendingExercise.sets.filter(set => set.state === WorkingSetState.failed)
  const allSetsCompleted = pendingSets.length === 0
  const hasFailedSets = failedSets.length > 0

  const handleNextButtonPress = () => {
    if (props.progressionMode === ProgressionMode.Custom) {
      props.onNext(null)
      return
    }

    if (allSetsCompleted) {
      if (hasFailedSets) {
        setShowHardAssessmentModal(true)
      } else {
        props.onNext({ assesment: ExerciseAssesmentScore.Ideal })
      }
    } else {
      setShowIncompleteSetsModal(true)
    }
  }

  const handleConfirmIncomplete = () => {
    setShowIncompleteSetsModal(false)
    props.onNext({ assesment: ExerciseAssesmentScore.Ideal })
  }

  const handleCancelIncomplete = () => {
    setShowIncompleteSetsModal(false)
  }

  const handleHardAssessmentConfirm = (assesmentTag: HardAssesmentTag) => {
    setShowHardAssessmentModal(false)
    props.onNext({
      assesment: ExerciseAssesmentScore.Hard,
      assesmentTag,
    })
  }

  const handleHardAssessmentCancel = () => {
    setShowHardAssessmentModal(false)
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={24}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingTop: CARD_PADDING + 10,
            paddingBottom: 100,
          }}
        >
          <View style={styles.card}>
            <View style={styles.paddedContent}>
              <View style={styles.titleContainer}>
                <CardTitle>{exerciseName}</CardTitle>
                <TouchableOpacity style={styles.titleButton} onPress={props.onExtraActions}>
                  <CogwheelFilled color={theme.colors.primary.main} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 16, paddingHorizontal: CARD_PADDING, paddingBottom: CARD_PADDING }}>
              {cycleProgress && (
                <CycleProgressCircle
                  animate={props.active}
                  lastWeek={pendingExercise.sets.map(set => {
                    switch (set.state) {
                      case WorkingSetState.done:
                        return 'completed'
                      case WorkingSetState.failed:
                        return 'failed'
                      case WorkingSetState.pending:
                        return 'pending'
                      default:
                        throw new Error('Illegal State')
                    }
                  })}
                  weeks={cycleProgress.map((progress, index) => ({
                    title: progress.isTesting ? 'Testing' : `Cycle ${index + 1}`,
                    testing: progress.isTesting,
                    sets: progress.sets,
                  }))}
                />
              )}
            </View>
          </View>
          {showCustomInputs ? (
            <>
              <View style={{ marginTop: CARD_PADDING }}>
                <Text style={[styles.setDetails, { color: theme.colors.text.primary, marginBottom: 12 }]}>
                  {pendingExercise.sets.length} SETS — ENTER YOUR WEIGHT AND REPS
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={styles.inputWrapper}>
                    <NumericalInput
                      value={customWeight}
                      keyboardType="decimal-pad"
                      onChange={setCustomWeight}
                      placeholder="Weight"
                    />
                    <Text style={styles.inputLabel}>{props.unit === 'metric' ? 'kg' : 'lbs'}</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <NumericalInput
                      value={customReps}
                      keyboardType="number-pad"
                      onChange={setCustomReps}
                      placeholder="Reps"
                    />
                    <Text style={styles.inputLabel}>reps</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <PrimaryButton
                  title="Confirm"
                  style={{ flex: 1 }}
                  onPress={handleCustomConfirm}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.setsCard}>
                {pendingExercise.sets.map((set, index) => {
                  const textStyle = set.state !== 'pending' ? styles.completedSetText : undefined

                  return (
                    <View
                      key={set.id}
                      style={[styles.setRow, index === pendingExercise.sets.length - 1 && { borderBottomWidth: 0 }]}
                    >
                      <View style={styles.setInfo}>
                        <Text
                          style={[
                            styles.setDetails,
                            textStyle,
                            {
                              color: theme.colors.text.primary,
                            },
                          ]}
                        >
                          {set.reps ?? '–'} reps × {formatWeight(set.weight)} {props.unit === 'metric' ? 'kg' : 'lbs'}
                        </Text>
                      </View>
                      <View style={styles.checkboxContainer}>
                        <Checkbox
                          checked={set.state === 'failed'}
                          onPress={() => handleSetFailed(set.id)}
                          label="Failed"
                          color={
                            set.state === WorkingSetState.pending
                              ? theme.colors.primary.main
                              : theme.colors.text.primary
                          }
                        />
                        <Checkbox
                          checked={set.state === 'done'}
                          onPress={() => handleSetDone(set.id)}
                          label="Done"
                          color={
                            set.state === WorkingSetState.pending
                              ? theme.colors.primary.main
                              : theme.colors.text.primary
                          }
                        />
                      </View>
                    </View>
                  )
                })}
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <PrimaryButton
                  title={props.hasMoreExercises ? 'Next Exercise' : 'Finish Workout!'}
                  style={{ flex: 1 }}
                  onPress={handleNextButtonPress}
                />
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <IncompleteSetsModal
        visible={showIncompleteSetsModal}
        onConfirm={handleConfirmIncomplete}
        onCancel={handleCancelIncomplete}
      />
      <HardAssessmentModal
        visible={showHardAssessmentModal}
        onConfirm={handleHardAssessmentConfirm}
        onCancel={handleHardAssessmentCancel}
      />
    </>
  )
}
