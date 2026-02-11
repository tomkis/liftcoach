import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { OnboardingStackParamList } from '../cards/types'

export const useOnboardingNavigation = () => useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>()
