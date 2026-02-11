import { TrainingFrequency } from '../onboarding'

export const getTrainingFrequencyCount = (trainingFrequency: TrainingFrequency) => {
  switch (trainingFrequency) {
    case TrainingFrequency.TwoDays:
      return 2
    case TrainingFrequency.ThreeDays:
      return 3
    case TrainingFrequency.FourDays:
      return 4
    case TrainingFrequency.FiveDays:
      return 5
    case TrainingFrequency.SixDays:
      return 6
    default:
      throw new Error(`Invalid training frequency: ${trainingFrequency}`)
  }
}
