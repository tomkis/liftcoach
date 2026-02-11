import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { HomeTestingStackParamList } from '@/mobile/ui/home-testing/home-testing-stack'

export const useHomeTestingNavigation = () => useNavigation<NativeStackNavigationProp<HomeTestingStackParamList>>()
