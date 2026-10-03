import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { LiveMeter } from '@/lib/liveMeters';
import { colors, fonts } from '@/theme/colors';

type Props = {
  meters: LiveMeter[];
  compact?: boolean;
};

function MeterBar({ meter }: { meter: LiveMeter }) {
  const width = useRef(new Animated.Value(meter.value)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: meter.value,
      duration: 420,
      useNativeDriver: false,
    }).start();
  }, [meter.value, width]);

  const fill =
    meter.tone === 'hot'
      ? colors.alert
      : meter.tone === 'warn'
        ? colors.amber
        : meter.tone === 'good'
          ? colors.tealBright
          : colors.mist;

  return (
    <View style={styles.meter}>
      <View style={styles.meterHead}>
        <Text style={styles.meterLabel}>{meter.label}</Text>
        <Text style={[styles.meterValue, { color: fill }]}>{Math.round(meter.value)}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fill,
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

export function AxisHud({ meters, compact }: Props) {
  return (
    <View style={[styles.hud, compact && styles.hudCompact]}>
      <Text style={styles.hudTitle}>THEATER METRICS</Text>
      <View style={styles.grid}>
        {meters.map((m) => (
          <MeterBar key={m.id} meter={m} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 10,
  },
  hudCompact: {
    padding: 10,
  },
  hudTitle: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.chalkDim,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  meter: {
    width: '47%',
    gap: 4,
  },
  meterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meterLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.chalk,
    letterSpacing: 0.4,
  },
  meterValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  track: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 5,
  },
});
