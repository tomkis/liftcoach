import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
})

export const VerticalButtonStack = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}
