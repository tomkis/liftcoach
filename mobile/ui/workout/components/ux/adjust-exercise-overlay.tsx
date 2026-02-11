import Slider from '@react-native-community/slider'
import { Unit } from '@/mobile/domain'
import React, { useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { SecondaryButton } from '@/mobile/ui/onboarding/cards/ux/secondary-button'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.newUi.backgroundLight,
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
  modalTitle: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.gray.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    marginVertical: 20,
  },
  option: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 20,
  },
  weightInputContainer: {
    marginVertical: 20,
  },
  weightInputLabel: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.newUi.text.primary,
    textAlign: 'left',
    marginBottom: 12,
  },
  currentWeightContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  currentWeightText: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    color: theme.colors.newUi.text.primary,
    marginBottom: 8,
  },
  currentWeightUnit: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.gray.light,
    textTransform: 'uppercase',
  },
  adjustmentButtonsContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  weightSliderContainer: {
    marginVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  weightDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weightDisplayText: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    color: theme.colors.newUi.primary.main,
  },
  weightDisplayUnit: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.gray.light,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  sliderLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.newUi.gray.light,
    textAlign: 'center',
  },
  currentWeightDisplayText: {
    fontSize: theme.fontSize.medium,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    color: theme.colors.newUi.primary.contrastText,
  },
  currentWeightDisplayUnit: {
    fontSize: theme.fontSize.small,
    color: theme.colors.newUi.primary.contrastText,
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  resetButtonContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  adjustmentButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.small,
    minWidth: 40,
    alignItems: 'center',
  },
  adjustmentButtonPrimary: {
    backgroundColor: theme.colors.newUi.primary.main,
  },
  adjustmentButtonSecondary: {
    backgroundColor: theme.colors.newUi.gray.light,
  },
  adjustmentButtonText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    color: theme.colors.newUi.text.primary,
  },
  adjustmentButtonTextPrimary: {
    color: theme.colors.newUi.primary.contrastText,
  },
  weightInputButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  weightInputButton: {
    flex: 1,
    padding: 12,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: theme.colors.newUi.primary.main,
  },
  cancelInputButton: {
    backgroundColor: theme.colors.newUi.gray.light,
  },
  buttonText: {
    fontSize: theme.fontSize.small,
    fontWeight: 'bold',
    color: theme.colors.newUi.text.primary,
  },
  confirmButtonText: {
    color: theme.colors.newUi.backgroundLight,
  },
  exerciseList: {
    maxHeight: 300,
    marginVertical: 12,
  },
  exerciseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.newUi.gray.light,
  },
  exerciseName: {
    fontSize: theme.fontSize.small,
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
    textTransform: 'uppercase',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.text.primary,
  },
  noExercisesText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.gray.light,
  },
  replacementButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  replacementButton: {
    flex: 1,
    padding: 12,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
  },

  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inputLabel: {
    color: theme.colors.newUi.text.primary,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontSize: 16,
    fontFamily: theme.font.sairaRegular,
  },
})

interface SomethingWentWrongOverlayProps {
  visible: boolean
  onCancel: () => void
  exerciseId: string
  currentWeight?: number
  onWeightChange?: (exerciseId: string, newWeight: number) => void
  exerciseName?: string
  onExerciseReplace?: (exerciseId: string, replacementExerciseId: string) => void
  canChangeWeight?: boolean
  unit: Unit
}

export const ProposeExerciseReplacementModal = ({
  exerciseId,
  exerciseName,
  handleReplaceExerciseCancel,
  onExerciseReplace,
  onCancel,
}: Pick<SomethingWentWrongOverlayProps, 'exerciseName' | 'exerciseId' | 'onExerciseReplace' | 'onCancel'> & {
  handleReplaceExerciseCancel: () => void
}) => {
  const proposeReplacement = trpc.workout.proposeExerciseReplacementQuery.useQuery({ workoutExerciseId: exerciseId })
  const [selectedReplacementId, setSelectedReplacementId] = useState<string | null>(null)

  const handleReplaceExerciseConfirm = () => {
    if (selectedReplacementId && exerciseId && onExerciseReplace) {
      onExerciseReplace(exerciseId, selectedReplacementId)
      setSelectedReplacementId(null)
      onCancel() // Close the main modal after exercise replacement
    }
  }

  return (
    <>
      {exerciseName && (
        <>
          <Text style={[styles.weightInputLabel]}>
            Select new exercise that you train instead of{' '}
            <Text style={{ color: theme.colors.newUi.primary.main, textTransform: 'uppercase' }}>{exerciseName}</Text>.
          </Text>
        </>
      )}

      {proposeReplacement.data ? (
        <>
          {proposeReplacement.data.length ? (
            <FlatList
              data={proposeReplacement.data}
              keyExtractor={item => item.id}
              style={styles.exerciseList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.exerciseItem,
                    selectedReplacementId === item.id && {
                      backgroundColor: theme.colors.newUi.primary.main,
                    },
                  ]}
                  onPress={() => setSelectedReplacementId(item.id)}
                >
                  <Text
                    style={[
                      styles.exerciseName,
                      selectedReplacementId === item.id && { color: theme.colors.newUi.primary.contrastText },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={[styles.weightInputLabel]}>
              There&apos;s no available exercise that can be used for replacement.
            </Text>
          )}

          <Text style={[styles.weightInputLabel, { color: theme.colors.newUi.gray.light }]}>
            Replacing exercise may affect your training program.
          </Text>

          <View style={styles.replacementButtons}>
            <SecondaryButton title="Cancel" onPress={handleReplaceExerciseCancel} style={{ flex: 1 }} />
            {proposeReplacement.data.length ? (
              <PrimaryButton
                title="Confirm"
                onPress={handleReplaceExerciseConfirm}
                style={{ flex: 1 }}
                disabled={!selectedReplacementId}
              />
            ) : (
              <></>
            )}
            <View style={styles.weightInputButtons}></View>
          </View>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export const AdjustExerciseOverlay = ({
  visible,
  onCancel,
  exerciseId,
  currentWeight,
  onWeightChange,
  exerciseName,
  onExerciseReplace,
  canChangeWeight,
  unit,
}: SomethingWentWrongOverlayProps) => {
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [showReplaceExercise, setShowReplaceExercise] = useState(false)
  const [adjustedWeight, setAdjustedWeight] = useState(currentWeight || 0)

  const handleCancel = () => {
    onCancel()
  }

  const handleChangeWeightPress = () => {
    setShowWeightInput(true)
    setAdjustedWeight(currentWeight || 0)
  }

  const handleReplaceExercisePress = async () => {
    setShowReplaceExercise(true)
  }

  const handleWeightChangeConfirm = () => {
    if (exerciseId && onWeightChange) {
      onWeightChange(exerciseId, adjustedWeight)
      setShowWeightInput(false)
      onCancel() // Close the main modal after weight change
    }
  }

  const handleWeightChangeCancel = () => {
    setShowWeightInput(false)
    setAdjustedWeight(currentWeight || 0)
  }

  const handleReplaceExerciseCancel = () => {
    setShowReplaceExercise(false)
  }

  const getModalTitle = () => {
    if (showWeightInput) return 'Adjust Weight'
    if (showReplaceExercise) return 'Replace Exercise'
    return 'Adjust The Exercise'
  }

  const renderWeightAdjustment = () => {
    const unitLabel = unit === 'metric' ? 'kg' : 'lbs'
    const originalWeight = currentWeight || 0

    // Calculate slider range
    const minWeight = Math.max(0, originalWeight - (unit === 'metric' ? 10 : 25))
    const maxWeight = originalWeight + (unit === 'metric' ? 10 : 25)
    const step = unit === 'metric' ? 1 : 5

    return (
      <>
        <View style={styles.weightInputContainer}>
          <Text style={[styles.weightInputLabel, { textTransform: 'uppercase' }]}>
            Adjust the weight for the exercise
          </Text>
          <Text style={[styles.weightInputLabel, { color: theme.colors.newUi.gray.light }]}>
            It is strongly advised not to change the weight, as doing so may interfere with your training program.
          </Text>

          <View style={styles.weightSliderContainer}>
            <View style={styles.weightDisplay}>
              <Text style={styles.weightDisplayText}>{adjustedWeight}</Text>
              <Text style={styles.weightDisplayUnit}>{unitLabel}</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={minWeight}
                maximumValue={maxWeight}
                step={step}
                value={adjustedWeight}
                onValueChange={setAdjustedWeight}
                minimumTrackTintColor={theme.colors.newUi.primary.main}
                maximumTrackTintColor={theme.colors.newUi.gray.light}
                thumbTintColor={theme.colors.newUi.primary.main}
              />

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{minWeight}</Text>
                <Text style={styles.sliderLabel}>{originalWeight}</Text>
                <Text style={styles.sliderLabel}>{maxWeight}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.weightInputButtons}>
          <SecondaryButton title="Cancel" onPress={handleWeightChangeCancel} style={{ flex: 1 }} />
          <PrimaryButton title="Confirm" onPress={handleWeightChangeConfirm} style={{ flex: 1 }} />
        </View>
      </>
    )
  }

  const renderMainContent = () => {
    if (showWeightInput) {
      return renderWeightAdjustment()
    }

    if (showReplaceExercise) {
      return (
        <ProposeExerciseReplacementModal
          exerciseId={exerciseId}
          exerciseName={exerciseName}
          onExerciseReplace={onExerciseReplace}
          onCancel={handleCancel}
          handleReplaceExerciseCancel={handleReplaceExerciseCancel}
        />
      )
    }

    return (
      <>
        <View style={styles.optionsContainer}>
          {canChangeWeight && (
            <PrimaryButton title="Change Weight" onPress={handleChangeWeightPress} style={styles.option} />
          )}
          <PrimaryButton title="Replace Exercise" onPress={handleReplaceExercisePress} style={styles.option} />
        </View>

        <SecondaryButton title="Cancel" onPress={handleCancel} style={styles.cancelButton} />
      </>
    )
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{getModalTitle()}</Text>
          {renderMainContent()}
        </View>
      </View>
    </Modal>
  )
}
