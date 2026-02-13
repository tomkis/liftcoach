import Slider from '@react-native-community/slider'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BodyPart, MuscleGroup, MuscleGroupPreference } from '@/mobile/domain'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import React, { useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { ScreenWrapper } from '@/mobile/ui/mesocycle-planner/screens/screen-wrapper'
import { theme } from '@/mobile/theme/theme'

type MusclePreferencesScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'MusclePreferences'>
  route: RouteProp<MesocyclePlannerStackParamList, 'MusclePreferences'>
}

type FormValues = {
  [key in BodyPart | MuscleGroup]: number
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    marginHorizontal: 40,
  },
  title: {
    height: 100,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: 30,
  },
  muscleGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  muscleGroupHeaderText: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

interface PreferenceSliderProps {
  control: Control<FormValues>
  name: BodyPart | MuscleGroup
  style?: any
}

const PreferenceSlider = ({ control, name, style }: PreferenceSliderProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Slider
        style={style}
        minimumValue={1}
        maximumValue={10}
        onValueChange={value => {
          field.onChange(value)
        }}
        step={1}
        value={field.value}
        minimumTrackTintColor={theme.colors.primary.main}
        maximumTrackTintColor="rgba(255,195,0, 0.3)"
        thumbTintColor={theme.colors.primary.main}
      />
    )}
  />
)

const ToggleableBlock = ({
  title,
  expanded,
  onToggleExpand,
}: {
  title: string
  expanded: boolean
  onToggleExpand: () => void
}) => {
  return (
    <Pressable onPress={onToggleExpand}>
      <View style={[styles.muscleGroupHeader, { flexDirection: 'row' }]}>
        <Text style={[styles.muscleGroupHeaderText, { flex: 1 }]}>{title}</Text>
        <View style={{ alignItems: 'flex-end' }}>
          {expanded ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.muscleGroupHeaderText}>Show less</Text>
              <ChevronUp size={24} color={theme.colors.text.primary} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.muscleGroupHeaderText}>Show More</Text>
              <ChevronDown size={24} color={theme.colors.text.primary} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export const MusclePreferencesScreen = ({ navigation, route }: MusclePreferencesScreenProps) => {
  const [expanded, setExpanded] = useState({ legs: false, shoulders: false, arms: false })

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      [BodyPart.Legs]: 7,
      [BodyPart.Shoulders]: 4,
      [BodyPart.Arms]: 3,
      [MuscleGroup.Chest]: 7,
      [MuscleGroup.Back]: 7,
      [MuscleGroup.Abs]: 3,
      [MuscleGroup.Quads]: 5,
      [MuscleGroup.Hamstrings]: 5,
      [MuscleGroup.Glutes]: 5,
      [MuscleGroup.Biceps]: 5,
      [MuscleGroup.Triceps]: 5,
      [MuscleGroup.SideDelts]: 5,
      [MuscleGroup.RearDelts]: 5,
    },
  })

  const onSubmit = handleSubmit(data => {
    const muscleGroupPreference: MuscleGroupPreference = {
      chest: data[MuscleGroup.Chest],
      back: data[MuscleGroup.Back],
      abs: data[MuscleGroup.Abs],
    }

    // Handle legs preferences
    if (expanded.legs) {
      muscleGroupPreference.glutes = data[MuscleGroup.Glutes]
      muscleGroupPreference.hamstrings = data[MuscleGroup.Hamstrings]
      muscleGroupPreference.quads = data[MuscleGroup.Quads]
    } else {
      muscleGroupPreference.legs = data[BodyPart.Legs]
    }

    // Handle shoulders preferences
    if (expanded.shoulders) {
      muscleGroupPreference.sideDelts = data[MuscleGroup.SideDelts]
      muscleGroupPreference.rearDelts = data[MuscleGroup.RearDelts]
    } else {
      muscleGroupPreference.shoulders = data[BodyPart.Shoulders]
    }

    // Handle arms preferences
    if (expanded.arms) {
      muscleGroupPreference.biceps = data[MuscleGroup.Biceps]
      muscleGroupPreference.triceps = data[MuscleGroup.Triceps]
    } else {
      muscleGroupPreference.arms = data[BodyPart.Arms]
    }

    navigation.navigate('VolumePreferences', {
      trainingDays: route.params.trainingDays,
      muscleGroupPreference,
    })
  })

  return (
    <ScreenWrapper title="Muscle Priorities" onNext={onSubmit} includeScrollView>
      <>
        <ToggleableBlock
          expanded={expanded.legs}
          title="Legs"
          onToggleExpand={() => setExpanded(prev => ({ ...prev, legs: !prev.legs }))}
        />
        <PreferenceSlider control={control} name={BodyPart.Legs} />
        {expanded.legs && (
          <>
            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Quads</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.Quads} />

            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Hamstrings</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.Hamstrings} />

            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Glutes</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.Glutes} />
          </>
        )}
        <View style={styles.muscleGroupHeader}>
          <Text style={styles.muscleGroupHeaderText}>Chest</Text>
        </View>
        <PreferenceSlider control={control} name={MuscleGroup.Chest} />
        <View style={styles.muscleGroupHeader}>
          <Text style={styles.muscleGroupHeaderText}>Back</Text>
        </View>
        <PreferenceSlider control={control} name={MuscleGroup.Back} />
        <ToggleableBlock
          expanded={expanded.shoulders}
          title="Shoulders"
          onToggleExpand={() => setExpanded(prev => ({ ...prev, shoulders: !prev.shoulders }))}
        />
        <PreferenceSlider control={control} name={BodyPart.Shoulders} />
        {expanded.shoulders && (
          <>
            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Side Delts</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.SideDelts} />

            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Rear Delts</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.RearDelts} />
          </>
        )}
        <ToggleableBlock
          expanded={expanded.arms}
          title="Arms"
          onToggleExpand={() => setExpanded(prev => ({ ...prev, arms: !prev.arms }))}
        />
        <PreferenceSlider control={control} name={BodyPart.Arms} />
        {expanded.arms && (
          <>
            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Biceps</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.Biceps} />

            <View style={styles.muscleGroupHeader}>
              <Text style={styles.muscleGroupHeaderText}>Triceps</Text>
            </View>
            <PreferenceSlider control={control} name={MuscleGroup.Triceps} />
          </>
        )}
        <View style={styles.muscleGroupHeader}>
          <Text style={styles.muscleGroupHeaderText}>Abs</Text>
        </View>
        <PreferenceSlider control={control} name={MuscleGroup.Abs} />
      </>
    </ScreenWrapper>
  )
}
