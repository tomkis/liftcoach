import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

import { useDeviceSize } from '@/mobile/hooks/use-device-size'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  h3: {
    fontFamily: theme.font.sairaBold,
    fontSize: 34,
    color: theme.colors.newUi.text.primary,
    textTransform: 'uppercase',
    lineHeight: 42,
  },
  title: {
    fontFamily: theme.font.sairaBold,
    fontSize: 18,
    marginBottom: 10,
    color: theme.colors.newUi.text.primary,
    textTransform: 'uppercase',
    lineHeight: 28,
  },
  h3Smaller: {
    fontSize: 24,
    lineHeight: 32,
  },
})

export const H3 = (props: { style?: StyleProp<TextStyle>; children: React.ReactNode; smaller?: boolean }) => {
  return <Text style={[styles.h3, props.style, props.smaller && styles.h3Smaller]}>{props.children}</Text>
}

export const H3ScreenAware = (props: {
  style?: StyleProp<TextStyle>
  children: React.ReactNode
  smaller?: boolean
}) => {
  const deviceSize = useDeviceSize()
  const smaller = deviceSize.isSmallDevice

  return (
    <H3 style={props.style} smaller={smaller}>
      {props.children}
    </H3>
  )
}

export const Title = (props: { style?: StyleProp<TextStyle>; children: React.ReactNode }) => {
  return <Text style={[styles.title, props.style]}>{props.children}</Text>
}
