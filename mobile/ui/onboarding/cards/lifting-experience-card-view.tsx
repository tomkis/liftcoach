import workoutExperienceImage from '@/assets/images/workout-experience-2.png'
import { LiftingExperience } from '@/mobile/domain'
import { useCallback } from 'react'
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

export const LiftingExperienceCardView = () => {
  const onboarding = useOnboardingContext()

  const setLiftingExperience = useCallback(
    (experience: LiftingExperience) => {
      onboarding.setLiftingExperience(experience)
    },
    [onboarding]
  )

  return (
    <ThreeBlockScreen
      topContent={
        <>
          <ScreenHeading style={{ textAlign: 'center' }}>Training Experience</ScreenHeading>
          <CaptionText>
            How long have you been consistently lifting recently?
          </CaptionText>
        </>
      }
      middleContainerStyle={{ flex: 2 }}
      middleContent={
        <View style={styles.imageContainer}>
          <Image source={workoutExperienceImage} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(18, 18, 18, 1)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 1)']}
            locations={[0, 0.14, 0.93, 1]}
            start={degToStartEnd(90).start}
            end={degToStartEnd(90).end}
            style={styles.gradientOverlay}
          />
        </View>
      }
      bottomContent={
        <VerticalButtonStack>
          <PrimaryButton
            title="Never worked out"
            onPress={() => setLiftingExperience(LiftingExperience.None)}
          ></PrimaryButton>
          <PrimaryButton
            title="Less than a year"
            onPress={() => setLiftingExperience(LiftingExperience.Beginner)}
          ></PrimaryButton>
          <PrimaryButton
            title="1 - 3 years"
            onPress={() => setLiftingExperience(LiftingExperience.Intermediate)}
          ></PrimaryButton>
          <PrimaryButton
            title="3 - 7 years"
            onPress={() => setLiftingExperience(LiftingExperience.Advanced)}
          ></PrimaryButton>
          <PrimaryButton
            title="7+ years"
            onPress={() => setLiftingExperience(LiftingExperience.Advanced)}
          ></PrimaryButton>
        </VerticalButtonStack>
      }
    ></ThreeBlockScreen>
  )
}
