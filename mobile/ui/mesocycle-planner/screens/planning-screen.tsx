import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MuscleGroup } from '@/mobile/domain'
import React from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { H3 } from '@/mobile/ui/onboarding/cards/ux/headings'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { TextContentHolder } from '@/mobile/ui/ui/text-content-holder'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'
import { Paragraph } from '@/mobile/ui/components/paragraph'

export const PlanningScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MesocyclePlannerStackParamList>>()
  const { data: microcycle, isLoading } = trpc.workout.getCurrentMicrocycle.useQuery()
  const insets = useSafeAreaInsets()
  const tracking = useTracking()

  const onCreateNewCycle = () => {
    tracking.newTrainingPlan()
    navigation.navigate('TrainingDays')
  }

  // Helper function to get a readable label for muscle groups
  const getMuscleGroupLabel = (muscleGroup: MuscleGroup): string => {
    return muscleGroup.replace(/([A-Z])/g, ' $1').trim()
  }

  const CARD_PADDING = 18

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.newUi.background,
    },
    scrollContent: {},
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    noCycleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    card: {
      backgroundColor: theme.colors.newUi.backgroundLight,
      borderRadius: theme.borderRadius.medium,
      marginBottom: 16,
    },
    paddedContent: {
      paddingTop: CARD_PADDING,
      paddingLeft: CARD_PADDING,
      paddingRight: CARD_PADDING,
    },
    noCycleText: {
      color: theme.colors.newUi.text.primary,
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      marginTop: 4,
      color: theme.colors.gray,
    },
    cycleContainer: {
      marginBottom: 16,
    },
    dayContainer: {
      marginBottom: 12,
      borderRadius: theme.borderRadius.small,
      padding: 12,
      marginTop: 24,
      backgroundColor: '#1e1e1e',
      borderWidth: 1,
      borderColor: '#333333',
    },
    dayTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.newUi.primary.main,
      fontFamily: theme.font.sairaSemiBold,
    },
    exerciseItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#333333',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    exerciseItemNoBorder: {
      borderBottomWidth: 0,
    },
    exerciseContent: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.newUi.text.primary,
      fontFamily: theme.font.sairaSemiBold,
    },
    exerciseDetails: {
      fontSize: 12,
      color: theme.colors.gray,
      marginTop: 2,
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
      color: theme.colors.newUi.primary.main,
    },
  })

  return (
    <>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 12 }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.newUi.primary.main} />
          </View>
        ) : !microcycle ? (
          <View style={styles.noCycleContainer}>
            <View style={styles.card}>
              <View style={styles.paddedContent}>
                <TextContentHolder>
                  <Paragraph style={styles.noCycleText}>No active training cycle found</Paragraph>
                  <Paragraph style={styles.subtitle}>Create your first workout plan to get started</Paragraph>
                </TextContentHolder>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* Current Training Cycle */}
            <View style={styles.card}>
              <View style={styles.paddedContent}>
                <>
                  <H3>Training Plan</H3>
                  <View style={{ marginTop: 16 }}>
                    <Paragraph>
                      This is your personalized <Text style={styles.emphasized}>4-week training plan</Text>.
                    </Paragraph>
                    <Paragraph>
                      After 4 weeks, LiftCoach will assess your progress and suggest a new training plan.
                    </Paragraph>
                    <Paragraph>You can also build a new plan anytime.</Paragraph>
                    <Paragraph>
                      For best results, it&apos;s recommended to{' '}
                      <Text style={styles.emphasized}>follow the training program consistently</Text> for at least{' '}
                      <Text style={styles.emphasized}>three months</Text>.
                    </Paragraph>
                  </View>
                </>
              </View>
            </View>

            {microcycle.workouts
              .sort((a, b) => a.index - b.index)
              .map(workout => (
                <View key={workout.id} style={styles.card}>
                  <View style={styles.paddedContent}>
                    <Text style={styles.dayTitle}>Day {workout.index + 1}</Text>
                    <FlatList
                      data={workout.exercises}
                      keyExtractor={item => item.id}
                      renderItem={({ item, index }) => (
                        <View
                          style={
                            index === workout.exercises.length - 1
                              ? [styles.exerciseItem, styles.exerciseItemNoBorder]
                              : styles.exerciseItem
                          }
                        >
                          <View style={styles.exerciseContent}>
                            <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                            <Text style={styles.exerciseDetails}>
                              {getMuscleGroupLabel(item.exercise.muscleGroup)} • {item.targetSets} sets •{' '}
                              {item.targetReps} reps
                            </Text>
                          </View>
                        </View>
                      )}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              ))}
            <View style={{ height: 200 }} />
          </>
        )}
      </ScrollView>

      <View style={[styles.bottomButtonContainer]}>
        <PrimaryButton title="Build new training plan" onPress={onCreateNewCycle} />
      </View>
    </>
  )
}
