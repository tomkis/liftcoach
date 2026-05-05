import { PendingWorkingExercise, Unit, WorkingSetState } from '@/mobile/domain'
import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { formatLabel } from '@/mobile/ui/exercise-library/add-exercise-modal/shared'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import CogwheelFilled from '@/mobile/ui/icons/cogwheel-filled'
import { IncompleteSetsModal } from '@/mobile/ui/workout/components/ux/incomplete-sets-modal'

const CARD_PADDING = 18

const parseDecimal = (value: string) => parseFloat(value.replace(',', '.'))

const formatNumber = (n: number | null) => (n === null ? '' : String(n))

type Props = {
  active: boolean
  pendingExercise: PendingWorkingExercise
  hasMoreExercises: boolean
  onNext: () => void
  onExtraActions: () => void
  onSetStateChanged: (setId: string, state: WorkingSetState) => void
  onSetWeightChanged: (setId: string, weight: number) => void
  onSetRepsChanged: (setId: string, reps: number) => void
  unit: Unit
}

export const ExercisePendingCustom = (props: Props) => {
  const { pendingExercise } = props
  const [showIncompleteSetsModal, setShowIncompleteSetsModal] = React.useState(false)

  const unitLabel = props.unit === 'metric' ? 'kg' : 'lbs'

  const { data: cycleProgress } = trpc.workout.getCycleProgress.useQuery(
    { exerciseId: pendingExercise.exercise.id },
    { enabled: props.active }
  )

  const completedSetsCount = pendingExercise.sets.filter(
    set => set.state === WorkingSetState.done || set.state === WorkingSetState.failed
  ).length
  const allSetsAnswered = completedSetsCount === pendingExercise.sets.length
  const currentWeek = cycleProgress?.length ?? null

  const handleWeightSubmit = (setId: string, value: string) => {
    const parsed = parseDecimal(value)
    if (!isNaN(parsed) && parsed > 0) {
      props.onSetWeightChanged(setId, parsed)
    }
  }

  const handleRepsSubmit = (setId: string, value: string) => {
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed > 0) {
      props.onSetRepsChanged(setId, parsed)
    }
  }

  const handleToggleDone = (setId: string) => {
    const set = pendingExercise.sets.find(s => s.id === setId)
    if (!set) {
      throw new Error('Set not found')
    }
    const next = set.state === WorkingSetState.done ? WorkingSetState.pending : WorkingSetState.done
    props.onSetStateChanged(setId, next)

    if (next === WorkingSetState.done) {
      const isFirst = pendingExercise.sets[0]?.id === setId
      if (isFirst && set.weight !== null && set.reps !== null) {
        pendingExercise.sets.forEach(other => {
          if (other.id === setId) return
          if (other.state !== WorkingSetState.pending) return
          if (other.weight === null) {
            props.onSetWeightChanged(other.id, set.weight as number)
          }
          if (other.reps === null) {
            props.onSetRepsChanged(other.id, set.reps as number)
          }
        })
      }
    }
  }

  const handleToggleFailed = (setId: string) => {
    const set = pendingExercise.sets.find(s => s.id === setId)
    if (!set) {
      throw new Error('Set not found')
    }
    const next = set.state === WorkingSetState.failed ? WorkingSetState.pending : WorkingSetState.failed
    props.onSetStateChanged(setId, next)
  }

  const handleNextPress = () => {
    if (allSetsAnswered) {
      props.onNext()
    } else {
      setShowIncompleteSetsModal(true)
    }
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
          <View style={styles.headerRow}>
            <View style={styles.headerTitleBlock}>
              <Text style={styles.exerciseTitle}>{pendingExercise.exercise.name.toUpperCase()}</Text>
              <Text style={styles.exerciseSubtitle}>{formatLabel(pendingExercise.exercise.muscleGroup)}</Text>
            </View>
            <TouchableOpacity style={styles.cogBtn} onPress={props.onExtraActions}>
              <CogwheelFilled color={theme.colors.primary.main} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryStrip}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>SETS</Text>
              <Text style={styles.summaryValue}>
                {completedSetsCount}/{pendingExercise.sets.length}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>WEEK</Text>
              <Text style={styles.summaryValue}>{currentWeek ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.setsContainer}>
            {pendingExercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                index={index}
                weight={set.weight}
                reps={set.reps}
                state={set.state}
                unitLabel={unitLabel}
                onWeightSubmit={value => handleWeightSubmit(set.id, value)}
                onRepsSubmit={value => handleRepsSubmit(set.id, value)}
                onToggleDone={() => handleToggleDone(set.id)}
                onToggleFailed={() => handleToggleFailed(set.id)}
              />
            ))}
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={props.hasMoreExercises ? 'Next Exercise' : 'Finish Workout!'}
              style={{ flex: 1 }}
              onPress={handleNextPress}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <IncompleteSetsModal
        visible={showIncompleteSetsModal}
        onConfirm={() => {
          setShowIncompleteSetsModal(false)
        }}
        onCancel={() => setShowIncompleteSetsModal(false)}
      />
    </>
  )
}

const SetRow = ({
  index,
  weight,
  reps,
  state,
  unitLabel,
  onWeightSubmit,
  onRepsSubmit,
  onToggleDone,
  onToggleFailed,
}: {
  index: number
  weight: number | null
  reps: number | null
  state: WorkingSetState
  unitLabel: string
  onWeightSubmit: (value: string) => void
  onRepsSubmit: (value: string) => void
  onToggleDone: () => void
  onToggleFailed: () => void
}) => {
  const [weightDraft, setWeightDraft] = React.useState(formatNumber(weight))
  const [repsDraft, setRepsDraft] = React.useState(formatNumber(reps))

  React.useEffect(() => {
    setWeightDraft(formatNumber(weight))
  }, [weight])

  React.useEffect(() => {
    setRepsDraft(formatNumber(reps))
  }, [reps])

  const isDone = state === WorkingSetState.done
  const isFailed = state === WorkingSetState.failed

  const canConfirm = weightDraft.trim() !== '' && repsDraft.trim() !== ''

  const accentColor = isFailed
    ? theme.colors.primary.negative
    : isDone
      ? theme.colors.primary.main
      : 'transparent'

  return (
    <View style={[rowStyles.row, isDone && rowStyles.rowDone, isFailed && rowStyles.rowFailed]}>
      <View style={[rowStyles.accentBar, { backgroundColor: accentColor }]} />

      <View style={rowStyles.numberTile}>
        <Text style={rowStyles.numberText}>{index + 1}</Text>
      </View>

      <View style={rowStyles.inputCell}>
        <TextInput
          value={weightDraft}
          onChangeText={setWeightDraft}
          onEndEditing={() => onWeightSubmit(weightDraft)}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={`rgba(255,255,255,${theme.opacity.placeholder})`}
          style={rowStyles.inputValue}
          maxLength={4}
        />
        <Text style={rowStyles.inputUnit}>{unitLabel}</Text>
      </View>

      <View style={rowStyles.inputCell}>
        <TextInput
          value={repsDraft}
          onChangeText={setRepsDraft}
          onEndEditing={() => onRepsSubmit(repsDraft)}
          keyboardType="number-pad"
          placeholder="—"
          placeholderTextColor={`rgba(255,255,255,${theme.opacity.placeholder})`}
          style={rowStyles.inputValue}
          maxLength={3}
        />
        <Text style={rowStyles.inputUnit}>reps</Text>
      </View>

      <View style={rowStyles.actionsGroup}>
        {!isDone && (
          <TouchableOpacity
            onPress={onToggleFailed}
            style={[rowStyles.iconBtn, rowStyles.failBtn, isFailed && rowStyles.failBtnActive]}
          >
            <Text style={[rowStyles.iconGlyph, { color: isFailed ? '#fff' : theme.colors.primary.negative }]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
        {!isFailed && (
          <TouchableOpacity
            onPress={onToggleDone}
            disabled={!isDone && !canConfirm}
            style={[
              rowStyles.iconBtn,
              rowStyles.confirmBtn,
              isDone && rowStyles.confirmBtnActive,
              !isDone && !canConfirm && rowStyles.confirmBtnDisabled,
            ]}
          >
            <Text
              style={[
                rowStyles.iconGlyph,
                { color: isDone ? theme.colors.primary.contrastText : theme.colors.primary.main },
              ]}
            >
              ✓
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleBlock: {
    flex: 1,
  },
  exerciseTitle: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 26,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  exerciseSubtitle: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  cogBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border.light,
  },
  summaryLabel: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  summaryValue: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  setsContainer: {
    gap: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    gap: 16,
  },
})

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingRight: 8,
    height: 52,
    overflow: 'hidden',
    gap: 8,
  },
  rowDone: {
    backgroundColor: 'rgba(255,195,0,0.10)',
  },
  rowFailed: {
    backgroundColor: 'rgba(229,57,53,0.12)',
  },
  accentBar: {
    width: 3,
    height: '100%',
  },
  numberTile: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  numberText: {
    color: theme.colors.text.muted,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  inputCell: {
    flex: 1,
    minWidth: 86,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: theme.borderRadius.small,
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 38,
  },
  inputValue: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 16,
    padding: 0,
    minWidth: 38,
    textAlign: 'center',
  },
  inputUnit: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 11,
    marginLeft: 4,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 38,
    borderRadius: theme.borderRadius.small,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.negative,
  },
  failBtnActive: {
    backgroundColor: theme.colors.primary.negative,
    borderColor: theme.colors.primary.negative,
  },
  confirmBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  confirmBtnActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  confirmBtnDisabled: {
    opacity: theme.opacity.disabled,
  },
  iconGlyph: {
    fontSize: 16,
    fontFamily: theme.font.sairaBold,
  },
})
