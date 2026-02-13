import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { useDeviceSize } from '@/mobile/hooks/use-device-size'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.font.sairaBold,
    fontSize: 34,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    lineHeight: 42,
  },
  smaller: {
    fontSize: 24,
    lineHeight: 32,
  },
})

export const ScreenHeading = ({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) => {
  const { isSmallDevice } = useDeviceSize()

  return <Text style={[styles.text, isSmallDevice && styles.smaller, style]}>{children}</Text>
}
