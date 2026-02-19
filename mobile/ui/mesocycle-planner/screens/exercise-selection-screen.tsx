import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { assertCurated, MicrocycleWorkoutsTemplateWithExercises, MuscleGroup, ProvidedExercise } from '@/mobile/domain'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { MesocyclePlannerStackParamList } from '@/mobile/ui/mesocycle-planner/routes'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { useResetToHomeNavigation } from '@/mobile/ui/workout/hooks/use-workout-navigation'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

import { ScreenWrapper } from './screen-wrapper'

type ExerciseSelectionScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'ExerciseSelection'>
  route: RouteProp<MesocyclePlannerStackParamList, 'ExerciseSelection'>
}

type ExerciseSelectionModalProps = {
  onClose: () => void
  onConfirm: (exercise: ProvidedExercise, sets: number) => void
  exercises: ProvidedExercise[]
  selectedExercise: { name: string; sets: number; muscleGroup: MuscleGroup }
  selectedMovementPatterns: string[]
}

const ExerciseSelectionModal = ({
  onClose,
  onConfirm,
  exercises,
  selectedExercise,
  selectedMovementPatterns,
}: ExerciseSelectionModalProps) => {
  const [currentlySelectedExercise, setCurrentlySelectedExercise] = useState<{ name: string; sets: number }>(
    selectedExercise
  )

  const handleSetsChange = (text: string) => {
    const numericalSets = parseInt(text)
    if (isNaN(numericalSets) || numericalSets === 0) {
      setCurrentlySelectedExercise(e => ({ ...e, sets: 0 }))
    } else {
      setCurrentlySelectedExercise(e => ({ ...e, sets: numericalSets }))
    }
  }

  const handleConfirm = () => {
    if (currentlySelectedExercise.sets > 0) {
      const exercise = exercises.find(e => e.name === currentlySelectedExercise.name)
      if (!exercise) {
        throw new Error('Illegal State')
      }

      onConfirm(exercise, currentlySelectedExercise.sets)
    }
  }

  const assignedMovementPatterns = new Set(selectedMovementPatterns)

  const sortedExercises = [...exercises].sort((a, b) => {
    const aIsAssigned = assignedMovementPatterns.has(assertCurated(a).movementPattern)
    const bIsAssigned = assignedMovementPatterns.has(assertCurated(b).movementPattern)
    if (aIsAssigned === bIsAssigned) return 0
    return aIsAssigned ? 1 : -1
  })

  const selecteExercise = (name: string) => {
    setCurrentlySelectedExercise(e => ({ ...e, name }))
  }

  return (
    <Modal visible={true} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
          </View>

          <ScrollView style={styles.exerciseList}>
            {sortedExercises.map(exercise => {
              const isAssigned = assignedMovementPatterns.has(assertCurated(exercise).movementPattern)

              return (
                <Pressable
                  key={exercise.id}
                  style={[
                    styles.exerciseButton,
                    isAssigned && styles.assignedExerciseButton,
                    currentlySelectedExercise.name === exercise.name && styles.selectedExerciseButton,
                  ]}
                  onPress={() => selecteExercise(exercise.name)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text
                      style={[
                        styles.exerciseButtonText,
                        isAssigned && styles.assignedExerciseText,
                        currentlySelectedExercise.name === exercise.name && styles.selectedExerciseButtonText,
                      ]}
                    >
                      {exercise.name}
                    </Text>
                    <Text
                      style={[
                        styles.movementPatternText,
                        isAssigned && styles.assignedExerciseText,
                        currentlySelectedExercise.name === exercise.name && styles.selectedExerciseButtonText,
                      ]}
                    >
                      {assertCurated(exercise).movementPattern}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <View style={styles.setsInputContainer}>
              <TextInput
                style={styles.setsInput}
                keyboardType="numeric"
                placeholder="Enter number of sets"
                placeholderTextColor={theme.colors.primary.main}
                value={currentlySelectedExercise.sets.toString()}
                onChangeText={handleSetsChange}
              />
            </View>
          </View>

          <View style={styles.modalButtons}>
            <OutlineButton title="Cancel" onPress={onClose} style={styles.cancelButton} />
            <PrimaryButton title="Confirm" onPress={handleConfirm} style={styles.confirmButton} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

type ExerciseSelectionScreenContentProps = {
  exerciseDatabase: ProvidedExercise[]
  proposedExercises: MicrocycleWorkoutsTemplateWithExercises
  route: RouteProp<MesocyclePlannerStackParamList, 'ExerciseSelection'>
}

const ExerciseSelectionScreenContent = ({
  exerciseDatabase,
  proposedExercises,
}: ExerciseSelectionScreenContentProps) => {
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedExercises, setSelectedExercises] = useState<MicrocycleWorkoutsTemplateWithExercises>(proposedExercises)
  const [selectedExercise, setSelectedExercise] = useState<{
    name: string
    sets: number
    muscleGroup: MuscleGroup
    exerciseIndex: number
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resetToHome = useResetToHomeNavigation()

  const { mutateAsync: changeMicrocycle } = trpc.workout.changeMicrocycle.useMutation()

  const handleSelectExercise = (exercise: ProvidedExercise, sets: number) => {
    if (!selectedExercise) {
      throw new Error('Illegal State')
    }

    const updatedExercises = [...selectedExercises]
    const dayExercises = updatedExercises[selectedDay - 1].exercises
    const exerciseIndex = selectedExercise?.exerciseIndex

    if (exerciseIndex !== -1) {
      const updatedExercise = {
        ...dayExercises[exerciseIndex],
        exercise: exercise,
        sets,
      }
      dayExercises[exerciseIndex] = updatedExercise
      setSelectedExercises(updatedExercises)
    } else {
      throw new Error('Illegal State')
    }

    setSelectedExercise(null)
  }

  const getExercisesForMuscleGroup = (muscleGroup: MuscleGroup): ProvidedExercise[] =>
    exerciseDatabase.filter(e => e.muscleGroup === muscleGroup)

  const currentlySelectedDayExercises = selectedExercises[selectedDay - 1].exercises

  const handleNext = async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await changeMicrocycle({ template: selectedExercises })
      resetToHome()
    } catch (error) {
      console.error('Failed to change microcycle:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <ScreenWrapper title="Exercise selection" includeScrollView={false} onNext={handleNext} isSubmitting={isSubmitting}>
      <View style={styles.daySelector}>
        {selectedExercises.map((_, index) => {
          const day = index + 1

          return (
            <Pressable
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>Day {day}</Text>
            </Pressable>
          )
        })}
      </View>

      <ScrollView style={styles.muscleGroupsList}>
        <View onStartShouldSetResponder={() => true}>
          {selectedExercises[selectedDay - 1].exercises.map((selectedExercise, exerciseIndex) => {
            const movementPattern = assertCurated(selectedExercise.exercise).movementPattern

            return (
              <View key={selectedExercise.exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{selectedExercise.exercise.name}</Text>
                  <Pressable
                    onPress={() => {
                      setSelectedExercise({
                        name: selectedExercise.exercise.name,
                        sets: selectedExercise.sets,
                        muscleGroup: selectedExercise.muscleGroup,
                        exerciseIndex,
                      })
                    }}
                    style={styles.editButton}
                  >
                    <Text style={styles.editIcon}>✎</Text>
                  </Pressable>
                </View>
                <Text style={styles.muscleGroupInfo}>
                  {selectedExercise.muscleGroup} • {movementPattern}
                </Text>
                <Text style={styles.setsText}>{selectedExercise.sets} sets</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {selectedExercise && (
        <ExerciseSelectionModal
          key={selectedExercise.exerciseIndex}
          selectedMovementPatterns={currentlySelectedDayExercises
            .filter(e => e.muscleGroup === selectedExercise.muscleGroup)
            .map(e => assertCurated(e.exercise).movementPattern)}
          onClose={() => {
            setSelectedExercise(null)
          }}
          onConfirm={handleSelectExercise}
          exercises={getExercisesForMuscleGroup(selectedExercise.muscleGroup)}
          selectedExercise={selectedExercise}
        />
      )}
    </ScreenWrapper>
  )
}

export const ExerciseSelectionScreen = ({ route }: ExerciseSelectionScreenProps) => {
  const { data: exercises } = trpc.mesoPlanner.getAvailableExercises.useQuery()
  const { data: proposedExercises } = trpc.mesoPlanner.getExercises.useQuery({
    template: Object.entries(route.params.splitByDay).map(([, exercises]) => ({
      exercises: exercises.map(exercise => ({
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
      })),
    })),
  })

  if (!proposedExercises || !exercises) {
    return <Text>Loading...</Text>
  }

  return (
    <ExerciseSelectionScreenContent exerciseDatabase={exercises} proposedExercises={proposedExercises} route={route} />
  )
}

const styles = StyleSheet.create({
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  dayButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    alignItems: 'center',
    flex: 0,
    minWidth: 70,
    maxWidth: 90,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary.main,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
  },
  selectedDayText: {
    color: theme.colors.primary.contrastText,
  },
  muscleGroupsList: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: theme.colors.background,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.main,
    paddingVertical: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    flex: 1,
    marginRight: 16,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 16,
    color: theme.colors.primary.main,
  },
  muscleGroupInfo: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    opacity: 0.8,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  setsText: {
    fontSize: 16,
    color: theme.colors.primary.main,
    fontFamily: theme.font.sairaRegular,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(88, 88, 88, 0.7)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: '10%',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 10,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseButton: {
    backgroundColor: theme.colors.background,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.main,
  },
  assignedExerciseButton: {
    backgroundColor: theme.colors.background,
    opacity: 0.7,
  },
  selectedExerciseButton: {
    backgroundColor: theme.colors.primary.main,
    opacity: 1,
  },
  exerciseButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
  },
  assignedExerciseText: {
    color: theme.colors.text.primary,
    opacity: 0.7,
  },
  selectedExerciseButtonText: {
    color: theme.colors.primary.contrastText,
    opacity: 1,
  },
  exerciseInfo: {
    flex: 1,
  },
  movementPatternText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    opacity: 0.8,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  bottomContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  setsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  muscleGroupTitle: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    textTransform: 'capitalize',
    marginTop: 4,
  },
})
