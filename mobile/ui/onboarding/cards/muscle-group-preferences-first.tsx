import musclePreferencesImage from '@/assets/images/workout-experience.png'
import { Image, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { degToStartEnd } from '@/mobile/ui/onboarding/cards/ux/deg-to-start'
import { H3ScreenAware } from '@/mobile/ui/onboarding/cards/ux/headings'
import { OnboardingDescriptiveTextBlock } from '@/mobile/ui/onboarding/cards/ux/onboarding-descriptive-text-block'
import { OnboaardingThreeBlockTemplate } from '@/mobile/ui/onboarding/cards/ux/onboarding-three-block-template'
import { OnboardingVerticalButtonContainer } from '@/mobile/ui/onboarding/cards/ux/onboarding-vertical-button-container'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'

const styles = StyleSheet.create({
  imageContainer: {
    flex: 3,
    flexDirection: 'row',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export const MuscleGroupPreferencesFirstCardView = () => {
  const onboarding = useOnboardingContext()

  return (
    <OnboaardingThreeBlockTemplate
      step="MuscleGroupPreferencesFirst"
      topContent={
        <>
          <H3ScreenAware style={{ textAlign: 'center' }}>Any muscle preferences?</H3ScreenAware>
          <OnboardingDescriptiveTextBlock>
            Are there specific areas of your body that you’d like to focus on improving?
          </OnboardingDescriptiveTextBlock>
        </>
      }
      middleContainerStyle={{ flex: 2 }}
      middleContent={
        <View style={styles.imageContainer}>
          <Image source={musclePreferencesImage} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(18, 18, 18, 1)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 1)']}
            locations={[0, 0.07, 0.75, 1]}
            start={degToStartEnd(90).start}
            end={degToStartEnd(90).end}
            style={styles.gradientOverlay}
          />
        </View>
      }
      bottomContent={
        <OnboardingVerticalButtonContainer>
          <PrimaryButton title="Well-balanced plan" onPress={onboarding.prepareWellBalancedPlan}></PrimaryButton>
          <PrimaryButton title="Yes, i have preferences" onPress={onboarding.goWithMusclePreferences}></PrimaryButton>
        </OnboardingVerticalButtonContainer>
      }
    ></OnboaardingThreeBlockTemplate>
  )
}
