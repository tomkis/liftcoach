import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { ConfirmationModal } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
    color: theme.colors.text.primary,
  },
  subtitle2: {
    color: theme.colors.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
  },
})

interface IncompleteSetsModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const IncompleteSetsModal = ({ visible, onConfirm, onCancel }: IncompleteSetsModalProps) => {
  return (
    <ConfirmationModal
      visible={visible}
      title="Incomplete Exercise"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Finish"
    >
      <Text style={styles.subtitle}>You haven&apos;t completed all sets.</Text>
      <Text style={styles.subtitle}>Finishing this exercise will mark the remaining sets as failed.</Text>
      <Text style={styles.subtitle}>Do you want to proceed?</Text>
      <Text style={styles.subtitle2}>Not completing the exercise could negatively affect your progress.</Text>
    </ConfirmationModal>
  )
}
