import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ApproveCycleCardView } from '@/mobile/ui/onboarding/cards/approve-cycle-card-view'
import { ChangeMicrocycleCardView } from '@/mobile/ui/onboarding/cards/change-microcycle-card-view'
import { FinalizationCardView } from '@/mobile/ui/onboarding/cards/finalization-card-view'
import { LiftingExperienceCardView } from '@/mobile/ui/onboarding/cards/lifting-experience-card-view'
import { MuscleGroupPreferencesFirstCardView } from '@/mobile/ui/onboarding/cards/muscle-group-preferences-first'
import { MuscleGroupPreferencesSecondCardView } from '@/mobile/ui/onboarding/cards/muscle-group-preferences-second'
import { TrainingFrequencyCardView } from '@/mobile/ui/onboarding/cards/training-frequency-card-view'
import { theme } from '@/mobile/theme/theme'

import { GenderCardView } from './cards/gender-card-view'
import { IntroCardView } from './cards/intro-card-view'
import { OnboardingStackParamList } from './cards/types'
import { OnboardingContext, useCreateOnboardingContext } from './hooks/use-onboarding-context'

const Stack = createNativeStackNavigator<OnboardingStackParamList>()

const disabledBack = {
  headerShown: false,
  gestureEnabled: false,
  fullScreenGestureEnabled: false,
} as const

export const OnboardingStack = () => {
  const value = useCreateOnboardingContext()
  const initialRouteName = 'Intro'

  return (
    <OnboardingContext.Provider value={value}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          headerStyle: {
            backgroundColor: theme.colors.newUi.background,
          },
          headerTintColor: theme.colors.newUi.text.primary,
          headerTitle: '',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Intro" component={IntroCardView} />
        <Stack.Screen name="Gender" component={GenderCardView} />
        <Stack.Screen name="LiftingExperience" component={LiftingExperienceCardView} />
        <Stack.Screen name="TrainingFrequencyCardView" component={TrainingFrequencyCardView} />
        <Stack.Screen name="MuscleGroupPreferencesFirst" component={MuscleGroupPreferencesFirstCardView} />
        <Stack.Screen name="MuscleGroupPreferencesSecond" component={MuscleGroupPreferencesSecondCardView} />
        <Stack.Screen name="Finalization" component={FinalizationCardView} />
        <Stack.Screen name="ApproveCycle" component={ApproveCycleCardView} options={disabledBack} />
        <Stack.Screen name="ChangeMicrocycle" component={ChangeMicrocycleCardView} options={disabledBack} />
      </Stack.Navigator>
    </OnboardingContext.Provider>
  )
}
