import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

export const ScreenBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
