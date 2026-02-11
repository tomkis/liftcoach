import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export const ContentContainer = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}
