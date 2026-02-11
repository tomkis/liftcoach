import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
})

export const TextContentHolder = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.content}>{children}</View>
}
