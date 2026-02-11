import { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { WorkoutLifestyleFeedbackModal } from '@/mobile/ui/workout/hooks/use-workout-context'
import { theme } from '@/mobile/theme/theme'

interface LifestyleFeedback {
  dietQuality: number
  sleepQuality: number
}

interface LifestyleFeedbackModalProps {
  visible: boolean
  reason: WorkoutLifestyleFeedbackModal
  onConfirm: (feedback: LifestyleFeedback) => void
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.gray.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: theme.fontSize.small,
    textTransform: 'uppercase',
    fontFamily: theme.font.sairaRegular,
    marginBottom: 12,
    textAlign: 'center',
    color: theme.colors.newUi.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.newUi.gray.light,
    backgroundColor: theme.colors.newUi.background,
  },
  selectedRatingButton: {
    borderColor: theme.colors.newUi.primary.main,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  ratingText: {
    fontSize: theme.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
  },
  selectedRatingText: {
    color: theme.colors.newUi.primary.contrastText,
  },
  ratingLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.newUi.gray.light,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: theme.font.sairaRegular,
  },
  confirmButton: {
    backgroundColor: theme.colors.newUi.primary.main,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: theme.colors.newUi.primary.contrastText,
    fontSize: theme.fontSize.medium,
    fontWeight: '600',
    fontFamily: theme.font.sairaRegular,
    textTransform: 'uppercase',
  },
  disabledConfirmButton: {
    backgroundColor: theme.colors.newUi.gray.light,
  },
  disabledConfirmButtonText: {
    color: theme.colors.newUi.background,
  },
})

const RATING_LABELS = {
  1: 'Very Poor',
  2: 'Bad',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
} as const

export const LifestyleFeedbackModal = ({ visible, onConfirm, reason }: LifestyleFeedbackModalProps) => {
  const [dietQuality, setDietQuality] = useState<number | null>(null)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)

  const handleConfirm = () => {
    if (dietQuality !== null && sleepQuality !== null) {
      onConfirm({ dietQuality, sleepQuality })
      // Reset state after a short delay
      setTimeout(() => {
        setDietQuality(null)
        setSleepQuality(null)
      }, 1000)
    }
  }

  const isConfirmEnabled = dietQuality !== null && sleepQuality !== null

  const renderRatingButtons = (value: number | null, onSelect: (rating: number) => void, title: string) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={[styles.ratingButton, value === rating && styles.selectedRatingButton]}
            onPress={() => onSelect(rating)}
          >
            <Text style={[styles.ratingText, value === rating && styles.selectedRatingText]}>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingLabel}>
        {value ? RATING_LABELS[value as keyof typeof RATING_LABELS] : 'Select a rating'}
      </Text>
    </View>
  )

  const getModalTitle = () => {
    if (reason === WorkoutLifestyleFeedbackModal.HardSets) {
      return 'Some of your exercises seemed a bit too hard.'
    }
    if (reason === WorkoutLifestyleFeedbackModal.FailedSets) {
      return 'You seem to have failed on some of your working sets.'
    }

    return 'Can you tell us a bit more about your past few days lifestyle?'
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{getModalTitle()}</Text>
          <Text style={styles.modalTitle}>
            How would you rate your lifestyle over the past few days on a scale from 1 to 5?
          </Text>
          <Text style={styles.modalTitle}> (1 = very poor, 5 = [excellent])</Text>
          <Text style={styles.modalTitle}>LiftCoach can then analyse and adjust your training program.</Text>

          {renderRatingButtons(dietQuality, setDietQuality, 'Diet Quality')}
          {renderRatingButtons(sleepQuality, setSleepQuality, 'Sleep Quality')}

          <PrimaryButton title="Continue" onPress={handleConfirm} disabled={!isConfirmEnabled} />
        </View>
      </View>
    </Modal>
  )
}
