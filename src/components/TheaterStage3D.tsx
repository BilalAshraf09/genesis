import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgGrad,
  RadialGradient,
  Stop,
  Path,
  Line,
  Rect,
  Circle,
  Ellipse,
  Polygon,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { CinematicShell } from '@/components/CinematicShell';
import { gradeForYear } from '@/theme/colors';

type Props = {
  year?: number;
  /** desk | ops | street | era — shifts palette & light */
  motif?: 'era' | 'desk' | 'street' | 'ops';
  intensity?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Immersive 3D command theater — perspective stage, volumetric light,
 * parallax layers. No flat photo wash. Expo-friendly (Animated + SVG).
 */
export function TheaterStage3D({
  year = 1962,
  motif = 'era',
  intensity = 1,
  style,
}: Props) {
  const cam = useRef(new Animated.Value(0)).current;
  const beam = useRef(new Animated.Value(0.55)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;
  const grade = gradeForYear(year);

  const palette = useMemo(() => {
    const late = year >= 1991;
    const cold = year >= 1945 && year < 1991;
    if (motif === 'ops') {
      return {
        void: '#03080E',
        stage: cold ? '#0A1820' : '#12100C',
        rim: late ? '#5BC4B5' : '#D4A04A',
        beam: late ? 'rgba(91,196,181,0.22)' : 'rgba(232,176,74,0.28)',
        horizon: cold ? '#1A3A48' : '#3A2818',
      };
    }
    if (motif === 'desk') {
      return {
        void: '#040A10',
        stage: '#0E1418',
        rim: '#C4A878',
        beam: 'rgba(196,168,120,0.2)',
        horizon: '#1C2428',
      };
    }
    return {
      void: '#02060A',
      stage: cold ? '#0C1620' : year < 1945 ? '#14100C' : '#0A1218',
      rim: cold ? '#5B9BC4' : '#D4A04A',
      beam: cold ? 'rgba(91,155,196,0.24)' : 'rgba(232,176,74,0.26)',
      horizon: cold ? '#152838' : '#2A1C10',
    };
  }, [year, motif]);

  useEffect(() => {
    const camLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cam, {
          toValue: 1,
          duration: 16000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(cam, {
          toValue: 0,
          duration: 16000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(beam, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(beam, {
          toValue: 0.4,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    camLoop.start();
    beamLoop.start();
    pulseLoop.start();
    return () => {
      camLoop.stop();
      beamLoop.stop();
      pulseLoop.stop();
    };
  }, [cam, beam, pulse]);

  const tx = cam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] });
  const ty = cam.interpolate({ inputRange: [0, 1], outputRange: [-6, 8] });
  const rot = cam.interpolate({
    inputRange: [0, 1],
    outputRange: ['-0.6deg', '0.6deg'],
  });
  const farTx = cam.interpolate({ inputRange: [0, 1], outputRange: [-8, 8] });
  const nearTx = cam.interpolate({ inputRange: [0, 1], outputRange: [-22, 22] });

  return (
    <View
      style={[styles.root, { backgroundColor: palette.void }, style]}
      pointerEvents="none"
      nativeID="theater-stage-3d"
    >
      {/* Far wall / world horizon */}
      <Animated.View
        style={[
          styles.farLayer,
          { transform: [{ translateX: farTx }, { translateY: ty }] },
        ]}
      >
        <LinearGradient
          colors={[palette.void, palette.horizon, palette.stage]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="worldGlow" cx="50%" cy="38%" rx="42%" ry="28%">
              <Stop offset="0%" stopColor={palette.rim} stopOpacity={0.35 * intensity} />
              <Stop offset="55%" stopColor={palette.rim} stopOpacity={0.08 * intensity} />
              <Stop offset="100%" stopColor={palette.rim} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="globe" cx="50%" cy="40%" rx="18%" ry="14%">
              <Stop offset="0%" stopColor="#8EB8C8" stopOpacity={0.45 * intensity} />
              <Stop offset="70%" stopColor="#2A4A58" stopOpacity={0.25 * intensity} />
              <Stop offset="100%" stopColor="#040A10" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          {/* Back proscenium arch */}
          <Path
            d="M8 8 L92 8 L88 42 L12 42 Z"
            fill="rgba(8,14,20,0.55)"
            stroke={palette.rim}
            strokeWidth={0.25}
            opacity={0.55}
          />
          <Ellipse cx="50" cy="40" rx="22" ry="16" fill="url(#worldGlow)" />
          <Ellipse cx="50" cy="40" rx="14" ry="11" fill="url(#globe)" />
          {/* Meridians hint */}
          <Ellipse
            cx="50"
            cy="40"
            rx="14"
            ry="11"
            fill="none"
            stroke={palette.rim}
            strokeWidth={0.2}
            opacity={0.35}
          />
          <Line x1="50" y1="29" x2="50" y2="51" stroke={palette.rim} strokeWidth={0.15} opacity={0.3} />
          <Line x1="36" y1="40" x2="64" y2="40" stroke={palette.rim} strokeWidth={0.15} opacity={0.3} />
        </Svg>
      </Animated.View>

      {/* Mid: volumetric beams + hanging fixtures */}
      <Animated.View
        style={[
          styles.midLayer,
          {
            opacity: beam.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.55 * intensity, 1 * intensity],
            }),
            transform: [{ translateX: tx }],
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <SvgGrad id="beamL" x1="30" y1="0" x2="35" y2="85" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={palette.rim} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={palette.rim} stopOpacity="0" />
            </SvgGrad>
            <SvgGrad id="beamC" x1="50" y1="0" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={palette.rim} stopOpacity={0.55} />
              <Stop offset="100%" stopColor={palette.rim} stopOpacity="0" />
            </SvgGrad>
            <SvgGrad id="beamR" x1="70" y1="0" x2="65" y2="85" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor={palette.rim} stopOpacity={0.4} />
              <Stop offset="100%" stopColor={palette.rim} stopOpacity="0" />
            </SvgGrad>
          </Defs>
          <Polygon points="28,4 38,4 48,88 18,88" fill="url(#beamL)" opacity={0.55} />
          <Polygon points="44,2 56,2 62,92 38,92" fill="url(#beamC)" opacity={0.7} />
          <Polygon points="62,4 72,4 82,88 52,88" fill="url(#beamR)" opacity={0.5} />
          {/* Light fixtures */}
          <Rect x="31" y="2" width="6" height="2.2" rx="0.4" fill={palette.rim} opacity={0.85} />
          <Rect x="47" y="1" width="6" height="2.4" rx="0.4" fill={palette.rim} opacity={0.95} />
          <Rect x="63" y="2" width="6" height="2.2" rx="0.4" fill={palette.rim} opacity={0.85} />
        </Svg>
      </Animated.View>

      {/* Perspective stage floor */}
      <Animated.View
        style={[
          styles.floorLayer,
          {
            transform: [
              { translateX: nearTx },
              { translateY: ty },
              ...(Platform.OS === 'web'
                ? ([{ perspective: 1100 }, { rotateX: '58deg' }, { scale: 1.35 }] as const)
                : ([{ scaleY: 0.55 }, { translateY: 40 }] as const)),
            ],
          },
        ]}
      >
        <View style={[styles.floorPlane, { backgroundColor: palette.stage }]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="floorFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#000" stopOpacity="0.55" />
                <Stop offset="40%" stopColor="#000" stopOpacity="0.1" />
                <Stop offset="100%" stopColor={palette.rim} stopOpacity="0.12" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="100" height="100" fill="url(#floorFade)" />
            {/* Perspective grid lines (vanishing toward center-top of floor) */}
            {Array.from({ length: 9 }).map((_, i) => {
              const t = i / 8;
              const x0 = 8 + t * 84;
              return (
                <Line
                  key={`v${i}`}
                  x1={x0}
                  y1="100"
                  x2={50}
                  y2="8"
                  stroke={palette.rim}
                  strokeWidth={0.2}
                  opacity={0.18 + (1 - Math.abs(t - 0.5)) * 0.12}
                />
              );
            })}
            {Array.from({ length: 7 }).map((_, i) => {
              const y = 18 + i * 12;
              const inset = 8 + i * 5.5;
              return (
                <Line
                  key={`h${i}`}
                  x1={inset}
                  y1={y}
                  x2={100 - inset}
                  y2={y}
                  stroke={palette.rim}
                  strokeWidth={0.25}
                  opacity={0.12 + i * 0.04}
                />
              );
            })}
            {/* Center stage mark */}
            <Circle cx="50" cy="62" r="3.5" fill="none" stroke={palette.rim} strokeWidth={0.4} opacity={0.45} />
            <Circle cx="50" cy="62" r="1.2" fill={palette.rim} opacity={0.35} />
          </Svg>
        </View>
      </Animated.View>

      {/* Side wings / curtains */}
      <Animated.View
        style={[
          styles.wings,
          {
            opacity: 0.85 * intensity,
            transform: [{ translateX: tx }, { rotate: rot }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(2,6,10,0.92)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.wingL}
        />
        <LinearGradient
          colors={['transparent', 'rgba(2,6,10,0.92)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.wingR}
        />
        {/* Proscenium frame */}
        <View style={[styles.proscenium, { borderColor: `${palette.rim}55` }]} />
      </Animated.View>

      {/* Floating dust / mote pulse */}
      <Animated.View
        style={[
          styles.motes,
          {
            opacity: pulse.interpolate({
              inputRange: [0.35, 1],
              outputRange: [0.12 * intensity, 0.28 * intensity],
            }),
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[12, 28, 41, 55, 67, 78, 88].map((cx, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={22 + ((i * 17) % 50)}
              r={0.35 + (i % 3) * 0.15}
              fill="#fff"
              opacity={0.5}
            />
          ))}
        </Svg>
      </Animated.View>

      {/* Era grade wash */}
      <View
        pointerEvents="none"
        style={[styles.gradeCool, { backgroundColor: grade.cool, opacity: 0.35 * intensity }]}
      />
      <View
        pointerEvents="none"
        style={[styles.gradeWarm, { backgroundColor: grade.warm, opacity: 0.28 * intensity }]}
      />

      <LinearGradient
        colors={[
          `rgba(2,6,10,${0.25 * intensity})`,
          'transparent',
          `rgba(2,6,10,${0.55 * intensity})`,
        ]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <CinematicShell overlay year={year} intensity={0.55 * intensity} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  farLayer: {
    ...StyleSheet.absoluteFill,
  },
  midLayer: {
    ...StyleSheet.absoluteFill,
  },
  floorLayer: {
    position: 'absolute',
    left: '-15%',
    right: '-15%',
    bottom: '-35%',
    height: '78%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  floorPlane: {
    width: '100%',
    height: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,160,74,0.2)',
  },
  wings: {
    ...StyleSheet.absoluteFill,
  },
  wingL: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '18%',
  },
  wingR: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '18%',
  },
  proscenium: {
    ...StyleSheet.absoluteFill,
    marginHorizontal: '3%',
    marginVertical: '2%',
    borderWidth: 1.5,
    borderRadius: 2,
  },
  motes: {
    ...StyleSheet.absoluteFill,
  },
  gradeCool: {
    ...StyleSheet.absoluteFill,
  },
  gradeWarm: {
    ...StyleSheet.absoluteFill,
  },
});
