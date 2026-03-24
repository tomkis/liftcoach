import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { LoadedWorkingExercise, TestedWorkingExercise, Unit, WorkingSetState } from '@/mobile/domain'
import { formatUserWeight, formatWeight } from '@/mobile/domain/utils/format-weight'
import { theme } from '@/mobile/theme/theme'
import { OutlineButton, PrimaryButton } from '@/mobile/ui/ds/buttons'
import { Checkbox } from '@/mobile/ui/ds/controls'
import { BodyText, CardTitle } from '@/mobile/ui/ds/typography'
import CogwheelFilled from '@/mobile/ui/icons/cogwheel-filled'
import { UndoExerciseModal } from '@/mobile/ui/workout/components/ux/undo-exercise-modal'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: CARD_PADDING + 10,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: CARD_PADDING,
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
  setInfo: {
    flex: 1,
  },
  setDetails: {
    fontSize: 13,
    color: '#666',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 0.15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 8,
    width: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  h2: {
    fontSize: theme.fontSize.medium,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
  successSection: {
    backgroundColor: theme.colors.primary.main,
    padding: CARD_PADDING,
    borderBottomLeftRadius: theme.borderRadius.medium,
    borderBottomRightRadius: theme.borderRadius.medium,
    marginTop: 1,
  },
  successText: {
    color: theme.colors.primary.contrastText,
  },
  performanceText: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bodySection: {
    marginTop: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
})

export const ExerciseLoadedAndTested = (props: {
  exercise: LoadedWorkingExercise | TestedWorkingExercise
  hasMoreExercises: boolean
  onNext: () => void
  onSetChanged: (setId: string, state: WorkingSetState) => void
  onExtraActions: () => void
  onUndo: () => void
  unit: Unit
}) => {
  const { exercise } = props
  const exerciseName = exercise.exercise.name
  const [showUndoModal, setShowUndoModal] = useState(false)

  const allSetsCompleted = exercise.sets.every(set =>
    [WorkingSetState.done, WorkingSetState.failed].includes(set.state)
  )

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <CardTitle>{exerciseName}</CardTitle>
          <TouchableOpacity style={styles.titleButton} onPress={props.onExtraActions}>
            <CogwheelFilled color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
        <View style={styles.bodySection}>
          <BodyText>
            You have been able to perform <Text style={styles.emphasized}>{exercise.loadingSet.reps} reps</Text> with{' '}
            <Text style={styles.emphasized}>
              {formatUserWeight(exercise.loadingSet.weight)} {props.unit === 'metric' ? 'kg' : 'lbs'}
            </Text>
          </BodyText>
          <BodyText>Let&apos;s try out some real training work now!</BodyText>
          <BodyText>Pick the weight proposed by LiftCoach and see how you perform.</BodyText>
        </View>
      </View>

      <View style={styles.setsCard}>
        {exercise.sets.map((set, index) => (
          <View key={set.id} style={[styles.setRow, index === exercise.sets.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.setInfo}>
              <Text
                style={[
                  styles.setDetails,
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
                onPress={() => {
                  props.onSetChanged(set.id, WorkingSetState.failed)
                }}
                label="Failed"
                color={theme.colors.text.primary}
              />
              <Checkbox
                checked={set.state === 'done'}
                onPress={() => {
                  props.onSetChanged(set.id, WorkingSetState.done)
                }}
                label="Done"
                color={theme.colors.text.primary}
              />
            </View>
          </View>
        ))}
      </View>
      {allSetsCompleted && (
        <View style={styles.bottomActions}>
          <PrimaryButton
            title={props.hasMoreExercises ? 'Move on to the next exercise' : 'Finish Workout!'}
            onPress={props.onNext}
            style={{ flex: 1 }}
          />
        </View>
      )}
      {!allSetsCompleted && (
        <View style={styles.bottomActions}>
          <OutlineButton title="Retest Weight" onPress={() => setShowUndoModal(true)} style={{ flex: 1 }} />
        </View>
      )}
      <UndoExerciseModal
        visible={showUndoModal}
        title="Retest Weight"
        description="This will discard the current sets and let you redo the test set with a different weight."
        onConfirm={() => {
          setShowUndoModal(false)
          props.onUndo()
        }}
        onCancel={() => setShowUndoModal(false)}
      />
    </View>
  )
}
