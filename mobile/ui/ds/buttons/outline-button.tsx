import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.small,
  },
  text: {
    color: theme.colors.primary.main,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 26,
    letterSpacing: 1.4,
    fontFamily: theme.font.sairaSemiBold,
  },
})

export const OutlineButton = ({
  title,
  onPress,
  style,
  disabled,
}: {
  title: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}) => {
  return (
    <View style={[style]}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.container]}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
