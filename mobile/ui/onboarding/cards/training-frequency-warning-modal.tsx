import { StyleSheet, Text, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { BodyText } from '@/mobile/ui/ds/typography'
import { ModalShell } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
  },
  alertText: {
    marginBottom: 16,
    lineHeight: 22,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary.main,
  },
})

type AlertType = 'once-a-week' | 'everyday'

interface TrainingFrequencyAlertModalProps {
  visible: boolean
  alertType: AlertType
  onConfirm: () => void
}

export const TrainingFrequencyAlertModal = ({ visible, alertType, onConfirm }: TrainingFrequencyAlertModalProps) => {
  const getModalContent = () => {
    if (alertType === 'once-a-week') {
      return {
        message: (
          <>
            <BodyText style={styles.alertText}>
              We understand you&apos;d prefer to train <Text style={styles.emphasized}>once a week</Text>, and
              that&apos;s perfectly fine!
            </BodyText>
            <BodyText style={styles.alertText}>
              To get the best results, your training will <Text style={styles.emphasized}>alternate</Text> between two
              different workout routines each week.
            </BodyText>
          </>
        ),
      }
    } else {
      return {
        message: (
          <>
            <BodyText style={styles.alertText}>
              We understand you want to train <Text style={styles.emphasized}>every day</Text>, and your dedication is
              impressive!
            </BodyText>
            <BodyText style={styles.alertText}>
              LiftCoach will build your training program around{' '}
              <Text style={styles.emphasized}>six distinct routines</Text> to ensure optimal muscle distribution.
            </BodyText>
            <BodyText style={styles.alertText}>
              You can still train every day, each day&apos;s workout will rotate weekly, keeping things varied and
              effective.
            </BodyText>
          </>
        ),
      }
    }
  }

  const content = getModalContent()

  return (
    <ModalShell visible={visible} title="Optimizing Your Training">
      {content.message}
      <View style={styles.modalButtons}>
        <PrimaryButton title="Okay, got it!" onPress={onConfirm} style={styles.confirmButton} />
      </View>
    </ModalShell>
  )
}
