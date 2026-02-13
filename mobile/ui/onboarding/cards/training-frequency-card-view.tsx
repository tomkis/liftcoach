import { TrainingFrequency } from '@/mobile/domain'
import { useCallback, useState } from 'react'
import { View } from 'react-native'

import { useDeviceSize } from '@/mobile/hooks/use-device-size'
import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { CaptionText } from '@/mobile/ui/ds/typography'
import { ThreeBlockScreen } from '@/mobile/ui/ds/layout'
import { VerticalButtonStack } from '@/mobile/ui/ds/layout'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
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
      <ThreeBlockScreen
        topContent={
          <ScreenHeading style={{ textAlign: 'center' }}>How often are you willing to train in a week?</ScreenHeading>
        }
        middleContainerStyle={{ flex: 2 }}
        bottomContainerStyle={{ marginTop: -100 }}
        middleContent={
          <>
            {!deviceSize.isSmallDevice ? (
              <CaptionText style={{ paddingBottom: 48, paddingHorizontal: 40 }}>
                Training even once a week makes sense and can bring you results!
              </CaptionText>
            ) : (
              <></>
            )}
          </>
        }
        bottomContent={
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <VerticalButtonStack>
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
            </VerticalButtonStack>
          </View>
        }
      ></ThreeBlockScreen>

      <TrainingFrequencyAlertModal visible={showAlertModal} alertType={alertType} onConfirm={handleAlertConfirm} />
    </>
  )
}
