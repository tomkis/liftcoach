import { Reps } from '@/mobile/domain'
import { useRef, useState } from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

import { ButtonContainer } from '@/mobile/ui/home-testing/components/button-container'
import { CardWrapper } from '@/mobile/ui/home-testing/components/card-wrapper'
import { ContentContainer } from '@/mobile/ui/home-testing/components/content-container'
import { StrengthLevelProgress } from '@/mobile/ui/home-testing/components/strength-level-progress'
import { percentiles } from '@/mobile/ui/home-testing/percentiles'
import { progression } from '@/mobile/ui/home-testing/progression-scheme'
import {
  ExerciseTestDescription,
  HomeTestingMuscleGroup,
  Result,
  TestingResults,
} from '@/mobile/ui/home-testing/types'
import { useHomeTestingNavigation } from '@/mobile/ui/home-testing/use-navigation'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { SecondaryButton } from '@/mobile/ui/onboarding/cards/ux/secondary-button'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 'auto',
    height: 20,
  },
  card: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    flex: 1,
  },
  title: {
    color: theme.colors.newUi.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    color: theme.colors.newUi.text.primary,
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.primary.main,
  },
  h2: {
    fontSize: theme.fontSize.medium,
  },
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
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
})

const StopTestConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Title style={styles.modalTitle}>Stop the Test?</Title>
          <Paragraph>Are you sure you want to stop the strength test? Your progress will be lost.</Paragraph>
          <View style={styles.modalButtons}>
            <SecondaryButton title="Cancel" onPress={onCancel} style={{ flex: 1 }} />
            <PrimaryButton title="Stop Test" onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const TestStrengthCard = ({
  muscleGroup,
  title,
  next,
  result,
  setResult,
  exercises,
  onNextMuscleGroup,
  onAbortTest,
}: {
  muscleGroup: HomeTestingMuscleGroup
  exercises: ExerciseTestDescription[]
  title: string
  next: string | null
  result: Result | null
  setResult: (result: Result) => void
  onNextMuscleGroup: () => void
  onAbortTest: () => void
}) => {
  const [progressionIndex, setProgressionIndex] = useState(0)
  const currentExercise = exercises[progressionIndex]
  const [status, setStatus] = useState<'progressed' | 'started'>('started')
  const [showStopConfirmation, setShowStopConfirmation] = useState(false)

  const progress = () => {
    setStatus('started')
    setProgressionIndex(index => index + 1)
  }

  const failure = () => {
    setResult({
      progression: Math.max(0, progressionIndex + 1),
      reps: Reps.Low,
    })
  }

  const foundStrenght = () => {
    setResult({
      progression: progressionIndex + 1,
      reps: Reps.Intermediate,
    })
  }

  const handleStopTest = () => {
    setShowStopConfirmation(true)
  }

  const confirmStopTest = () => {
    setShowStopConfirmation(false)
    onAbortTest()
  }

  const cancelStopTest = () => {
    setShowStopConfirmation(false)
  }

  if (result) {
    const getProgression = () => {
      switch (result.progression) {
        case 1:
          return '1'
        case 2:
          return '2'
        case 3:
          return '3'
        case 4:
          return '4'
        default:
          throw new Error('Invalid progression')
      }
    }

    const percentile = percentiles[muscleGroup][getProgression()][result.reps]

    return (
      <CardWrapper>
        <Title style={styles.title}>{title} Strength</Title>
        <Paragraph>
          Great job! Liftcoach has estimated your strength level for <Text style={styles.emphasized}>{title}</Text>.
        </Paragraph>
        <Paragraph>
          Your result is better than <Text style={styles.emphasized}>{percentile}%</Text> of the population.
        </Paragraph>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <StrengthLevelProgress strengthLevel={percentile} animate={true} size={320} showPercentage={true} />
        </View>
        <ButtonContainer>
          <PrimaryButton
            title={next ? `Let's Test ${next}` : 'Get Results'}
            style={styles.button}
            onPress={onNextMuscleGroup}
          />
        </ButtonContainer>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper>
      {status === 'started' && (
        <>
          <ContentContainer>
            <Title style={styles.title}>{currentExercise.exercise}</Title>
            <Paragraph style={styles.description}>{currentExercise.intro}</Paragraph>
            <Title style={[styles.subtitle, styles.h2]}>Technique clue</Title>
            <Paragraph style={styles.description}>{currentExercise.technique}</Paragraph>
            <Title style={[styles.subtitle, styles.h2]}>Ready to test?</Title>
            <Paragraph>
              How many <Text style={styles.emphasized}>{currentExercise.exercise}</Text> can you do with proper form?
            </Paragraph>
          </ContentContainer>
          <ButtonContainer style={{ marginBottom: 24 }}>
            <SecondaryButton title="Stop the test" onPress={handleStopTest} style={{ flex: 1 }} />
          </ButtonContainer>
          <ButtonContainer>
            <PrimaryButton title="< 5" style={styles.button} onPress={failure} />
            <PrimaryButton title="5-15" style={styles.button} onPress={foundStrenght} />
            <PrimaryButton
              title="> 15"
              style={styles.button}
              onPress={() => {
                if (progressionIndex < exercises.length - 1) {
                  setStatus('progressed')
                } else {
                  setResult({
                    progression: progressionIndex + 1,
                    reps: Reps.High,
                  })
                }
              }}
            />
          </ButtonContainer>
        </>
      )}
      {status === 'progressed' && (
        <>
          <ContentContainer>
            <Title style={styles.title}>{currentExercise.exercise}</Title>
            <Paragraph style={styles.description}>
              Amazing, you can handle over 15 reps of <Text style={styles.emphasized}>{currentExercise.exercise}</Text>.
            </Paragraph>
            <Title style={[styles.subtitle, styles.h2]}>What&apos;s next?</Title>
            <Paragraph style={styles.description}>{currentExercise.next}</Paragraph>
          </ContentContainer>
          <ButtonContainer style={{ marginBottom: 24 }}>
            <SecondaryButton title="Stop the test" onPress={handleStopTest} style={{ flex: 1 }} />
          </ButtonContainer>
          <ButtonContainer>
            <PrimaryButton title="Let's continue" onPress={progress} style={styles.button} />
          </ButtonContainer>
        </>
      )}
      <StopTestConfirmationModal visible={showStopConfirmation} onConfirm={confirmStopTest} onCancel={cancelStopTest} />
    </CardWrapper>
  )
}

export const TestStrengthSwiper = () => {
  const swiperRef = useRef<Swiper>(null)
  const insets = useSafeAreaInsets()
  const navigation = useHomeTestingNavigation()
  const utils = trpc.useUtils()
  const { mutateAsync: storeStrengthTest } = trpc.user.storeStrengthTest.useMutation()
  const [results, setResults] = useState<Record<HomeTestingMuscleGroup, Result | null>>({
    [HomeTestingMuscleGroup.FrontLegs]: null,
    [HomeTestingMuscleGroup.BackLegs]: null,
    [HomeTestingMuscleGroup.Chest]: null,
    [HomeTestingMuscleGroup.Back]: null,
  })

  const handleNextMuscleGroup = () => {
    const finished = Object.values(results).every(result => result !== null)

    if (finished) {
      function getResult(muscleGroup: HomeTestingMuscleGroup) {
        const result = results[muscleGroup]
        if (!result) {
          throw new Error('Result not found')
        }
        return result as Result
      }

      const upperFrontIndex = getResult(HomeTestingMuscleGroup.FrontLegs).progression
      const upperFrontReps = getResult(HomeTestingMuscleGroup.FrontLegs).reps
      const upperBackIndex = getResult(HomeTestingMuscleGroup.BackLegs).progression
      const upperBackReps = getResult(HomeTestingMuscleGroup.BackLegs).reps
      const lowerFrontIndex = getResult(HomeTestingMuscleGroup.Chest).progression
      const lowerFrontReps = getResult(HomeTestingMuscleGroup.Chest).reps
      const lowerBackIndex = getResult(HomeTestingMuscleGroup.Back).progression
      const lowerBackReps = getResult(HomeTestingMuscleGroup.Back).reps

      storeStrengthTest({
        strengthTest: {
          upperFrontIndex,
          upperFrontReps,
          upperBackIndex,
          upperBackReps,
          lowerFrontIndex,
          lowerFrontReps,
          lowerBackIndex,
          lowerBackReps,
        },
      }).then(utils.user.me.invalidate)

      navigation.navigate('Results', results as TestingResults)
    }

    swiperRef.current?.scrollBy(1)
  }

  return (
    <Swiper
      showsButtons={false}
      loop={false}
      ref={swiperRef}
      dotColor={theme.colors.white}
      activeDotColor={theme.colors.newUi.primary.main}
      paginationStyle={[styles.pagination, { top: insets.top }]}
    >
      {progression.map((muscleGroup, index) => (
        <View key={index} style={styles.slide}>
          <TestStrengthCard
            muscleGroup={muscleGroup.muscleGroup}
            title={muscleGroup.title}
            next={index < progression.length - 1 ? progression[index + 1].title : null}
            exercises={muscleGroup.exercises}
            result={results[muscleGroup.muscleGroup]}
            setResult={result => {
              setResults(prev => ({ ...prev, [muscleGroup.muscleGroup]: result }))
            }}
            onNextMuscleGroup={handleNextMuscleGroup}
            onAbortTest={() => {
              navigation.getParent()?.navigate('TabNavigator')
            }}
          />
        </View>
      ))}
    </Swiper>
  )
}
