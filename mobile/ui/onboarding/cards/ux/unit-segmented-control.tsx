import { Unit } from '@/mobile/domain'
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
    borderColor: theme.colors.newUi.primary.main,
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

export const UnitSegmentedControl = ({ unit, setUnit }: { unit: Unit; setUnit: (isImperial: Unit) => void }) => (
  <View style={styles.container}>
    <Pressable
      onPress={() => setUnit(Unit.Imperial)}
      style={[
        styles.button,
        styles.leftButton,
        {
          backgroundColor: unit === 'imperial' ? theme.colors.newUi.primary.main : theme.colors.newUi.background,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: unit === 'imperial' ? theme.colors.newUi.primary.contrastText : theme.colors.newUi.text.primary,
          },
        ]}
      >
        Imperial
      </Text>
    </Pressable>
    <Pressable
      onPress={() => setUnit(Unit.Metric)}
      style={[
        styles.button,
        styles.rightButton,
        {
          backgroundColor: unit === 'metric' ? theme.colors.newUi.primary.main : theme.colors.newUi.background,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: unit === 'metric' ? theme.colors.newUi.primary.contrastText : theme.colors.newUi.text.primary,
          },
        ]}
      >
        Metric
      </Text>
    </Pressable>
  </View>
)
