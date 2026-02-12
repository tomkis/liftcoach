import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/mobile/theme/theme'
import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'

type TrainingDaysScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'TrainingDays'>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    height: 100,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  titleText: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginHorizontal: 40,
    justifyContent: 'center',
    gap: 12,
  },
  footer: {
    paddingBottom: 40,
    marginHorizontal: 40,
  },
  description: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
})

export const TrainingDaysScreen = ({ navigation }: TrainingDaysScreenProps) => {
  const insets = useSafeAreaInsets()
  const days = [2, 3, 4, 5, 6]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.title}>
          <ScreenHeading style={styles.titleText}>Training Frequency</ScreenHeading>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Let&apos;s build the plan. How many days would you like to train per week?
          </Text>
          {days.map(day => (
            <PrimaryButton
              key={day}
              title={`${day} days per week`}
              onPress={() => navigation.navigate('MusclePreferences', { trainingDays: day })}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <OutlineButton title="Back" onPress={() => navigation.goBack()} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
