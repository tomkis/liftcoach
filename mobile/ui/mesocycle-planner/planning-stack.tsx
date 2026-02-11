import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { PlanningScreen } from '@/mobile/ui/mesocycle-planner/screens/planning-screen'
import { VolumePreferencesScreen } from '@/mobile/ui/mesocycle-planner/screens/volume-preferences-screen'

import { ExerciseSelectionScreen } from './screens/exercise-selection-screen'
import { MusclePreferencesScreen } from './screens/muscle-preferences-screen'
import { SplitTypeSelectionScreen } from './screens/split-type-selection-screen'
import { TrainingDaysScreen } from './screens/training-days-screen'
import { WorkoutSplitScreen } from './screens/workout-split-screen'

const Stack = createNativeStackNavigator<MesocyclePlannerStackParamList>()

export const PlanningStack = () => {
  return (
    <Stack.Navigator initialRouteName="PlanningHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PlanningHome" component={PlanningScreen} />
      <Stack.Screen name="TrainingDays" component={TrainingDaysScreen} />
      <Stack.Screen name="MusclePreferences" component={MusclePreferencesScreen} />
      <Stack.Screen name="VolumePreferences" component={VolumePreferencesScreen} />
      <Stack.Screen name="SplitTypeSelection" component={SplitTypeSelectionScreen} />
      <Stack.Screen name="SplitSelection" component={WorkoutSplitScreen} />
      <Stack.Screen name="ExerciseSelection" component={ExerciseSelectionScreen} />
    </Stack.Navigator>
  )
}
