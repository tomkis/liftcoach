import React, { useCallback, useRef, useState } from 'react'
import {
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

import { theme } from '@/mobile/theme/theme'

import { MUSCLE_GROUPS, TOTAL_COUNT, type MockExercise } from './mock-data'

const GOLD = theme.colors.primary.main
const SCREEN_WIDTH = Dimensions.get('window').width
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8

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

const ExerciseListCard = ({ exercise }: { exercise: MockExercise }) => (
  <Pressable style={({ pressed }) => [s.exerciseCard, pressed && { opacity: 0.8 }]}>
    <View style={[s.cardAccentBar, !exercise.performed && s.cardAccentBarMuted]} />
    <View style={s.cardBody}>
      <View style={s.cardLeft}>
        <View style={s.nameRow}>
          <Text style={s.exerciseName} numberOfLines={1}>
            {exercise.name}
          </Text>
          {exercise.performed && <View style={s.performedDot} />}
        </View>
        <Text style={s.patternLabel}>{exercise.movementPattern}</Text>
      </View>
      <View style={s.cardRight}>
        {exercise.e1rm ? (
          <>
            <Text style={s.e1rmValue}>{exercise.e1rm}</Text>
            <View style={s.trendRow}>
              <Text style={s.e1rmUnit}>kg</Text>
              {exercise.e1rmTrend && (
                <View
                  style={[
                    s.trendChip,
                    exercise.e1rmTrend === 'up' && s.trendChipUp,
                    exercise.e1rmTrend === 'down' && s.trendChipDown,
                    exercise.e1rmTrend === 'flat' && s.trendChipFlat,
                  ]}
                >
                  <Text
                    style={[
                      s.trendText,
                      exercise.e1rmTrend === 'up' && s.trendTextUp,
                      exercise.e1rmTrend === 'down' && s.trendTextDown,
                      exercise.e1rmTrend === 'flat' && s.trendTextFlat,
                    ]}
                  >
                    {exercise.e1rmTrend === 'up' ? '↑' : exercise.e1rmTrend === 'down' ? '↓' : '—'}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <Text style={s.noData}>—</Text>
        )}
      </View>
    </View>
  </Pressable>
)

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

export const ExerciseListView = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerAnim = useRef(new Animated.Value(0)).current

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

  const displayGroups = activeGroup ? MUSCLE_GROUPS.filter(mg => mg.name === activeGroup) : MUSCLE_GROUPS

  const sections = displayGroups.map(mg => ({
    title: mg.name,
    data: mg.exercises,
  }))

  const overlayOpacity = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const drawerTranslateX = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_WIDTH, 0],
  })

  return (
    <View style={s.container}>
      <View style={s.headerWrap}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <View style={s.headerAccent} />
            <Text style={s.headerTitle}>MY EXERCISES</Text>
          </View>
          <View style={s.headerActions}>
            <Pressable onPress={() => {}} hitSlop={12} style={s.addButton}>
              <View style={s.addIconHLine} />
              <View style={s.addIconVLine} />
            </Pressable>
            <Pressable onPress={openDrawer} hitSlop={12} style={s.filterButton}>
              <FilterIcon active={activeGroup !== null} />
            </Pressable>
          </View>
        </View>
        <View style={s.headerRule}>
          <Text style={s.headerSubtitle}>WHAT YOU LIFT</Text>
        </View>
      </View>

      {activeGroup && (
        <View style={s.activeFilterStrip}>
          <Pressable onPress={() => setActiveGroup(null)} style={s.activeChip}>
            <Text style={s.activeChipText}>{activeGroup}</Text>
            <Text style={s.activeChipX}>×</Text>
          </Pressable>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) =>
          !activeGroup ? (
            <View style={s.groupHeader}>
              <Text style={s.groupName}>{section.title.toUpperCase()}</Text>
              <View style={s.groupLine} />
            </View>
          ) : null
        }
        renderItem={({ item }) => <ExerciseListCard exercise={item} />}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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

            <ScrollView showsVerticalScrollIndicator={false} style={s.drawerScroll}>
              <FilterRow
                name="All Exercises"
                count={TOTAL_COUNT}
                active={activeGroup === null}
                onPress={() => selectGroup(null)}
              />
              <View style={s.drawerSep} />
              {MUSCLE_GROUPS.map(mg => (
                <FilterRow
                  key={mg.name}
                  name={mg.name}
                  count={mg.exercises.length}
                  active={activeGroup === mg.name}
                  onPress={() => selectGroup(activeGroup === mg.name ? null : mg.name)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    paddingHorizontal: 20,
    marginBottom: 12,
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
    marginLeft: 'auto',
    gap: 4,
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
})
