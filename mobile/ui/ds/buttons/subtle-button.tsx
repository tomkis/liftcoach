import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  disabled: {
    backgroundColor: 'transparent',
    opacity: theme.opacity.disabled,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  text: {
    color: theme.colors.primary.main,
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 1.2,
    fontFamily: theme.font.sairaBold,
  },
})

export const SubtleButton = ({
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
