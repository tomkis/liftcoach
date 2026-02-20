import Slider from '@react-native-community/slider'
import { Unit } from '@/mobile/domain'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { formatWeight } from '@/mobile/domain/utils/format-weight'
import { PrimaryButton, OutlineButton } from '@/mobile/ui/ds/buttons'
import { ModalShell } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

const styles = StyleSheet.create({
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
    color: theme.colors.text.primary,
    textAlign: 'left',
    marginBottom: 12,
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
    color: theme.colors.primary.main,
  },
  weightDisplayUnit: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.gray.light,
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
    color: theme.colors.gray.light,
    textAlign: 'center',
  },
  weightInputButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  exerciseList: {
    maxHeight: 300,
    marginVertical: 12,
  },
  exerciseItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray.light,
  },
  exerciseName: {
    fontSize: theme.fontSize.small,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    textTransform: 'uppercase',
  },
  replacementButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
      onCancel()
    }
  }

  return (
    <>
      {exerciseName && (
        <>
          <Text style={[styles.weightInputLabel]}>
            Select new exercise that you train instead of{' '}
            <Text style={{ color: theme.colors.primary.main, textTransform: 'uppercase' }}>{exerciseName}</Text>.
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
                      backgroundColor: theme.colors.primary.main,
                    },
                  ]}
                  onPress={() => setSelectedReplacementId(item.id)}
                >
                  <Text
                    style={[
                      styles.exerciseName,
                      selectedReplacementId === item.id && { color: theme.colors.primary.contrastText },
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

          <Text style={[styles.weightInputLabel, { color: theme.colors.gray.light }]}>
            Replacing exercise may affect your training program.
          </Text>

          <View style={styles.replacementButtons}>
            <OutlineButton title="Cancel" onPress={handleReplaceExerciseCancel} style={{ flex: 1 }} />
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
      onCancel()
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

    const minWeight = Math.max(0, originalWeight - (unit === 'metric' ? 10 : 25))
    const maxWeight = originalWeight + (unit === 'metric' ? 10 : 25)
    const step = unit === 'metric' ? 1 : 5

    return (
      <>
        <View style={styles.weightInputContainer}>
          <Text style={[styles.weightInputLabel, { textTransform: 'uppercase' }]}>
            Adjust the weight for the exercise
          </Text>
          <Text style={[styles.weightInputLabel, { color: theme.colors.gray.light }]}>
            It is strongly advised not to change the weight, as doing so may interfere with your training program.
          </Text>

          <View style={styles.weightSliderContainer}>
            <View style={styles.weightDisplay}>
              <Text style={styles.weightDisplayText}>{formatWeight(adjustedWeight)}</Text>
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
                minimumTrackTintColor={theme.colors.primary.main}
                maximumTrackTintColor={theme.colors.gray.light}
                thumbTintColor={theme.colors.primary.main}
              />

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{formatWeight(minWeight)}</Text>
                <Text style={styles.sliderLabel}>{formatWeight(originalWeight)}</Text>
                <Text style={styles.sliderLabel}>{formatWeight(maxWeight)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.weightInputButtons}>
          <OutlineButton title="Cancel" onPress={handleWeightChangeCancel} style={{ flex: 1 }} />
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

        <OutlineButton title="Cancel" onPress={handleCancel} style={styles.cancelButton} />
      </>
    )
  }

  return (
    <ModalShell visible={visible} title={getModalTitle()}>
      {renderMainContent()}
    </ModalShell>
  )
}
