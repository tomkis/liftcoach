import finalImage from '@/assets/images/final.png'
import { onboardedUserSchema, Unit } from '@/mobile/domain'
import { useCallback, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { PrivacyPolicyModal } from '@/mobile/ui/onboarding/cards/modals/privacy-policy-modal'
import { TermsAndConditionsModal } from '@/mobile/ui/onboarding/cards/modals/terms-and-conditions-modal'
import { degToStartEnd } from '@/mobile/ui/onboarding/cards/ux/deg-to-start'
import { SectionHeading } from '@/mobile/ui/ds/typography'
import { CaptionText } from '@/mobile/ui/ds/typography'
import { ThreeBlockScreen } from '@/mobile/ui/ds/layout'
import { VerticalButtonStack } from '@/mobile/ui/ds/layout'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { SegmentedControl } from '@/mobile/ui/ds/controls'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'
import { useTracking } from '@/mobile/ui/tracking/tracking'
import { theme } from '@/mobile/theme/theme'
import { Checkbox } from '@/mobile/ui/ds/controls'
import { trpc } from '@/mobile/trpc'

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
  checkboxContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  termsLink: {
    color: theme.colors.primary.main,
    textDecorationLine: 'underline',
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.small,
  },
  termsText: {
    color: theme.colors.text.primary,
    flex: 1,
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.small,
  },
  unitLabel: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
})

export const FinalizationCardView = () => {
  const onboarding = useOnboardingContext()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const tracking = useTracking()
  const generateMicrocycle = trpc.workout.generateMicrocycle.useMutation()

  const onStart = useCallback(async () => {
    const user = onboarding.user
    const finalizedUser = onboardedUserSchema.parse(user)

    await generateMicrocycle.mutateAsync({ onboardedUser: finalizedUser })
    tracking.onboarding.funnel.signUp('local')
    onboarding.finalize()
  }, [onboarding, tracking, generateMicrocycle])

  const handleTermsToggle = useCallback(() => {
    const newValue = !agreedToTerms
    tracking.onboarding.tocToggled(newValue)
    setAgreedToTerms(newValue)
  }, [agreedToTerms, tracking])

  const handleTermsPress = useCallback(() => {
    tracking.onboarding.tocDisplayed()
    setShowTermsModal(true)
  }, [tracking])

  const handleCloseTerms = useCallback(() => {
    setShowTermsModal(false)
  }, [])

  const handlePrivacyPress = useCallback(() => {
    tracking.onboarding.privacyPolicyDisplayed()
    setShowPrivacyModal(true)
  }, [tracking])

  const handlePrivacyClose = useCallback(() => {
    setShowPrivacyModal(false)
  }, [])

  return (
    <>
      <ThreeBlockScreen
        topContent={
          <>
            <SectionHeading style={{ textAlign: 'center' }}>We are ready!</SectionHeading>
            <CaptionText>
              Amazing! We&apos;ve got all the data we need to prepare personalized workout routine that matches your
              preferences.
            </CaptionText>
          </>
        }
        middleContainerStyle={{ flex: 2 }}
        middleContent={
          <View style={styles.imageContainer}>
            <Image source={finalImage} style={styles.image} resizeMode="cover" />
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
            <Text style={styles.unitLabel}>System of Measure</Text>
            <SegmentedControl
              value={onboarding.user.unit || Unit.Metric}
              onChange={onboarding.unitsProvided}
              options={[
                { value: Unit.Imperial, label: 'Imperial' },
                { value: Unit.Metric, label: 'Metric' },
              ]}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={agreedToTerms}
                onPress={handleTermsToggle}
                label={
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink} onPress={handleTermsPress}>
                      Terms of Use
                    </Text>{' '}
                    and{' '}
                    <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                      Privacy Policy
                    </Text>
                  </Text>
                }
                color={theme.colors.primary.main}
              />
            </View>
            <PrimaryButton title="Start!" onPress={onStart} disabled={!agreedToTerms} />
          </VerticalButtonStack>
        }
      ></ThreeBlockScreen>

      <TermsAndConditionsModal visible={showTermsModal} onClose={handleCloseTerms} />
      <PrivacyPolicyModal visible={showPrivacyModal} onClose={handlePrivacyClose} />
    </>
  )
}
