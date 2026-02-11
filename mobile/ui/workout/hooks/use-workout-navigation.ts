import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback } from 'react'

import { RootStackRoutes } from '@/mobile/ui/root/root-stack.types'

export const useResetToHomeNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackRoutes>>()

  return useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  }, [navigation])
}
