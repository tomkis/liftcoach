import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 40,
    borderBottomWidth: 2,
    borderColor: theme.colors.background,
  },
})

export const SetRow = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
