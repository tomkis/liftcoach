import { LiftingExperience, MuscleGroup, MuscleGroupPriorities, VolumePerMuscleGroup } from '../../index'

import { AuditTrail } from '../../audit-trail'

export interface MicrocycleVolumeConfig {
  minSetsPerMicrocycle: number
  maxSetsPerMicrocycle: number
  maxSetsPerWorkout: number
}

class MuscleGroupPrioritiesCalculated {
  public readonly type = 'MuscleGroupPrioritiesCalculated'
  constructor(
    public readonly userProvidedPriorities: MuscleGroupPriorities,
    public readonly muscleGroupPriorities: MuscleGroupPriorities
  ) {}
}

const volumeTable: Record<LiftingExperience, Record<number, number>> = {
  none: {
    1: 3,
    2: 3,
    3: 3,
    4: 4,
    5: 5,
    6: 5,
    7: 6,
    8: 6,
    9: 8,
    10: 12,
  },
  beginner: {
    1: 3,
    2: 3,
    3: 3,
    4: 4,
    5: 5,
    6: 5,
    7: 8,
    8: 8,
    9: 10,
    10: 14,
  },
  intermediate: {
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 10,
    6: 11,
    7: 12,
    8: 13,
    9: 14,
    10: 15,
  },
  advanced: {
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 10,
    6: 12,
    7: 14,
    8: 16,
    9: 18,
    10: 20,
  },
  expert: {
    1: 5,
    2: 7,
    3: 7,
    4: 9,
    5: 12,
    6: 14,
    7: 16,
    8: 18,
    9: 20,
    10: 22,
  },
}
export class MicrocycleVolumeCalculator {
  constructor(
    private readonly config: MicrocycleVolumeConfig,
    private readonly trail: AuditTrail
  ) {}

  calculateVolumePerMuscleGroup(
    liftingExperience: LiftingExperience,
    muscleGroupPriorities: MuscleGroupPriorities,
    daysOfTraining: number
  ) {
    const prioritizedMuscleGroups = muscleGroupPriorities
      .filter(({ priority }) => priority > 0)
      .map(muscleGroupPriority => {
        return {
          ...muscleGroupPriority,
          priority: muscleGroupPriority.priority * 1,
        }
      })

    this.trail.dispatch(new MuscleGroupPrioritiesCalculated(muscleGroupPriorities, prioritizedMuscleGroups))

    const volumes = prioritizedMuscleGroups.reduce((acc, group) => {
      const sets = Math.floor(volumeTable[liftingExperience][group.priority])

      if (!sets) {
        throw new Error(`No sets found for priority ${group.priority}`)
      }

      acc[group.muscleGroup] = sets
      return acc
    }, {} as VolumePerMuscleGroup)

    const getTotalVolume = (volumes: VolumePerMuscleGroup) => {
      return Object.values(volumes).reduce((acc, sets) => acc + sets, 0)
    }

    if (getTotalVolume(volumes) < this.config.minSetsPerMicrocycle) {
      console.debug('Volume too low, increasing...')

      const coefficient = this.config.minSetsPerMicrocycle / getTotalVolume(volumes)

      Object.entries(volumes).forEach(([muscleGroup, sets]) => {
        volumes[muscleGroup as MuscleGroup] = Math.floor(sets * coefficient)
      })
    }

    if (getTotalVolume(volumes) > this.config.maxSetsPerMicrocycle) {
      console.debug('Volume too high, reducing...', getTotalVolume(volumes))

      const coefficient = this.config.maxSetsPerMicrocycle / getTotalVolume(volumes)

      Object.entries(volumes).forEach(([muscleGroup, sets]) => {
        volumes[muscleGroup as MuscleGroup] = Math.floor(sets * coefficient)
      })
    }

    const dailyPotentialVolume = getTotalVolume(volumes) / daysOfTraining

    if (dailyPotentialVolume > this.config.maxSetsPerWorkout) {
      console.debug('Daily potential volume too high, reducing...')
      const coefficient = this.config.maxSetsPerWorkout / dailyPotentialVolume

      Object.entries(volumes).forEach(([muscleGroup, sets]) => {
        volumes[muscleGroup as MuscleGroup] = Math.round(sets * coefficient)
      })
    }

    return volumes
  }
}
