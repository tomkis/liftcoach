import React from 'react'

import { ConfirmationModal } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'
import { BodyText } from '@/mobile/ui/ds/typography'

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
      <BodyText style={{ marginBottom: 12 }}>{description}</BodyText>
      <BodyText style={{ color: theme.colors.gray.light, marginBottom: 12 }}>
        You will need to re-complete this exercise before finishing the workout.
      </BodyText>
    </ConfirmationModal>
  )
}
