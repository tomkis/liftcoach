import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { SecondaryButton } from '@/mobile/ui/onboarding/cards/ux/secondary-button'
import { theme } from '@/mobile/theme/theme'

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
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
    color: theme.colors.newUi.text.primary,
  },
  subtitle2: {
    color: theme.colors.newUi.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
})

interface IncompleteSetsModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const IncompleteSetsModal = ({ visible, onConfirm, onCancel }: IncompleteSetsModalProps) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Incomplete Exercise</Text>
          <Text style={styles.subtitle}>You haven&apos;t completed all sets.</Text>
          <Text style={styles.subtitle}>Finishing this exercise will mark the remaining sets as failed.</Text>
          <Text style={styles.subtitle}>Do you want to proceed?</Text>
          <Text style={styles.subtitle2}>Not completing the exercise could negatively affect your progress.</Text>

          <View style={styles.buttonsContainer}>
            <SecondaryButton title="Cancel" onPress={onCancel} style={{ flex: 1 }} />
            <PrimaryButton title="Finish" onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
