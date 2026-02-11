import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useMixpanel } from '@/mobile/ui/tracking/with-mixpanel'
import { theme } from '@/mobile/theme/theme'
import Calendar from '@/mobile/ui/icons/calendar'
import CalendarFilled from '@/mobile/ui/icons/calendar-filled'
import Home from '@/mobile/ui/icons/home'
import HomeFilled from '@/mobile/ui/icons/home-filled'
import WorkoutStretching from '@/mobile/ui/icons/workout-stretching'
import WorkoutStretchingFilled from '@/mobile/ui/icons/workout-stretching-filled'

const ACCENT_COLOR = theme.colors.newUi.primary.main // gold/yellow accent
const INACTIVE_ICON = theme.colors.lightGray || '#bdbdbd'

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.newUi.background,
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
  const mixpanel = useMixpanel()

  return (
    <View style={[styles.menuContainer, { paddingBottom: safeInsets.bottom }]}>
      <MenuIcon
        NonActiveIcon={Home}
        ActiveIcon={HomeFilled}
        text="Home"
        active={navigationState.index === 0}
        onPress={() => {
          mixpanel.menuItemPressed('MicrocycleProgress')
          props.navigation.navigate('MicrocycleProgress')
        }}
      />
      <MenuIcon
        NonActiveIcon={WorkoutStretching}
        ActiveIcon={WorkoutStretchingFilled}
        text="Workout"
        active={navigationState.index === 1}
        onPress={() => {
          mixpanel.menuItemPressed('Workout')
          props.navigation.navigate('Workout')
        }}
      />
      <MenuIcon
        NonActiveIcon={Calendar}
        ActiveIcon={CalendarFilled}
        text="Planning"
        active={navigationState.index === 2}
        onPress={() => {
          mixpanel.menuItemPressed('Planning')
          props.navigation.navigate('Planning')
        }}
      />
    </View>
  )
}
