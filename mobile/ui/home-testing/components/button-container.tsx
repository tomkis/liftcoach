import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
})

export const ButtonContainer = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  return <View style={[styles.container, style]}>{children}</View>
}
