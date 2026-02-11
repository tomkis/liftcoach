import { StyleSheet, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const CARD_PADDING = 18

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: CARD_PADDING + 10,
    paddingBottom: CARD_PADDING + 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.newUi.background,
    width: '100%',
  },
  card: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    flex: 1,
    marginTop: 80,
  },
  paddedContent: {
    padding: CARD_PADDING,
    width: '100%',
    flex: 1,
  },
})

export const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* <View style={{ height: 80 }} /> */}
      <View style={styles.card}>
        <View style={styles.paddedContent}>{children}</View>
      </View>
    </View>
  )
}
