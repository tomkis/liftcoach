import { Modal, StyleSheet, Text, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { theme } from '@/mobile/theme/theme'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
    marginTop: -12,
    marginRight: -8,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.gray,
  },
  alertText: {
    marginBottom: 16,
    lineHeight: 22,
  },
  emphasized: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.primary.main,
  },
  confirmButton: {
    backgroundColor: theme.colors.newUi.primary.main,
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
        title: 'Optimizing Your Training',
        message: (
          <>
            <Paragraph style={styles.alertText}>
              We understand you&apos;d prefer to train <Text style={styles.emphasized}>once a week</Text>, and
              that&apos;s perfectly fine!
            </Paragraph>
            <Paragraph style={styles.alertText}>
              To get the best results, your training will <Text style={styles.emphasized}>alternate</Text> between two
              different workout routines each week.
            </Paragraph>
          </>
        ),
      }
    } else {
      return {
        title: 'Optimizing Your Training',
        message: (
          <>
            <Paragraph style={styles.alertText}>
              We understand you want to train <Text style={styles.emphasized}>every day</Text>, and your dedication is
              impressive!
            </Paragraph>
            <Paragraph style={styles.alertText}>
              LiftCoach will build your training program around{' '}
              <Text style={styles.emphasized}>six distinct routines</Text> to ensure optimal muscle distribution.
            </Paragraph>
            <Paragraph style={styles.alertText}>
              You can still train every day, each day&apos;s workout will rotate weekly, keeping things varied and
              effective.
            </Paragraph>
          </>
        ),
      }
    }
  }

  const content = getModalContent()

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Title style={styles.modalTitle}>{content.title}</Title>
          </View>
          {content.message}
          <View style={styles.modalButtons}>
            <PrimaryButton title="Okay, got it!" onPress={onConfirm} style={styles.confirmButton} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
