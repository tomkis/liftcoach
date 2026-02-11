import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { theme } from '@/mobile/theme/theme'
import { Paragraph } from '@/mobile/ui/components/paragraph'
import { Title } from '@/mobile/ui/components/title'

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.newUi.backgroundLight,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: theme.colors.newUi.primary.main,
    marginRight: 8,
  },
  title: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaBold,
    textTransform: 'uppercase',
  },
  subTitleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.newUi.primary.main,
  },
  subTitle: {
    fontSize: theme.fontSize.extraSmall,
    fontWeight: 'bold',
    fontFamily: theme.font.sairaRegular,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.newUi.primary.main,
  },
})

type DashboardCardProps = {
  title?: string
  subTitle?: string
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  customHeader?: React.ReactNode
}

export const DashboardCard = ({ title, subTitle, children, style, customHeader }: DashboardCardProps) => {
  return (
    <View style={[styles.container, style]}>
      {customHeader ? (
        customHeader
      ) : (
        <>
          {title && (
            <View style={styles.headerContainer}>
              <View style={styles.accentBar} />
              <Title style={styles.title}>{title}</Title>
            </View>
          )}

          {subTitle && (
            <View style={styles.subTitleContainer}>
              <Paragraph style={styles.subTitle}>{subTitle}</Paragraph>
            </View>
          )}
        </>
      )}

      <View style={styles.contentContainer}>{children}</View>
    </View>
  )
}
