import { requireNativeModule } from 'expo'

const WatchConnectivityModule = requireNativeModule<{
  sendWorkoutStarted: () => Promise<void>
}>('WatchConnectivity')

export function sendWorkoutStarted(): Promise<void> {
  return WatchConnectivityModule.sendWorkoutStarted()
}
