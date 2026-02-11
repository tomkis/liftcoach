import { MesoPlannerContext, Session } from '@/mobile/api'
import {
  AuditTrail,
  ExercisePicker,
  ExerciseProvider,
  MuscleGroup,
  splitSelector,
  systemConfig,
  TrainingFrequency,
  UserVolumeCalculator,
} from '@/mobile/domain'

import * as userDao from '../db/user.dao'

const convertTrainingDaysToFrequency = (days: number): TrainingFrequency => {
  switch (days) {
    case 2:
      return TrainingFrequency.TwoDays
    case 3:
      return TrainingFrequency.ThreeDays
    case 4:
      return TrainingFrequency.FourDays
    case 5:
      return TrainingFrequency.FiveDays
    case 6:
      return TrainingFrequency.SixDays
    default:
      throw new Error(`Invalid number of training days: ${days}`)
  }
}

export const createLocalMesoPlannerContext = (): MesoPlannerContext => {
  const proposeVolume: MesoPlannerContext['proposeVolume'] = async (_session, muscleGroupPreference, trainingDays) => {
    const auditTrail = new AuditTrail()
    const user = await userDao.getOnboardingData()
    if (!user) throw new Error('User not found')

    const volumeCalculator = new UserVolumeCalculator(auditTrail, systemConfig.microcycleGenerator, {
      ...user,
      muscleGroupPreference,
      trainingFrequency: convertTrainingDaysToFrequency(trainingDays),
    })

    const volumes = volumeCalculator.getVolumePerMuscleGroup(trainingDays)

    return Object.values(MuscleGroup).reduce(
      (acc, muscleGroup) => {
        acc[muscleGroup] = volumes[muscleGroup] ?? 10
        return acc
      },
      {} as Record<MuscleGroup, number>
    )
  }

  const proposeSplit: MesoPlannerContext['proposeSplit'] = async (_, volumePerMuscleGroup, trainingDays) => {
    return splitSelector(volumePerMuscleGroup, trainingDays)
  }

  const getAvailableExercises: MesoPlannerContext['getAvailableExercises'] = async () => {
    const exercises = await userDao.getAvailableExercises()
    const exerciseProvider = new ExerciseProvider(exercises)
    return exerciseProvider.getExercises()
  }

  const getExercises: MesoPlannerContext['getExercises'] = async (_session: Session, microcycleWorkoutTemplate) => {
    const user = await userDao.getOnboardingData()
    if (!user) throw new Error('User not found')
    const exercises = await userDao.getAvailableExercises()

    const exercisePicker = new ExercisePicker(new ExerciseProvider(exercises))
    return exercisePicker.pickExercises(microcycleWorkoutTemplate, user.liftingExperience)
  }

  return {
    proposeVolume,
    proposeSplit,
    getAvailableExercises,
    getExercises,
  }
}
