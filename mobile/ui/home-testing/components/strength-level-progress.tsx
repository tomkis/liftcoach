import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'

import { theme } from '@/mobile/theme/theme'

const STROKE_WIDTH = 12
const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface StrengthLevelProgressProps {
  strengthLevel: number // 0-100
  animate?: boolean
  size?: number
  showPercentage?: boolean
}

export const StrengthLevelProgress: React.FC<StrengthLevelProgressProps> = ({
  strengthLevel,
  animate = true,
  size = 200,
  showPercentage = true,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current
  const [displayPercent, setDisplayPercent] = useState(0)

  useEffect(() => {
    if (animate) {
      Animated.timing(progressAnimation, {
        toValue: strengthLevel,
        duration: 1500,
        useNativeDriver: false,
      }).start()
    } else {
      progressAnimation.setValue(strengthLevel)
    }
  }, [strengthLevel, animate, progressAnimation])

  useEffect(() => {
    const id = progressAnimation.addListener(({ value }) => {
      setDisplayPercent(Math.round(value))
    })
    return () => progressAnimation.removeListener(id)
  }, [progressAnimation])

  const centerX = size / 2
  const centerY = size / 2

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G rotation={-90} origin={`${centerX}, ${centerY}`}>
          {/* Background circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={RADIUS}
            stroke={theme.colors.newUi.background}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Progress circle */}
          <AnimatedCircle
            cx={centerX}
            cy={centerY}
            r={RADIUS}
            stroke={theme.colors.newUi.primary.main}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={progressAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: [`0,${CIRCUMFERENCE}`, `${CIRCUMFERENCE},0`],
              extrapolate: 'clamp',
            })}
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent} pointerEvents="none">
        {showPercentage && <Text style={styles.percentageText}>{displayPercent}%</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.text.primary,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 12,
    fontFamily: theme.font.sairaSemiBold,
    color: theme.colors.newUi.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
