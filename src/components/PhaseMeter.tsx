import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/colors';

type Props = {
  phase: number;
  total: number;
  label?: string;
};

export function PhaseMeter({ phase, total, label }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.kicker}>{label ?? 'COMMAND PHASE'}</Text>
        <Text style={styles.count}>
          {phase} / {total}
        </Text>
      </View>
      <View style={styles.rail}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.seg,
              i < phase ? styles.segOn : styles.segOff,
              i === phase - 1 && styles.segCurrent,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.amber,
  },
  count: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.chalk,
    letterSpacing: 1,
  },
  rail: {
    flexDirection: 'row',
    gap: 5,
  },
  seg: {
    flex: 1,
    height: 6,
  },
  segOn: {
    backgroundColor: colors.teal,
  },
  segOff: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  segCurrent: {
    backgroundColor: colors.amberHot,
  },
});
