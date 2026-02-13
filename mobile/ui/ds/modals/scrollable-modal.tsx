import { ScrollView, StyleSheet, View } from 'react-native'

import { OutlineButton } from '@/mobile/ui/ds/buttons'

import { ModalShell } from './modal-shell'

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
})

export const ScrollableModal = ({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
}) => {
  return (
    <ModalShell visible={visible} title={title} maxHeight="80%">
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      <View style={styles.buttons}>
        <OutlineButton title="Close" onPress={onClose} style={{ flex: 1 }} />
      </View>
    </ModalShell>
  )
}
