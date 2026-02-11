import { MuscleGroup } from '@/mobile/domain'

const arms = [MuscleGroup.Biceps, MuscleGroup.Triceps]
const shoulders = [MuscleGroup.RearDelts, MuscleGroup.SideDelts]
const chest = [MuscleGroup.Chest]
const back = [MuscleGroup.Back]
const legs = [MuscleGroup.Glutes, MuscleGroup.Hamstrings, MuscleGroup.Quads]
const abs = [MuscleGroup.Abs]

const lowerBodyMuscleGroups = [MuscleGroup.Glutes, MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Abs]
const upperBodyMuscleGroups = [
  MuscleGroup.Chest,
  MuscleGroup.Back,
  MuscleGroup.RearDelts,
  MuscleGroup.SideDelts,
  MuscleGroup.Biceps,
  MuscleGroup.Triceps,
  MuscleGroup.Abs,
]

const getMuscleGroupToParts = (muscleGroups: MuscleGroup[]) => {
  return muscleGroups.reduce((acc: string[], group) => {
    if (arms.includes(group)) {
      acc.push('Arms')
    } else if (shoulders.includes(group)) {
      acc.push('Shoulders')
    } else if (chest.includes(group)) {
      acc.push('Chest')
    } else if (back.includes(group)) {
      acc.push('Back')
    } else if (legs.includes(group)) {
      acc.push('Legs')
    } else if (abs.includes(group)) {
      acc.push('Abs')
    }

    return acc
  }, [])
}

export const getTrainingTitle = ({ exercises }: { exercises: Array<{ exercise: { muscleGroup: MuscleGroup } }> }) => {
  const muscleGroups = exercises.map(exercise => exercise.exercise.muscleGroup)
  const uniqueMuscleGroups = [...new Set(muscleGroups)]
  const uniqueMuscleParts = [...new Set(getMuscleGroupToParts(uniqueMuscleGroups))]

  if (uniqueMuscleParts.length === 1) {
    return `${uniqueMuscleParts[0]}`
  } else if (uniqueMuscleParts.length <= 4) {
    const rest = uniqueMuscleParts.slice(0, -1)
    const last = uniqueMuscleParts[uniqueMuscleParts.length - 1]

    return `${rest.join(', ')} and ${last}`
  }

  if (uniqueMuscleGroups.every(group => lowerBodyMuscleGroups.includes(group))) {
    return 'Lower Body'
  } else if (uniqueMuscleGroups.every(group => upperBodyMuscleGroups.includes(group))) {
    return 'Upper Body'
  } else if (uniqueMuscleGroups.length <= 4) {
    return `${uniqueMuscleGroups.join(', ')}`
  } else {
    return 'Full Body'
  }
}
