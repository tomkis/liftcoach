import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
})

export const HorizontalButtonRow = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
