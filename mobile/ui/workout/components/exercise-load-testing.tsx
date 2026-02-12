import { LoadingSet, LoadingWorkingExercise, Unit } from '@/mobile/domain'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { NumericalInput } from '@/mobile/ui/ds/inputs'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { useTracking } from '@/mobile/ui/tracking/tracking'
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
  bold: {
    fontWeight: 'bold',
  },
  titleButton: {
    paddingHorizontal: 8,
    marginTop: -5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },

  failureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  undoButton: {
    position: 'absolute',
    right: CARD_PADDING,
    top: CARD_PADDING,
    zIndex: 1,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
  undoButtonText: {
    color: theme.colors.primary.main,
    fontFamily: theme.font.sairaCondensedSemiBold,
    textTransform: 'uppercase',
    fontSize: theme.fontSize.extraSmall,
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
  errorText: {
    color: theme.colors.primary.negative,
    marginTop: 8,
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
  },
})

const moreRepsMessages = [
  {
    title: <CardTitle style={styles.h2}>Great!</CardTitle>,
    subtitle: (
      <>
        <Text>Do you think you could squeeze in </Text>
        <Text style={styles.emphasized}>3 more reps</Text>
        <Text> with the same weight and form?</Text>
      </>
    ),
  },
  {
    title: <CardTitle style={styles.h2}>Wow, you are strong!</CardTitle>,
    subtitle: (
      <>
        <Text>Do you still have enough steam to do </Text>
        <Text style={styles.emphasized}>3 more reps</Text>
        <Text> with the same weight and form?</Text>
      </>
    ),
  },
  {
    title: <CardTitle style={styles.h2}>You are a beast!</CardTitle>,
    subtitle: (
      <>
        <Text>Would you still feel comfortable to perform </Text>
        <Text style={styles.emphasized}>3 more reps</Text>
        <Text> with the same weight and form?</Text>
      </>
    ),
  },
]

const PerformSetCard = ({
  setIndex,
  onFailedEarly,
  onSucceeded,
}: {
  setIndex: number
  onFailedEarly: () => void
  onSucceeded: () => void
}) => {
  return (
    <>
      {setIndex === 1 && (
        <>
          <CardTitle style={styles.h2}>Let&apos;s start</CardTitle>
          <BodyText>
            Take a challenging weight that you think you can <Text style={styles.emphasized}>safely</Text> do for{' '}
            <Text style={styles.emphasized}>8 reps</Text> and do those.
          </BodyText>
          <BodyText>
            Remember, exercise must be executed with <Text style={styles.emphasized}>proper form</Text>. No cheat reps!
          </BodyText>
        </>
      )}
      {setIndex > 1 && (
        <>
          <CardTitle style={styles.h2}>How did it go?</CardTitle>
          <BodyText>
            <Text>Have you safely managed to perform </Text>
            <Text style={styles.emphasized}>{8 + (setIndex - 1) * 3} reps</Text>
            <Text> ?</Text>
          </BodyText>
        </>
      )}

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 16,
        }}
      >
        <PrimaryButton title="Failed" style={{ flex: 1 }} onPress={onFailedEarly} />
        <PrimaryButton title="Done!" style={{ flex: 1 }} onPress={onSucceeded} />
      </View>
    </>
  )
}

const SetPerformedCard = ({
  sets,
  onVolutaryStop,
  onTryAnotherSet,
}: {
  sets: Array<SetState>
  onVolutaryStop: () => void
  onTryAnotherSet: () => void
}) => {
  return (
    <>
      {moreRepsMessages[sets.length - 1].title}
      <BodyText>{moreRepsMessages[sets.length - 1].subtitle}</BodyText>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 16,
        }}
      >
        <PrimaryButton title="No" style={{ flex: 1 }} onPress={onVolutaryStop} />
        <PrimaryButton title="Yes" style={{ flex: 1 }} onPress={onTryAnotherSet} />
      </View>
    </>
  )
}

enum SetState {
  TryAnotherSet = 'TryAnotherSet',
  SetSucceeded = 'SetSucceeded',
  VoluntaryStop = 'VoluntaryStop',
  Failure = 'Failure',
}

export const ExerciseLoadTesting = ({
  loadingExercise,
  onLoaded,
  onExtraActions,
  unit,
}: {
  active: boolean
  loadingExercise: LoadingWorkingExercise
  onLoaded: (loadingSet: LoadingSet, reachedFailure: boolean) => void
  onExtraActions: () => void
  unit: Unit
}) => {
  const tracking = useTracking()
  const [warmupCompleted, setWarmupCompleted] = useState(false)
  const toggleWarmupCompleted = () => {
    setWarmupCompleted(value => !value)
    tracking.workout.warmupToggled()
  }

  const [sets, setSets] = useState<Array<SetState>>([SetState.TryAnotherSet])
  const [undoStack, setUndoStack] = useState<Array<SetState>>([])
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true)
    })
    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  const pushToUndoStack = useCallback((set: SetState) => {
    setUndoStack(stack => [...stack, set])
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weight: '',
      reps: '',
    },
    mode: 'onChange',
  })
  const lastSet = sets[sets.length - 1]

  const reachedFailure = lastSet === SetState.Failure
  const stopedVoluntarily = lastSet === SetState.VoluntaryStop
  const isTooManySets = sets.length > moreRepsMessages.length
  const loadingFinished = reachedFailure || stopedVoluntarily || isTooManySets

  const failedEarly = useCallback(() => {
    pushToUndoStack(SetState.Failure)

    setSets(sets => {
      return sets.map((set, index) => {
        if (index === sets.length - 1) {
          return SetState.Failure
        }

        return set
      })
    })
  }, [pushToUndoStack])

  const setSucceeded = useCallback(() => {
    pushToUndoStack(SetState.SetSucceeded)

    setSets(sets => {
      return sets.map((set, index) => {
        if (index === sets.length - 1) {
          return SetState.SetSucceeded
        }

        return set
      })
    })
  }, [pushToUndoStack])

  const voluntaryStop = useCallback(() => {
    pushToUndoStack(SetState.VoluntaryStop)

    setSets(sets =>
      sets.map((set, index) => {
        if (index === sets.length - 1) {
          return SetState.VoluntaryStop
        }

        return set
      })
    )
  }, [pushToUndoStack])

  const tryAnotherSet = useCallback(() => {
    pushToUndoStack(SetState.TryAnotherSet)

    setSets(sets => [...sets, SetState.TryAnotherSet])
  }, [pushToUndoStack])

  const onUndo = useCallback(() => {
    tracking.exerciseLoadingUndo()

    const stackCopy = [...undoStack]
    const lastOperation = stackCopy.pop()

    if (lastOperation) {
      setSets(sets => {
        switch (lastOperation) {
          case SetState.Failure:
          case SetState.SetSucceeded:
          case SetState.VoluntaryStop:
            return sets.map((set, index) => {
              if (index === sets.length - 1) {
                return SetState.TryAnotherSet
              }

              return set
            })
          case SetState.TryAnotherSet:
            return sets.slice(0, -1)

          default:
            throw new Error('Illegal State')
        }
      })

      setUndoStack(stack => stack.slice(0, -1))
    }
  }, [tracking, undoStack])

  const moveOnToWorkingSets = useCallback(
    (data: { weight: string; reps?: string }) => {
      const getLoadingResult = () => {
        if (stopedVoluntarily) {
          const reps = (sets.length - 1) * 3 + 8
          const weight = parseFloat(data.weight)
          return { reps, weight }
        } else {
          const weight = parseFloat(data.weight)
          const reps = parseFloat(data.reps || '')
          return { weight, reps }
        }
      }

      const loadingResult = getLoadingResult()

      onLoaded(loadingResult, reachedFailure)
    },
    [sets.length, stopedVoluntarily, onLoaded, reachedFailure]
  )

  const exerciseName = loadingExercise.exercise.name

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
        <View>
          <View style={styles.card}>
            <View style={[styles.paddedContent]}>
              <View style={styles.titleContainer}>
                <View style={styles.titleWrapper}>
                  <CardTitle>{exerciseName}</CardTitle>
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.titleButton} onPress={onExtraActions}>
                    <CogwheelFilled color={theme.colors.primary.main} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: 16 }}>
                <BodyText>Let&apos;s test your performance on this exercise.</BodyText>
                <BodyText>Make sure you execute the exercise with proper form.</BodyText>
              </View>
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
              {!warmupCompleted && (
                <BodyText style={styles.warmupParagraph}>
                  Before we test your strength, let&apos;s warm up properly. Do a few light sets to prepare your muscles
                  and joints.
                </BodyText>
              )}
            </View>
          </View>

          {warmupCompleted && (
            <View style={[styles.card, { marginTop: CARD_PADDING, paddingBottom: CARD_PADDING }]}>
              <View style={[styles.paddedContent]}>
                {undoStack.length > 0 && (
                  <View style={styles.undoButton}>
                    <TouchableOpacity onPress={onUndo}>
                      <Text style={styles.undoButtonText}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {lastSet === SetState.TryAnotherSet && !isTooManySets && (
                  <PerformSetCard setIndex={sets.length} onFailedEarly={failedEarly} onSucceeded={setSucceeded} />
                )}
                {lastSet === SetState.SetSucceeded && !isTooManySets && (
                  <SetPerformedCard sets={sets} onVolutaryStop={voluntaryStop} onTryAnotherSet={tryAnotherSet} />
                )}
                {stopedVoluntarily && (
                  <>
                    <CardTitle style={styles.h2}>Great Job!</CardTitle>
                    <BodyText>What&apos;s the weight that you used?</BodyText>

                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.inputWrapper}>
                          <Controller
                            control={control}
                            name="weight"
                            rules={{
                              required: 'Please enter the weight',
                              validate: value => {
                                const numValue = parseFloat(value)
                                if (isNaN(numValue) || numValue <= 0) {
                                  return 'Please enter a valid weight'
                                }
                                return true
                              },
                            }}
                            render={({ field }) => (
                              <NumericalInput
                                width={80}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Weight"
                              />
                            )}
                          />
                          <Text style={styles.inputLabel}>{unit === 'metric' ? 'kg' : 'lbs'}</Text>
                        </View>
                      </View>
                      {errors.weight && (
                        <View style={{ marginVertical: 10 }}>
                          <Text style={styles.errorText}>{errors.weight.message}</Text>
                        </View>
                      )}
                    </View>
                  </>
                )}

                {(isTooManySets || reachedFailure) && (
                  <>
                    <>
                      <CardTitle style={styles.h2}>{isTooManySets ? 'Great Job!' : 'Failure is key to improve'}</CardTitle>
                      <BodyText>
                        {isTooManySets
                          ? "What's the weight and how many reps did you do?"
                          : "You'll get better and stronger over time! What was the weight and how many reps did you do?"}
                      </BodyText>
                    </>
                    <View>
                      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 16 }}>
                        <View style={styles.inputWrapper}>
                          <Controller
                            control={control}
                            name="weight"
                            rules={{
                              required: 'Please enter the weight',
                              validate: value => {
                                const numValue = parseFloat(value)
                                if (isNaN(numValue) || numValue <= 0) {
                                  return 'Please enter a valid weight'
                                }
                                return true
                              },
                            }}
                            render={({ field }) => (
                              <NumericalInput
                                width={80}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Weight"
                              />
                            )}
                          />
                          <Text style={styles.inputLabel}>{unit === 'metric' ? 'kg' : 'lbs'}</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                          <Controller
                            control={control}
                            name="reps"
                            rules={{
                              required: 'Please enter the number of reps',
                              validate: value => {
                                const numValue = parseFloat(value)
                                if (isNaN(numValue) || numValue <= 0) {
                                  return 'Please enter a valid number of reps'
                                }
                                return true
                              },
                            }}
                            render={({ field }) => (
                              <NumericalInput
                                width={80}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                placeholder="Reps"
                              />
                            )}
                          />
                          <Text style={styles.inputLabel}>x</Text>
                        </View>
                      </View>
                      {(errors.weight || errors.reps) && (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={{ flex: 1 }}>
                            {errors.weight && <Text style={styles.errorText}>{errors.weight.message}</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            {errors.reps && <Text style={styles.errorText}>{errors.reps.message}</Text>}
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
        <HorizontalButtonRow>
          {loadingFinished && warmupCompleted && !isKeyboardVisible && (
            <OutlineButton title="Move on to working set" onPress={handleSubmit(moveOnToWorkingSets)} />
          )}
        </HorizontalButtonRow>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
