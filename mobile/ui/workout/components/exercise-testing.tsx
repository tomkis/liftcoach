import { LoadingSet, TestingWorkingExercise, Unit } from '@/mobile/domain'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { useKeyboardVisible } from '@/mobile/hooks/use-keyboard-visible'
import { NumericalInput } from '@/mobile/ui/ds/inputs'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { HorizontalButtonRow } from '@/mobile/ui/ds/layout'
import { theme } from '@/mobile/theme/theme'
import { Checkbox } from '@/mobile/ui/ds/controls'
import { BodyText } from '@/mobile/ui/ds/typography'
import { CardTitle } from '@/mobile/ui/ds/typography'
import CogwheelFilled from '@/mobile/ui/icons/cogwheel-filled'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  paddedContent: {
    paddingTop: CARD_PADDING,
    paddingBottom: CARD_PADDING,
    paddingLeft: CARD_PADDING,
    paddingRight: CARD_PADDING,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
  },
  warmupSection: {
    backgroundColor: theme.colors.backgroundLight,
    padding: CARD_PADDING,
    borderBottomLeftRadius: theme.borderRadius.medium,
    borderBottomRightRadius: theme.borderRadius.medium,
  },
  greenBackground: {
    backgroundColor: theme.colors.primary.main,
  },
  warmupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  warmupTitle: {
    color: theme.colors.text.primary,
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  warmupCheckboxContainer: {
    marginTop: 3,
  },
  warmupParagraph: {
    paddingTop: 5,
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
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  inputLabel: {
    color: theme.colors.text.primary,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontSize: 16,
    fontFamily: theme.font.sairaRegular,
  },
  errorText: {
    color: theme.colors.primary.negative,
    marginTop: 8,
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
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
})

export const ExerciseTesting = ({
  testingExercise,
  onLoadTested,
  onExtraActions,
  unit,
}: {
  testingExercise: TestingWorkingExercise
  onLoadTested: (loadingSet: LoadingSet) => void
  onExtraActions: () => void
  unit: Unit
}) => {
  const [warmupCompleted, setWarmupCompleted] = useState(false)
  const keyboardVisible = useKeyboardVisible()

  const toggleWarmupCompleted = () => setWarmupCompleted(value => !value)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reps: '',
    },
    mode: 'onChange',
  })

  const onMoveToWorkingSet = useCallback(
    (data: { reps: string }) => {
      onLoadTested({
        weight: testingExercise.testingWeight,
        reps: parseInt(data.reps, 10),
      })
    },
    [onLoadTested, testingExercise.testingWeight]
  )

  const exerciseName = testingExercise.exercise.name

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={24}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          paddingTop: CARD_PADDING + 10,
        }}
      >
        <View style={styles.card}>
          <View style={styles.paddedContent}>
            <View style={styles.titleContainer}>
              <CardTitle>{exerciseName}</CardTitle>
              <TouchableOpacity style={styles.titleButton} onPress={onExtraActions}>
                <CogwheelFilled color={theme.colors.primary.main} />
              </TouchableOpacity>
            </View>
            {!keyboardVisible && (
              <View style={{ marginTop: 16 }}>
                <BodyText>Let&apos;s test your performance on this exercise.</BodyText>
                <BodyText>Make sure you execute the exercise with proper form.</BodyText>
              </View>
            )}
          </View>

          <View style={[styles.warmupSection, warmupCompleted && styles.greenBackground]}>
            <View style={styles.warmupHeader}>
              <CardTitle
                style={[
                  styles.warmupTitle,
                  styles.h2,
                  warmupCompleted && { color: theme.colors.primary.contrastText },
                ]}
              >
                Warm-up
              </CardTitle>
              <View style={styles.warmupCheckboxContainer}>
                <Checkbox
                  checked={warmupCompleted}
                  onPress={toggleWarmupCompleted}
                  label="Warm-up completed"
                  color={warmupCompleted ? theme.colors.primary.contrastText : theme.colors.primary.main}
                />
              </View>
            </View>
            {!warmupCompleted && !keyboardVisible && (
              <View>
                <BodyText style={styles.warmupParagraph}>
                  Your test will be performed with{' '}
                  <Text style={styles.emphasized}>
                    {testingExercise.testingWeight} {unit === 'metric' ? 'kg' : 'lbs'}
                  </Text>
                  .
                </BodyText>
                <BodyText style={styles.warmupParagraph}>
                  Before we test your strength, let&apos;s warm up properly. Do a few light sets to prepare your muscles
                  and joints.
                </BodyText>
              </View>
            )}
          </View>
        </View>

        {warmupCompleted && (
          <View style={[styles.card, { marginTop: CARD_PADDING }]}>
            <View style={styles.paddedContent}>
              {!keyboardVisible && (
                <View>
                  <BodyText>
                    Try to perform as many reps as possible with{' '}
                    <Text style={styles.emphasized}>
                      {testingExercise.testingWeight} {unit === 'metric' ? 'kg' : 'lbs'}
                    </Text>
                    .
                  </BodyText>
                  <BodyText>
                    Remember, exercise must be executed with <Text style={styles.emphasized}>proper form</Text>. No
                    cheat reps!
                  </BodyText>
                </View>
              )}
              {keyboardVisible && <BodyText>How many reps did you manage to execute?</BodyText>}
              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="reps"
                  rules={{
                    required: 'Please enter the number of reps',
                    min: {
                      value: 1,
                      message: 'Reps must be at least 1',
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Please enter a valid number',
                    },
                  }}
                  render={({ field }) => (
                    <NumericalInput width={80} value={field.value} onChange={value => field.onChange(value)} />
                  )}
                />
                <Text style={styles.inputLabel}>reps</Text>
              </View>
              {errors.reps && <Text style={styles.errorText}>{errors.reps.message}</Text>}
            </View>
          </View>
        )}

        <HorizontalButtonRow>
          {warmupCompleted && (
            <OutlineButton
              title="Move on to working set"
              onPress={handleSubmit(onMoveToWorkingSet)}
              style={{ marginTop: 16, flex: 1 }}
            />
          )}
        </HorizontalButtonRow>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
