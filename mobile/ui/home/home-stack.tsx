import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'
import { ExerciseLibraryScreen } from '@/mobile/ui/exercise-library/exercise-library-screen'
import { MicrocycleProgressView } from '@/mobile/ui/home/microcycle-progress/microcycle-progress-view'
import { PlanningStack } from '@/mobile/ui/mesocycle-planner/planning-stack'
import { WorkoutStack } from '@/mobile/ui/workout/workout-stack'

import { HomeTabBar } from './home-tab-bar'

const TabStack = createBottomTabNavigator<{
  MicrocycleProgress: undefined
  Workout: undefined
  Planning: undefined
  ExerciseLibrary: undefined
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
      <TabStack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
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
    </Stack.Navigator>
  )
}
