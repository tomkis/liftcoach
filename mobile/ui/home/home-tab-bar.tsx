import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { theme } from '@/mobile/theme/theme'
import Clipboard from '@/mobile/ui/icons/clipboard'
import ClipboardFilled from '@/mobile/ui/icons/clipboard-filled'
import Home from '@/mobile/ui/icons/home'
import HomeFilled from '@/mobile/ui/icons/home-filled'
import WorkoutStretching from '@/mobile/ui/icons/workout-stretching'
import WorkoutStretchingFilled from '@/mobile/ui/icons/workout-stretching-filled'
import { useTracking } from '@/mobile/ui/tracking/tracking'

const ACCENT_COLOR = theme.colors.primary.main // gold/yellow accent
const INACTIVE_ICON = '#e0e0e0'

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  menuIconWrapper: {
    flex: 0,
    width: 80,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: ACCENT_COLOR,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 26,
    letterSpacing: 0.8,
    fontFamily: theme.font.sairaSemiBold,
  },
  textHidden: {
    display: 'none',
  },
})

const AnimatedText = Animated.Text

const MenuIcon = ({
  NonActiveIcon,
  ActiveIcon,
  text,
  active,
  onPress,
}: {
  NonActiveIcon: React.FC<{ color: string }>
  ActiveIcon: React.FC<{ color: string }>
  text: string
  active: boolean
  onPress: () => void
}) => {
  // Animation values
  const textOpacity = useRef(new Animated.Value(active ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [active, textOpacity])

  return (
    <View style={styles.menuIconWrapper}>
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={styles.icon}>
          {active ? <ActiveIcon color={ACCENT_COLOR} /> : <NonActiveIcon color={INACTIVE_ICON} />}
        </View>
        <AnimatedText style={[styles.text, { opacity: textOpacity }]} numberOfLines={1} ellipsizeMode="tail">
          {text}
        </AnimatedText>
      </Pressable>
    </View>
  )
}

export const HomeTabBar = (props: BottomTabBarProps) => {
  const navigationState = props.navigation.getState()
  const safeInsets = useSafeAreaInsets()
  const tracking = useTracking()

  return (
    <View style={[styles.menuContainer, { paddingBottom: safeInsets.bottom }]}>
      <MenuIcon
        NonActiveIcon={Home}
        ActiveIcon={HomeFilled}
        text="Home"
        active={navigationState.index === 0}
        onPress={() => {
          tracking.menuItemPressed('MicrocycleProgress')
          props.navigation.navigate('MicrocycleProgress')
        }}
      />
      <MenuIcon
        NonActiveIcon={WorkoutStretching}
        ActiveIcon={WorkoutStretchingFilled}
        text="Workout"
        active={navigationState.index === 1}
        onPress={() => {
          tracking.menuItemPressed('Workout')
          props.navigation.navigate('Workout')
        }}
      />
      <MenuIcon
        NonActiveIcon={Clipboard}
        ActiveIcon={ClipboardFilled}
        text="Plan"
        active={navigationState.index === 2}
        onPress={() => {
          tracking.menuItemPressed('Planning')
          props.navigation.navigate('Planning')
        }}
      />
    </View>
  )
}
