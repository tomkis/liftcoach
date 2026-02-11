import { AppConfiguration } from './index'

export const systemConfig: AppConfiguration = {
  microcycleGenerator: {
    userLiftingExperience: {
      calculatedExperienceTrustFactor: 0.7,
    },
    volumeConfig: {
      minSetsPerMicrocycle: 50,
      maxSetsPerMicrocycle: 80,
      maxSetsPerWorkout: 25,
    },
  },
  apiVersion: '3.0.0',
}
