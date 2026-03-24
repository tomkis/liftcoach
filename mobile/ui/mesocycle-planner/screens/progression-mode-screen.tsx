import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ProgressionMode } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'
import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { OutlineButton } from '@/mobile/ui/ds/buttons'

type ProgressionModeScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'ProgressionModeSelection'>
}

export const ProgressionModeScreen = ({ navigation }: ProgressionModeScreenProps) => {
  const insets = useSafeAreaInsets()

  const onSelect = (mode: ProgressionMode) => {
    navigation.navigate('TrainingDays', { progressionMode: mode })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.title}>
          <ScreenHeading style={styles.titleText}>Progression Mode</ScreenHeading>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Choose how your training weights and reps are managed throughout the program.
          </Text>

          <TouchableOpacity activeOpacity={0.85} onPress={() => onSelect(ProgressionMode.LiftCoach)}>
            <View style={styles.card}>
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>LIFTCOACH PROGRESSION</Text>
              <Text style={styles.cardDescription}>
                The app determines your working weights through a calibration week, then applies progressive overload automatically.
              </Text>
              <View style={styles.cardTag}>
                <Text style={styles.cardTagText}>RECOMMENDED FOR BEGINNERS</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} onPress={() => onSelect(ProgressionMode.Custom)}>
            <View style={styles.card}>
              <View style={[styles.cardAccent, styles.cardAccentCustom]} />
              <Text style={styles.cardTitle}>CUSTOM PROGRESSION</Text>
              <Text style={styles.cardDescription}>
                No calibration week. You enter your own weights and reps each session. Full control over your programming.
              </Text>
              <View style={styles.cardTag}>
                <Text style={styles.cardTagText}>FOR EXPERIENCED LIFTERS</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <OutlineButton title="Back" onPress={() => navigation.goBack()} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
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
    marginHorizontal: 20,
    gap: 16,
  },
  description: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.primary.main,
  },
  cardAccentCustom: {
    backgroundColor: theme.colors.text.dim,
  },
  cardTitle: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    color: theme.colors.text.primary,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 13,
    color: theme.colors.text.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: theme.colors.surface.muted,
  },
  cardTagText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 9,
    color: theme.colors.text.muted,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 40,
    marginHorizontal: 40,
  },
})
