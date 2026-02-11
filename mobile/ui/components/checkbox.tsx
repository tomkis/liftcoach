import { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: theme.borderRadius.small,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: theme.colors.newUi.primary.contrastText,
  },
  checkmark: {
    fontSize: 14,
    fontFamily: theme.font.sairaCondensedSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 1.05,
  },
  checked: {},
})

export const Checkbox = ({
  checked,
  onPress,
  label,
  style,
  boxStyle,
  color,
}: {
  checked: boolean
  onPress: () => void
  label: ReactNode
  style?: StyleProp<ViewStyle>
  boxStyle?: StyleProp<ViewStyle>
  color: string
}) => (
  <TouchableOpacity style={[styles.checkbox, style]} onPress={onPress}>
    <View style={[styles.checkboxBox, checked && styles.checkboxChecked, boxStyle, { borderColor: color }]}>
      {checked && <Text style={[styles.checkmark, styles.checked, { color }]}>✓</Text>}
    </View>
    {typeof label === 'string' ? (
      <Text style={[styles.checkmark, checked && styles.checked, { color }]}>{label}</Text>
    ) : (
      label
    )}
  </TouchableOpacity>
)
