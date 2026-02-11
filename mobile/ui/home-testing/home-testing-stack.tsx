import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { TestingResults } from '@/mobile/ui/home-testing/types'
import { HomeTestingResults } from '@/mobile/ui/home-testing/views/home-testing-results'
import { IntroView } from '@/mobile/ui/home-testing/views/intro-view'
import { TestStrengthSwiper } from '@/mobile/ui/home-testing/views/test-strength-swiper'

export type HomeTestingStackParamList = {
  Intro: undefined
  TestStrength: undefined
  Results: TestingResults
}

const Stack = createNativeStackNavigator<HomeTestingStackParamList>()

export const HomeTestingStack = () => {
  return (
    <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={IntroView} />
      <Stack.Screen name="TestStrength" component={TestStrengthSwiper} />
      <Stack.Screen name="Results" component={HomeTestingResults} />
    </Stack.Navigator>
  )
}
