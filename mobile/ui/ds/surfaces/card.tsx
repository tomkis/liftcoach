import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    ...theme.shadow.card,
    shadowColor: '#000',
  },
})

export const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
