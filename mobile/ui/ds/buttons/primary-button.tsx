import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.small,
  },
  disabled: {
    backgroundColor: theme.colors.primary.main,
    opacity: theme.opacity.disabled,
  },
  text: {
    color: theme.colors.primary.contrastText,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 26,
    letterSpacing: 1.4,
    fontFamily: theme.font.sairaSemiBold,
  },
})

export const PrimaryButton = ({
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
        <View style={[styles.container, disabled && styles.disabled]}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
