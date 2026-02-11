import Slider from '@react-native-community/slider'
import { MuscleGroupPreference } from '@/mobile/domain'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { H3ScreenAware } from '@/mobile/ui/onboarding/cards/ux/headings'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 24,
  },
  muscleGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  expandedBlock: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  expandedItemWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  expandedItemTitle: {
    width: 100,
    height: 100,
    paddingLeft: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  muscleGroupHeaderText: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

interface PreferenceSliderProps {
  control: Control<MuscleGroupPreference>
  name: keyof MuscleGroupPreference
  style?: StyleProp<ViewStyle>
}

const PreferenceSlider = ({ control, name, style }: PreferenceSliderProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <Slider
        style={style}
        minimumValue={0}
        maximumValue={10}
        onValueChange={value => {
          field.onChange(value)
        }}
        step={1}
        value={field.value}
        minimumTrackTintColor={theme.colors.newUi.primary.main}
        maximumTrackTintColor="rgba(255,195,0, 0.3)"
        thumbTintColor={theme.colors.newUi.primary.main}
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
              <ChevronUp size={24} color={theme.colors.newUi.text.primary} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.muscleGroupHeaderText}>Show More</Text>
              <ChevronDown size={24} color={theme.colors.newUi.text.primary} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export const MuscleGroupPreferencesSecondCardView = () => {
  return (
    <MuscleGroupPreferencesSecondCardViewInternal
      defaultMuscleGroupPreference={{
        chest: 7,
        back: 7,
        shoulders: 4,
        arms: 3,
        legs: 7,
        abs: 3,
      }}
    />
  )
}

const ensureMusclePreferencesIntegrity = (
  data: MuscleGroupPreference,
  expanded: { legs: boolean; shoulders: boolean; arms: boolean }
) => {
  const adjustedValues = { ...data }

  if (expanded.arms) {
    adjustedValues.arms = undefined
  } else {
    adjustedValues.biceps = undefined
    adjustedValues.triceps = undefined
  }

  if (expanded.legs) {
    adjustedValues.legs = undefined
  } else {
    adjustedValues.glutes = undefined
    adjustedValues.hamstrings = undefined
    adjustedValues.quads = undefined
  }

  if (expanded.shoulders) {
    adjustedValues.shoulders = undefined
  } else {
    adjustedValues.sideDelts = undefined
    adjustedValues.rearDelts = undefined
  }

  return adjustedValues
}

const MuscleGroupPreferencesSecondCardViewInternal = (props: {
  defaultMuscleGroupPreference: MuscleGroupPreference
}) => {
  const onboarding = useOnboardingContext()
  const [expanded, setExpanded] = useState({ legs: false, shoulders: false, arms: false })
  const tracking = useTracking()

  const { control, handleSubmit } = useForm<MuscleGroupPreference>({
    defaultValues: {
      legs: props.defaultMuscleGroupPreference.legs,
      quads: 5,
      hamstrings: 5,
      glutes: 5,
      chest: props.defaultMuscleGroupPreference.chest,
      back: 5,
      shoulders: props.defaultMuscleGroupPreference.shoulders,
      sideDelts: 5,
      rearDelts: 5,
      arms: props.defaultMuscleGroupPreference.arms,
      biceps: 5,
      triceps: 5,
      abs: 5,
    },
  })

  const onSubmit = handleSubmit(data => {
    const adjustedValues = ensureMusclePreferencesIntegrity(data, expanded)
    onboarding.selectMuscleGroupPreferences(adjustedValues)
  })

  const onToggleLegs = useCallback(() => {
    tracking.showMoreMusclePreferences('legs')
    setExpanded(prev => ({ ...prev, legs: !prev.legs }))
  }, [tracking, setExpanded])

  const onToggleShoulders = useCallback(() => {
    tracking.showMoreMusclePreferences('shoulders')
    setExpanded(prev => ({ ...prev, shoulders: !prev.shoulders }))
  }, [tracking, setExpanded])

  const onToggleArms = useCallback(() => {
    tracking.showMoreMusclePreferences('arms')
    setExpanded(prev => ({ ...prev, arms: !prev.arms }))
  }, [tracking, setExpanded])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.newUi.background,
        flexDirection: 'column',
      }}
    >
      <View style={{ height: 100, justifyContent: 'center', marginHorizontal: 60, marginBottom: 20 }}>
        <H3ScreenAware style={{ textAlign: 'center' }}>Your preferences</H3ScreenAware>
      </View>
      <View style={{ flex: 1, marginHorizontal: 40 }}>
        <ScrollView>
          <ToggleableBlock expanded={expanded.legs} title="Legs" onToggleExpand={onToggleLegs} />
          <PreferenceSlider control={control} name="legs" />

          <View style={{ display: expanded.legs ? 'flex' : 'none' }}>
            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Quads</Text>
              </View>
              <PreferenceSlider control={control} name="quads" style={{ flex: 1 }} />
            </View>

            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Hamstrings</Text>
              </View>
              <PreferenceSlider control={control} name="hamstrings" style={{ flex: 1 }} />
            </View>

            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Glutes</Text>
              </View>
              <PreferenceSlider control={control} name="glutes" style={{ flex: 1 }} />
            </View>
          </View>

          <View style={styles.muscleGroupHeader}>
            <Text style={styles.muscleGroupHeaderText}>Chest</Text>
          </View>
          <PreferenceSlider control={control} name="chest" />

          <View style={styles.muscleGroupHeader}>
            <Text style={styles.muscleGroupHeaderText}>Back</Text>
          </View>
          <PreferenceSlider control={control} name="back" />

          <ToggleableBlock expanded={expanded.shoulders} title="Shoulders" onToggleExpand={onToggleShoulders} />
          <PreferenceSlider control={control} name="shoulders" />

          <View style={{ display: expanded.shoulders ? 'flex' : 'none' }}>
            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Side Delts</Text>
              </View>
              <PreferenceSlider control={control} name="sideDelts" style={{ flex: 1 }} />
            </View>

            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Rear Delts</Text>
              </View>
              <PreferenceSlider control={control} name="rearDelts" style={{ flex: 1 }} />
            </View>
          </View>

          <ToggleableBlock expanded={expanded.arms} title="Arms" onToggleExpand={onToggleArms} />
          <PreferenceSlider control={control} name="arms" />

          <View style={{ display: expanded.arms ? 'flex' : 'none' }}>
            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Biceps</Text>
              </View>
              <PreferenceSlider control={control} name="biceps" style={{ flex: 1 }} />
            </View>

            <View>
              <View style={styles.muscleGroupHeader}>
                <Text style={styles.muscleGroupHeaderText}>Triceps</Text>
              </View>
              <PreferenceSlider control={control} name="triceps" style={{ flex: 1 }} />
            </View>
          </View>

          <View style={styles.muscleGroupHeader}>
            <Text style={styles.muscleGroupHeaderText}>Abs</Text>
          </View>
          <PreferenceSlider control={control} name="abs" />
        </ScrollView>
      </View>
      <View style={{ justifyContent: 'flex-end', paddingBottom: 40, marginHorizontal: 40 }}>
        <PrimaryButton title="Proceed with preferences" onPress={onSubmit}></PrimaryButton>
      </View>
    </View>
  )
}
