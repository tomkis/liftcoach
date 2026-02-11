import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 24,
  },
})

export const ButtonContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>{children}</View>
)
