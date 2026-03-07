import { LoadingType, MuscleGroup } from '@/mobile/domain'

export type AddExerciseModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (input: { name: string; muscleGroup: MuscleGroup; loadingType: LoadingType }) => void
  lockedMuscleGroup?: MuscleGroup
}

export const MUSCLE_GROUPS = Object.values(MuscleGroup)
export const LOADING_TYPES = Object.values(LoadingType)

const loadingTypeLabels: Record<string, string> = {
  double_plates: 'Barbell / Plate Machine',
  dumbbell: 'Dumbbell',
  plates: 'Bodyweight + Plates',
  stack: 'Cable / Stack Machine',
}

export const formatLabel = (value: string) =>
  loadingTypeLabels[value] ?? value.replace(/([a-z])([A-Z])/g, '$1 $2')
