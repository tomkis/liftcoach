import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

import { type MuscleGroup } from '@/mobile/domain'
import { theme } from '@/mobile/theme/theme'

import { type AddExerciseModalProps, formatLabel, MUSCLE_GROUPS } from './shared'

const GOLD = theme.colors.primary.main

export const AddExerciseModal = ({ visible, onClose }: AddExerciseModalProps) => {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null)

  const canAdd = name.trim().length > 0 && muscleGroup !== null

  const handleClose = () => {
    setName('')
    setMuscleGroup(null)
    onClose()
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={s.overlay}>
        <Pressable style={s.overlayTap} onPress={handleClose} />
        <View style={s.sheet}>
          <View style={s.handle} />

          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Add Exercise</Text>
            <Pressable style={s.closeBtn} onPress={handleClose}>
              <Text style={s.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={s.scrollBody}>
            <View style={s.fieldLabelRow}>
              <View style={s.fieldNum}>
                <Text style={s.fieldNumText}>1</Text>
              </View>
              <Text style={s.fieldLabel}>EXERCISE NAME</Text>
            </View>
            <TextInput
              style={s.nameInput}
              placeholder="e.g. Barbell Hip Thrust"
              placeholderTextColor={theme.colors.text.faint}
              value={name}
              onChangeText={setName}
            />

            <View style={s.fieldLabelRow}>
              <View style={s.fieldNum}>
                <Text style={s.fieldNumText}>2</Text>
              </View>
              <Text style={s.fieldLabel}>DOMINANT MUSCLE GROUP</Text>
            </View>
            <View style={s.tagCloud}>
              {MUSCLE_GROUPS.map(mg => (
                <Pressable
                  key={mg}
                  style={[s.chip, mg === muscleGroup && s.chipSelected]}
                  onPress={() => setMuscleGroup(mg)}
                >
                  <Text style={[s.chipText, mg === muscleGroup && s.chipTextSelected]}>
                    {formatLabel(mg)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable
            style={[s.addBtn, !canAdd && s.addBtnDisabled]}
            onPress={canAdd ? handleClose : undefined}
            disabled={!canAdd}
          >
            <Text style={s.addBtnText}>ADD EXERCISE</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  overlayTap: {
    flex: 1,
  },
  sheet: {
    backgroundColor: theme.colors.backgroundLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.text.dim,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: theme.font.sairaBold,
    fontSize: 18,
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 22,
    color: theme.colors.text.dim,
    lineHeight: 24,
  },
  scrollBody: {
    paddingHorizontal: 20,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  fieldNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,195,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldNumText: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 10,
    color: GOLD,
  },
  fieldLabel: {
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: theme.colors.text.dim,
  },
  nameInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontFamily: theme.font.sairaRegular,
    fontSize: 15,
    color: theme.colors.text.primary,
    marginBottom: 22,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background,
  },
  chipSelected: {
    borderColor: GOLD,
    backgroundColor: 'rgba(255,195,0,0.06)',
  },
  chipText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  chipTextSelected: {
    color: GOLD,
  },
  addBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: GOLD,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnDisabled: {
    opacity: 0.35,
  },
  addBtnText: {
    fontFamily: theme.font.sairaBold,
    fontSize: 13,
    letterSpacing: 2,
    color: theme.colors.primary.contrastText,
  },
})
