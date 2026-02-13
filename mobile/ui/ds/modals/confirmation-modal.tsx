import { StyleSheet, View } from 'react-native'

import { OutlineButton, PrimaryButton } from '@/mobile/ui/ds/buttons'

import { ModalShell } from './modal-shell'

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
})

export const ConfirmationModal = ({
  visible,
  title,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmDisabled,
}: {
  visible: boolean
  title: string
  children: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
}) => {
  return (
    <ModalShell visible={visible} title={title}>
      {children}
      <View style={styles.buttons}>
        <OutlineButton title={cancelLabel} onPress={onCancel} style={{ flex: 1 }} />
        <PrimaryButton title={confirmLabel} onPress={onConfirm} style={{ flex: 1 }} disabled={confirmDisabled} />
      </View>
    </ModalShell>
  )
}
