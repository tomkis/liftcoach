import { Platform } from 'react-native'
import { sendWorkoutStarted } from '@/modules/watch-connectivity/src'

export const sendWorkoutStartedToWatch = () => {
  if (Platform.OS !== 'ios') return
  sendWorkoutStarted().catch((e: unknown) => {
    console.warn('[WatchBridge] sendWorkoutStarted failed:', e)
  })
}
