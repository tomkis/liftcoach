import { BodyPart, MuscleGroup } from '../muscle-group'

const priorityBodyPartToMuscleGroups: Record<
  number,
  Record<BodyPart, Array<{ muscleGroup: MuscleGroup; priority: number }>>
> = {
  0: {
    [BodyPart.Legs]: [],
    [BodyPart.Shoulders]: [],
    [BodyPart.Arms]: [],
  },
  1: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 1,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 1,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 1,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 1,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 0,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 1,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 1,
      },
    ],
  },
  2: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 1,
      },
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 2,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 2,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 0,
      },
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 2,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 2,
      },
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 2,
      },
    ],
  },
  3: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 2,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 2,
      },
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 3,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 3,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 0,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 3,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 3,
      },
    ],
  },
  4: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 4,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 3,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 3,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 4,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 0,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 4,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 4,
      },
    ],
  },
  5: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 3,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 3,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 3,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 5,
      },
    ],
  },
  6: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 4,
      },
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 6,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 4,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 3,
      },
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 6,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 6,
      },
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 6,
      },
    ],
  },
  7: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 7,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 7,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 4,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 7,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 7,
      },
    ],
  },
  8: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 8,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 6,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 6,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 8,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 4,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 8,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 8,
      },
    ],
  },
  9: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 9,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 7,
      },
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 6,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 5,
      },
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 9,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 9,
      },
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 9,
      },
    ],
  },
  10: {
    [BodyPart.Legs]: [
      {
        muscleGroup: MuscleGroup.Hamstrings,
        priority: 8,
      },
      {
        muscleGroup: MuscleGroup.Glutes,
        priority: 8,
      },
      {
        muscleGroup: MuscleGroup.Quads,
        priority: 10,
      },
    ],
    [BodyPart.Shoulders]: [
      {
        muscleGroup: MuscleGroup.SideDelts,
        priority: 10,
      },
      {
        muscleGroup: MuscleGroup.RearDelts,
        priority: 5,
      },
    ],
    [BodyPart.Arms]: [
      {
        muscleGroup: MuscleGroup.Triceps,
        priority: 10,
      },
      {
        muscleGroup: MuscleGroup.Biceps,
        priority: 10,
      },
    ],
  },
}

export const convertBodyPartToMuscleGroups = (bodyPart: BodyPart, priority: number) => {
  if (priority < 0 || priority > 10) {
    throw new Error(`Invalid priority - ${priority}`)
  }

  return priorityBodyPartToMuscleGroups[priority][bodyPart]
}
