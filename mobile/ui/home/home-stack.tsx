import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeTestingStack } from '@/mobile/ui/home-testing/home-testing-stack'
import { MicrocycleProgressView } from '@/mobile/ui/home/microcycle-progress/microcycle-progress-view'
import { PlanningStack } from '@/mobile/ui/mesocycle-planner/planning-stack'
import { WorkoutStack } from '@/mobile/ui/workout/workout-stack'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'

import { HomeTabBar } from './home-tab-bar'

const TabStack = createBottomTabNavigator<{
  MicrocycleProgress: undefined
  Workout: undefined
  Planning: undefined
}>()

const Stack = createNativeStackNavigator<{
  TabNavigator: undefined
  ExtraOnboarding: undefined
  HomeTesting: undefined
}>()

const TabNavigator = () => {
  const user = trpc.user.me.useQuery(undefined, { retry: false })
  if (!user.data) {
    return <EmptyWrapper />
  }

  return (
    <TabStack.Navigator
      initialRouteName={user.data.hasActiveWorkout ? 'Workout' : 'MicrocycleProgress'}
      screenOptions={{ headerShown: false }}
      tabBar={props => <HomeTabBar {...props} />}
    >
      <TabStack.Screen name="MicrocycleProgress" component={MicrocycleProgressView} />
      <TabStack.Screen name="Workout" component={WorkoutStack} />
      <TabStack.Screen name="Planning" component={PlanningStack} />
    </TabStack.Navigator>
  )
}

export const HomeStack = () => {
  const user = trpc.user.me.useQuery(undefined, { retry: false })

  if (!user.data) {
    return <EmptyWrapper />
  }

  return (
    <Stack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="HomeTesting" component={HomeTestingStack} />
    </Stack.Navigator>
  )
}
