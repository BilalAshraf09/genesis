import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, RadialGradient, Stop, Polygon } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { choiceOps, type TheaterDef } from '@/data/theaters';
import { geoForScenario, geoForTheaterId } from '@/maps/geoAtlas';
import { paintGeoCanvas } from '@/maps/paintGeoTexture';
import { colors, fonts } from '@/theme/colors';

type Props = {
  theater: TheaterDef;
  height?: number;
  activeMarkerIds?: string[];
  selectedChoiceId?: string | null;
  pulse?: boolean;
};

/** Theater card preview — geographically distinct map per crisis. */
export function TheaterMap({
  theater,
  height = 280,
  activeMarkerIds = [],
  selectedChoiceId,
  pulse = true,
}: Props) {
  const throb = useRef(new Animated.Value(0.45)).current;
  const [uri, setUri] = useState<string | null>(null);

  const geo = useMemo(() => {
    if (theater.scenarioId) return geoForScenario(theater.scenarioId);
    return geoForTheaterId(theater.id);
  }, [theater.scenarioId, theater.id]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    try {
      const canvas = paintGeoCanvas(geo, theater, 640);
      setUri(canvas.toDataURL('image/jpeg', 0.85));
    } catch {
      setUri(null);
    }
  }, [geo, theater]);

  useEffect(() => {
    if (!pulse) return;
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(throb, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(throb, {
          toValue: 0.4,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulse, throb]);

  const selectedMarker = selectedChoiceId ? choiceOps[selectedChoiceId]?.markerId : undefined;
  const markerById = Object.fromEntries(theater.markers.map((m) => [m.id, m]));

  return (
    <View style={[styles.wrap, { height }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.terrain} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={[geo.water, geo.land, '#040A10']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.svg}>
        <Defs>
          <RadialGradient id="homeGlow" cx="50%" cy="40%" rx="42%" ry="30%">
            <Stop offset="0%" stopColor={theater.accent} stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50" cy="40" rx="36" ry="22" fill="url(#homeGlow)" />
        {!uri
          ? geo.lands.map((land, li) => (
              <Polygon
                key={li}
                points={land.map(([x, y]) => `${x},${y}`).join(' ')}
                fill={geo.land}
                opacity={0.85}
                stroke={geo.accent}
                strokeWidth={0.3}
              />
            ))
          : null}
        {theater.corridors.map((c, i) => {
          const a = markerById[c.from];
          const b = markerById[c.to];
          if (!a || !b) return null;
          return (
            <Line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(212,160,74,0.4)"
              strokeWidth={0.3}
              strokeDasharray="1.2 1.2"
            />
          );
        })}
        {theater.markers.map((m) => {
          const active = activeMarkerIds.includes(m.id) || selectedMarker === m.id;
          return (
            <Circle
              key={m.id}
              cx={m.x}
              cy={m.y}
              r={active ? 2.4 : 1.5}
              fill={active ? colors.amberHot : colors.chalk}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={0.25}
              opacity={active ? 1 : 0.55}
            />
          );
        })}
      </Svg>
      <View style={styles.legend} pointerEvents="none">
        <Text style={styles.legendTitle}>{geo.label}</Text>
        <Text style={styles.legendSub}>RELIEF BOARD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#060E14',
    borderWidth: 1,
    borderColor: 'rgba(212,168,90,0.3)',
  },
  terrain: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  svg: { ...StyleSheet.absoluteFill },
  legend: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    gap: 2,
  },
  legendTitle: {
    color: 'rgba(240,245,242,0.85)',
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  legendSub: {
    color: colors.amberHot,
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.2,
  },
});
