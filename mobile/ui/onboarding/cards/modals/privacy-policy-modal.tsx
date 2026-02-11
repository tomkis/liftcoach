import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Title } from '@/mobile/ui/onboarding/cards/ux/headings'
import { SecondaryButton } from '@/mobile/ui/onboarding/cards/ux/secondary-button'
import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  modalText: {
    fontSize: theme.fontSize.small,
    fontFamily: theme.font.sairaRegular,
    color: theme.colors.newUi.text.primary,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  emphasizedText: {
    fontFamily: theme.font.sairaBold,
    color: theme.colors.newUi.primary.main,
  },
})

export const PrivacyPolicyModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Title style={styles.modalTitle}>Privacy Policy</Title>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalText}>
              At LiftCoach, we take your privacy seriously. This policy explains what personal data we collect, how we
              use it, and your rights under the General Data Protection Regulation (GDPR).
            </Text>
            <Title>Who We Are</Title>
            <Text style={styles.modalText}>
              LiftCoach is a strength training app designed to help users track and improve their performance through
              structured programs. If you have any questions about this policy, you can contact us at: liftcoach.net
            </Text>
            <Title>What Data We Collect</Title>
            <Text style={styles.modalText}>We collect the following data:</Text>
            <Text style={styles.modalText}>
              <Text style={styles.emphasizedText}>User profile data</Text>: all data you provide when signing up, such
              as weight, body fat, height, personal records etc.
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.emphasizedText}>Training data</Text>: exercises performed, sets, reps, weight used,
              rest times, etc.
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.emphasizedText}>User Account Info</Text>: email address to identify your profile
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.emphasizedText}>App Usage Data (anonymized)</Text> We collect anonymized information
              about how you interact with the app, such as: which features are used, screen visits and tap flows, Crash
              logs
            </Text>
            <Title>Why We Collect This Data</Title>
            <Text style={styles.modalText}>We use the above data to:</Text>
            <Text style={styles.modalText}>
              Store and sync your training history Adapt your training plan over time Improve app features based on user
              behavior Debug errors and crashes Make informed product decisions and improvements We do not use this data
              for advertising purposes, nor do we share it with advertisers.
            </Text>

            <Title>Legal Basis for Processing</Title>
            <Text style={styles.modalText}>Under the GDPR, our legal bases for processing your data are:</Text>
            <Text style={styles.modalText}>Consent: You agree to this Privacy Policy during sign-up.</Text>
            <Text style={styles.modalText}>Legitimate interest: We collect usage data to improve the app.</Text>
            <Text style={styles.modalText}>
              Contract: Storing your training data is essential to provide the app’s core features.
            </Text>

            <Title>How We Store and Protect Your Data</Title>
            <Text style={styles.modalText}>Training and usage data is securely stored on our servers.</Text>
            <Text style={styles.modalText}>Data is encrypted in transit (HTTPS) and at rest.</Text>
            <Text style={styles.modalText}>We follow industry best practices to prevent unauthorized access.</Text>

            <Title>Your Rights (Under GDPR)</Title>
            <Text style={styles.modalText}>Access your data</Text>
            <Text style={styles.modalText}>Correct inaccurate data</Text>
            <Text style={styles.modalText}>Delete your account and associated data</Text>
            <Text style={styles.modalText}>Withdraw consent</Text>
            <Text style={styles.modalText}>Export your data (data portability)</Text>
            <Text style={styles.modalText}>File a complaint with a supervisory authority</Text>

            <Text style={styles.modalText}>To exercise these rights, contact us at: privacy@liftcoach.net</Text>

            <Title>How Long We Keep Your Data</Title>
            <Text style={styles.modalText}>Training and usage data is retained as long as your account is active.</Text>
            <Text style={styles.modalText}>You can request permanent deletion at any time.</Text>

            <Title>Third-Party Services</Title>
            <Text style={styles.modalText}>
              We may use trusted third-party tools to collect analytics and manage cloud storage. These services process
              data under strict GDPR-compliant agreements and do not use your data for their own purposes.
            </Text>

            <Title>Analytics and Third-Party Tools</Title>
            <Text style={styles.modalText}>
              We use Sentry and Mixpanel, a third-party analytics provider, to help us understand how users interact
              with LiftCoach. This helps us improve the app&apos;s features, performance, and usability.
            </Text>
            <Text style={styles.modalText}>Mixpanel collects:</Text>
            <Text style={styles.modalText}>Events and app usage patterns</Text>
            <Text style={styles.modalText}>Anonymized device and session information</Text>
            <Text style={styles.modalText}>
              A unique user identifier (not your real name or email unless you explicitly provide it)
            </Text>
            <Text style={styles.modalText}>
              If you create an account, we may associate your usage data with your user ID to personalize your
              experience and improve the app.
            </Text>

            <Text style={styles.modalText}>
              <Text style={styles.emphasizedText}>Sentry</Text>: Used for error monitoring and crash reporting. It helps
              us identify bugs, crashes, and technical issues in the app.
            </Text>
            <Text style={styles.modalText}>Sentry collects:</Text>
            <Text style={styles.modalText}>• Crash logs and error messages</Text>
            <Text style={styles.modalText}>• Device and OS version</Text>
            <Text style={styles.modalText}>• Stack traces and app version</Text>
            <Text style={styles.modalText}>
              Sentry may collect anonymized technical context about the error, but it does not access personal or
              training data.
            </Text>

            <Text style={styles.modalText}>You may request to</Text>
            <Text style={styles.modalText}>Opt out of analytics tracking</Text>
            <Text style={styles.modalText}>Request deletion of your Sentry or Mixpanel tracked data</Text>
            <Text style={styles.modalText}>To do so, contact us at: privacy@liftcoach.net</Text>

            <Title>Changes to This Policy</Title>
            <Text style={styles.modalText}>
              We may update this Privacy Policy as needed. Major changes will be announced via email.
            </Text>

            <Title>Contact Us</Title>
            <Text style={styles.modalText}>Questions? Reach us at: privacy@liftcoach.net</Text>
          </ScrollView>

          <View style={styles.modalButtons}>
            <SecondaryButton title="Close" onPress={onClose} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
