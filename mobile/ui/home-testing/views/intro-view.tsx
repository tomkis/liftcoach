import workoutImage from '@/assets/images/backpack.png'
import { useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useHomeTestingNavigation } from '@/mobile/ui/home-testing/use-navigation'
import { degToStartEnd } from '@/mobile/ui/onboarding/cards/ux/deg-to-start'
import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { CaptionText } from '@/mobile/ui/ds/typography'
import { ThreeBlockScreen } from '@/mobile/ui/ds/layout'
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { OutlineButton } from '@/mobile/ui/ds/buttons'
import { HorizontalButtonRow } from '@/mobile/ui/ds/layout'
import { KeyboardScreen } from '@/mobile/ui/ds/layout'
import { trpc } from '@/mobile/trpc'

const styles = StyleSheet.create({
  imageContainer: {
    flex: 3,
    flexDirection: 'row',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export const IntroView = () => {
  const insets = useSafeAreaInsets()
  const navigation = useHomeTestingNavigation()
  const { mutateAsync: skipStrengthTest } = trpc.user.skipStrengthTest.useMutation()
  const utils = trpc.useUtils()

  const notNow = useCallback(async () => {
    await skipStrengthTest()
    await utils.user.me.invalidate()

    navigation.getParent()?.navigate('TabNavigator')
  }, [navigation, skipStrengthTest, utils.user.me])

  return (
    <KeyboardScreen>
      <ThreeBlockScreen
        topContent={
          <ScreenHeading style={{ textAlign: 'center', marginTop: insets.top }}>Test your strength now</ScreenHeading>
        }
        middleContainerStyle={{ flex: 1.5 }}
        middleContent={
          <View style={styles.imageContainer}>
            <Image source={workoutImage} style={styles.image} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 1)']}
              locations={[0.8263, 0.9485]}
              start={degToStartEnd(12).start}
              end={degToStartEnd(12).end}
              style={styles.gradientOverlay}
            />
            <LinearGradient
              colors={['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 1)']}
              locations={[0.69, 0.89]}
              start={degToStartEnd(332).start}
              end={degToStartEnd(332).end}
              style={[styles.gradientOverlay]}
            />
            <LinearGradient
              colors={[
                'rgba(18, 18, 18, 1)',
                'rgba(18, 18, 18, 0.07)',
                'rgba(18, 18, 18, 0.00)',
                'rgba(18, 18, 18, 1)',
              ]}
              locations={[0, 0.0765, 0.6083, 1]}
              start={degToStartEnd(90).start}
              end={degToStartEnd(90).end}
              style={styles.gradientOverlay}
            />
          </View>
        }
        bottomContent={
          <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 30 }}>
            <CaptionText>
              This quick workout takes less than 30 minutes. All you need is your bodyweight, towel, a backpack (loaded
              with bottles or books), and a chair or sofa.
            </CaptionText>
            <HorizontalButtonRow>
              <OutlineButton title="Maybe Later" onPress={notNow} />
              <PrimaryButton
                title="Lets do the test!"
                onPress={() => {
                  navigation.navigate('TestStrength')
                }}
              />
            </HorizontalButtonRow>
          </View>
        }
      />
    </KeyboardScreen>
  )
}
