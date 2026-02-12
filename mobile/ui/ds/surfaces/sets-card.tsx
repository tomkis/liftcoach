import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginTop: 18,
    overflow: 'hidden',
  },
})

export const SetsCard = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
