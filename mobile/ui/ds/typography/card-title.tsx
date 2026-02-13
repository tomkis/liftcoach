import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontSize: theme.fontSize.large,
    lineHeight: 32,
    fontFamily: theme.font.sairaCondesedBold,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
})

export const CardTitle = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}
