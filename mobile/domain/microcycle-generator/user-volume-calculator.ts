import { AuditTrail } from '../audit-trail'
import { BodyPart, MuscleGroup } from '../muscle-group'
import { OnboardedUser } from '../onboarding'
import { convertBodyPartToMuscleGroups } from '../user/convert-body-to-muscle-groups'
import {
  getBalancedMuscleGroupPreferenceFemale,
  getBalancedMuscleGroupPreferenceMale,
} from '../user/get-muscle-group-preference'
import { MicrocycleVolumeCalculator, MicrocycleVolumeConfig } from './volume/microcycle-volume-calculator'

export class UserVolumeCalculator {
  private readonly microcycleVolumeCalculator: MicrocycleVolumeCalculator

  constructor(
    private readonly auditTrail: AuditTrail,
    private readonly config: {
      volumeConfig: MicrocycleVolumeConfig
    },
    private readonly onboardedUser: OnboardedUser
  ) {
    this.microcycleVolumeCalculator = new MicrocycleVolumeCalculator(this.config.volumeConfig, this.auditTrail)
  }

  public getMuscleGroupPriorities() {
    const muscleGroupPriorities = Object.entries(
      this.onboardedUser.muscleGroupPreference ??
        (this.onboardedUser.gender === 'male'
          ? getBalancedMuscleGroupPreferenceMale()
          : getBalancedMuscleGroupPreferenceFemale())
    ).reduce<Array<{ muscleGroup: MuscleGroup; priority: number }>>((acc, [muscleGroup, priority]) => {
      if (priority === undefined) {
        throw new Error(`Undefined priority for muscle group "${muscleGroup}"`)
      }
      switch (muscleGroup) {
        case 'chest':
          return acc.concat([{ muscleGroup: MuscleGroup.Chest, priority }])
        case 'back':
          return acc.concat([{ muscleGroup: MuscleGroup.Back, priority }])
        case 'shoulders':
          return acc.concat(convertBodyPartToMuscleGroups(BodyPart.Shoulders, priority))
        case 'arms':
          return acc.concat(convertBodyPartToMuscleGroups(BodyPart.Arms, priority))
        case 'legs':
          return acc.concat(convertBodyPartToMuscleGroups(BodyPart.Legs, priority))
        case 'abs':
          return acc.concat([{ muscleGroup: MuscleGroup.Abs, priority }])
        case 'glutes':
          return acc.concat([{ muscleGroup: MuscleGroup.Glutes, priority }])
        case 'hamstrings':
          return acc.concat([{ muscleGroup: MuscleGroup.Hamstrings, priority }])
        case 'quads':
          return acc.concat([{ muscleGroup: MuscleGroup.Quads, priority }])
        case 'biceps':
          return acc.concat([{ muscleGroup: MuscleGroup.Biceps, priority }])
        case 'triceps':
          return acc.concat([{ muscleGroup: MuscleGroup.Triceps, priority }])
        case 'sideDelts':
          return acc.concat([{ muscleGroup: MuscleGroup.SideDelts, priority }])
        case 'rearDelts':
          return acc.concat([{ muscleGroup: MuscleGroup.RearDelts, priority }])
        default:
          throw new Error(`Illegal State - ${muscleGroup}`)
      }
    }, [])

    return muscleGroupPriorities
  }

  getVolumePerMuscleGroup = (trainingDays: number) => {
    const muscleGroupPriorities = this.getMuscleGroupPriorities()
    const volumes = this.microcycleVolumeCalculator.calculateVolumePerMuscleGroup(
      this.onboardedUser.liftingExperience,
      muscleGroupPriorities,
      trainingDays
    )

    return volumes
  }
}
