import { LoadedWorkingExercise, TestedWorkingExercise, Unit, WorkingSetState } from '@/mobile/domain'
import { StyleSheet, Text, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { ButtonContainer } from '@/mobile/ui/ui/button-container'
import { theme } from '@/mobile/theme/theme'
import { Checkbox } from '@/mobile/ui/components/checkbox'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: CARD_PADDING + 10,
  },
  card: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: CARD_PADDING,
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
  h2: {
    fontSize: theme.fontSize.medium,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.primary.main,
  },
  successSection: {
    backgroundColor: theme.colors.newUi.primary.main,
    padding: CARD_PADDING,
    borderBottomLeftRadius: theme.borderRadius.medium,
    borderBottomRightRadius: theme.borderRadius.medium,
    marginTop: 1,
  },
  successText: {
    color: theme.colors.newUi.primary.contrastText,
  },
  performanceText: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
})

export const ExerciseLoadedAndTested = (props: {
  exercise: LoadedWorkingExercise | TestedWorkingExercise
  hasMoreExercises: boolean
  onNext: () => void
  onSetChanged: (setId: string, state: WorkingSetState) => void
  unit: Unit
}) => {
  const { exercise } = props
  const exerciseName = exercise.exercise.name

  const allSetsCompleted = exercise.sets.every(set =>
    [WorkingSetState.done, WorkingSetState.failed].includes(set.state)
  )

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Title>{exerciseName}</Title>
        <View style={{ marginTop: 16 }}>
          <Paragraph>
            You have been able to perform <Text style={styles.emphasized}>{exercise.loadingSet.reps} reps</Text> with{' '}
            <Text style={styles.emphasized}>
              {exercise.loadingSet.weight} {props.unit === 'metric' ? 'kg' : 'lbs'}
            </Text>
          </Paragraph>
          <Paragraph>Let&apos;s try out some real training work now!</Paragraph>
          <Paragraph>Pick the weight proposed by LiftCoach and see how you perform.</Paragraph>
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
                    color: theme.colors.newUi.text.primary,
                  },
                ]}
              >
                {set.reps} reps × {set.weight} {props.unit === 'metric' ? 'kg' : 'lbs'}
              </Text>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={set.state === 'failed'}
                onPress={() => {
                  props.onSetChanged(set.id, WorkingSetState.failed)
                }}
                label="Failed"
                color={theme.colors.newUi.text.primary}
              />
              <Checkbox
                checked={set.state === 'done'}
                onPress={() => {
                  props.onSetChanged(set.id, WorkingSetState.done)
                }}
                label="Done"
                color={theme.colors.newUi.text.primary}
              />
            </View>
          </View>
        ))}
      </View>
      {allSetsCompleted && (
        <ButtonContainer>
          <PrimaryButton
            title={props.hasMoreExercises ? 'Move on to the next exercise' : 'Finish Workout!'}
            onPress={props.onNext}
          />
        </ButtonContainer>
      )}
    </View>
  )
}
