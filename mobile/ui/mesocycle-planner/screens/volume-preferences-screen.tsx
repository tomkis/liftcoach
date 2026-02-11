import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MuscleGroup } from '@/mobile/domain'
import React from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { ScreenWrapper } from '@/mobile/ui/mesocycle-planner/screens/screen-wrapper'
import { NumericalInput } from '@/mobile/ui/onboarding/cards/ux/numerical-input'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

type VolumePreferencesScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'VolumePreferences'>
  route: RouteProp<MesocyclePlannerStackParamList, 'VolumePreferences'>
}

type FormValues = {
  [key in MuscleGroup]: string
}

const styles = StyleSheet.create({
  formBlockRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formBlockLabel: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 14,
    marginBottom: 4,
    fontSize: 10,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    color: theme.colors.newUi.text.primary,
    lineHeight: 16,
    letterSpacing: 0.15,
    fontSize: 12,
    fontFamily: theme.font.sairaRegular,
  },
  inputContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  container: {
    flexDirection: 'column',
    gap: 24,
    paddingBottom: 24,
  },
  infoText: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
})

interface VolumeInputProps {
  control: Control<FormValues>
  muscleGroup: MuscleGroup
  label: string
}

const VolumeInput = ({ control, muscleGroup, label }: VolumeInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.formBlockLabel}>{label}</Text>
    <View style={styles.formBlockRow}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name={muscleGroup}
          render={({ field }) => (
            <NumericalInput value={field.value} onChange={value => field.onChange(value)} placeholder="Sets" />
          )}
        />
        <Text style={styles.inputLabel}>sets</Text>
      </View>
    </View>
  </View>
)

interface VolumeFormProps {
  proposedVolume: Record<string, number>
  onSubmit: (data: FormValues) => void
}

const VolumeForm = ({ proposedVolume, onSubmit }: VolumeFormProps) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: Object.entries(proposedVolume).reduce(
      (acc, [muscleGroup, sets]) => ({
        ...acc,
        [muscleGroup]: sets.toString(),
      }),
      {} as FormValues
    ),
  })

  return (
    <ScreenWrapper title="Volume Preferences" onNext={handleSubmit(onSubmit)} includeScrollView>
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Based on your training goals, LiftCoach suggests these optimal training volumes. Customize freely to match
          your preferences.
        </Text>
        <View style={styles.row}>
          <VolumeInput control={control} muscleGroup={MuscleGroup.Chest} label="Chest" />
          <VolumeInput control={control} muscleGroup={MuscleGroup.Back} label="Back" />
        </View>
        <View style={styles.row}>
          <VolumeInput control={control} muscleGroup={MuscleGroup.Quads} label="Quads" />
          <VolumeInput control={control} muscleGroup={MuscleGroup.Hamstrings} label="Hamstrings" />
        </View>
        <View style={styles.row}>
          <VolumeInput control={control} muscleGroup={MuscleGroup.Triceps} label="Triceps" />
          <VolumeInput control={control} muscleGroup={MuscleGroup.Biceps} label="Biceps" />
        </View>
        <View style={styles.row}>
          <VolumeInput control={control} muscleGroup={MuscleGroup.SideDelts} label="Side Delts" />
          <VolumeInput control={control} muscleGroup={MuscleGroup.RearDelts} label="Rear Delts" />
        </View>
        <View style={styles.row}>
          <VolumeInput control={control} muscleGroup={MuscleGroup.Abs} label="Abs" />
          <VolumeInput control={control} muscleGroup={MuscleGroup.Glutes} label="Glutes" />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export const VolumePreferencesScreen = ({ navigation, route }: VolumePreferencesScreenProps) => {
  const { data: proposedVolume, isLoading } = trpc.mesoPlanner.proposeVolume.useQuery({
    muscleGroupPreference: route.params.muscleGroupPreference,
    trainingDays: route.params.trainingDays,
  })

  if (isLoading) {
    return (
      <ScreenWrapper title="Volume Preferences" onNext={() => {}} includeScrollView>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.newUi.text.primary} />
          <Text style={styles.loadingText}>Loading volume suggestions...</Text>
        </View>
      </ScreenWrapper>
    )
  }

  const handleSubmit = (data: FormValues) => {
    navigation.navigate('SplitTypeSelection', {
      trainingDays: route.params.trainingDays,
      muscleGroupPreference: route.params.muscleGroupPreference,
      volumePreferences: Object.entries(data).map(([muscleGroup, sets]) => ({
        muscleGroup: muscleGroup as MuscleGroup,
        sets: parseInt(sets as string) || 0,
      })),
    })
  }

  if (!proposedVolume) {
    return <></>
  }

  return <VolumeForm proposedVolume={proposedVolume} onSubmit={handleSubmit} />
}
