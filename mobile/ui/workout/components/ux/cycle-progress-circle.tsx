import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'

import { theme } from '@/mobile/theme/theme'

const STROKE_WIDTH = 10

type WeekSegment = {
  title: string
  testing: boolean
  sets: Array<'completed' | 'failed' | 'pending'>
}

function getStatusColor(status: 'completed' | 'failed' | 'pending') {
  switch (status) {
    case 'completed':
      return theme.colors.primary.main
    case 'failed':
      return theme.colors.primary.negative
    case 'pending':
    default:
      return theme.colors.background
  }
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface CycleProgressCircleProps {
  lastWeek: Array<'completed' | 'failed' | 'pending'> | null
  weeks: WeekSegment[]
  animate: boolean
}

export const CycleProgressCircle: React.FC<CycleProgressCircleProps> = ({
  weeks: weeksOriginal,
  animate,
  lastWeek,
}) => {
  const [size, setSize] = useState(0)
  const radius = (size - STROKE_WIDTH) / 2
  const circumference = 2 * Math.PI * radius

  const currentWeekIndex = weeksOriginal.findIndex(week => week.sets.some(set => set === 'pending'))

  // Memoize the weeks with lastWeek replacement to prevent unnecessary recalculations
  const weeks = useMemo(() => {
    return weeksOriginal.map((week, index) => {
      if (lastWeek && index === currentWeekIndex) {
        return {
          ...week,
          sets: lastWeek.sort((a, b) => {
            if (a === 'pending' && b !== 'pending') return 1
            if (a !== 'pending' && b === 'pending') return -1
            return 0
          }),
        }
      }
      return week
    })
  }, [weeksOriginal, lastWeek, currentWeekIndex])

  // Memoize completed sets calculation
  const completedSets = useMemo(() => {
    return weeks.reduce((sum, week) => sum + week.sets.filter(set => set === 'completed' || set === 'failed').length, 0)
  }, [weeks])

  // Calculate completed weeks (a week is completed if it has at least one completed or failed set)
  // Note: This is calculated but not currently used in the percentage calculation
  // const completedWeeks = useMemo(() => {
  //   return weeks.filter(week => week.sets.some(set => set === 'completed' || set === 'failed')).length
  // }, [weeks])

  // Calculate total sets for percentage calculation
  const totalSets = useMemo(() => {
    return weeks.reduce((sum, week) => sum + week.sets.length, 0)
  }, [weeks])

  // Animation for the sweep - tracks previous value for incremental updates
  const sweep = useRef(new Animated.Value(0)).current
  const previousCompletedSets = useRef(0)

  useEffect(() => {
    if (!animate) {
      return
    }

    // Calculate the difference between current and previous completed sets
    const difference = completedSets - previousCompletedSets.current

    if (difference !== 0) {
      // Animate only the difference incrementally
      Animated.timing(sweep, {
        toValue: completedSets,
        duration: 900,
        useNativeDriver: false,
      }).start()

      // Update the previous value for next animation
      previousCompletedSets.current = completedSets
    }
  }, [completedSets, animate, sweep])

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width
    if (width && width !== size) {
      setSize(width - 200)
    }
  }

  const LABEL_RADIUS = radius + 30 // Add 30 pixels to offset labels outward
  const LABEL_POSITIONS = [
    { x: LABEL_RADIUS * Math.cos(-Math.PI / 3), y: LABEL_RADIUS * Math.sin(-Math.PI / 3) }, // top
    { x: LABEL_RADIUS * Math.cos(0), y: LABEL_RADIUS * Math.sin(0) }, // top right
    { x: LABEL_RADIUS * Math.cos(Math.PI / 3), y: LABEL_RADIUS * Math.sin(Math.PI / 3) }, // bottom right
    { x: LABEL_RADIUS * Math.cos((2 * Math.PI) / 3), y: LABEL_RADIUS * Math.sin((2 * Math.PI) / 3) }, // bottom
    { x: LABEL_RADIUS * Math.cos(Math.PI), y: LABEL_RADIUS * Math.sin(Math.PI) }, // bottom left
    { x: LABEL_RADIUS * Math.cos((-2 * Math.PI) / 3), y: LABEL_RADIUS * Math.sin((-2 * Math.PI) / 3) }, // top left
  ]

  // Helper to render animated arc for each set
  const renderAnimatedArc = (setIndex: number, color: string, isTestingWeek?: boolean) => {
    const weekGapSize = 3
    const setGapSize = 0.5
    const totalWeeks = weeks.length

    // Each week gets 1/5th of the circle
    const weekSegmentLength = (circumference - weekGapSize * totalWeeks) / totalWeeks

    // Find which week this set belongs to and its position within that week
    let currentSetIndex = 0
    let weekStartAngle = 0

    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const week = weeks[weekIndex]
      const setsInWeek = week.sets.length

      if (setsInWeek === 0) {
        weekStartAngle += weekSegmentLength + weekGapSize
        continue
      }

      // Check if this is a testing week
      if (week.testing) {
        // For testing weeks, render the entire week as one continuous block
        const weekHasCompletedSets = week.sets.some(set => set === 'completed' || set === 'failed')

        if (weekHasCompletedSets && isTestingWeek) {
          return (
            <AnimatedCircle
              key={`week-${weekIndex}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={sweep.interpolate({
                inputRange: [currentSetIndex, currentSetIndex + setsInWeek],
                outputRange: [`0,${circumference}`, `${weekSegmentLength},${circumference}`],
                extrapolate: 'clamp',
              })}
              strokeDashoffset={-weekStartAngle}
            />
          )
        }

        // Skip to next week if no completed sets in testing week
        currentSetIndex += setsInWeek
        weekStartAngle += weekSegmentLength + weekGapSize
        continue
      }

      // For non-testing weeks, render individual sets
      const setLength = (weekSegmentLength - setGapSize * (setsInWeek - 1)) / setsInWeek

      for (let setInWeekIndex = 0; setInWeekIndex < setsInWeek; setInWeekIndex++) {
        if (currentSetIndex === setIndex && !isTestingWeek) {
          // Calculate the position of this set within the week
          const setOffset = setInWeekIndex * (setLength + setGapSize)
          const totalOffset = weekStartAngle + setOffset

          return (
            <AnimatedCircle
              key={`set-${setIndex}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={sweep.interpolate({
                inputRange: [setIndex, setIndex + 1],
                outputRange: [`0,${circumference}`, `${setLength},${circumference}`],
                extrapolate: 'clamp',
              })}
              strokeDashoffset={-totalOffset}
            />
          )
        }

        currentSetIndex++
      }

      weekStartAngle += weekSegmentLength + weekGapSize
    }

    return null
  }

  const [displayPercent, setDisplayPercent] = useState(0)
  useEffect(() => {
    const id = sweep.addListener(({ value }) => {
      // Simplified percentage calculation based on completed sets vs total sets
      const percentage = totalSets > 0 ? (value / totalSets) * 100 : 0
      setDisplayPercent(Math.round(percentage))
    })
    return () => sweep.removeListener(id)
  }, [sweep, totalSets])

  // Create a flat array of all sets with their statuses
  const allSets = useMemo(() => {
    const sets: Array<{ status: 'completed' | 'failed' | 'pending'; setIndex: number; isTestingWeek?: boolean }> = []
    let globalSetIndex = 0
    weeks.forEach(week => {
      if (week.testing) {
        // For testing weeks, add one entry for the entire week
        const weekHasCompletedSets = week.sets.some(set => set === 'completed' || set === 'failed')
        if (weekHasCompletedSets) {
          sets.push({
            status: weekHasCompletedSets ? 'completed' : 'pending',
            setIndex: globalSetIndex,
            isTestingWeek: true,
          })
        }
        globalSetIndex += week.sets.length // Skip individual sets for testing weeks
      } else {
        // For non-testing weeks, add individual sets
        week.sets.forEach(setStatus => {
          sets.push({ status: setStatus, setIndex: globalSetIndex })
          globalSetIndex++
        })
      }
    })
    return sets
  }, [weeks])

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={[styles.svgContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
            {/* Background ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.background}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${circumference},0`}
              strokeDashoffset={0}
            />

            {/* Animated completed/failed sets */}
            {allSets.map((set, i) => {
              if (i >= completedSets) return null
              return renderAnimatedArc(set.setIndex, getStatusColor(set.status), set.isTestingWeek)
            })}
          </G>
        </Svg>
        {/* Center percentage and label */}
        <View style={styles.centerLabelContainer} pointerEvents="none">
          <Text style={styles.centerPercent}>{displayPercent}%</Text>
        </View>
        {/* Week labels positioned around the circle */}
        {weeks.map((week, i) => {
          const { x, y } = LABEL_POSITIONS[i]

          const isLeftSide = i >= 3
          const leftSideOffset = isLeftSide ? -40 : 0

          return (
            <Text
              key={week.title}
              style={[
                styles.labelText,
                {
                  position: 'absolute',
                  left: size / 2 + x + leftSideOffset,
                  top: size / 2 + y,
                },
              ]}
            >
              {week.title}
            </Text>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 40,
    width: '100%',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontFamily: theme.font.sairaSemiBold,
    textTransform: 'uppercase',
    color: theme.colors.text.primary,
    width: 50,
  },
  centerLabelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '37%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  centerPercent: {
    fontSize: 20,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
  },
})
