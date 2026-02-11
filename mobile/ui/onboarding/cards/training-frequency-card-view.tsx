import { TrainingFrequency } from '@/mobile/domain'
import { useCallback, useState } from 'react'
import { View } from 'react-native'

import { useDeviceSize } from '@/mobile/hooks/use-device-size'
import { H3ScreenAware } from '@/mobile/ui/onboarding/cards/ux/headings'
import { OnboardingDescriptiveTextBlock } from '@/mobile/ui/onboarding/cards/ux/onboarding-descriptive-text-block'
import { OnboaardingThreeBlockTemplate } from '@/mobile/ui/onboarding/cards/ux/onboarding-three-block-template'
import { OnboardingVerticalButtonContainer } from '@/mobile/ui/onboarding/cards/ux/onboarding-vertical-button-container'
import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { useOnboardingContext } from '@/mobile/ui/onboarding/hooks/use-onboarding-context'

import { TrainingFrequencyAlertModal } from './training-frequency-warning-modal'

export const TrainingFrequencyCardView = () => {
  const deviceSize = useDeviceSize()
  const onboarding = useOnboardingContext()
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertType, setAlertType] = useState<'once-a-week' | 'everyday'>('once-a-week')
  const [days, setDays] = useState<number | null>(null)

  const setTrainingFrequency = useCallback(
    (frequency: TrainingFrequency, days: number) => {
      onboarding.setTrainingFrequency(frequency, days)
      setDays(days)
    },
    [onboarding]
  )

  const handleFrequencySelection = useCallback(
    (frequency: TrainingFrequency, days: number, showAlert: boolean, alertType: 'once-a-week' | 'everyday') => {
      if (showAlert) {
        setAlertType(alertType)
        setShowAlertModal(true)
        setDays(days)
      } else {
        setTrainingFrequency(frequency, days)
      }
    },
    [setTrainingFrequency]
  )

  const handleAlertConfirm = useCallback(() => {
    const frequency = alertType === 'once-a-week' ? TrainingFrequency.TwoDays : TrainingFrequency.SixDays
    if (days === null) {
      throw new Error('Days are not set')
    }

    setTrainingFrequency(frequency, days)
    setShowAlertModal(false)
  }, [alertType, setTrainingFrequency, days])

  return (
    <>
      <OnboaardingThreeBlockTemplate
        step="TrainingFequency"
        topContent={
          <H3ScreenAware style={{ textAlign: 'center' }}>How often are you willing to train in a week?</H3ScreenAware>
        }
        middleContainerStyle={{ flex: 2 }}
        bottomContainerStyle={{ marginTop: -100 }}
        middleContent={
          <>
            {!deviceSize.isSmallDevice ? (
              <OnboardingDescriptiveTextBlock style={{ paddingBottom: 48, paddingHorizontal: 40 }}>
                Training even once a week makes sense and can bring you results!
              </OnboardingDescriptiveTextBlock>
            ) : (
              <></>
            )}
          </>
        }
        bottomContent={
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <OnboardingVerticalButtonContainer>
              <PrimaryButton
                title="Once a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.TwoDays, 1, true, 'once-a-week')}
              />
              <PrimaryButton
                title="Two times a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.TwoDays, 2, false, 'once-a-week')}
              />
              <PrimaryButton
                title="Three times a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.ThreeDays, 3, false, 'once-a-week')}
              />
              <PrimaryButton
                title="Four times a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.FourDays, 4, false, 'once-a-week')}
              />
              <PrimaryButton
                title="Five times a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.FiveDays, 5, false, 'once-a-week')}
              />
              <PrimaryButton
                title="Six times a week"
                onPress={() => handleFrequencySelection(TrainingFrequency.SixDays, 6, false, 'once-a-week')}
              />
              <PrimaryButton
                title="Everyday"
                onPress={() => handleFrequencySelection(TrainingFrequency.SixDays, 7, true, 'everyday')}
              />
            </OnboardingVerticalButtonContainer>
          </View>
        }
      ></OnboaardingThreeBlockTemplate>

      <TrainingFrequencyAlertModal visible={showAlertModal} alertType={alertType} onConfirm={handleAlertConfirm} />
    </>
  )
}
