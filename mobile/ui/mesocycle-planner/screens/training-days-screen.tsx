import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { H3ScreenAware } from '@/mobile/ui/onboarding/cards/ux/headings'
import { OnboardingDescriptiveTextBlock } from '@/mobile/ui/onboarding/cards/ux/onboarding-descriptive-text-block'
import { OnboaardingThreeBlockTemplate } from '@/mobile/ui/onboarding/cards/ux/onboarding-three-block-template'
import { OnboardingVerticalButtonContainer } from '@/mobile/ui/onboarding/cards/ux/onboarding-vertical-button-container'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { ScreenBackground } from '@/mobile/ui/ux/screen-background'

type TrainingDaysScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'TrainingDays'>
}

export const TrainingDaysScreen = ({ navigation }: TrainingDaysScreenProps) => {
  const days = [2, 3, 4, 5, 6]

  return (
    <ScreenBackground>
      <OnboaardingThreeBlockTemplate
        step="TrainingDays"
        topContent={<H3ScreenAware style={{ textAlign: 'center' }}>Training Frequency</H3ScreenAware>}
        middleContainerStyle={{ flex: 2 }}
        bottomContainerStyle={{ marginTop: -100 }}
        middleContent={
          <OnboardingDescriptiveTextBlock style={{ paddingBottom: 48, paddingHorizontal: 40 }}>
            Let&apos;s build the plan. How many days would you like to train per week?
          </OnboardingDescriptiveTextBlock>
        }
        bottomContent={
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <OnboardingVerticalButtonContainer>
              {days.map(day => (
                <PrimaryButton
                  key={day}
                  title={`${day} days per week`}
                  onPress={() => navigation.navigate('MusclePreferences', { trainingDays: day })}
                />
              ))}
            </OnboardingVerticalButtonContainer>
          </View>
        }
      />
    </ScreenBackground>
  )
}
