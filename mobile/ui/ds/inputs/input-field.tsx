import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${theme.opacity.inputBorder})`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})

export const InputField = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
