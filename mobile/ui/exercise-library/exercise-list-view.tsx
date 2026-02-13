import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

import { type MockExercise, MUSCLE_GROUPS, PERFORMED_COUNT, TOTAL_COUNT } from './mock-data'

const GOLD = theme.colors.primary.main

const CategoryCard = ({
  name,
  count,
  performed,
  active,
  onPress,
}: {
  name: string
  count: number
  performed: number
  active: boolean
  onPress: () => void
}) => (
  <Pressable onPress={onPress} style={[s.catCard, active && s.catCardActive]}>
    <Text style={[s.catName, active && s.catNameActive]}>{name}</Text>
    <View style={s.catMeta}>
      <Text style={[s.catCount, active && s.catCountActive]}>{count}</Text>
      {performed > 0 && (
        <View style={s.catPerformedWrap}>
          <View style={[s.catPerformedDot, active && s.catPerformedDotActive]} />
          <Text style={[s.catPerformedNum, active && s.catCountActive]}>{performed}</Text>
        </View>
      )}
    </View>
  </Pressable>
)

const ExerciseListCard = ({ exercise }: { exercise: MockExercise }) => (
  <Pressable style={({ pressed }) => [s.exerciseCard, pressed && { opacity: 0.8 }]}>
    <View style={s.cardAccentBar} />
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
                    exercise.e1rmTrend === 'up' && { backgroundColor: 'rgba(74, 222, 128, 0.15)' },
                    exercise.e1rmTrend === 'down' && { backgroundColor: 'rgba(229, 57, 53, 0.15)' },
                    exercise.e1rmTrend === 'flat' && { backgroundColor: 'rgba(255, 195, 0, 0.1)' },
                  ]}
                >
                  <Text
                    style={[
                      s.trendText,
                      exercise.e1rmTrend === 'up' && { color: theme.colors.status.success },
                      exercise.e1rmTrend === 'down' && { color: theme.colors.primary.negative },
                      exercise.e1rmTrend === 'flat' && { color: GOLD },
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

export const ExerciseListView = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const displayGroups = activeGroup
    ? MUSCLE_GROUPS.filter(mg => mg.name === activeGroup)
    : MUSCLE_GROUPS

  const exerciseCount = displayGroups.reduce((sum, mg) => sum + mg.exercises.length, 0)
  const performedInView = displayGroups.reduce(
    (sum, mg) => sum + mg.exercises.filter(e => e.performed).length,
    0
  )

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={s.header}>
          <Text style={s.title}>EXERCISES</Text>
          <Text style={s.subtitle}>
            {PERFORMED_COUNT} of {TOTAL_COUNT} performed
          </Text>
        </View>

        <View style={s.searchWrap}>
          <TextInput
            style={s.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={theme.colors.text.hint}
            editable={false}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.catRow}
          style={s.catScroll}
        >
          <Pressable
            onPress={() => setActiveGroup(null)}
            style={[s.catCard, s.catCardAll, !activeGroup && s.catCardActive]}
          >
            <Text style={[s.catName, !activeGroup && s.catNameActive]}>All</Text>
            <Text style={[s.catCount, !activeGroup && s.catCountActive]}>{TOTAL_COUNT}</Text>
          </Pressable>
          {MUSCLE_GROUPS.map(mg => (
            <CategoryCard
              key={mg.name}
              name={mg.name}
              count={mg.exercises.length}
              performed={mg.exercises.filter(e => e.performed).length}
              active={activeGroup === mg.name}
              onPress={() => setActiveGroup(activeGroup === mg.name ? null : mg.name)}
            />
          ))}
        </ScrollView>

        <View style={s.countLine}>
          <View style={s.countAccent} />
          <Text style={s.countText}>
            {exerciseCount} exercises · {performedInView} done
          </Text>
        </View>

        {displayGroups.map(mg => (
          <View key={mg.name}>
            {!activeGroup && (
              <View style={s.groupHeader}>
                <Text style={s.groupName}>{mg.name.toUpperCase()}</Text>
                <View style={s.groupLine} />
              </View>
            )}
            {mg.exercises.map(ex => (
              <ExerciseListCard key={ex.id} exercise={ex} />
            ))}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    marginBottom: 16,
  },
  title: {
    fontFamily: theme.font.sairaBold,
    fontSize: 28,
    color: theme.colors.text.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 13,
    color: theme.colors.text.hint,
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: theme.font.sairaRegular,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  catScroll: {
    marginBottom: 14,
  },
  catRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  catCard: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catCardAll: {
    minWidth: 56,
  },
  catCardActive: {
    borderColor: GOLD,
    backgroundColor: 'rgba(255, 195, 0, 0.08)',
  },
  catName: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  catNameActive: {
    color: theme.colors.text.primary,
  },
  catMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catCount: {
    fontFamily: theme.font.orbitron,
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  catCountActive: {
    color: GOLD,
  },
  catPerformedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  catPerformedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.text.dim,
  },
  catPerformedDotActive: {
    backgroundColor: GOLD,
  },
  catPerformedNum: {
    fontFamily: theme.font.orbitron,
    fontSize: 10,
    color: theme.colors.text.dim,
  },
  countLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  countAccent: {
    width: 3,
    height: 14,
    borderRadius: 1.5,
    backgroundColor: GOLD,
  },
  countText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 12,
    color: theme.colors.text.muted,
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
    fontFamily: theme.font.orbitronMedium,
    fontSize: 20,
    color: theme.colors.text.primary,
    lineHeight: 24,
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
  trendText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 11,
  },
  noData: {
    fontFamily: theme.font.orbitron,
    fontSize: 16,
    color: theme.colors.text.faint,
  },
})
