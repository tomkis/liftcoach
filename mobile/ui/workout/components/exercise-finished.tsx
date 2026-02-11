import { FinishedWorkingExercise, Unit } from '@/mobile/domain'
import { StyleSheet, Text, View } from 'react-native'

import { CycleProgressCircle } from '@/mobile/ui/workout/components/ux/cycle-progress-circle'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { Checkbox } from '@/mobile/ui/components/checkbox'
import { Title } from '@/mobile/ui/components/title'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  paddedContent: {
    paddingTop: CARD_PADDING,
    paddingLeft: CARD_PADDING,
    paddingRight: CARD_PADDING,
  },
  card: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
  },
  setsCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
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
    borderColor: theme.colors.newUi.background,
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
    color: theme.colors.newUi.primary.main,
  },
  finishedMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.newUi.gray.light,
    marginTop: 32,
    paddingHorizontal: CARD_PADDING,
    paddingBottom: CARD_PADDING,
  },
})

export const ExerciseFinished = (props: { finishedExercise: FinishedWorkingExercise; active: boolean; unit: Unit }) => {
  const { finishedExercise, active, unit } = props
  const exerciseName = finishedExercise.exercise.name

  const { data: cycleProgress } = trpc.workout.getCycleProgress.useQuery(
    {
      exerciseId: finishedExercise.exercise.id,
    },
    { enabled: active }
  )

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingTop: CARD_PADDING + 10,
      }}
    >
      <View style={styles.card}>
        <View style={styles.paddedContent}>
          <Title>{exerciseName}</Title>
        </View>

        <View style={{ marginTop: 16, paddingHorizontal: CARD_PADDING, paddingBottom: CARD_PADDING }}>
          {cycleProgress && (
            <CycleProgressCircle
              animate={active}
              lastWeek={null}
              weeks={cycleProgress.map((progress, index) => ({
                title: progress.isTesting ? 'Testing' : `Cycle ${index + 1}`,
                testing: progress.isTesting,
                sets: progress.sets,
              }))}
            />
          )}
        </View>
      </View>
      <View style={styles.setsCard}>
        {finishedExercise.sets.map((set, index) => {
          const textStyle = set.state !== 'pending' ? styles.completedSetText : undefined

          return (
            <View
              key={set.id}
              style={[styles.setRow, index === finishedExercise.sets.length - 1 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.setInfo}>
                <Text
                  style={[
                    styles.setDetails,
                    textStyle,
                    {
                      color: theme.colors.newUi.text.primary,
                    },
                  ]}
                >
                  {set.reps} reps × {set.weight} {unit === 'metric' ? 'kg' : 'lbs'}
                </Text>
              </View>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  checked={set.state === 'failed'}
                  onPress={() => {}} // Readonly - no action
                  label="Failed"
                  color={theme.colors.newUi.text.primary}
                />
                <Checkbox
                  checked={set.state === 'done'}
                  onPress={() => {}} // Readonly - no action
                  label="Done"
                  color={theme.colors.newUi.text.primary}
                />
              </View>
            </View>
          )
        })}
        <Text style={styles.finishedMessage}>This exercise has been finished. You can swipe to the next one.</Text>
      </View>
    </View>
  )
}
