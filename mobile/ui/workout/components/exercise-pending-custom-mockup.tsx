import React, { useRef, useState } from 'react'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/mobile/theme/theme'
import { PaginationDots } from '@/mobile/ui/components/pagination-dots'
import CogwheelFilled from '@/mobile/ui/icons/cogwheel-filled'

type SetState = 'pending' | 'done' | 'failed'

type SetRow = {
  id: string
  weight: string
  reps: string
  state: SetState
}

type Scenario = 'week1-empty' | 'week2-prefilled'

type MockExercise = {
  id: string
  name: string
  muscle: string
  setCount: number
  prefilled: { weight: string; reps: string } | null
}

const MOCK_EXERCISES: MockExercise[] = [
  { id: 'bench', name: 'Bench Press', muscle: 'Chest · Triceps', setCount: 4, prefilled: null },
  { id: 'row', name: 'Barbell Row', muscle: 'Back · Biceps', setCount: 3, prefilled: { weight: '70', reps: '10' } },
  { id: 'squat', name: 'Back Squat', muscle: 'Legs · Glutes', setCount: 4, prefilled: null },
]

const buildInitialSets = (count: number, prefilled: { weight: string; reps: string } | null): SetRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    weight: prefilled?.weight ?? '',
    reps: prefilled?.reps ?? '',
    state: 'pending' as const,
  }))

type SetCardStatus = 'locked' | 'active' | 'done' | 'failed'

const SetRowItem = ({
  index,
  set,
  status,
  unitLabel,
  onWeightChange,
  onRepsChange,
  onToggleConfirm,
  onToggleFailed,
}: {
  index: number
  set: SetRow
  status: SetCardStatus
  unitLabel: string
  onWeightChange: (value: string) => void
  onRepsChange: (value: string) => void
  onToggleConfirm: () => void
  onToggleFailed: () => void
}) => {
  const isLocked = status === 'locked'
  const isDone = status === 'done'
  const isFailed = status === 'failed'

  const accentColor = isFailed
    ? theme.colors.primary.negative
    : isDone
      ? theme.colors.primary.main
      : 'transparent'

  const numberColor = isFailed
    ? theme.colors.primary.negative
    : isDone
      ? theme.colors.primary.main
      : theme.colors.text.muted

  const canConfirm = !isLocked && set.weight.trim() !== '' && set.reps.trim() !== ''

  return (
    <View
      style={[
        rowStyles.row,
        isDone && rowStyles.rowDone,
        isFailed && rowStyles.rowFailed,
        isLocked && rowStyles.rowLocked,
      ]}
    >
      <View style={[rowStyles.accentBar, { backgroundColor: accentColor }]} />

      <View style={rowStyles.numberTile}>
        <Text style={[rowStyles.numberText, { color: numberColor }]}>{index + 1}</Text>
      </View>

      <View style={rowStyles.inputCell}>
        <TextInput
          value={set.weight}
          onChangeText={onWeightChange}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={`rgba(255,255,255,${theme.opacity.placeholder})`}
          style={rowStyles.inputValue}
          maxLength={4}
          numberOfLines={1}
        />
        <Text style={rowStyles.inputUnit} numberOfLines={1}>
          {unitLabel}
        </Text>
      </View>

      <View style={rowStyles.inputCell}>
        <TextInput
          value={set.reps}
          onChangeText={onRepsChange}
          keyboardType="number-pad"
          placeholder="—"
          placeholderTextColor={`rgba(255,255,255,${theme.opacity.placeholder})`}
          style={rowStyles.inputValue}
          maxLength={3}
          numberOfLines={1}
        />
        <Text style={rowStyles.inputUnit} numberOfLines={1}>
          reps
        </Text>
      </View>

      <View style={rowStyles.actionsGroup}>
        {!isDone && (
          <TouchableOpacity
            onPress={onToggleFailed}
            disabled={isLocked}
            style={[rowStyles.iconBtn, rowStyles.failBtn, isFailed && rowStyles.iconBtnFailedActive]}
          >
            <Text
              style={[
                rowStyles.iconGlyph,
                { color: isFailed ? '#fff' : theme.colors.primary.negative },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
        {!isFailed && (
          <TouchableOpacity
            onPress={onToggleConfirm}
            disabled={isLocked || (!isDone && !canConfirm)}
            style={[
              rowStyles.iconBtn,
              rowStyles.confirmBtn,
              isDone && rowStyles.confirmBtnActive,
              !isDone && !canConfirm && rowStyles.confirmBtnDisabled,
            ]}
          >
            <Text
              style={[
                rowStyles.iconGlyph,
                {
                  color: isDone
                    ? theme.colors.primary.contrastText
                    : theme.colors.primary.main,
                },
              ]}
            >
              ✓
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const ExerciseCardSlide = ({
  exercise,
  scenario,
}: {
  exercise: MockExercise
  scenario: Scenario
}) => {
  const initial =
    scenario === 'week2-prefilled' && exercise.prefilled
      ? buildInitialSets(exercise.setCount, exercise.prefilled)
      : buildInitialSets(exercise.setCount, null)

  const [sets, setSets] = useState<SetRow[]>(initial)
  const unitLabel = 'kg'

  const firstSetReady = sets[0].weight.trim() !== '' && sets[0].reps.trim() !== ''
  const allAnswered = sets.every(s => s.state === 'done' || s.state === 'failed')
  const completedCount = sets.filter(s => s.state !== 'pending').length

  const updateSet = (id: string, patch: Partial<SetRow>) =>
    setSets(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))

  const toggleConfirm = (id: string) => {
    setSets(prev => {
      const target = prev.find(s => s.id === id)
      if (!target) return prev
      const willBeDone = target.state !== 'done'
      const isFirst = prev[0].id === id

      if (isFirst && willBeDone) {
        return prev.map((s, i) => {
          if (s.id === id) return { ...s, state: 'done' }
          if (i > 0 && s.state === 'pending' && s.weight.trim() === '' && s.reps.trim() === '') {
            return { ...s, weight: target.weight, reps: target.reps }
          }
          return s
        })
      }
      return prev.map(s => (s.id === id ? { ...s, state: willBeDone ? 'done' : 'pending' } : s))
    })
  }

  const toggleFailed = (id: string) =>
    setSets(prev =>
      prev.map(s => (s.id === id ? { ...s, state: s.state === 'failed' ? 'pending' : 'failed' } : s))
    )

  const statusFor = (i: number, set: SetRow): SetCardStatus => {
    if (set.state === 'done') return 'done'
    if (set.state === 'failed') return 'failed'
    if (i === 0) return 'active'
    if (scenario === 'week2-prefilled' && exercise.prefilled) return 'active'
    return firstSetReady ? 'active' : 'locked'
  }

  return (
    <View style={slideStyles.slide}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={24} style={slideStyles.flex}>
        <View style={slideStyles.headerRow}>
          <View style={slideStyles.headerTitleBlock}>
            <Text style={slideStyles.exerciseTitle}>{exercise.name.toUpperCase()}</Text>
            <Text style={slideStyles.exerciseSubtitle}>{exercise.muscle}</Text>
          </View>
          <TouchableOpacity style={slideStyles.cogBtn}>
            <CogwheelFilled color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>

        <View style={slideStyles.summaryStrip}>
          <View style={slideStyles.summaryItem}>
            <Text style={slideStyles.summaryLabel}>SETS</Text>
            <Text style={slideStyles.summaryValue}>
              {completedCount}/{sets.length}
            </Text>
          </View>
          <View style={slideStyles.summaryDivider} />
          <View style={slideStyles.summaryItem}>
            <Text style={slideStyles.summaryLabel}>WEEK</Text>
            <Text style={slideStyles.summaryValue}>{scenario === 'week1-empty' ? '1' : '3'}</Text>
          </View>
        </View>

        <ScrollView
          style={slideStyles.scroll}
          contentContainerStyle={slideStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sets.map((s, i) => (
            <SetRowItem
              key={s.id}
              index={i}
              set={s}
              status={statusFor(i, s)}
              unitLabel={unitLabel}
              onWeightChange={v => updateSet(s.id, { weight: v })}
              onRepsChange={v => updateSet(s.id, { reps: v })}
              onToggleConfirm={() => toggleConfirm(s.id)}
              onToggleFailed={() => toggleFailed(s.id)}
            />
          ))}
        </ScrollView>

        <View style={slideStyles.footer}>
          <TouchableOpacity
            style={[slideStyles.nextBtn, !allAnswered && slideStyles.nextBtnDisabled]}
            disabled={!allAnswered}
            onPress={() => {}}
          >
            <Text style={slideStyles.nextBtnText}>Next Exercise →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export const ExercisePendingCustomMockup = () => {
  const [scenario, setScenario] = useState<Scenario>('week1-empty')
  const [activeIndex, setActiveIndex] = useState(0)
  const insets = useSafeAreaInsets()
  const pagerRef = useRef<PagerView>(null)
  const pagerKey = `${scenario}`

  return (
    <SafeAreaView style={containerStyles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={containerStyles.flex}>
          <View style={containerStyles.scenarioBar}>
            <TouchableOpacity
              onPress={() => setScenario('week1-empty')}
              style={[
                containerStyles.scenarioBtn,
                scenario === 'week1-empty' && containerStyles.scenarioBtnActive,
              ]}
            >
              <Text
                style={[
                  containerStyles.scenarioText,
                  scenario === 'week1-empty' && containerStyles.scenarioTextActive,
                ]}
              >
                Week 1 (blank)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScenario('week2-prefilled')}
              style={[
                containerStyles.scenarioBtn,
                scenario === 'week2-prefilled' && containerStyles.scenarioBtnActive,
              ]}
            >
              <Text
                style={[
                  containerStyles.scenarioText,
                  scenario === 'week2-prefilled' && containerStyles.scenarioTextActive,
                ]}
              >
                Week 2+ (carry-forward)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[containerStyles.pagination, { paddingTop: insets.top / 2 }]}>
            <PaginationDots count={MOCK_EXERCISES.length} activeIndex={activeIndex} />
          </View>

          <PagerView
            key={pagerKey}
            ref={pagerRef}
            style={containerStyles.pager}
            initialPage={0}
            onPageSelected={e => setActiveIndex(e.nativeEvent.position)}
          >
            {MOCK_EXERCISES.map(ex => (
              <View key={ex.id} style={containerStyles.pageHost}>
                <ExerciseCardSlide exercise={ex} scenario={scenario} />
              </View>
            ))}
          </PagerView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const containerStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scenarioBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  scenarioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  scenarioBtnActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  scenarioText: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scenarioTextActive: {
    color: theme.colors.primary.contrastText,
  },
  pagination: {
    paddingBottom: 4,
  },
  pager: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pageHost: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: theme.colors.background,
  },
})

const slideStyles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  flex: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleBlock: {
    flex: 1,
  },
  exerciseTitle: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 26,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  exerciseSubtitle: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  cogBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border.light,
  },
  summaryLabel: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  summaryValue: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 12,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  nextBtn: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.small,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    opacity: theme.opacity.disabled,
    borderColor: theme.colors.border.light,
  },
  nextBtnText: {
    color: theme.colors.primary.main,
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
})

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingRight: 8,
    paddingLeft: 0,
    height: 52,
    overflow: 'hidden',
    gap: 8,
  },
  rowDone: {
    backgroundColor: 'rgba(255,195,0,0.10)',
  },
  rowFailed: {
    backgroundColor: 'rgba(229,57,53,0.12)',
  },
  rowLocked: {
    opacity: theme.opacity.disabled,
  },
  accentBar: {
    width: 3,
    height: '100%',
  },
  numberTile: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  numberText: {
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  inputCell: {
    flex: 1,
    minWidth: 86,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: theme.borderRadius.small,
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 38,
  },
  inputValue: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: 16,
    padding: 0,
    minWidth: 38,
    textAlign: 'center',
  },
  inputUnit: {
    color: theme.colors.text.tertiary,
    fontFamily: theme.font.sairaRegular,
    fontSize: 11,
    marginLeft: 4,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 38,
    borderRadius: theme.borderRadius.small,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.negative,
  },
  iconBtnFailedActive: {
    backgroundColor: theme.colors.primary.negative,
    borderColor: theme.colors.primary.negative,
  },
  iconGlyph: {
    fontSize: 16,
    fontFamily: theme.font.sairaBold,
  },
  confirmBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  confirmBtnActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  confirmBtnDisabled: {
    opacity: theme.opacity.disabled,
  },
})
