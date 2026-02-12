import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
})

export const EmphasizedText = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.text, style]}>{children}</Text>
}
