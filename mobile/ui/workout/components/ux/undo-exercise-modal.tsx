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

interface UndoExerciseModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}

export const UndoExerciseModal = ({ visible, onConfirm, onCancel, title, description }: UndoExerciseModalProps) => {
  return (
    <ConfirmationModal
      visible={visible}
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel="Undo"
    >
      <Text style={styles.subtitle}>{description}</Text>
      <Text style={styles.subtitle2}>You will need to re-complete this exercise before finishing the workout.</Text>
    </ConfirmationModal>
  )
}
