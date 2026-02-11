import { WorkoutStats } from '@/mobile/domain'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Title } from '@/mobile/ui/onboarding/cards/ux/headings'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { getTrainingTitle } from '@/mobile/ui/ux/get-training-title'
import { theme } from '@/mobile/theme/theme'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.newUi.background,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: CARD_PADDING,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  weekText: {
    color: theme.colors.newUi.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
  },
  infoCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: 20,
    padding: CARD_PADDING,
    marginBottom: CARD_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: theme.colors.newUi.text.primary,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.newUi.background,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
  },
})

const numberToString = (number: number) => {
  if (number === 1) {
    return 'first'
  } else if (number === 2) {
    return 'second'
  } else if (number === 3) {
    return 'third'
  } else if (number === 4) {
    return 'fourth'
  } else if (number === 5) {
    return 'fifth'
  } else if (number === 6) {
    return 'sixth'
  } else {
    return ''
  }
}

export const WorkoutStartTemplate = (props: {
  children: React.ReactNode
  workoutStats: WorkoutStats
  onStartWorkout: () => void
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Title>{getTrainingTitle(props.workoutStats)}</Title>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          This is your <Text style={styles.emphasized}>{numberToString(props.workoutStats.currentWeekProgress)}</Text>{' '}
          workout of week <Text style={styles.emphasized}>{props.workoutStats.currentWeek}</Text>.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>{props.children}</ScrollView>

      <View style={[styles.bottomButtonContainer]}>
        <PrimaryButton title="Start Workout" onPress={props.onStartWorkout} />
      </View>
    </View>
  )
}
