import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, space } from '@/theme/colors';

type Section = { title: string; body: string };

const SECTIONS: Section[] = [
  {
    title: '1. Overview',
    body: 'Genesis is a historical decision / strategy game. This policy explains what information the app handles, how purchases and subscriptions work, and what choices you have.',
  },
  {
    title: '2. Accounts and authentication (current build)',
    body: 'Today Genesis uses local (on-device) authentication. You may create an account with an email address and password to deploy into theaters. Credentials and session data are stored on your device using platform secure storage where available (SecureStore on native; local storage on web demos). Passwords are stored as a local hash, not as plaintext. There is no Genesis cloud account server in the current build. Uninstalling the app or clearing app data removes local account data. If authentication is later moved to a provider such as Supabase or Firebase, that provider’s processing will apply; this policy should be updated and the Play Data safety form revised before that release ships.',
  },
  {
    title: '3. Game progress and preferences',
    body: 'We store on your device information needed to run the game, for example: which theaters you have played and Pro / entitlement status; retention features (streaks, Crisis of the Day state); endings / mastery progress, leaderboard personal bests (local), invite/deep-link handling; and UI preferences such as audio mute. This data stays on device unless a future update adds an optional cloud sync (not present today).',
  },
  {
    title: '4. Notifications',
    body: 'Crisis / reminder notifications are optional. The app requests notification permission only when you enable reminders. You can revoke permission in system settings. We do not use notifications for unrelated advertising in the current build.',
  },
  {
    title: '5. Purchases and subscriptions (Google Play and RevenueCat)',
    body: 'Paid access uses Google Play Billing, mediated by RevenueCat when configured. Entitlement: genesis_pro (full timeline access). Offerings may include lifetime, yearly, and monthly plans (exact product IDs and prices are shown in the Play purchase sheet / in-app RevenueCat Paywall). You can manage or cancel auto-renewing subscriptions in Google Play → Payments & subscriptions, or via the in-app Customer Center when that UI is enabled. Payment details are processed by Google. RevenueCat validates entitlements and restore state. Google and RevenueCat process purchase tokens and related identifiers under their own policies. Genesis does not receive your full payment card number. Use restore / Customer Center flows if you reinstall or change devices while Pro is active.',
  },
  {
    title: '6. Optional AI evaluation (OpenAI)',
    body: 'If the developer enables an OpenAI API key in the build configuration, end-of-run evaluations may send gameplay context (scenario choices / scores — not your password) to OpenAI over HTTPS to generate text feedback. If that key is not configured, Genesis uses a built-in on-device / mock evaluator and no evaluation traffic leaves the device for that feature.',
  },
  {
    title: '7. Analytics and crash reporting',
    body: 'The current first-party app code does not ship a separate advertising SDK. Google Play may collect standard install / vitals / crash information when you install from Play. RevenueCat and Google Play Billing may collect technical data required to operate purchases and subscriptions (see their documentation).',
  },
  {
    title: '8. Data we do not collect (current build)',
    body: 'Genesis does not request access to: precise or approximate location; camera, microphone, or photos; contacts or SMS; health or fitness data.',
  },
  {
    title: '9. Children',
    body: 'Genesis is intended for a general audience comfortable with historical conflict themes as strategy subject matter. It is not directed at children under 13. Do not create an account for a child under 13.',
  },
  {
    title: '10. Retention',
    body: 'On-device data is retained until you clear app storage or uninstall. Purchase / subscription records are retained by Google / RevenueCat as required to provide the entitlement and for legal/accounting purposes. Optional OpenAI requests are subject to OpenAI’s retention practices when that feature is enabled.',
  },
  {
    title: '11. Your choices',
    body: 'Play without purchasing; free theaters remain available after sign-in. Decline notification permission. Clear local data / uninstall to remove on-device account and progress. Manage or cancel Play subscriptions in Google Play (or Customer Center when available). Contact the developer (below) for privacy questions. When cloud accounts exist, a deletion request path will be documented here.',
  },
  {
    title: '12. Security',
    body: 'We use platform secure storage for session secrets on native builds and HTTPS for any network features that are enabled (Play, RevenueCat, optional OpenAI, future auth backends). No method of transmission or storage is 100% secure.',
  },
  {
    title: '13. Changes',
    body: 'We may update this policy when the app’s data practices change (for example, adding cloud auth or changing subscription offerings). The “Last updated” date will change; material changes should also be reflected in the Play Data safety form.',
  },
  {
    title: '14. Contact',
    body: 'Developer: Bilal Ashraf. App package: com.bilalashraf.genesis. Email: add the address you will monitor before publishing this page to a public HTTPS host for Play Console.',
  },
];

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Policy', headerShown: true }} />
      <View style={styles.root}>
        <LinearGradient colors={[colors.void, colors.deep]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe} edges={['bottom']}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.brand}>GENESIS</Text>
            <Text style={styles.h1}>Privacy Policy</Text>
            <Text style={styles.meta}>
              Last updated: 24 September 2026 · App: Genesis (com.bilalashraf.genesis) · Developer:
              Bilal Ashraf
            </Text>
            {SECTIONS.map((s) => (
              <View key={s.title} style={styles.section}>
                <Text style={styles.h2}>{s.title}</Text>
                <Text style={styles.body}>{s.body}</Text>
              </View>
            ))}
            <Text style={styles.footer}>
              This in-app copy mirrors the hosted policy used for Google Play. Prefer the HTTPS URL
              you publish from public/privacy.html when filling Play Console.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xl * 2,
    gap: space.md,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.cyan,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.chalk,
    letterSpacing: 1,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.mist,
    marginBottom: space.sm,
  },
  section: { gap: space.xs },
  h2: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.cyanHot,
    letterSpacing: 0.3,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.chalkDim,
  },
  footer: {
    marginTop: space.lg,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.fog,
  },
});
