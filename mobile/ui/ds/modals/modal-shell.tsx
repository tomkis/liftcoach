import { DimensionValue, Modal, StyleSheet, Text, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: `rgba(0, 0, 0, ${theme.opacity.overlay})`,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.xxl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    ...theme.shadow.modal,
  },
  title: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})

export const ModalShell = ({
  visible,
  title,
  children,
  maxHeight,
}: {
  visible: boolean
  title: string
  children: React.ReactNode
  maxHeight?: DimensionValue
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.content, maxHeight ? { maxHeight } : undefined]}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  )
}
