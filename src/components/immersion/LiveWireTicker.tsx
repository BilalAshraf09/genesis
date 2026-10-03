import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/colors';

const CABLES: Record<string, string[]> = {
  default: [
    'WIRE · desk confirms corridor traffic',
    'SIGINT · partial intercept, authenticity unverified',
    'DESK · capitals trading private notes',
    'FIELD · flashpoint markers warm on board',
    'OPS · window narrowing — commit posture',
  ],
  war: [
    'WIRE · mobilization rumors on open lines',
    'NAVAL · convoy chatter spiked',
    'DESK · allies ask for clarity within the hour',
    'FIELD · artillery map overlays conflict',
  ],
  politics: [
    'PRESS · overnight polls redraw the map',
    'PARTY · whip counts still soft',
    'WIRE · coalition partners demand brief',
    'CIVIC · street temperature rising',
  ],
  economy: [
    'MARKETS · overnight futures gap',
    'WIRE · treasury lines busy',
    'DESK · liquidity desks on watch',
    'FIELD · social calm meter twitching',
  ],
};

type Props = {
  year?: number;
  family?: string;
  urgency?: number;
  lines?: string[];
};

export function LiveWireTicker({ year, family, urgency = 0.3, lines }: Props) {
  const pool = useMemo(() => {
    if (lines?.length) return lines;
    if (family === 'politics') return CABLES.politics;
    if (family === 'economy') return CABLES.economy;
    if (year && year >= 1914 && year <= 1945) return CABLES.war;
    return CABLES.default;
  }, [lines, family, year]);

  const [idx, setIdx] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slide, {
        toValue: -12,
        duration: 220,
        useNativeDriver: false,
      }).start(() => {
        setIdx((i) => (i + 1) % pool.length);
        slide.setValue(10);
        Animated.timing(slide, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      });
    }, Math.max(2200, 4200 - urgency * 1800));
    return () => clearInterval(interval);
  }, [pool.length, urgency, slide]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  return (
    <View style={styles.wrap} nativeID="live-wire-ticker">
      <Animated.View style={[styles.dot, { opacity: glow }]} />
      <Text style={styles.kicker}>LIVE WIRE</Text>
      <Animated.Text
        style={[styles.line, { transform: [{ translateY: slide }], opacity: glow }]}
        numberOfLines={1}
      >
        {pool[idx]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(12, 26, 36, 0.92)',
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.alert,
  },
  kicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.amber,
  },
  line: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.chalkDim,
    letterSpacing: 0.3,
  },
});
