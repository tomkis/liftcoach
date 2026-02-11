import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.newUi.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
  },
  text: {
    color: theme.colors.newUi.primary.main,
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 26,
    letterSpacing: 1.4,
    fontFamily: theme.font.sairaSemiBold,
  },
})

export const SecondaryButton = ({
  title,
  onPress,
  style,
}: {
  title: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}) => {
  return (
    <View style={[style]}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container]}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
