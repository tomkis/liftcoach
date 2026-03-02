import { StyleSheet, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})

export const PaginationDots = ({
  count,
  activeIndex,
}: {
  count: number
  activeIndex: number
}) => (
  <View style={styles.container}>
    {Array.from({ length: count }, (_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          {
            backgroundColor:
              i === activeIndex ? theme.colors.primary.main : theme.colors.text.primary,
          },
        ]}
      />
    ))}
  </View>
)
