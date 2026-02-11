import { HardAssesmentTag } from '@/mobile/domain'
import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/onboarding/cards/ux/primary-button'
import { SecondaryButton } from '@/mobile/ui/onboarding/cards/ux/secondary-button'
import { theme } from '@/mobile/theme/theme'

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
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
    color: theme.colors.newUi.text.primary,
  },
  subtitle2: {
    color: theme.colors.newUi.gray.light,
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
  },
  optionsContainer: {
    marginVertical: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.newUi.gray.light,
  },
  selectedOption: {
    backgroundColor: theme.colors.newUi.primary.main,
    borderColor: theme.colors.newUi.primary.main,
  },
  optionText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.newUi.text.primary,
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.newUi.primary.contrastText,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.newUi.gray.light,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: theme.colors.newUi.primary.contrastText,
    backgroundColor: theme.colors.newUi.primary.contrastText,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
})

interface HardAssessmentModalProps {
  visible: boolean
  onConfirm: (assesmentTag: HardAssesmentTag) => void
  onCancel: () => void
}

const getHardAssessmentLabel = (tag: HardAssesmentTag): string => {
  switch (tag) {
    case HardAssesmentTag.TooHeavy:
      return 'Weight felt too heavy'
    case HardAssesmentTag.TooHighVolume:
      return 'There were too many sets'
    case HardAssesmentTag.BadForm:
      return 'My technique felt off'
    case HardAssesmentTag.Other:
      return 'Other'
    default:
      return tag
  }
}

export const HardAssessmentModal = ({ visible, onConfirm, onCancel }: HardAssessmentModalProps) => {
  const [selectedTag, setSelectedTag] = useState<HardAssesmentTag | null>(null)

  const handleConfirm = () => {
    if (selectedTag) {
      onConfirm(selectedTag)
    }
  }

  const handleCancel = () => {
    setSelectedTag(null)
    onCancel()
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Exercise Assessment</Text>

          <Text style={styles.subtitle}>It looks like some sets were marked as failed.</Text>
          <Text style={styles.subtitle}>Can you tell us more what happened?</Text>
          <Text style={styles.subtitle2}>Your feedback helps LiftCoach adjust your training program.</Text>

          <View style={styles.optionsContainer}>
            {Object.values(HardAssesmentTag).map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.option, selectedTag === tag && styles.selectedOption]}
                onPress={() => setSelectedTag(tag)}
              >
                <View style={[styles.radioButton, selectedTag === tag && styles.selectedRadioButton]}>
                  {selectedTag === tag && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={[styles.optionText, selectedTag === tag && styles.selectedOptionText]}>
                  {getHardAssessmentLabel(tag)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <SecondaryButton title="Cancel" onPress={handleCancel} style={{ flex: 1 }} />
            <PrimaryButton title="Confirm" onPress={handleConfirm} style={{ flex: 1 }} disabled={!selectedTag} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
