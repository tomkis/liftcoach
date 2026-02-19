import { MuscleGroup } from '@/mobile/domain'

export type AddExerciseModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (input: { name: string; muscleGroup: MuscleGroup }) => void
}

export const MUSCLE_GROUPS = Object.values(MuscleGroup)

export const formatLabel = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1 $2')
