import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, {
  Defs,
  Line,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
  Circle,
  Ellipse,
  Polygon,
} from 'react-native-svg';
import type { Choice } from '@/data/scenarios';
import type { TheaterDef } from '@/data/theaters';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import {
  displayOpLabel,
  hotZoneFocus,
  layoutBoardNodes,
  layoutLegalChoices,
  type ChoiceOpInput,
  type LaidOutChoice,
} from '@/lib/layoutBoardNodes';
import { BoardJuice } from '@/components/BoardJuice';
import { LinearGradient as ExpoGradient } from 'expo-linear-gradient';
import { colors, fonts, elevation } from '@/theme/colors';

export type MapOp = {
  choice: Choice;
  markerId: string;
  short: string;
  kind: string;
};

type Props = {
  theater: TheaterDef;
  height?: number;
  claimedMarkerIds?: string[];
  availableOps?: MapOp[];
  selectedChoiceId?: string | null;
  focusMarkerId?: string | null;
  commitFlash?: boolean;
  previewTension?: number;
  onSelectOp?: (op: MapOp) => void;
  onPlaceOp?: (op: MapOp) => void;
  pulse?: boolean;
  urgency?: number;
  phaseKey?: string | number;
  locked?: boolean;
};

const KIND_FACE: Record<string, string> = {
  naval: '#2A6B72',
  diplomatic: '#8A6A2E',
  economic: '#6B5A3A',
  kinetic: '#7A3A2A',
  political: '#2E5A52',
  legal: '#3A5568',
  civic: '#3A5A40',
};

/**
 * Command-table board — tap a lit move to select, then Lock In.
 * No drag-and-drop. Self-explanatory affordances + clear selected state.
 */
export function InteractiveTheaterMap({
  theater,
  height = 380,
  claimedMarkerIds = [],
  availableOps = [],
  selectedChoiceId,
  focusMarkerId,
  commitFlash = false,
  previewTension = 0,
  onSelectOp,
  onPlaceOp,
  pulse = true,
  urgency = 0,
  phaseKey,
  locked = false,
}: Props) {
  const throb = useRef(new Animated.Value(0.45)).current;
  const legalPulse = useRef(new Animated.Value(0.5)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const focusAnim = useRef(new Animated.Value(1)).current;
  const cameraX = useRef(new Animated.Value(0)).current;
  const cameraY = useRef(new Animated.Value(0)).current;
  const tipFade = useRef(new Animated.Value(1)).current;
  const punch = useRef(new Animated.Value(1)).current;
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [placedId, setPlacedId] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ x: number; y: number; key: number } | null>(null);
  const burstKey = useRef(0);

  const selectedMarker = selectedChoiceId
    ? resolveChoiceOp(selectedChoiceId)?.markerId ??
      availableOps.find((o) => o.choice.id === selectedChoiceId)?.markerId
    : undefined;

  const opsByMarker = useMemo(() => {
    const map = new Map<string, MapOp[]>();
    for (const op of availableOps) {
      const list = map.get(op.markerId) ?? [];
      list.push(op);
      map.set(op.markerId, list);
    }
    return map;
  }, [availableOps]);

  const priorityIds = useMemo(() => {
    const ids = new Set<string>([...opsByMarker.keys(), ...claimedMarkerIds]);
    if (selectedMarker) ids.add(selectedMarker);
    return ids;
  }, [opsByMarker, claimedMarkerIds, selectedMarker]);

  const scenery = useMemo(
    () => layoutBoardNodes(theater, priorityIds),
    [theater, priorityIds],
  );
  const sceneryById = useMemo(
    () => Object.fromEntries(scenery.map((n) => [n.id, n])),
    [scenery],
  );

  const choiceInputs: ChoiceOpInput[] = useMemo(
    () =>
      availableOps.map((op) => ({
        choiceId: op.choice.id,
        markerId: op.markerId,
        choiceLabel: op.choice.label,
        short: op.short,
        kind: op.kind,
      })),
    [availableOps],
  );

  const legalChoices = useMemo(
    () =>
      size.w > 0
        ? layoutLegalChoices(theater, choiceInputs, size.w, size.h || height)
        : [],
    [theater, choiceInputs, size.w, size.h, height],
  );

  const opByChoiceId = useMemo(
    () => Object.fromEntries(availableOps.map((o) => [o.choice.id, o])),
    [availableOps],
  );

  useEffect(() => {
    setPlacedId(null);
    setBurst(null);
  }, [phaseKey, theater.id]);

  useEffect(() => {
    if (!selectedChoiceId) setPlacedId(null);
  }, [selectedChoiceId]);

  useEffect(() => {
    if (!pulse) return;
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(throb, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(throb, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    const legalLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(legalPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(legalPulse, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    pulseLoop.start();
    legalLoop.start();
    return () => {
      pulseLoop.stop();
      legalLoop.stop();
    };
  }, [pulse, throb, legalPulse]);

  useEffect(() => {
    if (!commitFlash) return;
    flash.setValue(0);
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 70, useNativeDriver: false }),
      Animated.timing(flash, { toValue: 0, duration: 360, useNativeDriver: false }),
    ]).start();
    Animated.sequence([
      Animated.timing(punch, { toValue: 1.045, duration: 90, useNativeDriver: false }),
      Animated.spring(punch, { toValue: 1, friction: 5, useNativeDriver: false }),
    ]).start();
  }, [commitFlash, flash, punch]);

  useEffect(() => {
    const anchors = legalChoices.map((c) => ({ x: c.anchorX, y: c.anchorY }));
    const focus = hotZoneFocus(anchors);
    if (!focus || !size.w) {
      Animated.parallel([
        Animated.spring(focusAnim, { toValue: 1, friction: 8, useNativeDriver: false }),
        Animated.spring(cameraX, { toValue: 0, friction: 8, useNativeDriver: false }),
        Animated.spring(cameraY, { toValue: 0, friction: 8, useNativeDriver: false }),
      ]).start();
      return;
    }
    const offsetX = (50 - focus.cx) * 0.18;
    const offsetY = (50 - focus.cy) * 0.14;
    Animated.sequence([
      Animated.parallel([
        Animated.spring(focusAnim, {
          toValue: focus.scale,
          friction: 7,
          tension: 70,
          useNativeDriver: false,
        }),
        Animated.spring(cameraX, { toValue: offsetX, friction: 7, useNativeDriver: false }),
        Animated.spring(cameraY, { toValue: offsetY, friction: 7, useNativeDriver: false }),
      ]),
      Animated.delay(420),
      Animated.parallel([
        Animated.spring(focusAnim, { toValue: 1, friction: 8, useNativeDriver: false }),
        Animated.spring(cameraX, { toValue: 0, friction: 8, useNativeDriver: false }),
        Animated.spring(cameraY, { toValue: 0, friction: 8, useNativeDriver: false }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseKey, theater.id, availableOps.length, size.w]);

  useEffect(() => {
    Animated.timing(tipFade, {
      toValue: selectedChoiceId || placedId ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [selectedChoiceId, placedId, tipFade]);

  const selectMove = (op: MapOp, slot?: LaidOutChoice) => {
    if (locked) return;
    const target =
      slot ?? legalChoices.find((c) => c.choiceId === op.choice.id) ?? legalChoices[0];
    if (target) {
      const cx = (target.x / 100) * size.w;
      const cy = (target.y / 100) * size.h;
      burstKey.current += 1;
      setBurst({ x: cx, y: cy, key: burstKey.current });
    }
    setPlacedId(op.choice.id);
    Animated.sequence([
      Animated.timing(punch, { toValue: 1.04, duration: 70, useNativeDriver: false }),
      Animated.spring(punch, { toValue: 1, friction: 4, tension: 120, useNativeDriver: false }),
    ]).start();
    onSelectOp?.(op);
    onPlaceOp?.(op);
  };

  const trayLayout = useMemo(() => {
    const n = availableOps.length || 1;
    const pieceW = Math.min(136, Math.max(100, (size.w - 28) / n - 10));
    const pieceH = Math.max(118, Math.round(pieceW * 1.08));
    const gap = 12;
    const total = n * pieceW + (n - 1) * gap;
    const startX = Math.max(10, (size.w - total) / 2);
    const y = Math.max(8, size.h - pieceH - 16);
    return availableOps.map((op, i) => ({
      op,
      x: startX + i * (pieceW + gap),
      y,
      w: pieceW,
      h: pieceH,
    }));
  }, [availableOps, size.w, size.h]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    setSize((prev) =>
      Math.abs(prev.w - width) > 1 || Math.abs(prev.h - h) > 1 ? { w: width, h } : prev,
    );
  };

  const urgencyGlow = Math.min(1, Math.max(0, urgency));
  const hasLegal = availableOps.length > 0;
  const activeId = placedId ?? selectedChoiceId;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          height,
          transform: [
            { scale: Animated.multiply(focusAnim, punch) },
            {
              translateX: cameraX.interpolate({
                inputRange: [-20, 20],
                outputRange: [(-20 / 100) * Math.max(size.w, 1), (20 / 100) * Math.max(size.w, 1)],
              }),
            },
            {
              translateY: cameraY.interpolate({
                inputRange: [-20, 20],
                outputRange: [(-20 / 100) * Math.max(size.h, 1), (20 / 100) * Math.max(size.h, 1)],
              }),
            },
          ],
        },
      ]}
      onLayout={onLayout}
      nativeID="interactive-theater-map"
    >
      {/* 3D stage surface — no washed photo */}
      <ExpoGradient
        colors={['#0A1420', '#12100C', '#0C1820']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.gradeCool} pointerEvents="none" />
      <View style={styles.gradeWarm} pointerEvents="none" />
      <ExpoGradient
        pointerEvents="none"
        colors={['rgba(4,10,16,0.45)', 'transparent', 'transparent', 'rgba(4,10,16,0.8)']}
        locations={[0, 0.2, 0.58, 1]}
        style={styles.vignetteGrad}
      />
      <View
        pointerEvents="none"
        style={[styles.urgencyWash, { opacity: 0.08 + urgencyGlow * 0.28 }]}
      />

      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={styles.svg}
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient id="sqGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={colors.amberHot} stopOpacity={0.55 + previewTension * 0.2} />
            <Stop offset="55%" stopColor={colors.amberHot} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={colors.amberHot} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="legalGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={colors.tealBright} stopOpacity="0.5" />
            <Stop offset="70%" stopColor={colors.tealBright} stopOpacity="0.14" />
            <Stop offset="100%" stopColor={colors.tealBright} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="stageGlow" cx="50%" cy="42%" rx="48%" ry="32%">
            <Stop offset="0%" stopColor={colors.amber} stopOpacity="0.18" />
            <Stop offset="100%" stopColor={colors.amber} stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="boardEdge" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#000" stopOpacity="0.45" />
            <Stop offset="18%" stopColor="#000" stopOpacity="0" />
            <Stop offset="78%" stopColor="#000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0.65" />
          </LinearGradient>
          <LinearGradient id="beam" x1="50" y1="0" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={colors.amberHot} stopOpacity="0.28" />
            <Stop offset="100%" stopColor={colors.amberHot} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Stage depth wash */}
        <Ellipse cx="50" cy="38" rx="40" ry="22" fill="url(#stageGlow)" />
        <Polygon points="42,2 58,2 68,55 32,55" fill="url(#beam)" opacity={0.7} />

        {/* Perspective floor lines */}
        {Array.from({ length: 7 }).map((_, i) => {
          const t = i / 6;
          const x0 = 12 + t * 76;
          return (
            <Line
              key={`pv${i}`}
              x1={x0}
              y1="92"
              x2="50"
              y2="28"
              stroke="rgba(212,160,74,0.14)"
              strokeWidth={0.2}
            />
          );
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = 40 + i * 10;
          const inset = 14 + i * 4;
          return (
            <Line
              key={`ph${i}`}
              x1={inset}
              y1={y}
              x2={100 - inset}
              y2={y}
              stroke="rgba(212,160,74,0.1)"
              strokeWidth={0.2}
            />
          );
        })}

        {theater.zones.map((z) => (
          <Rect
            key={z.id}
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill={
              z.tension + previewTension > 0.55
                ? 'rgba(196,92,58,0.07)'
                : 'rgba(61,155,143,0.04)'
            }
            stroke="rgba(232,240,236,0.04)"
            strokeWidth={0.12}
          />
        ))}

        {theater.corridors.map((c, i) => {
          const a = sceneryById[c.from];
          const b = sceneryById[c.to];
          if (!a || !b) return null;
          return (
            <Line
              key={`c${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(212,160,74,0.22)"
              strokeWidth={0.25}
              strokeDasharray="1.2 1.4"
            />
          );
        })}

        {/* Lit drop sockets */}
        {legalChoices.map((c) => {
          const filled = placedId === c.choiceId || activeId === c.choiceId;
          return (
            <Circle
              key={`sock-${c.choiceId}`}
              cx={c.x}
              cy={c.y}
              r={filled ? 9 : 7.2}
              fill={filled ? 'url(#sqGlow)' : 'url(#legalGlow)'}
              stroke={filled ? colors.amberHot : colors.tealBright}
              strokeWidth={filled ? 0.7 : 0.45}
              opacity={0.95}
            />
          );
        })}

        <Rect x="0" y="0" width="100" height="100" fill="url(#boardEdge)" />
      </Svg>

      {/* Tappable sockets — select matching move */}
      {size.w > 0 &&
        legalChoices.map((c) => {
          const w = Math.max(c.pieceW * 0.85, 72);
          const h = Math.min(c.pieceH * 0.55, 68);
          const left = (c.x / 100) * size.w - w / 2;
          const top = (c.y / 100) * size.h - h / 2;
          const filled = activeId === c.choiceId;
          const op = opByChoiceId[c.choiceId];
          return (
            <Pressable
              key={`socket-${c.choiceId}`}
              accessibilityRole="button"
              accessibilityLabel={`Tap to select ${c.placeLabel}`}
              disabled={locked}
              onPress={() => {
                if (op) selectMove(op, c);
              }}
              style={[
                styles.socket,
                {
                  left,
                  top,
                  width: w,
                  height: h,
                  borderColor: filled ? colors.amberHot : colors.tealBright,
                  backgroundColor: filled
                    ? 'rgba(212,160,74,0.18)'
                    : 'rgba(91,196,181,0.1)',
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.socketHalo,
                  {
                    opacity: legalPulse.interpolate({
                      inputRange: [0.45, 1],
                      outputRange: [0.2, 0.7],
                    }),
                  },
                ]}
              />
              <Text style={[styles.socketLabel, filled && styles.socketLabelOn]} numberOfLines={1}>
                {filled ? 'SELECTED' : c.placeLabel.toUpperCase()}
              </Text>
              {!filled ? <Text style={styles.socketHint}>TAP</Text> : null}
            </Pressable>
          );
        })}

      {/* Selected piece on board */}
      {size.w > 0 &&
        activeId &&
        (() => {
          const slot = legalChoices.find((c) => c.choiceId === activeId);
          const op = opByChoiceId[activeId];
          if (!slot || !op) return null;
          const w = slot.pieceW;
          const h = slot.pieceH * 0.72;
          const left = (slot.x / 100) * size.w - w / 2;
          const top = (slot.y / 100) * size.h - h / 2;
          const face = KIND_FACE[op.kind] ?? KIND_FACE.political;
          return (
            <View
              key={`placed-${activeId}`}
              style={[styles.pieceOnBoard, { left, top, width: w, height: h }]}
              pointerEvents="none"
            >
              <View
                style={[
                  styles.pieceFace,
                  elevation.piece,
                  styles.selectedFace,
                  { backgroundColor: face, width: w - 10 },
                ]}
              >
                <Text style={styles.trayKind}>{(op.kind ?? 'op').toUpperCase()}</Text>
                <Text style={styles.pieceGlyph} numberOfLines={3}>
                  {displayOpLabel(op.short, op.choice.label)}
                </Text>
              </View>
            </View>
          );
        })()}

      {/* Hand — tap pieces to select */}
      {size.w > 0 &&
        trayLayout.map(({ op, x, y, w, h }) => {
          const selected = activeId === op.choice.id;
          const face = KIND_FACE[op.kind] ?? KIND_FACE.political;
          const title = displayOpLabel(op.short, op.choice.label);
          const kind = (op.kind ?? 'op').toUpperCase();
          // When selected, piece sits on board — dim tray ghost
          return (
            <View
              key={`tray-${op.choice.id}`}
              style={[
                styles.trayPiece,
                {
                  left: x,
                  top: y,
                  width: w,
                  height: h,
                  zIndex: selected ? 5 : 12,
                  opacity: locked ? 0.4 : selected ? 0.35 : 1,
                  transform: [{ scale: selected ? 0.92 : 1 }],
                },
              ]}
              nativeID={`map-op-${op.choice.id}`}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${kind}: ${op.choice.label}. Tap to select.`}
                accessibilityState={{ selected }}
                disabled={locked}
                onPress={() => selectMove(op)}
                style={({ pressed }) => [
                  styles.trayPress,
                  pressed && !locked && styles.trayPressed,
                ]}
              >
                <View
                  style={[
                    styles.pieceFace,
                    elevation.piece,
                    styles.trayCard,
                    selected && styles.selectedFace,
                    {
                      backgroundColor: face,
                      borderColor: selected ? colors.amberHot : colors.tealBright,
                    },
                  ]}
                >
                  <View style={styles.pieceBevel} />
                  <Text style={styles.trayKind}>{kind}</Text>
                  <Text style={styles.pieceGlyph} numberOfLines={3}>
                    {title}
                  </Text>
                  <Text style={styles.tapCue}>{selected ? 'SELECTED' : 'TAP'}</Text>
                </View>
              </Pressable>
            </View>
          );
        })}

      <BoardJuice burst={burst} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.flashOverlay,
          {
            opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
          },
        ]}
      />

      {hasLegal && !activeId ? (
        <Animated.View style={[styles.tip, { opacity: tipFade }]} pointerEvents="none">
          <Text style={styles.tipKicker}>YOUR MOVE</Text>
          <Text style={styles.tipBody}>
            {urgencyGlow > 0.55 ? 'Clock hot — tap a lit move' : 'Tap a lit move'}
          </Text>
        </Animated.View>
      ) : activeId && !locked ? (
        <View style={styles.tipSelected} pointerEvents="none">
          <Text style={styles.tipSelectedText}>Selected — Lock in below</Text>
        </View>
      ) : null}

      {focusMarkerId ? null : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#060E14',
    borderWidth: 1,
    borderColor: 'rgba(212,168,90,0.42)',
    ...elevation.board,
  },
  gradeCool: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16, 36, 52, 0.3)' },
  gradeWarm: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(90, 55, 25, 0.12)' },
  vignetteGrad: { ...StyleSheet.absoluteFill },
  urgencyWash: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(196, 92, 58, 0.35)' },
  svg: { ...StyleSheet.absoluteFill },
  socket: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 6,
    zIndex: 3,
    gap: 2,
  },
  socketHalo: {
    ...StyleSheet.absoluteFill,
    borderRadius: 6,
    backgroundColor: 'rgba(91,196,181,0.12)',
  },
  socketLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(240,245,242,0.9)',
    textShadowColor: '#000',
    textShadowRadius: 3,
  },
  socketLabelOn: {
    color: colors.amberHot,
  },
  socketHint: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.tealBright,
  },
  pieceOnBoard: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  pieceFace: {
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(240,230,210,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderBottomColor: 'rgba(0,0,0,0.55)',
    overflow: 'visible',
  },
  selectedFace: {
    borderWidth: 2.5,
    borderColor: colors.amberHot,
    shadowColor: colors.amberHot,
    shadowOpacity: 0.55,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  pieceBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '36%',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  pieceGlyph: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.15,
    color: colors.chalk,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowRadius: 2,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },
  trayPiece: {
    position: 'absolute',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  trayPress: {
    width: '100%',
    height: '100%',
  },
  trayPressed: {
    transform: [{ scale: 0.97 }],
  },
  trayCard: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 8,
    gap: 6,
    justifyContent: 'flex-start',
    borderWidth: 2,
    overflow: 'visible',
  },
  trayKind: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 18,
    letterSpacing: 1,
    color: colors.void,
    textAlign: 'center',
    backgroundColor: 'rgba(255,236,190,0.92)',
    paddingTop: 4,
    paddingBottom: 5,
    paddingHorizontal: 6,
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  tapCue: {
    marginTop: 'auto',
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.tealBright,
    textAlign: 'center',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.amberHot,
  },
  tip: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '18%',
    right: '18%',
    backgroundColor: 'rgba(4,10,16,0.92)',
    borderWidth: 1,
    borderColor: colors.lineGold,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 2,
    zIndex: 8,
  },
  tipKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.8,
    color: colors.goldInk,
  },
  tipBody: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.3,
    color: colors.chalk,
    textAlign: 'center',
  },
  tipSelected: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    left: '22%',
    right: '22%',
    backgroundColor: 'rgba(212,160,74,0.18)',
    borderWidth: 1,
    borderColor: colors.amberHot,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    zIndex: 8,
  },
  tipSelectedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.4,
    color: colors.amberHot,
    textAlign: 'center',
  },
});
