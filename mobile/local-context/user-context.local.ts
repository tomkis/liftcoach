import { Session, UserContext } from '@/mobile/api'
import {
  AuditTrail,
  getUserCoefficient,
  MesocycleAggregateRoot,
  systemConfig,
  TrainingFrequency,
  UserVolumeCalculator,
} from '@/mobile/domain'

import * as mesocycleDao from '../db/mesocycle.dao'
import * as userDao from '../db/user.dao'

export const createLocalUserContext = (): UserContext => {
  const me: UserContext['me'] = async (session: Session) => {
    const { hasStrengthTest, isConfirmedMicrocycle } = await userDao.getUserFlags()

    let hasActiveWorkout = false
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (mesocycleId) {
      const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
      const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
      hasActiveWorkout = mesocycle.hasActiveWorkout()
    }

    return {
      userId: session.userId,
      hasStrengthTest,
      isOnboarded: isConfirmedMicrocycle,
      hasActiveWorkout,
    }
  }

  const getOnboardingInfo: UserContext['getOnboardingInfo'] = async () => {
    return await userDao.getOnboardingData()
  }

  const getDashboardData: UserContext['getDashboardData'] = async (session: Session) => {
    const onboardingData = await userDao.getOnboardingData()
    if (!onboardingData) throw new Error('No onboarding data found')

    const results = await userDao.getPastTrainingResults()
    const calendarData = results.map(
      result =>
        ({
          date: result.date,
          feeling: result.feeling,
          successRate: result.successRate,
        }) as const
    )

    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')

    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    const cycleProgress = mesocycle.getCurrentCycleIndex()
    const insights = mesocycle.getLiftCoachInsights()
    const avgVolume = mesocycle.getRollingAverageVolume()

    const calculateVolume = () => {
      if (avgVolume === null) {
        return { weeklyAvgSets: 0, expectedWeeklyVolume: 0 }
      }

      const getTrainingDays = (trainingFrequency: TrainingFrequency) => {
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
        }
      }
      const volumes = new UserVolumeCalculator(
        new AuditTrail(),
        systemConfig.microcycleGenerator,
        onboardingData
      ).getVolumePerMuscleGroup(getTrainingDays(onboardingData.trainingFrequency))
      const expectedWeeklyVolume = Object.values(volumes).reduce((acc, volume) => acc + volume, 0)
      const weeklyAvgSets = avgVolume * 7

      return { expectedWeeklyVolume, weeklyAvgSets }
    }

    return {
      ...calculateVolume(),
      unit: onboardingData.unit,
      calendarData,
      insights,
      cycleProgress,
    }
  }

  const getUserFlags: UserContext['getUserFlags'] = async () => {
    return await userDao.getUserFlags()
  }

  const storeStrengthTest: UserContext['storeStrengthTest'] = async (_session, strengthTest) => {
    await userDao.storeStrengthTest(strengthTest)
  }

  const skipStrengthTest: UserContext['skipStrengthTest'] = async () => {
    await userDao.skipStrengthTest()
  }

  return {
    me,
    getOnboardingInfo,
    getDashboardData,
    getUserFlags,
    storeStrengthTest,
    skipStrengthTest,
  }
}
