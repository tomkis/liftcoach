import femaleImage from '@/assets/images/female-select.png'
import maleImage from '@/assets/images/male-select.png'
import { useCallback } from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { ScreenHeading } from '@/mobile/ui/ds/typography'
import { CaptionText } from '@/mobile/ui/ds/typography'
import { ThreeBlockScreen } from '@/mobile/ui/ds/layout'
import { theme } from '@/mobile/theme/theme'

import { useOnboardingContext } from '../hooks/use-onboarding-context'

const styles = StyleSheet.create({
  genderText: {
    color: theme.colors.text.primary,
    fontSize: 12,
    textAlign: 'center',
    margin: 16,
    fontFamily: theme.font.sairaSemiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descriptiveTextCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
})

export const GenderCardView = () => {
  const onboarding = useOnboardingContext()

  const onSelectMale = useCallback(() => {
    onboarding.setGender('male')
  }, [onboarding])

  const onSelectFemale = useCallback(() => {
    onboarding.setGender('female')
  }, [onboarding])

  return (
    <ThreeBlockScreen
      topContent={<ScreenHeading style={{ textAlign: 'center' }}>Who are you?</ScreenHeading>}
      middleContainerStyle={{ flex: 1 }}
      middleContent={
        <View style={{ flex: 1, flexDirection: 'row', gap: 17, marginHorizontal: 40 }}>
          <TouchableHighlight onPress={onSelectFemale} style={{ flex: 1 }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                alignContent: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <Image
                source={femaleImage}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderColor: theme.colors.primary.main,
                  borderWidth: 2,
                  borderRadius: 16,
                  position: 'absolute',
                }}
              />

              <Text style={styles.genderText}>Female</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={onSelectMale} style={{ flex: 1 }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: 16,
                borderWidth: 2,
                borderColor: theme.colors.primary.main,
                alignContent: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <Image
                source={maleImage}
                resizeMode="cover"
                style={{
                  width: '300%',
                  height: '300%',
                  position: 'absolute',
                  left: -117,
                  top: -237,
                }}
              />
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', '#000']}
                locations={[0.4513, 0.8267]}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              />

              <Text style={styles.genderText}>Male</Text>
            </View>
          </TouchableHighlight>
        </View>
      }
      bottomContent={
        <View style={styles.descriptiveTextCenter}>
          <CaptionText>
            While the training may be similar for both, knowing your gender helps us better understand and interpret
            your results.
          </CaptionText>
        </View>
      }
    />
  )
}
