import { useEffect, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    flexDirection: 'column',
  },
  topContainer: {
    minHeight: 100,
    justifyContent: 'center',
    marginHorizontal: 40,
    paddingVertical: 20,
  },
  middleContainer: {},
  bottomContainer: {
    flexGrow: 1,
    minHeight: 120,
    marginHorizontal: 40,
    paddingBottom: 50,
  },
})

export const ThreeBlockScreen = (props: {
  topContent: React.ReactNode
  middleContent: React.ReactNode
  bottomContent: React.ReactNode
  middleContainerStyle?: StyleProp<ViewStyle>
  bottomContainerStyle?: StyleProp<ViewStyle>
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => {
      setIsKeyboardVisible(true)
    })
    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false)
    })
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          {isKeyboardVisible ? <></> : <View style={styles.topContainer}>{props.topContent}</View>}
          <View style={[styles.middleContainer, props.middleContainerStyle]}>{props.middleContent}</View>
          <View style={[styles.bottomContainer, props.bottomContainerStyle]}>{props.bottomContent}</View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
