import { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { OverallScore } from '@/lib/overallScore';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  theaterTitle: string;
  year: number;
  headline: string;
  overall: OverallScore;
  /** Optional: scroll/focus target for viral loop. */
  challengeMode?: boolean;
};

function paintShareCard(opts: {
  theaterTitle: string;
  year: number;
  headline: string;
  overall: OverallScore;
  w?: number;
  h?: number;
}): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const w = opts.w ?? 1080;
  const h = opts.h ?? 1350;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#05070C');
  bg.addColorStop(0.45, '#0A1220');
  bg.addColorStop(1, '#0C2030');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(46, 230, 200, 0.08)';
  ctx.lineWidth = 2;
  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.38, w * 0.12 * i, h * 0.08 * i, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(110, 245, 222, 0.55)';
  ctx.lineWidth = 3;
  const tick = 48;
  ctx.beginPath();
  ctx.moveTo(36, 36 + tick);
  ctx.lineTo(36, 36);
  ctx.lineTo(36 + tick, 36);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w - 36 - tick, 36);
  ctx.lineTo(w - 36, 36);
  ctx.lineTo(w - 36, 36 + tick);
  ctx.stroke();

  ctx.fillStyle = '#2EE6C8';
  ctx.font = '700 36px Orbitron, Sora, system-ui, sans-serif';
  ctx.fillText('GENESIS', 64, 110);

  ctx.fillStyle = 'rgba(154, 173, 194, 0.9)';
  ctx.font = '500 22px Sora, system-ui, sans-serif';
  ctx.fillText('CABINET CHALLENGE', 64, 148);

  ctx.fillStyle = '#F4F7FB';
  ctx.font = '700 52px Orbitron, Sora, system-ui, sans-serif';
  const title = opts.theaterTitle.toUpperCase();
  ctx.fillText(title.length > 28 ? `${title.slice(0, 26)}…` : title, 64, 240);

  ctx.fillStyle = '#FFB84D';
  ctx.font = '600 28px Sora, system-ui, sans-serif';
  ctx.fillText(String(opts.year), 64, 286);

  const plateY = 340;
  ctx.fillStyle = 'rgba(16, 22, 36, 0.85)';
  ctx.strokeStyle = 'rgba(46, 230, 200, 0.55)';
  ctx.lineWidth = 2;
  roundRect(ctx, 64, plateY, w - 128, 280, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#9AADC2';
  ctx.font = '600 22px Sora, system-ui, sans-serif';
  ctx.fillText(opts.overall.label, 96, plateY + 52);

  ctx.fillStyle = '#6FF5DE';
  ctx.font = '700 160px Orbitron, Sora, system-ui, sans-serif';
  ctx.fillText(String(opts.overall.score), 96, plateY + 200);

  ctx.font = '700 160px Orbitron, Sora, system-ui, sans-serif';
  const scoreW = ctx.measureText(String(opts.overall.score)).width;
  ctx.font = '700 72px Orbitron, Sora, system-ui, sans-serif';
  ctx.fillStyle = '#FFD078';
  ctx.fillText(opts.overall.grade, 96 + scoreW + 28, plateY + 160);

  if (opts.overall.pathFamily) {
    ctx.fillStyle = 'rgba(46, 230, 200, 0.85)';
    ctx.font = '600 20px Sora, system-ui, sans-serif';
    ctx.fillText(opts.overall.pathFamily.replace(/_/g, ' ').toUpperCase(), 96, plateY + 248);
  }

  const headY = plateY + 340;
  ctx.fillStyle = '#F4F7FB';
  ctx.font = '600 36px Sora, system-ui, sans-serif';
  wrapText(ctx, opts.headline, 64, headY, w - 128, 46, 3);

  const chipY = headY + 180;
  const gain = opts.overall.topGain;
  const cost = opts.overall.topCost;
  if (gain) {
    drawChip(
      ctx,
      64,
      chipY,
      (w - 128) / 2 - 12,
      120,
      '#3DCF8A',
      'TOP GAIN',
      `${gain.tag.replace(/_/g, ' ').toUpperCase()} +${gain.weight}`,
      gain.summary,
    );
  }
  if (cost) {
    drawChip(
      ctx,
      64 + (w - 128) / 2 + 12,
      chipY,
      (w - 128) / 2 - 12,
      120,
      '#FF6B4A',
      'TOP COST',
      `${cost.tag.replace(/_/g, ' ').toUpperCase()} ${cost.weight}`,
      cost.summary,
    );
  }

  ctx.fillStyle = '#FFB84D';
  ctx.font = '700 26px Orbitron, Sora, system-ui, sans-serif';
  ctx.fillText('BEAT MY PATH', 64, h - 110);

  ctx.fillStyle = 'rgba(154, 173, 194, 0.75)';
  ctx.font = '500 22px Sora, system-ui, sans-serif';
  ctx.fillText('Play Genesis · clear a higher cabinet score', 64, h - 64);

  return canvas;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  let line = '';
  let lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + lines * lineH);
      lines += 1;
      line = words[i];
      if (lines >= maxLines - 1) {
        let rest = words.slice(i).join(' ');
        while (ctx.measureText(`${rest}…`).width > maxW && rest.length > 3) {
          rest = rest.slice(0, -1);
        }
        ctx.fillText(`${rest}…`, x, y + lines * lineH);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y + lines * lineH);
}

function drawChip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string,
  kicker: string,
  title: string,
  body: string,
) {
  ctx.fillStyle = 'rgba(16, 22, 36, 0.9)';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = '600 18px Sora, system-ui, sans-serif';
  ctx.fillText(kicker, x + 20, y + 32);
  ctx.fillStyle = '#F4F7FB';
  ctx.font = '700 22px Sora, system-ui, sans-serif';
  ctx.fillText(title.slice(0, 28), x + 20, y + 64);
  ctx.fillStyle = '#9AADC2';
  ctx.font = '400 18px Sora, system-ui, sans-serif';
  const clipped = body.length > 42 ? `${body.slice(0, 40)}…` : body;
  ctx.fillText(clipped, x + 20, y + 94);
}

/**
 * Share-ready cabinet score card + challenge Copy / Web Share / download.
 */
export function ShareScoreCard({ theaterTitle, year, headline, overall }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [cardW, setCardW] = useState(0);
  const cardRef = useRef<View>(null);
  const sharePayload = overall.shareText || overall.challengeText;

  const onCardLayout = (e: LayoutChangeEvent) => {
    setCardW(e.nativeEvent.layout.width);
  };

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2200);
  };

  const copySummary = useCallback(async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(sharePayload);
        flash('Challenge copied');
        return;
      }
      if (typeof document !== 'undefined') {
        const ta = document.createElement('textarea');
        ta.value = sharePayload;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        flash('Challenge copied');
        return;
      }
      flash('Copy unavailable');
    } catch {
      flash('Copy failed');
    }
  }, [sharePayload]);

  const shareNative = useCallback(async () => {
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: `Genesis challenge · ${theaterTitle} · beat ${overall.score}`,
          text: sharePayload,
        });
        flash('Challenge shared');
        return;
      }
      await copySummary();
      flash('Share unavailable — challenge copied');
    } catch (e) {
      if (e instanceof Error && /abort|cancel/i.test(e.message)) return;
      flash('Share failed');
    }
  }, [theaterTitle, overall.score, sharePayload, copySummary]);

  const downloadCard = useCallback(async () => {
    if (Platform.OS !== 'web') {
      flash('Download is web-only');
      return;
    }
    try {
      const canvas = paintShareCard({ theaterTitle, year, headline, overall });
      if (!canvas) {
        flash('Could not render card');
        return;
      }
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `genesis-challenge-${year}-${overall.score}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      flash('Challenge card downloaded');
    } catch {
      flash('Download failed');
    }
  }, [theaterTitle, year, headline, overall]);

  const gain = overall.topGain;
  const cost = overall.topCost;
  const family = overall.pathFamily
    ? overall.pathFamily.replace(/_/g, ' ').toUpperCase()
    : null;

  return (
    <View style={styles.wrap} nativeID="share-score-block">
      <View
        ref={cardRef}
        onLayout={onCardLayout}
        style={styles.card}
        nativeID="share-score-card"
        collapsable={false}
      >
        <LinearGradient
          colors={['rgba(46,230,200,0.14)', 'transparent', 'rgba(255,184,77,0.08)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Text style={styles.brand}>GENESIS</Text>
        <Text style={styles.brandSub}>CABINET CHALLENGE</Text>

        <Text style={styles.theater} numberOfLines={2}>
          {theaterTitle.toUpperCase()}
        </Text>
        <Text style={styles.year}>{year}</Text>

        <View style={styles.scorePlate} nativeID="overall-score">
          <Text style={styles.scoreLabel}>{overall.label}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNum}>{overall.score}</Text>
            <View style={styles.gradeCol}>
              <Text style={styles.grade}>{overall.grade}</Text>
              {family ? <Text style={styles.family}>{family}</Text> : null}
            </View>
          </View>
        </View>

        <Text style={styles.headline} numberOfLines={3}>
          {headline}
        </Text>

        <View style={styles.polarRow}>
          <View style={[styles.chip, styles.chipGain]}>
            <Text style={styles.chipKicker}>TOP GAIN</Text>
            <Text style={styles.chipTitle} numberOfLines={1}>
              {gain
                ? `${gain.tag.replace(/_/g, ' ').toUpperCase()} +${gain.weight}`
                : 'NONE'}
            </Text>
            <Text style={styles.chipBody} numberOfLines={2}>
              {gain?.summary ?? 'No clear gain this run.'}
            </Text>
          </View>
          <View style={[styles.chip, styles.chipCost]}>
            <Text style={[styles.chipKicker, styles.chipKickerCost]}>TOP COST</Text>
            <Text style={styles.chipTitle} numberOfLines={1}>
              {cost
                ? `${cost.tag.replace(/_/g, ' ').toUpperCase()} ${cost.weight}`
                : 'NONE'}
            </Text>
            <Text style={styles.chipBody} numberOfLines={2}>
              {cost?.summary ?? 'No hard cost logged.'}
            </Text>
          </View>
        </View>

        <Text style={styles.beatInvite}>BEAT MY PATH · score {overall.score}</Text>
      </View>

      <Text style={styles.shareKicker}>CHALLENGE A FRIEND</Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Copy challenge"
          onPress={copySummary}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
        >
          <Text style={styles.actionLabel}>COPY CHALLENGE</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share challenge"
          onPress={shareNative}
          style={({ pressed }) => [styles.actionBtn, styles.actionPrimary, pressed && styles.actionPressed]}
          nativeID="share-challenge-btn"
        >
          <LinearGradient
            colors={[colors.cyanHot, colors.cyan, colors.cyanDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.actionLabel, styles.actionLabelDark]}>SHARE CHALLENGE</Text>
        </Pressable>
        {Platform.OS === 'web' ? (
          <Pressable
            accessibilityRole="button"
            onPress={downloadCard}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
          >
            <Text style={styles.actionLabel}>DOWNLOAD CARD</Text>
          </Pressable>
        ) : null}
      </View>
      {status ? <Text style={styles.status}>{status}</Text> : null}
      {cardW > 0 ? null : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.lg,
    padding: 18,
    gap: 10,
    backgroundColor: colors.panelRaised,
    overflow: 'hidden',
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.cyanHot,
  },
  brandSub: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.mist,
    marginTop: -4,
  },
  theater: {
    marginTop: 8,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 1,
    color: colors.chalk,
  },
  year: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 1.2,
    color: colors.amber,
  },
  scorePlate: {
    marginTop: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(46,230,200,0.4)',
    borderRadius: radii.md,
    backgroundColor: 'rgba(5,10,18,0.55)',
    gap: 6,
  },
  scoreLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.mist,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  scoreNum: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 68,
    color: colors.cyanHot,
  },
  gradeCol: {
    paddingBottom: 10,
    gap: 2,
  },
  grade: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 34,
    color: colors.amberHot,
  },
  family: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.cyan,
  },
  headline: {
    fontFamily: fonts.bodyMed,
    fontSize: 15,
    lineHeight: 21,
    color: colors.chalk,
  },
  polarRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    flex: 1,
    padding: 10,
    gap: 3,
    borderWidth: 1,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(5,10,16,0.5)',
  },
  chipGain: {
    borderColor: 'rgba(61,207,138,0.45)',
  },
  chipCost: {
    borderColor: 'rgba(255,107,74,0.45)',
  },
  chipKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.safe,
  },
  chipKickerCost: {
    color: colors.alert,
  },
  chipTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.chalk,
  },
  chipBody: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.mist,
  },
  beatInvite: {
    marginTop: 4,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.amberHot,
  },
  shareKicker: {
    fontFamily: fonts.displayMed,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amber,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.sm,
    backgroundColor: colors.panelSolid,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: {
    borderColor: colors.cyanHot,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.chalk,
  },
  actionLabelDark: {
    color: colors.void,
  },
  status: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cyanHot,
  },
});
