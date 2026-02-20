import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MuscleGroup } from '@/mobile/domain'
import React, { useState } from 'react'
import {
  Alert,
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
import { ScreenWrapper } from '@/mobile/ui/mesocycle-planner/screens/screen-wrapper'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { theme } from '@/mobile/theme/theme'

type SplitSelectionScreenProps = {
  navigation: NativeStackNavigationProp<MesocyclePlannerStackParamList, 'SplitSelection'>
  route: RouteProp<MesocyclePlannerStackParamList, 'SplitSelection'>
}

type MuscleGroupDistribution = {
  id: string
  dayIndex: number
  muscleGroup: MuscleGroup
  sets: number
}

type AddMuscleGroupModalProps = {
  isVisible: boolean
  onClose: () => void
  onConfirm: (muscleGroup: MuscleGroup, sets: number) => void
  availableMuscleGroups: Array<{
    muscleGroup: MuscleGroup
    totalSets: number
    distributedSets: number
  }>
}

type WarningDialogProps = {
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
  remainingSets: Array<{
    muscleGroup: MuscleGroup
    remainingSets: number
  }>
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const AddMuscleGroupModal = ({ isVisible, onClose, onConfirm, availableMuscleGroups }: AddMuscleGroupModalProps) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null)
  const [selectedSets, setSelectedSets] = useState('')
  const [showSetsError, setShowSetsError] = useState(false)

  const handleSetsChange = (text: string) => {
    const num = parseInt(text) || 0
    setSelectedSets(Math.max(0, num).toString())
    setShowSetsError(false)
  }

  const handleConfirm = () => {
    const sets = parseInt(selectedSets) || 0
    if (!selectedSets.trim() || sets === 0) {
      setShowSetsError(true)
      return
    }
    if (selectedMuscleGroup) {
      onConfirm(selectedMuscleGroup, sets)
      setSelectedMuscleGroup(null)
      setSelectedSets('')
      setShowSetsError(false)
    }
  }

  const selectMuscleGroup = (muscleGroup: MuscleGroup) => {
    setSelectedMuscleGroup(muscleGroup)
    setSelectedSets('')
  }

  const selectedGroupInfo = selectedMuscleGroup
    ? availableMuscleGroups.find(g => g.muscleGroup === selectedMuscleGroup)
    : null

  const numericalSelectedSets = parseInt(selectedSets) || 0
  const remainingSets = selectedGroupInfo
    ? selectedGroupInfo.totalSets - selectedGroupInfo.distributedSets - numericalSelectedSets
    : 0

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Distribute Sets</Text>
          </View>

          <ScrollView style={styles.muscleGroupList}>
            {availableMuscleGroups.map(group => (
              <Pressable
                key={group.muscleGroup}
                style={[
                  styles.muscleGroupButton,
                  selectedMuscleGroup === group.muscleGroup && styles.selectedMuscleGroupButton,
                ]}
                onPress={() => selectMuscleGroup(group.muscleGroup)}
              >
                <Text
                  style={[
                    styles.muscleGroupButtonText,
                    selectedMuscleGroup === group.muscleGroup && styles.selectedMuscleGroupButtonText,
                  ]}
                >
                  {group.muscleGroup}
                </Text>
                <Text
                  style={[
                    styles.remainingSetsText,
                    selectedMuscleGroup === group.muscleGroup && styles.selectedMuscleGroupButtonText,
                  ]}
                >
                  {Math.max(0, group.totalSets - group.distributedSets)} sets available.
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {selectedMuscleGroup && (
            <View style={styles.bottomContainer}>
              {remainingSets < 0 ? (
                <Text style={styles.warningText}>
                  There are <Text style={{ fontFamily: theme.font.sairaBold }}>{-remainingSets}</Text> sets over the
                  original plan for the muscle group.
                </Text>
              ) : (
                showSetsError && <Text style={styles.warningText}>Please enter a number of sets greater than 0</Text>
              )}

              <View style={styles.setsInputContainer}>
                <TextInput
                  style={[styles.setsInput, showSetsError && styles.errorInput]}
                  keyboardType="numeric"
                  value={selectedSets}
                  onChangeText={handleSetsChange}
                  placeholder="Enter number of sets"
                  placeholderTextColor={theme.colors.primary.main}
                />
              </View>
            </View>
          )}

          <View style={styles.modalButtons}>
            <OutlineButton title="Cancel" onPress={onClose} style={styles.cancelButton} />
            <PrimaryButton
              title="Add"
              onPress={handleConfirm}
              style={[styles.confirmButton, !selectedSets.trim() && styles.disabledButton]}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const WarningDialog = ({ isVisible, onClose, onConfirm, remainingSets }: WarningDialogProps) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.warningDialogOverlay}>
        <View style={styles.warningDialogContent}>
          <Text style={styles.warningDialogTitle}>Undistributed Sets</Text>
          <Text style={styles.warningDialogText}>
            You have not distributed all sets for the following muscle groups:
          </Text>
          <ScrollView style={styles.warningDialogList}>
            {remainingSets.map(({ muscleGroup, remainingSets }) => (
              <Text key={muscleGroup} style={styles.warningDialogItem}>
                • {muscleGroup}: {remainingSets} sets remaining
              </Text>
            ))}
          </ScrollView>
          <View style={styles.warningDialogButtons}>
            <OutlineButton title="Adjust Split" onPress={onClose} style={styles.warningDialogButton} />
            <PrimaryButton title="Continue Anyway" onPress={onConfirm} style={styles.warningDialogButton} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const WorkoutSplitScreen = ({ navigation, route }: SplitSelectionScreenProps) => {
  const [selectedDay, setSelectedDay] = useState(1)
  const [distributions, setDistributions] = useState<MuscleGroupDistribution[]>(() => {
    // Initialize distributions from the pre-selected split
    const initialDistributions: MuscleGroupDistribution[] = []
    Object.entries(route.params.splitByDay).forEach(([dayIndex, muscleGroups]) => {
      muscleGroups.forEach(group => {
        initialDistributions.push({
          id: generateId(),
          dayIndex: parseInt(dayIndex),
          muscleGroup: group.muscleGroup,
          sets: group.sets,
        })
      })
    })
    return initialDistributions
  })
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isWarningDialogVisible, setIsWarningDialogVisible] = useState(false)
  const [remainingSets, setRemainingSets] = useState<Array<{ muscleGroup: MuscleGroup; remainingSets: number }>>([])

  const handleDayChange = (day: number) => {
    setSelectedDay(day)
    setIsAddModalVisible(false)
  }

  const handleAddMuscleGroup = (muscleGroup: MuscleGroup, sets: number) => {
    setDistributions(prev => [
      ...prev,
      {
        id: generateId(),
        dayIndex: selectedDay,
        muscleGroup,
        sets,
      },
    ])
    setIsAddModalVisible(false)
  }

  const handleRemoveMuscleGroup = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id))
  }

  const handleContinue = () => {
    // Check if all sets have been distributed
    const undistributedSets = route.params.volumePreferences
      .filter(pref => {
        const distributedSets = getDistributedSetsForMuscleGroup(pref.muscleGroup)
        return pref.sets - distributedSets > 0
      })
      .map(pref => ({
        muscleGroup: pref.muscleGroup,
        remainingSets: pref.sets - getDistributedSetsForMuscleGroup(pref.muscleGroup),
      }))

    if (undistributedSets.length > 0) {
      setRemainingSets(undistributedSets)
      setIsWarningDialogVisible(true)
      return
    }

    navigateToExerciseSelection()
  }

  const handleWarningConfirm = () => {
    setIsWarningDialogVisible(false)
    navigateToExerciseSelection()
  }

  const getDistributedSetsForMuscleGroup = (muscleGroup: MuscleGroup) => {
    return distributions.filter(d => d.muscleGroup === muscleGroup).reduce((acc, d) => acc + d.sets, 0)
  }

  const getMuscleGroupsForDay = (dayIndex: number) => {
    return distributions.filter(d => d.dayIndex === dayIndex)
  }

  const availableMuscleGroups = route.params.volumePreferences.map(pref => ({
    muscleGroup: pref.muscleGroup,
    totalSets: pref.sets,
    distributedSets: getDistributedSetsForMuscleGroup(pref.muscleGroup),
  }))

  const getSplitByDay = () => {
    return distributions.reduce(
      (acc, dist) => {
        if (!acc[dist.dayIndex]) {
          acc[dist.dayIndex] = []
        }
        acc[dist.dayIndex].push({
          muscleGroup: dist.muscleGroup,
          sets: dist.sets,
        })
        return acc
      },
      {} as { [key: number]: Array<{ muscleGroup: MuscleGroup; sets: number }> }
    )
  }

  const navigateToExerciseSelection = () => {
    const splitByDay = getSplitByDay()
    if (Object.keys(splitByDay).length === 0) {
      Alert.alert('Missing exercises', 'Each training day must have at least one exercise.')
      return
    }
    navigation.navigate('ExerciseSelection', {
      trainingDays: route.params.trainingDays,
      muscleGroupPreference: route.params.muscleGroupPreference,
      volumePreferences: route.params.volumePreferences,
      splitType: route.params.splitType,
      splitByDay,
    })
  }

  return (
    <ScreenWrapper title="Workout Split" onNext={handleContinue} includeScrollView={false}>
      <View style={styles.daySelector}>
        {Object.keys(route.params.splitByDay).map((_, index) => {
          const day = index + 1

          return (
            <Pressable
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
              onPress={() => handleDayChange(day)}
            >
              <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>Day {day}</Text>
            </Pressable>
          )
        })}
      </View>

      <ScrollView style={styles.muscleGroupsContainer}>
        <View onStartShouldSetResponder={() => true}>
          <Pressable style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Muscle Group</Text>
          </Pressable>

          {getMuscleGroupsForDay(selectedDay).map(dist => (
            <View key={dist.id} style={styles.muscleGroupCard}>
              <View style={styles.muscleGroupInfo}>
                <Text style={styles.muscleGroupName}>{dist.muscleGroup}</Text>
                <Text style={styles.setsText}>{dist.sets} sets</Text>
              </View>
              <Pressable style={styles.removeButton} onPress={() => handleRemoveMuscleGroup(dist.id)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {isAddModalVisible && (
        <AddMuscleGroupModal
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onConfirm={handleAddMuscleGroup}
          availableMuscleGroups={availableMuscleGroups}
        />
      )}

      {isWarningDialogVisible && (
        <WarningDialog
          isVisible={isWarningDialogVisible}
          onClose={() => setIsWarningDialogVisible(false)}
          onConfirm={handleWarningConfirm}
          remainingSets={remainingSets}
        />
      )}
    </ScreenWrapper>
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
  dayContent: {
    flex: 1,
  },
  muscleGroupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  muscleGroupInfo: {
    flex: 1,
  },
  muscleGroupName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 4,
  },
  setsText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    opacity: 0.7,
    fontFamily: theme.font.sairaRegular,
  },
  removeButton: {
    backgroundColor: theme.colors.primary.main,
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: theme.colors.primary.contrastText,
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
  },
  addButton: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.primary.main,
    fontSize: 16,
    fontFamily: theme.font.sairaRegular,
  },
  disabledButton: {
    opacity: 0.5,
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
  setsInfo: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 15,
  },
  muscleGroupList: {
    flex: 1,
  },
  muscleGroupButton: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  selectedMuscleGroupButton: {
    backgroundColor: theme.colors.primary.main,
  },
  muscleGroupButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 4,
  },
  selectedMuscleGroupButtonText: {
    color: theme.colors.primary.contrastText,
  },
  remainingSetsText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    opacity: 0.7,
    fontFamily: theme.font.sairaRegular,
  },
  setsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  setsLabel: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginRight: 10,
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
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  bottomContainer: {
    height: 150,
    justifyContent: 'flex-end',
  },
  warningText: {
    color: theme.colors.primary.main,
    fontSize: 14,
    fontFamily: theme.font.sairaRegular,
    marginTop: 8,
  },
  errorInput: {
    borderColor: theme.colors.primary.main,
  },
  errorText: {
    color: theme.colors.primary.main,
    fontSize: 12,
    fontFamily: theme.font.sairaRegular,
    marginTop: 4,
  },
  warningDialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningDialogContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  warningDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 10,
  },
  warningDialogText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 15,
  },
  warningDialogList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  warningDialogItem: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaRegular,
    marginBottom: 5,
  },
  warningDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  warningDialogButton: {
    flex: 1,
  },
  muscleGroupsContainer: {
    flex: 1,
  },
})
