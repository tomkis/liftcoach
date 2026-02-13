import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.sairaBold,
    fontSize: 18,
    marginBottom: 10,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    lineHeight: 28,
  },
})

export const SectionHeading = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}
