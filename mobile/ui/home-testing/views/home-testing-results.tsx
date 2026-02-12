import { RouteProp, useRoute } from '@react-navigation/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { HorizontalButtonRow } from '@/mobile/ui/ds/layout'
import { CardWrapper } from '@/mobile/ui/home-testing/components/card-wrapper'
import { HomeTestingStackParamList } from '@/mobile/ui/home-testing/home-testing-stack'
import { percentiles } from '@/mobile/ui/home-testing/percentiles'
import { progression } from '@/mobile/ui/home-testing/progression-scheme'
import { HomeTestingMuscleGroup } from '@/mobile/ui/home-testing/types'
import { useHomeTestingNavigation } from '@/mobile/ui/home-testing/use-navigation'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { theme } from '@/mobile/theme/theme'
import { BodyText } from '@/mobile/ui/ds/typography'
import { CardTitle } from '@/mobile/ui/ds/typography'

const muscleGroupLabels: Record<HomeTestingMuscleGroup, string> = {
  [HomeTestingMuscleGroup.FrontLegs]: 'Front Legs',
  [HomeTestingMuscleGroup.BackLegs]: 'Back Legs',
  [HomeTestingMuscleGroup.Chest]: 'Front Upper Body',
  [HomeTestingMuscleGroup.Back]: 'Back Upper Body',
}

const repsLabels: Record<string, string> = {
  low: 'less than 5',
  intermediate: 'between 5 and 15',
  high: 'more than 15',
}

const getStrengthLevel = (muscleGroup: HomeTestingMuscleGroup, progression: number, reps: string): number => {
  const percentile =
    percentiles[muscleGroup][progression.toString() as '1' | '2' | '3' | '4'][reps as 'low' | 'intermediate' | 'high']
  return percentile
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  overallProgress: {
    alignItems: 'center',
    marginBottom: 32,
  },
  overallLabel: {
    fontSize: 16,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.text.primary,
    marginTop: 12,
    textAlign: 'center',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  muscleGroupCard: {
    borderRadius: theme.borderRadius.medium,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray.light,
    opacity: 1,
  },
  muscleGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  muscleGroupTitle: {
    fontSize: 16,
    fontFamily: theme.font.sairaBold,
    color: theme.colors.text.primary,
  },
  muscleGroupProgress: {
    alignItems: 'center',
  },
  muscleGroupLevel: {
    fontSize: 14,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.gray.light,
    marginTop: 4,
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.gray.light,
  },
  resultValue: {
    fontSize: 14,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.text.primary,
  },
  resultTextContainer: {
    marginBottom: 12,
  },
  resultMainText: {
    fontSize: 16,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    lineHeight: 22,
    marginBottom: 8,
  },
  resultHighlightText: {
    fontSize: 16,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.main,
  },
  tableContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.small,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray.light,
  },
  tableLabel: {
    fontSize: 13,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.gray.light,
    flex: 0.4,
    marginRight: 8,
  },
  tableValue: {
    fontSize: 13,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.text.primary,
    textAlign: 'right',
    flex: 0.6,
  },
  tableValueHighlight: {
    fontSize: 13,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.main,
    textAlign: 'right',
    flex: 0.6,
    flexWrap: 'wrap',
  },
  percentileBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.small,
  },
  percentileBadgeText: {
    fontSize: 13,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.contrastText,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthChip: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  strengthChipText: {
    fontSize: 12,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.contrastText,
  },
  buttonContainer: {
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: theme.colors.backgroundLight,
  },
  emphasized: {
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.primary.main,
  },
})

export const HomeTestingResults = () => {
  const route = useRoute<RouteProp<HomeTestingStackParamList, 'Results'>>()
  const navigation = useHomeTestingNavigation()
  const results = route.params

  const handleContinue = () => {
    navigation.getParent()?.navigate('TabNavigator')
  }

  const strengthLevels = Object.entries(results).reduce<Partial<Record<HomeTestingMuscleGroup, number>>>(
    (acc, [muscleGroup, result]) => {
      acc[muscleGroup as HomeTestingMuscleGroup] = getStrengthLevel(
        muscleGroup as HomeTestingMuscleGroup,
        result.progression,
        result.reps
      )
      return acc
    },
    {}
  )

  return (
    <CardWrapper>
      <View style={styles.container}>
        <View style={{ marginBottom: 24 }}>
          <CardTitle>Test Results</CardTitle>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <BodyText>Your test results are in. Here&apos;s how you did.</BodyText>
            <BodyText>Liftcoach will use these results to fine-tune your training plan.</BodyText>
          </View>

          <View style={styles.resultsContainer}>
            {Object.entries(results).map(([muscleGroup, result]) => {
              const strengthLevel = strengthLevels[muscleGroup as HomeTestingMuscleGroup]
              const exercise = progression.find(p => p.muscleGroup === muscleGroup)?.exercises[result.progression - 1]
                .exercise

              return (
                <View key={muscleGroup} style={styles.muscleGroupCard}>
                  <View style={styles.headerRow}>
                    <Text style={styles.muscleGroupTitle}>
                      {muscleGroupLabels[muscleGroup as HomeTestingMuscleGroup]}
                    </Text>
                    <View style={styles.strengthChip}>
                      <Text style={styles.strengthChipText}>{strengthLevel}%</Text>
                    </View>
                  </View>

                  <View style={styles.tableContainer}>
                    <BodyText>
                      <Text style={styles.emphasized}>{exercise}</Text> performed{' '}
                      <Text style={styles.emphasized}>{repsLabels[result.reps]}</Text> reps.
                    </BodyText>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <HorizontalButtonRow>
            <PrimaryButton title="Got it" onPress={handleContinue} style={{ flex: 1 }} />
          </HorizontalButtonRow>
        </View>
      </View>
    </CardWrapper>
  )
}
