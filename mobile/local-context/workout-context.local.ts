import { v4 } from 'uuid'

import { Session, WorkoutContext } from '@/mobile/api'
import {
  AuditTrail,
  getBalancedMuscleGroupPreferenceFemale,
  getBalancedMuscleGroupPreferenceMale,
  getUserCoefficient,
  MesocycleAggregateRoot,
  MicrocycleGenerator,
  systemConfig,
  toDateTime,
} from '@/mobile/domain'

import * as mesocycleDao from '../db/mesocycle.dao'
import * as userDao from '../db/user.dao'

export const createLocalWorkoutContext = (): WorkoutContext => {
  const startWorkout: WorkoutContext['startWorkout'] = async (session: Session) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.startWorkout()
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const getWorkoutStats: WorkoutContext['getWorkoutStats'] = async (session: Session) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))

    const getExerciseIdsInNextWorkout = () => {
      const nextActiveWorkout = mesocycle.getNextActiveWorkout()
      if (!nextActiveWorkout) return []
      return nextActiveWorkout.exercises.map(exercise => exercise.exercise.id)
    }

    const allRecentlyFinishedExercises = await mesocycleDao.getAllRecentlyTestedExercises(getExerciseIdsInNextWorkout())
    return mesocycle.getWorkoutStats(allRecentlyFinishedExercises)
  }

  const getActivePlanSummary: WorkoutContext['getActivePlanSummary'] = async (session: Session) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) return null
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    return mesocycle.getActivePlanSummary()
  }

  const getWorkout: WorkoutContext['getWorkout'] = async (session: Session) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))

    if (mesocycle.hasActiveWorkout()) {
      return mesocycle.getActiveWorkout()
    }
    return null
  }

  const generateMicrocycle: WorkoutContext['generateMicrocycle'] = async (session, onboardedUser) => {
    await userDao.storeOnboardingData(onboardedUser)
    const availableExercises = await userDao.getAvailableExercises()

    const microcycleGenerator = new MicrocycleGenerator(
      onboardedUser,
      systemConfig.microcycleGenerator,
      new AuditTrail()
    )

    const existingMesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (existingMesocycleId) throw new Error('Microcycle already exists')

    const newMesocycleId = v4()
    const finishedExercises = await mesocycleDao.getAllRecentlyFinishedExercises(90)
    const microcycle = await microcycleGenerator.generateMicrocycle(
      newMesocycleId,
      finishedExercises,
      availableExercises,
      getUserCoefficient(session)
    )

    const mesocycle = new MesocycleAggregateRoot(
      {
        id: newMesocycleId,
        createdAt: toDateTime(new Date()),
        finishedAt: undefined,
        isConfirmed: false,
        microcycles: [],
      },
      getUserCoefficient(session)
    )

    mesocycle.initializeMesocycle(microcycle, mesocycle.isConfirmed())
    await mesocycleDao.updateMesocycle(mesocycle.events)

    return microcycle
  }

  const finishWorkout: WorkoutContext['finishWorkout'] = async (session, workoutId, lifestyleFeedback) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)

    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.finishWorkout(workoutId, lifestyleFeedback)

    const microcycleFinished = mesocycle.isActiveMicrocycleFinished()
    if (microcycleFinished) {
      const mesocycleFinished = mesocycle.isMesocycleFinished()

      if (mesocycleFinished) {
        const lastTestingResults = await userDao.getLastTestingWeights(
          mesocycleDto.microcycles.flatMap(microcycle =>
            microcycle.workouts.flatMap(workout => workout.exercises.map(e => e.exercise))
          )
        )

        const newMicrocycle = mesocycle.finishMesocycle(lastTestingResults)
        await mesocycleDao.updateMesocycle(mesocycle.events)

        const newMesocycle = new MesocycleAggregateRoot(
          {
            id: newMicrocycle.mesocycleId,
            createdAt: toDateTime(new Date()),
            finishedAt: undefined,
            isConfirmed: true,
            microcycles: [],
          },
          getUserCoefficient(session)
        )

        newMesocycle.initializeMesocycle(newMicrocycle, newMesocycle.isConfirmed())
        await mesocycleDao.updateMesocycle(mesocycle.events)
        await mesocycleDao.updateMesocycle(newMesocycle.events)

        return newMesocycle.getActiveMicrocycle()
      } else {
        mesocycle.extendMicrocycle()
      }
    }

    await mesocycleDao.updateMesocycle(mesocycle.events)
    return mesocycle.getActiveMicrocycle()
  }

  const getCurrentMicrocycle: WorkoutContext['getCurrentMicrocycle'] = async session => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    return mesocycle.getActiveMicrocycle()
  }

  const proposeExerciseReplacement: WorkoutContext['proposeExerciseReplacement'] = async (
    session,
    workoutExerciseId
  ) => {
    const availableExercises = await userDao.getAvailableExercises()
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))

    const proposedExercises = mesocycle.proposeExerciseReplacement(workoutExerciseId, availableExercises)
    const allExercises = await userDao.getAvailableExercises()

    return proposedExercises.map(proposedExercise => {
      const exercise = allExercises.find(e => e.name === proposedExercise.name)
      if (!exercise) throw new Error(`Exercise ${proposedExercise.name} not found in seed data`)
      return {
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
      }
    })
  }

  const replaceExercise: WorkoutContext['replaceExercise'] = async (
    session,
    workoutExerciseId,
    replacementExerciseId,
    workoutId
  ) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const replacingExercise = await userDao.getExerciseWithHistory(replacementExerciseId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    const workingExercise = mesocycle.replaceExercise(workoutExerciseId, replacingExercise, workoutId)
    await mesocycleDao.updateMesocycle(mesocycle.events)
    return workingExercise
  }

  const exerciseSetStateChanged: WorkoutContext['exerciseSetStateChanged'] = async (
    session,
    workoutId,
    workoutExerciseId,
    setId,
    state
  ) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.setStateHasChanged(workoutExerciseId, setId, state)
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const exerciseChangeWeight: WorkoutContext['exerciseChangeWeight'] = async (
    session,
    workoutId,
    workoutExerciseId,
    weight
  ) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)

    const allExercises = mesocycleDto.microcycles.flatMap(m => m.workouts.flatMap(w => w.exercises))
    const workoutExercise = allExercises.find(e => e.id === workoutExerciseId)
    if (!workoutExercise) throw new Error('Workout Exercise not found')

    const exercise = await userDao.getExerciseWithHistory(workoutExercise.exercise.id)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.exerciseWeightChanged(workoutExerciseId, weight, exercise.historicalResult)
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const exerciseFinished: WorkoutContext['exerciseFinished'] = async (
    session,
    workoutId,
    workingExerciseId,
    exerciseAssesment
  ) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.finishExercise(workingExerciseId, exerciseAssesment)
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const exerciseLoaded: WorkoutContext['exerciseLoaded'] = async (
    session,
    workoutId,
    workoutExerciseId,
    loadingSet,
    reachedFailure
  ) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.exerciseLoaded(workoutExerciseId, loadingSet, reachedFailure)
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const exerciseTested: WorkoutContext['exerciseTested'] = async (
    session,
    workoutId,
    workoutExerciseId,
    loadingSet
  ) => {
    const mesocycleId = await mesocycleDao.getMesocycleIdByWorkoutId(workoutId)
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.exerciseTested(workoutExerciseId, loadingSet)
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  const changeMicrocycle: WorkoutContext['changeMicrocycle'] = async (session, template) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')

    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const onboardedUser = await userDao.getOnboardingData()
    if (!onboardedUser) throw new Error('User not found')

    const microcycleGenerator = new MicrocycleGenerator(
      onboardedUser,
      systemConfig.microcycleGenerator,
      new AuditTrail()
    )

    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.terminateMesocycle()
    await mesocycleDao.updateMesocycle(mesocycle.events)

    const newMesocycleId = v4()
    const microcycleId = v4()
    const finishedExercises = await mesocycleDao.getAllRecentlyFinishedExercises(90)

    const newMicrocycle = await microcycleGenerator.createMicrocycle(
      newMesocycleId,
      microcycleId,
      template,
      finishedExercises,
      getUserCoefficient(session)
    )

    const newMesocycle = new MesocycleAggregateRoot(
      {
        id: newMesocycleId,
        createdAt: toDateTime(new Date()),
        finishedAt: undefined,
        microcycles: [],
        isConfirmed: true,
      },
      getUserCoefficient(session)
    )

    newMesocycle.initializeMesocycle(newMicrocycle, newMesocycle.isConfirmed())
    await mesocycleDao.updateMesocycle(newMesocycle.events)

    return newMicrocycle
  }

  const getCycleProgress: WorkoutContext['getCycleProgress'] = async (session, exerciseId) => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    return await mesocycle.getCycleProgressForExercise(exerciseId)
  }

  const getBalancedMuscleGroupPreference: WorkoutContext['getBalancedMuscleGroupPreference'] = async () => {
    const onboardedUser = await userDao.getOnboardingData()
    if (!onboardedUser) throw new Error('User not found')

    if (onboardedUser.gender === 'male') {
      return getBalancedMuscleGroupPreferenceMale()
    } else {
      return getBalancedMuscleGroupPreferenceFemale()
    }
  }

  const confirmMesocycle: WorkoutContext['confirmMesocycle'] = async session => {
    const mesocycleId = await mesocycleDao.getCurrentMesocycleId()
    if (!mesocycleId) throw new Error('No active mesocycle')
    const mesocycleDto = await mesocycleDao.getMesocycleById(mesocycleId)
    const mesocycle = new MesocycleAggregateRoot(mesocycleDto, getUserCoefficient(session))
    mesocycle.confirmMesocycle()
    await mesocycleDao.updateMesocycle(mesocycle.events)
  }

  return {
    startWorkout,
    getWorkout,
    generateMicrocycle,
    getBalancedMuscleGroupPreference,
    finishWorkout,
    getCurrentMicrocycle,
    getActivePlanSummary,
    proposeExerciseReplacement,
    replaceExercise,
    exerciseSetStateChanged,
    exerciseChangeWeight,
    exerciseFinished,
    exerciseLoaded,
    exerciseTested,
    changeMicrocycle,
    getCycleProgress,
    getWorkoutStats,
    confirmMesocycle,
  }
}
