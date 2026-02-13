import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'
import { BodyText } from '@/mobile/ui/ds/typography'
import { CardTitle } from '@/mobile/ui/ds/typography'

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.backgroundLight,
    ...theme.shadow.card,
    shadowColor: '#000',
    paddingBottom: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 4,
  },
  accentBar: {
    width: 3,
    height: 16,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.primary.main,
    marginRight: 8,
  },
  title: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
  },
  subTitleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.main,
  },
  subTitle: {
    fontSize: theme.fontSize.extraSmall,
    fontWeight: 'bold',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.primary.main,
  },
})

type AccentCardProps = {
  title?: string
  subTitle?: string
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  customHeader?: React.ReactNode
}

export const AccentCard = ({ title, subTitle, children, style, customHeader }: AccentCardProps) => {
  return (
    <View style={[styles.container, style]}>
      {customHeader ? (
        customHeader
      ) : (
        <>
          {title && (
            <View style={styles.headerContainer}>
              <View style={styles.accentBar} />
              <CardTitle style={styles.title}>{title}</CardTitle>
            </View>
          )}

          {subTitle && (
            <View style={styles.subTitleContainer}>
              <BodyText style={styles.subTitle}>{subTitle}</BodyText>
            </View>
          )}
        </>
      )}

      <View style={styles.contentContainer}>{children}</View>
    </View>
  )
}
