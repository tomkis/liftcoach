import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.small,
    color: theme.colors.text.primary,
    lineHeight: 24,
    marginBottom: 8,
  },
})

export const BodyText = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}
