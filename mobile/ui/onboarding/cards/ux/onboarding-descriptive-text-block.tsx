import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  descriptionText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.15,
    color: 'rgba(255, 255, 255, 0.7)',
  },
})

export const OnboardingDescriptiveTextBlock = (props: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  return <Text style={[styles.descriptionText, props.style]}>{props.children}</Text>
}
