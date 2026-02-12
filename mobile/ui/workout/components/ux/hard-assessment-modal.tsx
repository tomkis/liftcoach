import { HardAssesmentTag } from '@/mobile/domain'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { ConfirmationModal } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: theme.font.sairaRegular,
    textAlign: 'left',
    marginBottom: 12,
    color: theme.colors.text.primary,
  },
  subtitle2: {
    color: theme.colors.gray.light,
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
    borderColor: theme.colors.gray.light,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  optionText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    flex: 1,
  },
  selectedOptionText: {
    color: theme.colors.primary.contrastText,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.gray.light,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: theme.colors.primary.contrastText,
    backgroundColor: theme.colors.primary.contrastText,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.main,
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
    <ConfirmationModal
      visible={visible}
      title="Exercise Assessment"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmDisabled={!selectedTag}
    >
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
    </ConfirmationModal>
  )
}
