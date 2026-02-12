import { StyleSheet, Text } from 'react-native'

import { SectionHeading } from '@/mobile/ui/ds/typography'
import { ScrollableModal } from '@/mobile/ui/ds/modals'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  modalText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.text.primary,
    lineHeight: 20,
    marginBottom: 16,
  },
  emphasizedText: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.primary.main,
  },
})

export const TermsAndConditionsModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <ScrollableModal visible={visible} title="Terms and Conditions" onClose={onClose}>
      <Text style={styles.modalText}>
        Last updated: <Text style={styles.emphasizedText}>14.08.2025</Text>
      </Text>

      <Text style={styles.modalText}>
        Welcome to <Text style={styles.emphasizedText}>LiftCoach</Text>, your personal trainer in your pocket. By
        using this app, you agree to the following terms and conditions. Please read them carefully.
      </Text>

      <SectionHeading>Purpose of the App</SectionHeading>
      <Text style={styles.modalText}>
        LiftCoach is designed to help you <Text style={styles.emphasizedText}>build muscle and strength</Text>{' '}
        through structured, progressive training. The app generates workout plans, including{' '}
        <Text style={styles.emphasizedText}>recommended weights, reps, and overall programming</Text>, based on
        your performance over time.
      </Text>
      <Text style={styles.modalText}>
        However,{' '}
        <Text style={styles.emphasizedText}>
          LiftCoach does not supervise your workouts in real time, and cannot assess your physical condition or
          form.
        </Text>
      </Text>
      <SectionHeading>User Responsibility</SectionHeading>
      <Text style={styles.modalText}>By using LiftCoach, you agree that:</Text>

      <Text style={styles.modalText}>
        You are responsible for deciding whether a recommended weight is{' '}
        <Text style={styles.emphasizedText}>appropriate and safe</Text> for your current condition.
      </Text>
      <Text style={styles.modalText}>
        You must always assess whether a weight feels too heavy or risky, and reduce it if necessary.
      </Text>
      <Text style={styles.modalText}>
        You must use <Text style={styles.emphasizedText}>proper form</Text>, equipment, and judgment during all
        exercises.
      </Text>
      <Text style={styles.modalText}>
        You understand that the app does{' '}
        <Text style={styles.emphasizedText}>not replace a qualified coach or trainer</Text>.
      </Text>

      <SectionHeading>Medical Disclaimer</SectionHeading>

      <Text style={styles.modalText}>
        Before beginning any new exercise program, consult with a licensed physician, especially if you:
      </Text>

      <Text style={styles.modalText}>Have existing health issues or injuries.</Text>
      <Text style={styles.modalText}>Are pregnant or postpartum.</Text>
      <Text style={styles.modalText}>Are unsure about your readiness for strength training.</Text>

      <Text style={styles.modalText}>
        LiftCoach <Text style={styles.emphasizedText}>is not a medical device</Text> and does not provide medical
        or injury-related guidance.
      </Text>

      <SectionHeading>Eligibility</SectionHeading>
      <Text style={styles.modalText}>
        By using LiftCoach, you confirm that you are at least{' '}
        <Text style={styles.emphasizedText}>16 years of age</Text>. The app is not intended for children, and we
        do not knowingly collect data from anyone under 16.
      </Text>

      <SectionHeading>No Liability</SectionHeading>
      <Text style={styles.modalText}>
        By using LiftCoach, you acknowledge and agree that you use the service entirely at your own risk. To the
        maximum extent permitted by applicable law, the developers, owners, and operators of LiftCoach{' '}
        <Text style={styles.emphasizedText}>disclaim all liability</Text> for any damages, injuries, losses, or
        claims arising from:
      </Text>
      <Text style={styles.modalText}>• Use of the app or any workout recommendations</Text>
      <Text style={styles.modalText}>• Reliance on any information, advice, or guidance provided</Text>
      <Text style={styles.modalText}>• Any errors, bugs, or technical issues in the software</Text>
      <Text style={styles.modalText}>• Service interruptions, data loss, or system failures</Text>
      <Text style={styles.modalText}>• Any third-party content or external links</Text>
      <Text style={styles.modalText}>
        You are <Text style={styles.emphasizedText}>solely responsible</Text> for your physical safety, exercise
        execution, and any decisions made based on the app&apos;s recommendations.
      </Text>

      <SectionHeading>Software as Is</SectionHeading>
      <Text style={styles.modalText}>
        LiftCoach is provided{' '}
        <Text style={styles.emphasizedText}>&quot;as is&quot; and &quot;as available&quot;</Text> without any
        warranties of any kind, either express or implied. We make no guarantees regarding:
      </Text>
      <Text style={styles.modalText}>• The accuracy, completeness, or reliability of any information</Text>
      <Text style={styles.modalText}>• The availability, performance, or functionality of the service</Text>
      <Text style={styles.modalText}>• The suitability of workout recommendations for your specific needs</Text>
      <Text style={styles.modalText}>• The security of your data or privacy</Text>
      <Text style={styles.modalText}>• The absence of errors, bugs, or technical issues</Text>
      <Text style={styles.modalText}>
        We <Text style={styles.emphasizedText}>do not guarantee</Text> that the service will meet your
        requirements, operate without interruption, or be error-free.
      </Text>

      <SectionHeading>Service Termination</SectionHeading>
      <Text style={styles.modalText}>
        We reserve the right to <Text style={styles.emphasizedText}>terminate, suspend, or modify</Text> the
        LiftCoach service at any time, with or without notice, for any reason or no reason at all. This includes:
      </Text>
      <Text style={styles.modalText}>• Discontinuing the service entirely</Text>
      <Text style={styles.modalText}>• Suspending access for maintenance or updates</Text>
      <Text style={styles.modalText}>• Modifying features, functionality, or availability</Text>
      <Text style={styles.modalText}>• Changing pricing, terms, or conditions</Text>
      <Text style={styles.modalText}>
        You acknowledge that you have <Text style={styles.emphasizedText}>no right to continued access</Text> to
        the service and that we may cease operations at any time without liability to you.
      </Text>

      <SectionHeading>Changes to Terms</SectionHeading>
      <Text style={styles.modalText}>
        We may update these Terms of Use as the app evolves. If changes occur, we will notify users via the email.
      </Text>

      <SectionHeading>Contact Us</SectionHeading>
      <Text style={styles.modalText}>Questions? Reach us at: info@liftcoach.net</Text>
    </ScrollableModal>
  )
}
