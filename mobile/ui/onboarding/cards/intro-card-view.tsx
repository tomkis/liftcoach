import chestImage from '@/assets/images/chest-intro.png'
import { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { degToStartEnd } from '@/mobile/ui/onboarding/cards/ux/deg-to-start'
import { OnboardingDescriptiveTextBlock } from '@/mobile/ui/onboarding/cards/ux/onboarding-descriptive-text-block'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { theme } from '@/mobile/theme/theme'

import { useOnboardingContext } from '../hooks/use-onboarding-context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.newUi.background,
  },
  mainContent: {
    flexDirection: 'column',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: theme.font.orbitronBold,
    fontSize: 90,
    color: theme.colors.newUi.text.primary,
    fontWeight: '900',
    borderWidth: 1,
    lineHeight: 90,
    padding: 0,
  },
  logoTextAccent: {
    color: theme.colors.newUi.primary.main,
  },
  logoSubtext: {
    fontFamily: theme.font.orbitronBold,
    fontSize: 55,
    color: theme.colors.newUi.text.primary,
    marginTop: -20,
    fontWeight: '900',
  },
  topSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  taglineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineText: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaCondensedRegular,
    textTransform: 'uppercase',
    letterSpacing: 1.37,
  },
  imageSection: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
  },
  image: {
    width: '100%',
    flex: 1,
  },
  bottomSection: {
    flex: 1,
    gap: 40,
    paddingHorizontal: 40,
    paddingTop: 30,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  descriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.logoText}>
        <Text style={styles.logoTextAccent}>LIFT</Text>
      </Text>
      <Text style={styles.logoSubtext}>COACH</Text>
    </View>
  )
}

export const IntroCardView = () => {
  const onboarding = useOnboardingContext()
  const insets = useSafeAreaInsets()
  const tracking = useTracking()

  useEffect(() => {
    tracking.appStarted()
  }, [tracking])

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.mainContent}>
        <View style={styles.topSection}>
          <Logo />
          <View style={styles.taglineContainer}>
            <Text style={styles.taglineText}>Your personal trainer, right in your pocket</Text>
          </View>
        </View>

        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image source={chestImage} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(18, 18, 18, 1)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 1)']}
              locations={[0, 0.24, 0.73, 1]}
              start={degToStartEnd(90).start}
              end={degToStartEnd(90).end}
              style={styles.gradientOverlay}
            />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.descriptionContainer}>
            <OnboardingDescriptiveTextBlock>
              Let&apos;s get to know you better so we can design a workout routine tailored just for you.
            </OnboardingDescriptiveTextBlock>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton title="Get Started" onPress={onboarding.start} />
          </View>
        </View>
      </View>
    </View>
  )
}
