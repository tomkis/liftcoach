import { Pressable, StyleSheet, Text, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const BORDER_RADIUS = 4

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#eee',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  leftButton: {
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
  },
  rightButton: {
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
  },
  buttonText: {
    fontFamily: theme.font.sairaBold,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})

export const SegmentedControl = <T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: [{ value: T; label: string }, { value: T; label: string }]
}) => (
  <View style={styles.container}>
    <Pressable
      onPress={() => onChange(options[0].value)}
      style={[
        styles.button,
        styles.leftButton,
        {
          backgroundColor:
            value === options[0].value ? theme.colors.primary.main : theme.colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color:
              value === options[0].value
                ? theme.colors.primary.contrastText
                : theme.colors.text.primary,
          },
        ]}
      >
        {options[0].label}
      </Text>
    </Pressable>
    <Pressable
      onPress={() => onChange(options[1].value)}
      style={[
        styles.button,
        styles.rightButton,
        {
          backgroundColor:
            value === options[1].value ? theme.colors.primary.main : theme.colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color:
              value === options[1].value
                ? theme.colors.primary.contrastText
                : theme.colors.text.primary,
          },
        ]}
      >
        {options[1].label}
      </Text>
    </Pressable>
  </View>
)
