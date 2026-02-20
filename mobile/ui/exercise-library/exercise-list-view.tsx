import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { Unit } from '@/mobile/domain'
import type { ExerciseLibraryItem, MuscleGroup, ProgressState } from '@/mobile/domain'
import { formatWeight } from '@/mobile/domain/utils/format-weight'
import { theme } from '@/mobile/theme/theme'
import { trpc } from '@/mobile/trpc'

import { AddExerciseModal } from './add-exercise-modal/add-exercise-modal'
import { formatLabel } from './add-exercise-modal/shared'

const GOLD = theme.colors.primary.main
const SCREEN_WIDTH = Dimensions.get('window').width
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8

const trendFromProgress = (state: ProgressState) => {
  if (state === 'progressing') return 'up' as const
  if (state === 'regressing') return 'down' as const
  return 'flat' as const
}

type GroupedSection = {
  title: string
  muscleGroup: MuscleGroup
  data: ExerciseLibraryItem[]
}

const groupByMuscleGroup = (items: ExerciseLibraryItem[]): GroupedSection[] => {
  const map = new Map<MuscleGroup, ExerciseLibraryItem[]>()
  for (const item of items) {
    const arr = map.get(item.muscleGroup) ?? []
    arr.push(item)
    map.set(item.muscleGroup, arr)
  }
  return Array.from(map.entries()).map(([mg, exercises]) => ({
    title: formatLabel(mg),
    muscleGroup: mg,
    data: exercises,
  }))
}

const FilterIcon = ({ active }: { active: boolean }) => {
  const color = active ? GOLD : theme.colors.text.secondary
  return (
    <View style={s.filterIconWrap}>
      <View style={[s.filterBar, { width: 18, backgroundColor: color }]} />
      <View style={[s.filterBar, { width: 13, backgroundColor: color }]} />
      <View style={[s.filterBar, { width: 8, backgroundColor: color }]} />
    </View>
  )
}

const ExerciseListCard = React.memo(function ExerciseListCard({ exercise, unit }: { exercise: ExerciseLibraryItem; unit: Unit }) {
  return (
    <Pressable style={({ pressed }) => [s.exerciseCard, pressed && { opacity: 0.8 }]}>
      <View style={[s.cardAccentBar, !exercise.doneInPast && s.cardAccentBarMuted]} />
      <View style={s.cardBody}>
        <View style={s.cardLeft}>
          <View style={s.nameRow}>
            <Text style={s.exerciseName} numberOfLines={1}>
              {exercise.name}
            </Text>
            {exercise.doneInPast && <View style={s.performedDot} />}
          </View>
          <Text style={s.patternLabel}>{formatLabel(exercise.muscleGroup)}</Text>
        </View>
        {exercise.doneInPast && <ExerciseStats exercise={exercise} unit={unit} />}
      </View>
    </Pressable>
  )
})

const ExerciseStats = React.memo(function ExerciseStats({ exercise, unit }: { exercise: ExerciseLibraryItem & { doneInPast: true }; unit: Unit }) {
  const trend = exercise.progressState ? trendFromProgress(exercise.progressState) : null
  const hasE1rm = exercise.estimatedOneRepMax > 0

  return (
    <View style={s.cardRight}>
      {hasE1rm ? (
        <>
          <Text style={s.e1rmValue}>{formatWeight(exercise.estimatedOneRepMax)}</Text>
          <View style={s.trendRow}>
            <Text style={s.e1rmUnit}>{unit === Unit.Metric ? 'kg' : 'lbs'}</Text>
            {trend && (
              <View
                style={[
                  s.trendChip,
                  trend === 'up' && s.trendChipUp,
                  trend === 'down' && s.trendChipDown,
                  trend === 'flat' && s.trendChipFlat,
                ]}
              >
                <Text
                  style={[
                    s.trendText,
                    trend === 'up' && s.trendTextUp,
                    trend === 'down' && s.trendTextDown,
                    trend === 'flat' && s.trendTextFlat,
                  ]}
                >
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <Text style={s.noData}>—</Text>
      )}
    </View>
  )
})

const FilterRow = ({
  name,
  count,
  active,
  onPress,
}: {
  name: string
  count: number
  active: boolean
  onPress: () => void
}) => (
  <Pressable onPress={onPress} style={[s.filterRow, active && s.filterRowActive]}>
    <View style={[s.filterRowAccent, active && s.filterRowAccentActive]} />
    <View style={s.filterRowBody}>
      <Text style={[s.filterRowName, active && s.filterRowNameActive]}>{name}</Text>
      <Text style={[s.filterRowCount, active && s.filterRowCountActive]}>{count}</Text>
    </View>
  </Pressable>
)

const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <Pressable onPress={onToggle} hitSlop={8} style={[s.toggle, active && s.toggleActive]}>
    <Animated.View style={[s.toggleKnob, active && s.toggleKnobActive]} />
  </Pressable>
)

export const ExerciseListView = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [performedOnly, setPerformedOnly] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerAnim = useRef(new Animated.Value(0)).current
  const [modalVisible, setModalVisible] = useState(false)

  const trpcUtils = trpc.useUtils()
  const { data: onboardingInfo } = trpc.user.getOnboardingInfo.useQuery()
  const { data: exercises, isLoading: isLoadingExercises, isError, refetch } = trpc.exerciseLibrary.getExercises.useQuery()
  const createExercise = trpc.exerciseLibrary.createExercise.useMutation({
    onSuccess: () => trpcUtils.exerciseLibrary.getExercises.invalidate(),
  })
  const isLoading = isLoadingExercises || !onboardingInfo

  useFocusEffect(
    useCallback(() => {
      trpcUtils.exerciseLibrary.getExercises.invalidate()
    }, [trpcUtils])
  )

  const filteredExercises = useMemo(
    () => (performedOnly ? (exercises ?? []).filter(e => e.doneInPast) : (exercises ?? [])),
    [exercises, performedOnly]
  )
  const allSections = useMemo(() => groupByMuscleGroup(filteredExercises), [filteredExercises])
  const totalCount = filteredExercises.length

  const openDrawer = useCallback(() => {
    setDrawerOpen(true)
    Animated.spring(drawerAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
    }).start()
  }, [drawerAnim])

  const closeDrawer = useCallback(() => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false))
  }, [drawerAnim])

  const selectGroup = useCallback(
    (group: string | null) => {
      setActiveGroup(group)
      closeDrawer()
    },
    [closeDrawer]
  )

  const displaySections = useMemo(
    () => (activeGroup ? allSections.filter(s => s.title === activeGroup) : allSections),
    [activeGroup, allSections]
  )

  const unit = onboardingInfo?.unit
  const keyExtractor = useCallback((item: ExerciseLibraryItem) => item.id, [])
  const renderItem = useCallback(
    ({ item }: { item: ExerciseLibraryItem }) => <ExerciseListCard exercise={item} unit={unit!} />,
    [unit]
  )
  const renderSectionHeader = useCallback(
    ({ section }: { section: GroupedSection }) =>
      !activeGroup ? (
        <View style={s.groupHeader}>
          <Text style={s.groupName}>{section.title.toUpperCase()}</Text>
          <View style={s.groupLine} />
        </View>
      ) : null,
    [activeGroup]
  )

  const overlayOpacity = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const drawerTranslateX = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  })

  if (isLoading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator color={GOLD} />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={s.loadingContainer}>
        <Text style={s.errorText}>Failed to load exercises</Text>
        <Pressable onPress={() => refetch()} style={s.retryButton}>
          <Text style={s.retryText}>RETRY</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={s.container}>
      <View style={s.headerWrap}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <View style={s.headerAccent} />
            <Text style={s.headerTitle}>MY EXERCISES</Text>
          </View>
          <View style={s.headerActions}>
            <Pressable onPress={() => setModalVisible(true)} hitSlop={12} style={s.addButton}>
              <View style={s.addIconHLine} />
              <View style={s.addIconVLine} />
            </Pressable>
            <Pressable onPress={openDrawer} hitSlop={12} style={s.filterButton}>
              <FilterIcon active={activeGroup !== null || performedOnly} />
            </Pressable>
          </View>
        </View>
        <View style={s.headerRule}>
          <Text style={s.headerSubtitle}>WHAT YOU LIFT</Text>
        </View>
      </View>

      {(activeGroup || performedOnly) && (
        <View style={s.activeFilterStrip}>
          {performedOnly && (
            <Pressable onPress={() => setPerformedOnly(false)} style={s.activeChip}>
              <View style={s.activeChipDot} />
              <Text style={s.activeChipText}>Performed</Text>
              <Text style={s.activeChipX}>×</Text>
            </Pressable>
          )}
          {activeGroup && (
            <Pressable onPress={() => setActiveGroup(null)} style={s.activeChip}>
              <Text style={s.activeChipText}>{activeGroup}</Text>
              <Text style={s.activeChipX}>×</Text>
            </Pressable>
          )}
        </View>
      )}

      <SectionList
        sections={displaySections}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        maxToRenderPerBatch={15}
        windowSize={5}
      />

      {drawerOpen && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View style={[s.overlay, { opacity: overlayOpacity }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
          </Animated.View>
          <Animated.View style={[s.drawer, { transform: [{ translateX: drawerTranslateX }] }]}>
            <View style={s.drawerHeader}>
              <View style={s.drawerHeaderLeft}>
                <View style={s.drawerAccentBar} />
                <Text style={s.drawerTitle}>FILTER</Text>
              </View>
              <Pressable onPress={closeDrawer} hitSlop={12}>
                <Text style={s.drawerClose}>×</Text>
              </Pressable>
            </View>
            <View style={s.drawerRule} />

            <View style={s.drawerSearchWrap}>
              <TextInput
                style={s.drawerSearchInput}
                placeholder="Search exercises..."
                placeholderTextColor={theme.colors.text.hint}
                editable={false}
              />
            </View>

            <View style={s.drawerSectionHeader}>
              <Text style={s.drawerSectionLabel}>STATUS</Text>
            </View>
            <View style={s.toggleRow}>
              <View style={s.toggleRowLeft}>
                <View style={[s.toggleRowDot, performedOnly && s.toggleRowDotActive]} />
                <Text style={[s.toggleRowLabel, performedOnly && s.toggleRowLabelActive]}>
                  Performed Only
                </Text>
              </View>
              <ToggleSwitch active={performedOnly} onToggle={() => setPerformedOnly(p => !p)} />
            </View>
            <View style={s.drawerSep} />

            <View style={s.drawerSectionHeader}>
              <Text style={s.drawerSectionLabel}>MUSCLE GROUP</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={s.drawerScroll}>
              <FilterRow
                name="All Groups"
                count={totalCount}
                active={activeGroup === null}
                onPress={() => selectGroup(null)}
              />
              <View style={s.drawerSep} />
              {allSections.map(section => (
                <FilterRow
                  key={section.title}
                  name={section.title}
                  count={section.data.length}
                  active={activeGroup === section.title}
                  onPress={() => selectGroup(activeGroup === section.title ? null : section.title)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      )}

      <AddExerciseModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={input => createExercise.mutate(input)} />
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  retryButton: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: {
    fontFamily: theme.font.sairaBold,
    fontSize: 12,
    color: GOLD,
    letterSpacing: 1.5,
  },
  headerWrap: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAccent: {
    width: 3,
    height: 16,
    borderRadius: theme.borderRadius.small,
    backgroundColor: GOLD,
  },
  headerTitle: {
    fontFamily: theme.font.sairaBold,
    fontSize: theme.fontSize.medium,
    color: theme.colors.text.primary,
  },
  headerRule: {
    borderBottomWidth: 1,
    borderBottomColor: GOLD,
    paddingBottom: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  headerSubtitle: {
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.extraSmall,
    color: GOLD,
    letterSpacing: 1.4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconHLine: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: theme.colors.text.secondary,
    borderRadius: 1,
  },
  addIconVLine: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: theme.colors.text.secondary,
    borderRadius: 1,
  },
  filterButton: {
    padding: 6,
  },
  filterIconWrap: {
    width: 22,
    height: 18,
    justifyContent: 'center',
    gap: 3,
  },
  filterBar: {
    height: 2,
    borderRadius: 1,
  },
  activeFilterStrip: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 195, 0, 0.08)',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  activeChipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: GOLD,
  },
  activeChipText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 10,
    color: GOLD,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  activeChipX: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    color: GOLD,
    lineHeight: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  groupName: {
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 12,
    color: theme.colors.text.dim,
    letterSpacing: 2,
  },
  groupLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.default,
  },
  exerciseCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccentBar: {
    width: 3,
    backgroundColor: GOLD,
  },
  cardAccentBarMuted: {
    backgroundColor: theme.colors.border.light,
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardLeft: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  exerciseName: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 15,
    color: theme.colors.text.primary,
    flexShrink: 1,
  },
  performedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  patternLabel: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 12,
    color: theme.colors.text.hint,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  e1rmValue: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 22,
    color: theme.colors.text.primary,
    lineHeight: 26,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  e1rmUnit: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  trendChip: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  trendChipUp: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
  },
  trendChipDown: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
  },
  trendChipFlat: {
    backgroundColor: 'rgba(255, 195, 0, 0.1)',
  },
  trendText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 11,
  },
  trendTextUp: {
    color: theme.colors.status.success,
  },
  trendTextDown: {
    color: theme.colors.primary.negative,
  },
  trendTextFlat: {
    color: GOLD,
  },
  noData: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 18,
    color: theme.colors.text.faint,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: theme.colors.backgroundLight,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border.default,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  drawerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerAccentBar: {
    width: 3,
    height: 14,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.text.dim,
  },
  drawerTitle: {
    fontFamily: theme.font.sairaBold,
    fontSize: 16,
    color: theme.colors.text.primary,
    letterSpacing: 1.5,
  },
  drawerClose: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 28,
    color: theme.colors.text.dim,
    lineHeight: 30,
  },
  drawerRule: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  drawerSearchWrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  drawerSearchInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: theme.font.sairaRegular,
    fontSize: 14,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  drawerScroll: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  filterRowActive: {
    backgroundColor: 'rgba(255, 195, 0, 0.06)',
  },
  filterRowAccent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  filterRowAccentActive: {
    backgroundColor: GOLD,
  },
  filterRowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filterRowName: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  filterRowNameActive: {
    color: theme.colors.text.primary,
  },
  filterRowCount: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 16,
    color: theme.colors.text.muted,
  },
  filterRowCountActive: {
    color: GOLD,
  },
  drawerSep: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  drawerSectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  drawerSectionLabel: {
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: 11,
    color: theme.colors.text.dim,
    letterSpacing: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 6,
  },
  toggleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleRowDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.text.muted,
  },
  toggleRowDotActive: {
    backgroundColor: GOLD,
  },
  toggleRowLabel: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  toggleRowLabelActive: {
    color: theme.colors.text.primary,
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.border.light,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: 'rgba(255, 195, 0, 0.25)',
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.text.muted,
  },
  toggleKnobActive: {
    backgroundColor: GOLD,
    alignSelf: 'flex-end',
  },
})
