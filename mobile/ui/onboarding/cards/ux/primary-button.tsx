import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.newUi.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 4,
  },
  subtleContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.newUi.primary.main,
  },
  disabledContainer: {
    backgroundColor: theme.colors.newUi.primary.main,
    opacity: 0.5,
  },
  disabledSubtleContainer: {
    backgroundColor: 'transparent',
    opacity: 0.5,
    borderWidth: 1,
    borderColor: theme.colors.newUi.primary.main,
  },
  text: {
    color: theme.colors.newUi.primary.contrastText,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 26,
    letterSpacing: 1.4,
    fontFamily: theme.font.sairaSemiBold,
  },
  subtleText: {
    color: theme.colors.newUi.primary.main,
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 20,
    letterSpacing: 1.2,
    fontFamily: theme.font.sairaBold,
  },
})

export const PrimaryButton = ({
  title,
  onPress,
  style,
  disabled,
  variant = 'default',
}: {
  title: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  variant?: 'default' | 'subtle'
}) => {
  const isSubtle = variant === 'subtle'

  return (
    <View style={[style]}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={[
            isSubtle ? styles.subtleContainer : styles.container,
            disabled && (isSubtle ? styles.disabledSubtleContainer : styles.disabledContainer),
          ]}
        >
          <Text style={isSubtle ? styles.subtleText : styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
