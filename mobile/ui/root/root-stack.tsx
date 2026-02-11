import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeStack } from '@/mobile/ui/home/home-stack'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'

import { OnboardingStack } from '../onboarding/onboarding-stack'

const Stack = createNativeStackNavigator()

const RootStackWithAuth = () => {
  const isOnboardedQuery = trpc.user.getOnboardingInfo.useQuery()
  if (isOnboardedQuery.isLoading) {
    return <EmptyWrapper />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  )
}

export const RootStack = () => {
  const user = trpc.user.me.useQuery(undefined, { retry: false })

  if (user.isLoading) {
    return <EmptyWrapper />
  }

  if (!user.data?.isOnboarded) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      </Stack.Navigator>
    )
  }

  return <RootStackWithAuth />
}
