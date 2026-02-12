import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MuscleGroup } from '@/mobile/domain'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { ScreenWrapper } from '@/mobile/ui/mesocycle-planner/screens/screen-wrapper'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

type SplitTypeSelectionScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'SplitTypeSelection'>
  route: RouteProp<MesocyclePlannerStackParamList, 'SplitTypeSelection'>
}

type SplitType = {
  id: string
  name: string
  isRecommended?: boolean
  distribution: Array<{
    dayIndex: number
    muscleGroups: Array<{
      muscleGroup: MuscleGroup
      sets: number
    }>
  }>
}

const SPLIT_NAMES: Record<string, string> = {
  ppl: 'Push / Pull / Legs',
  upper_lower: 'Upper / Lower',
  push_pull: 'Push / Pull',
  full_body: 'Full Body',
  custom: 'Custom',
}

interface SplitTypeFormProps {
  proposedSplit: { type: string; split: Array<{ exercises: Array<{ muscleGroup: MuscleGroup; sets: number }> }> }
  trainingDays: number
  onContinue: (split: SplitType) => void
}

const SplitTypeForm = ({ proposedSplit, trainingDays, onContinue }: SplitTypeFormProps) => {
  const serverSplit: SplitType = {
    id: proposedSplit.type,
    name: SPLIT_NAMES[proposedSplit.type] || proposedSplit.type,
    isRecommended: true,
    distribution: proposedSplit.split.map((day, index) => ({
      dayIndex: index + 1,
      muscleGroups: day.exercises.map(ex => ({
        muscleGroup: ex.muscleGroup,
        sets: ex.sets,
      })),
    })),
  }

  const customSplit: SplitType = {
    id: 'custom',
    name: 'Custom Split',
    distribution: Array.from({ length: trainingDays }, (_, i) => ({
      dayIndex: i + 1,
      muscleGroups: [],
    })),
  }

  const [selectedSplit, setSelectedSplit] = useState<SplitType>(serverSplit)

  const handleSplitSelect = (split: SplitType) => {
    setSelectedSplit(split)
  }

  const handleContinue = () => {
    onContinue(selectedSplit)
  }

  const renderSplitItem = (split: SplitType) => {
    const isSelected = selectedSplit.id === split.id
    const showDaysRecommendation = split.id === serverSplit.id && split.distribution.length > trainingDays

    return (
      <TouchableOpacity
        style={[styles.splitItem, isSelected && styles.selectedSplitItem]}
        onPress={() => handleSplitSelect(split)}
      >
        <View style={styles.splitHeader}>
          <Text style={styles.splitName}>
            {split.id === 'custom' ? `${trainingDays} Days Custom Split` : split.name}
          </Text>
          {split.isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          )}
        </View>
        {split.id !== 'custom' && (
          <View style={styles.splitDetails}>
            {split.distribution.map((day, index) => (
              <View key={`${split.id}-day-${index}`} style={styles.dayInfo}>
                <Text style={styles.dayText}>Day {day.dayIndex}:</Text>
                <Text style={styles.muscleGroupsText}>
                  {day.muscleGroups.length > 0
                    ? day.muscleGroups.map(mg => mg.muscleGroup).join(', ')
                    : 'Customize your split'}
                </Text>
              </View>
            ))}
            {showDaysRecommendation && (
              <View style={styles.recommendationContainer}>
                <Text style={styles.recommendationText}>
                  To achieve ideal workout distribution, it is recommended to extend the training cycle to{' '}
                  {split.distribution.length} days.
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const splits = [serverSplit, customSplit]

  return (
    <ScreenWrapper title="Preferred Split" onNext={handleContinue} includeScrollView>
      <View style={{ flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
        {splits.map(split => (
          <View key={split.id}>{renderSplitItem(split)}</View>
        ))}
      </View>
    </ScreenWrapper>
  )
}

export const SplitTypeSelectionScreen = ({ navigation, route }: SplitTypeSelectionScreenProps) => {
  const { data: proposedSplit, isLoading } = trpc.mesoPlanner.proposeSplit.useQuery({
    volumePerMuscleGroup: route.params.volumePreferences.reduce(
      (acc, { muscleGroup, sets }) => {
        acc[muscleGroup] = sets
        return acc
      },
      {} as Record<MuscleGroup, number>
    ),
    trainingDays: route.params.trainingDays,
  })

  if (isLoading) {
    return (
      <ScreenWrapper title="Preferred Split" onNext={() => {}} includeScrollView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.text.primary} />
          <Text style={styles.loadingText}>Loading split suggestions...</Text>
        </View>
      </ScreenWrapper>
    )
  }

  if (!proposedSplit || proposedSplit === false) {
    throw new Error('No suitable split found for your preferences')
  }

  const handleContinue = (split: SplitType) => {
    // Group distributions by day
    const splitByDay = split.distribution.reduce(
      (acc, day) => {
        acc[day.dayIndex] = day.muscleGroups
        return acc
      },
      {} as { [key: number]: Array<{ muscleGroup: MuscleGroup; sets: number }> }
    )

    navigation.navigate('SplitSelection', {
      trainingDays: route.params.trainingDays,
      muscleGroupPreference: route.params.muscleGroupPreference,
      volumePreferences: route.params.volumePreferences,
      splitType: split.id,
      splitByDay,
    })
  }

  return (
    <SplitTypeForm proposedSplit={proposedSplit} trainingDays={route.params.trainingDays} onContinue={handleContinue} />
  )
}

const styles = StyleSheet.create({
  splitItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
  },
  selectedSplitItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    margin: -1,
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  splitName: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendedBadge: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: theme.colors.primary.contrastText,
    fontSize: 12,
    fontWeight: '600',
  },
  splitDetails: {
    gap: 8,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  muscleGroupsText: {
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  recommendationContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary.main,
  },
  recommendationText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
  },
})
