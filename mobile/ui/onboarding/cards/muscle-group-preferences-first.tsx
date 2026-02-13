import musclePreferencesImage from '@/assets/images/workout-experience.png'
import { Image, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { degToStartEnd } from '@/mobile/ui/onboarding/cards/ux/deg-to-start'
import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { CaptionText } from '@/mobile/ui/ds/typography'
import { ThreeBlockScreen } from '@/mobile/ui/ds/layout'
import { VerticalButtonStack } from '@/mobile/ui/ds/layout'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
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
    <ThreeBlockScreen
      topContent={
        <>
          <ScreenHeading style={{ textAlign: 'center' }}>Any muscle preferences?</ScreenHeading>
          <CaptionText>
            Are there specific areas of your body that you’d like to focus on improving?
          </CaptionText>
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
        <VerticalButtonStack>
          <PrimaryButton title="Well-balanced plan" onPress={onboarding.prepareWellBalancedPlan}></PrimaryButton>
          <PrimaryButton title="Yes, i have preferences" onPress={onboarding.goWithMusclePreferences}></PrimaryButton>
        </VerticalButtonStack>
      }
    ></ThreeBlockScreen>
  )
}
