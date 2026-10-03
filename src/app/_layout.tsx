import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import {
  Orbitron_600SemiBold,
  Orbitron_700Bold,
} from '@expo-google-fonts/orbitron';
import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
} from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { GameProvider } from '@/context/GameContext';
import { SoundProvider } from '@/audio/SoundProvider';
import { AccountProvider } from '@/account/AccountProvider';
import { BillingProviderHost } from '@/billing/BillingProvider';
import { RetentionProvider } from '@/retention/RetentionProvider';
import { parseInviteUrl } from '@/lib/inviteLinks';
import { colors, fonts } from '@/theme/colors';

/** Cold-start + runtime deep links → /invite. */
function InviteLinkBridge() {
  const router = useRouter();

  useEffect(() => {
    const go = (url: string | null) => {
      if (!url) return;
      const invite = parseInviteUrl(url);
      if (!invite) return;
      const q = new URLSearchParams({
        from: invite.from,
        theater: invite.theater,
        score: String(invite.score),
        path: invite.path,
      });
      if (invite.year) q.set('year', String(invite.year));
      if (invite.title) q.set('title', invite.title);
      router.push(`/invite?${q.toString()}`);
    };

    void Linking.getInitialURL().then(go);
    const sub = Linking.addEventListener('url', ({ url }) => go(url));
    return () => sub.remove();
  }, [router]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.void, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.cyan} />
      </View>
    );
  }

  return (
    <AccountProvider>
      <BillingProviderHost>
        <RetentionProvider>
          <SoundProvider>
            <GameProvider>
              <StatusBar style="light" />
              <InviteLinkBridge />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.deep },
                  headerTintColor: colors.chalk,
                  headerTitleStyle: { fontFamily: fonts.bodyBold, fontSize: 14 },
                  headerShadowVisible: false,
                  contentStyle: { backgroundColor: colors.void },
                  animation: 'fade',
                }}
              >
                <Stack.Screen name="index" options={{ title: 'Genesis', headerShown: false }} />
                <Stack.Screen name="auth" options={{ title: 'Account' }} />
                <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
                <Stack.Screen name="invite" options={{ title: 'Challenge', headerShown: false }} />
                <Stack.Screen name="endings" options={{ title: 'Endings', headerShown: false }} />
                <Stack.Screen
                  name="leaderboard"
                  options={{ title: 'Leaderboard', headerShown: false }}
                />
                <Stack.Screen name="scenario/[id]" options={{ title: 'Theater', headerShown: false }} />
                <Stack.Screen
                  name="evaluation"
                  options={{ title: 'After-Action', headerBackVisible: false, headerShown: false }}
                />
              </Stack>
            </GameProvider>
          </SoundProvider>
        </RetentionProvider>
      </BillingProviderHost>
    </AccountProvider>
  );
}
