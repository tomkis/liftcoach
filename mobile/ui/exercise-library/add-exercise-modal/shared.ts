import { EquipmentType, MuscleGroup } from '@/mobile/domain'

export type AddExerciseModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (input: { name: string; muscleGroup: MuscleGroup; equipmentType: EquipmentType }) => void
  lockedMuscleGroup?: MuscleGroup
}

export const MUSCLE_GROUPS = Object.values(MuscleGroup)
export const EQUIPMENT_TYPES = Object.values(EquipmentType)

export const formatLabel = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1 $2')
