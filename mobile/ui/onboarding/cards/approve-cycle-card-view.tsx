import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'
import { BodyText } from '@/mobile/ui/ds/typography'
import { CardTitle } from '@/mobile/ui/ds/typography'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  upcomingWorkout: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: CARD_PADDING,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.main,
  },
  upcomingText: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.primary.main,
    fontFamily: theme.font.sairaCondesedBold,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  exerciseItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.small,
    padding: 12,
    marginBottom: 8,
  },
  exerciseName: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: theme.fontSize.extraSmall,
    textTransform: 'uppercase',
  },
  exerciseDetails: {
    color: theme.colors.gray.light,
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.extraSmall,
  },
  remainingWorkouts: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: CARD_PADDING,
    // marginTop: 8,
  },
  remainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingHeaderExpanded: {
    marginBottom: 12,
  },
  remainingTitle: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: theme.fontSize.small,
    textTransform: 'uppercase',
  },
  collapsedWorkout: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.borderRadius.small,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.gray.light,
  },
  collapsedTitle: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: theme.fontSize.extraSmall,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  collapsedSubtitle: {
    color: theme.colors.gray.light,
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.extraSmall,
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 12,
  },
})

export const ApproveCycleCardView = () => {
  const { data: microcycle, isLoading } = trpc.workout.getCurrentMicrocycle.useQuery()
  const insets = useSafeAreaInsets()
  const onboardingContext = useOnboardingContext()

  if (!microcycle || isLoading) {
    return <EmptyWrapper />
  }

  const upcomingWorkout = microcycle.workouts[0]
  const remainingWorkouts = microcycle.workouts.slice(1)

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <CardTitle>You’re set. Let’s crush this cycle</CardTitle>
          <BodyText style={{ marginTop: 8 }}>
            Your new block is built for steady gains. If anything feels off, I’ll adjust it for you.
          </BodyText>
        </View>

        {/* Scrollable Content */}

        {/* Upcoming workout - highlighted */}
        <Text style={styles.upcomingText}>First Training Session</Text>
        <View style={styles.upcomingWorkout}>
          {upcomingWorkout?.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
            </View>
          ))}
        </View>

        {remainingWorkouts.map((workout, index) => (
          <View key={workout.id} style={styles.collapsedWorkout}>
            <Text style={styles.collapsedTitle}>Day {index + 2}</Text>
            <Text style={styles.collapsedSubtitle}>
              {workout.exercises.map(exercise => exercise.exercise.name).join(' • ')}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ height: 20 }} />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <OutlineButton title="Make Changes" onPress={onboardingContext.changeMicrocycle} />
        <PrimaryButton title="Let’s Do This" onPress={onboardingContext.cycleReviewed} />
      </View>
    </View>
  )
}
