import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WorldCourseVisual, type Branch } from '@/components/WorldCourseVisual';
import { buildShareableInviteLine } from '@/lib/inviteLinks';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  visible: boolean;
  title: string;
  detail: string;
  markerLabel?: string;
  year?: number;
  branches?: Branch[];
  /** Mid-run viral challenge — still works with invite/share */
  theaterId?: string;
  theaterTitle?: string;
  moveIndex?: number;
  moveTotal?: number;
  /** User must dismiss — no auto-skip, no timer bar */
  onContinue: () => void;
};

/**
 * Resolve popup — readable consequence beat + shareable WORLD COURSE LOCKED strip.
 * Stays until the player taps Continue. No countdown / progress bar.
 */
export function ResolveBeat({
  visible,
  title,
  detail,
  markerLabel,
  year,
  branches,
  theaterId,
  theaterTitle,
  moveIndex,
  moveTotal,
  onContinue,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const punch = useRef(new Animated.Value(1)).current;
  const [ready, setReady] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const continued = useRef(false);

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      scale.setValue(0.92);
      flash.setValue(0);
      punch.setValue(1);
      setReady(false);
      setShareHint(null);
      continued.current = false;
      return;
    }

    continued.current = false;
    setReady(false);
    setShareHint(null);
    flash.setValue(1);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, friction: 7, tension: 70, useNativeDriver: false }),
      Animated.sequence([
        Animated.timing(punch, { toValue: 1.03, duration: 120, useNativeDriver: false }),
        Animated.timing(punch, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(flash, { toValue: 0, duration: 520, useNativeDriver: false }),
    ]).start();

    const unlock = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(unlock);
  }, [visible, detail, opacity, scale, flash, punch]);

  const onShareChallenge = useCallback(async () => {
    if (!theaterId) return;
    const line = buildShareableInviteLine({
      from: 'mid-run',
      theaterId,
      score: Math.max(1, (moveIndex ?? 1) * 11),
      pathFamily: markerLabel?.replace(/\s+/g, '_') ?? 'fork',
      year,
      title: theaterTitle ?? title,
    });
    const message = [
      `GENESIS · WORLD COURSE LOCKED`,
      theaterTitle ? `${theaterTitle}${year ? ` · ${year}` : ''}` : null,
      moveIndex && moveTotal ? `OBJ ${moveIndex}/${moveTotal}` : null,
      `Order: ${title}`,
      '',
      `Beat this fork — same theater.`,
      line,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        setShareHint('CHALLENGE COPIED');
        return;
      }
      await Share.share({ message, title: 'Genesis — challenge' });
      setShareHint('CHALLENGE SENT');
    } catch {
      setShareHint('SHARE FAILED — RETRY');
    }
  }, [theaterId, theaterTitle, title, year, markerLabel, moveIndex, moveTotal]);

  if (!visible) return null;

  const dismiss = () => {
    if (!ready || continued.current) return;
    continued.current = true;
    onContinue();
  };

  return (
    <Animated.View
      style={[styles.overlay, { opacity, transform: [{ scale: punch }] }]}
      nativeID="resolve-beat"
    >
      <View style={styles.overlayInner}>
        <Animated.View
          style={[
            styles.flash,
            {
              opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] }),
            },
          ]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['rgba(5,7,12,0.4)', 'rgba(5,7,12,0.92)', 'rgba(5,7,12,0.97)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Dismiss backdrop" />
        <Animated.View style={[styles.card, { transform: [{ scale }] }]} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(32,48,72,0.98)', 'rgba(10,14,24,0.99)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardEdge} />
          <Text style={styles.kicker}>
            {year ? `${year} · ` : ''}WORLD COURSE LOCKED
          </Text>
          {markerLabel ? (
            <Text style={styles.marker}>{markerLabel.toUpperCase()}</Text>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.detail}>{detail}</Text>
          {branches?.length ? (
            <WorldCourseVisual year={year ?? 1900} branches={branches} compact />
          ) : null}

          {theaterId ? (
            <Pressable
              onPress={() => {
                void onShareChallenge();
              }}
              style={styles.viral}
              accessibilityRole="button"
              accessibilityLabel="Challenge a rival on this fork"
              nativeID="resolve-viral-share"
            >
              <Text style={styles.viralKicker}>VIRAL BEAT</Text>
              <Text style={styles.viralTitle}>CHALLENGE A RIVAL</Text>
              <Text style={styles.viralBody}>
                Same theater · this fork · beat your order
              </Text>
              <Text style={styles.viralCta}>{shareHint ?? 'COPY CHALLENGE LINK'}</Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={dismiss}
            style={[styles.continueBtn, ready && styles.continueReady]}
            accessibilityRole="button"
            accessibilityLabel="Continue to next move"
          >
            <Text style={[styles.footer, ready && styles.footerReady]}>
              {ready ? 'TAP TO CONTINUE' : '…'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    padding: 20,
  },
  overlayInner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  flash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.amberHot,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.lg,
    padding: 22,
    gap: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardEdge: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: 'rgba(255,255,255,0.18)',
    borderBottomColor: 'rgba(0,0,0,0.4)',
  },
  kicker: {
    fontFamily: fonts.displayMed,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.amberHot,
  },
  marker: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyan,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    color: colors.chalk,
    letterSpacing: 1,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.chalkDim,
  },
  viral: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.lineGold,
    backgroundColor: 'rgba(40,28,10,0.55)',
    gap: 2,
  },
  viralKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.goldInk,
  },
  viralTitle: {
    fontFamily: fonts.displayMed,
    fontSize: 14,
    letterSpacing: 1.2,
    color: colors.amberHot,
  },
  viralBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.chalkDim,
  },
  viralCta: {
    marginTop: 6,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.cyanHot,
  },
  continueBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46,230,200,0.35)',
    backgroundColor: 'rgba(5,7,12,0.55)',
    borderRadius: radii.sm,
  },
  continueReady: {
    borderColor: colors.cyanHot,
    backgroundColor: 'rgba(46,230,200,0.14)',
  },
  footer: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.mist,
    textAlign: 'center',
  },
  footerReady: {
    color: colors.cyanHot,
    fontFamily: fonts.bodyBold,
  },
});
