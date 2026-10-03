import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { useAccount } from '@/account/AccountProvider';
import { colors, fonts } from '@/theme/colors';

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [isSignup, setIsSignup] = useState(mode !== 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const account = useAccount();
  const router = useRouter();

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      if (isSignup) await account.signup(email, password);
      else await account.login(email, password);
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auth failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: isSignup ? 'Sign up' : 'Sign in' }} />
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient colors={[colors.void, colors.deep]} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.badge}>MOCK AUTH · LOCAL SANDBOX</Text>
          <Text style={styles.h1}>{isSignup ? 'CREATE DESK' : 'RETURN TO DESK'}</Text>
          <Text style={styles.body}>
            Email/password accounts persist on this device. Production builds swap this mock for
            Supabase or Firebase Auth — see README.
          </Text>
          <Text style={styles.hint}>
            Freemium: {account.freeLimit} theaters free, then ${account.unlockPriceUsd} once unlocks
            all remaining forever.
          </Text>

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            nativeID="auth-email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.fog}
            style={styles.input}
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            nativeID="auth-password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.fog}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label={busy ? 'Working…' : isSignup ? 'Sign up' : 'Sign in'}
            onPress={submit}
            disabled={busy || !email || password.length < 6}
          />
          <Button
            label={isSignup ? 'Have an account? Sign in' : 'Need an account? Sign up'}
            variant="ghost"
            onPress={() => {
              setIsSignup((v) => !v);
              setError(null);
            }}
          />
          <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  scroll: { padding: 20, gap: 10, paddingBottom: 48 },
  badge: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.alert,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.chalk,
    letterSpacing: 1,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalkDim,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.mist,
    marginBottom: 8,
  },
  label: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.fog,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    color: colors.chalk,
    fontFamily: fonts.body,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.alert,
    fontSize: 13,
  },
});
