import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.15,
    color: `rgba(255, 255, 255, ${theme.opacity.inputText})`,
  },
})

export const CaptionText = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}
