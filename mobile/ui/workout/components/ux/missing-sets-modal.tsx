import { StyleSheet, Text, View } from 'react-native'

import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { ModalShell } from '@/mobile/ui/ds/modals'
import { BodyText } from '@/mobile/ui/ds/typography'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  intro: {
    marginBottom: 12,
    lineHeight: 22,
  },
  list: {
    marginBottom: 16,
    gap: 6,
  },
  bullet: {
    color: theme.colors.text.primary,
    fontFamily: theme.font.sairaBold,
    fontSize: theme.fontSize.medium,
  },
  buttons: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
})

interface MissingSetsModalProps {
  visible: boolean
  exerciseNames: string[]
  onClose: () => void
}

export const MissingSetsModal = ({ visible, exerciseNames, onClose }: MissingSetsModalProps) => {
  return (
    <ModalShell visible={visible} title="Almost There!">
      <BodyText style={styles.intro}>
        Log every set with weight and reps, and mark each one done or failed before finishing your workout.
      </BodyText>
      <BodyText style={styles.intro}>Still to finish:</BodyText>
      <View style={styles.list}>
        {exerciseNames.map(name => (
          <Text key={name} style={styles.bullet}>
            • {name}
          </Text>
        ))}
      </View>
      <View style={styles.buttons}>
        <PrimaryButton title="Back to Workout" onPress={onClose} />
      </View>
    </ModalShell>
  )
}
