import { StyleSheet, TextInput } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  input: {
    flex: 1,
    textAlign: 'left',
    fontFamily: theme.font.sairaRegular,
    lineHeight: 24,
    letterSpacing: 0.15,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
})
export const NumericalInput = (props: {
  width?: number
  value: string | undefined
  keyboardType?: 'numeric' | 'number-pad'
  onChange: (value: string) => void
  placeholder?: string
  placeholderTextColor?: string
}) => {
  return (
    <TextInput
      placeholder={props.placeholder}
      placeholderTextColor="rgba(255, 255, 255, 0.4)"
      style={styles.input}
      keyboardType={props.keyboardType ?? 'number-pad'}
      onChangeText={props.onChange}
      value={props.value ?? ''}
    />
  )
}
