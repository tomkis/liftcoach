import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { theme } from '@/mobile/theme/theme'

interface WrapperProps {
  title: string
  children: React.ReactNode
  includeScrollView: boolean
  onNext: () => void
  isSubmitting?: boolean
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    marginHorizontal: 40,
    marginTop: 24,
    paddingBottom: 24,
  },
  title: {
    height: 100,
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  titleText: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: 30,
  },
  muscleGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  muscleGroupHeaderText: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

export const ScreenWrapper = (props: WrapperProps) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.title}>
          <ScreenHeading style={styles.titleText}>{props.title}</ScreenHeading>
        </View>

        <View style={styles.content}>
          {props.includeScrollView ? (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View onStartShouldSetResponder={() => true}>{props.children}</View>
            </ScrollView>
          ) : (
            props.children
          )}
        </View>

        <View style={{ justifyContent: 'flex-end', paddingBottom: 40, marginHorizontal: 40 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <OutlineButton title="Back" onPress={() => navigation.goBack()} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton title="Continue" onPress={props.onNext} disabled={props.isSubmitting} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
