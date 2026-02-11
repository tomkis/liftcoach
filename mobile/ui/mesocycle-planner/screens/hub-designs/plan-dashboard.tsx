import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/mobile/theme/theme'

import { PlanHubProps } from './types'

const DotGrid = ({ completed, total }: { completed: number; total: number }) => {
  const dots = Array.from({ length: total }, (_, i) => i < completed)
  return (
    <View style={styles.dotGrid}>
      {dots.map((filled, i) => (
        <View key={i} style={[styles.dot, filled && styles.dotFilled]} />
      ))}
    </View>
  )
}

const KeyValue = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <View style={styles.kvPair}>
    <Text style={styles.kvLabel}>{label}</Text>
    <Text style={[styles.kvValue, accent && styles.kvValueAccent]}>{value}</Text>
  </View>
)

export const PlanDashboard = ({ activePlan, onViewActivePlan, onBuildNewPlan, isLoading }: PlanHubProps) => {
  const insets = useSafeAreaInsets()

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <ActivityIndicator size="large" color={theme.colors.newUi.primary.main} />
      </View>
    )
  }

  const completionPct = activePlan
    ? Math.round((activePlan.workoutsCompleted / activePlan.totalWorkouts) * 100)
    : 0

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>MY PLAN</Text>
      </View>
      <View style={styles.headerRule}>
        <Text style={styles.headerSubtitle}>WHAT YOU DO IN THE GYM</Text>
      </View>

      {activePlan ? (
        <TouchableOpacity onPress={onViewActivePlan} activeOpacity={0.85}>
          <View style={styles.activePlanCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardLabel}>ACTIVE PLAN</Text>
                <Text style={styles.splitName}>{activePlan.splitType}</Text>
              </View>
              <View style={styles.pctContainer}>
                <Text style={styles.pctValue}>{completionPct}</Text>
                <Text style={styles.pctSign}>%</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.statsGrid}>
              <KeyValue label="WEEK" value={`${activePlan.currentWeek}/${activePlan.totalWeeks}`} accent />
              <KeyValue label="FREQ" value={`${activePlan.trainingDaysPerWeek} days`} />
              <KeyValue
                label="DONE"
                value={`${activePlan.workoutsCompleted}/${activePlan.totalWorkouts}`}
              />
            </View>

            <DotGrid completed={activePlan.workoutsCompleted} total={activePlan.totalWorkouts} />

            <View style={styles.cardFooter}>
              <View style={styles.cardFooterLine} />
              <Text style={styles.cardFooterText}>VIEW DETAILS</Text>
              <View style={styles.cardFooterLine} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyTopBorder} />
          <View style={styles.emptyContent}>
            <View style={styles.emptyRing}>
              <Text style={styles.emptyRingText}>0</Text>
            </View>
            <Text style={styles.emptyTitle}>No Active Plan</Text>
            <Text style={styles.emptyBody}>
              Create a training plan to get personalized workouts with progressive overload
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={onBuildNewPlan} activeOpacity={0.85}>
        <View style={styles.buildCard}>
          <View style={styles.buildTop}>
            <View style={styles.buildIconWrap}>
              <View style={styles.buildIconHLine} />
              <View style={styles.buildIconVLine} />
            </View>
            <View style={styles.buildTextWrap}>
              <Text style={styles.buildTitle}>BUILD CUSTOM PLAN</Text>
              <Text style={styles.buildSubtitle}>
                {activePlan ? 'Replace current program' : 'Start your first program'}
              </Text>
            </View>
          </View>
          <View style={styles.buildBottom}>
            <View style={styles.buildTag}>
              <Text style={styles.buildTagText}>DAYS</Text>
            </View>
            <Text style={styles.buildArrowSep}>→</Text>
            <View style={styles.buildTag}>
              <Text style={styles.buildTagText}>MUSCLES</Text>
            </View>
            <Text style={styles.buildArrowSep}>→</Text>
            <View style={styles.buildTag}>
              <Text style={styles.buildTagText}>SPLIT</Text>
            </View>
            <Text style={styles.buildArrowSep}>→</Text>
            <View style={styles.buildTag}>
              <Text style={styles.buildTagText}>EXERCISES</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.newUi.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  headerAccent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  headerTitle: {
    fontFamily: theme.font.sairaBold,
    fontSize: 22,
    color: theme.colors.newUi.text.primary,
    letterSpacing: 3,
  },
  headerRule: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.newUi.primary.main,
    paddingBottom: 8,
    marginBottom: 24,
    marginTop: 4,
  },
  headerSubtitle: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 10,
    color: theme.colors.newUi.primary.main,
    letterSpacing: 2,
  },
  activePlanCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 10,
    color: '#4ade80',
    letterSpacing: 2,
    marginBottom: 4,
  },
  splitName: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 26,
    color: theme.colors.newUi.text.primary,
    textTransform: 'uppercase',
  },
  pctContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pctValue: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 44,
    color: theme.colors.newUi.text.primary,
    lineHeight: 52,
  },
  pctSign: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  kvPair: {
    flex: 1,
  },
  kvLabel: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 10,
    color: '#555',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  kvValue: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 15,
    color: theme.colors.newUi.text.primary,
  },
  kvValueAccent: {
    color: theme.colors.newUi.primary.main,
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#222',
  },
  dotFilled: {
    backgroundColor: theme.colors.newUi.primary.main,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardFooterLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2a2a2a',
  },
  cardFooterText: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 11,
    color: theme.colors.newUi.primary.main,
    letterSpacing: 2,
  },
  emptyCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 16,
    overflow: 'hidden',
  },
  emptyTopBorder: {
    height: 2,
    backgroundColor: '#333',
  },
  emptyContent: {
    padding: 32,
    alignItems: 'center',
  },
  emptyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyRingText: {
    fontFamily: theme.font.sairaCondesedBold,
    fontSize: 22,
    color: '#444',
  },
  emptyTitle: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 16,
    color: '#555',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
  },
  buildCard: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  buildTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  buildIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.newUi.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildIconHLine: {
    position: 'absolute',
    width: 14,
    height: 1.5,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  buildIconVLine: {
    position: 'absolute',
    width: 1.5,
    height: 14,
    backgroundColor: theme.colors.newUi.primary.main,
  },
  buildTextWrap: {
    flex: 1,
  },
  buildTitle: {
    fontFamily: theme.font.sairaSemiBold,
    fontSize: 14,
    color: theme.colors.newUi.text.primary,
    letterSpacing: 1.5,
  },
  buildSubtitle: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  buildBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#161616',
    gap: 6,
  },
  buildTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: '#222',
  },
  buildTagText: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 9,
    color: '#666',
    letterSpacing: 1,
  },
  buildArrowSep: {
    fontFamily: theme.font.sairaRegular,
    fontSize: 10,
    color: '#444',
  },
})
