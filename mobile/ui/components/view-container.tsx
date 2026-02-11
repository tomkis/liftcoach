import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
})

export const ViewContainer = ({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) => {
  const insets = useSafeAreaInsets()
  return <View style={[styles.container, { paddingTop: insets.top }, style]}>{children}</View>
}
