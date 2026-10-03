import { Audio, type AVPlaybackSource } from 'expo-av';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type SfxName = 'tick' | 'deploy' | 'commit' | 'riser' | 'sting';
export type AmbientEra = 'early' | 'war' | 'cold' | 'modern';
export type MusicCue = 'intro' | 'peak' | 'resolve' | 'coda';
export type MusicPhase = 'idle' | 'intro' | 'ambient' | 'peak' | 'resolve' | 'coda';

const SFX: Record<SfxName, AVPlaybackSource> = {
  tick: require('../../assets/sfx/tick.wav'),
  deploy: require('../../assets/sfx/deploy.wav'),
  commit: require('../../assets/sfx/commit.wav'),
  riser: require('../../assets/sfx/riser.wav'),
  sting: require('../../assets/sfx/sting.wav'),
};

const AMBIENT: Record<AmbientEra, AVPlaybackSource> = {
  early: require('../../assets/sfx/ambient_era_early.wav'),
  war: require('../../assets/sfx/ambient_era_war.wav'),
  cold: require('../../assets/sfx/ambient_era_cold.wav'),
  modern: require('../../assets/sfx/ambient_era_modern.wav'),
};

const MUSIC_BED: Record<AmbientEra, AVPlaybackSource> = {
  early: require('../../assets/sfx/music_early.wav'),
  war: require('../../assets/sfx/music_war.wav'),
  cold: require('../../assets/sfx/music_cold.wav'),
  modern: require('../../assets/sfx/music_modern.wav'),
};

const MUSIC_CUE: Record<MusicCue, AVPlaybackSource> = {
  intro: require('../../assets/sfx/music_intro.wav'),
  peak: require('../../assets/sfx/music_peak.wav'),
  resolve: require('../../assets/sfx/music_resolve.wav'),
  coda: require('../../assets/sfx/music_coda.wav'),
};

type SoundApi = {
  unlocked: boolean;
  muted: boolean;
  unlock: () => Promise<void>;
  toggleMute: () => void;
  play: (name: SfxName, opts?: { volume?: number }) => Promise<void>;
  setAmbient: (era: AmbientEra | null) => Promise<void>;
  ambientEra: AmbientEra | null;
  musicPhase: MusicPhase;
  /** Start scored sequence for a theater (intro → ambient bed). */
  beginMusicSequence: (era: AmbientEra) => Promise<void>;
  /** Tension swell into commit. */
  peakMusic: () => Promise<void>;
  /** Resolve cue then optional coda bed (after-action). */
  resolveMusic: (opts?: { coda?: boolean }) => Promise<void>;
  /** Soft home/menu bed. */
  playMenuMusic: () => Promise<void>;
  stopMusic: () => Promise<void>;
};

const SoundContext = createContext<SoundApi | null>(null);

export function eraFromYear(year: number): AmbientEra {
  if (year < 1914) return 'early';
  if (year < 1945) return 'war';
  if (year < 1991) return 'cold';
  return 'modern';
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ambientEra, setAmbientEraState] = useState<AmbientEra | null>(null);
  const [musicPhase, setMusicPhase] = useState<MusicPhase>('idle');
  const ambientRef = useRef<Audio.Sound | null>(null);
  const musicBedRef = useRef<Audio.Sound | null>(null);
  const mutedRef = useRef(false);
  const unlockedRef = useRef(false);
  const eraRef = useRef<AmbientEra | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    unlockedRef.current = unlocked;
  }, [unlocked]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});
    return () => {
      ambientRef.current?.unloadAsync().catch(() => {});
      musicBedRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const unlock = useCallback(async () => {
    if (unlockedRef.current) return;
    try {
      const { sound } = await Audio.Sound.createAsync(SFX.tick, { volume: 0.01, shouldPlay: true });
      await sound.stopAsync();
      await sound.unloadAsync();
      setUnlocked(true);
      unlockedRef.current = true;
    } catch {
      setUnlocked(true);
      unlockedRef.current = true;
    }
  }, []);

  const play = useCallback(async (name: SfxName, opts?: { volume?: number }) => {
    if (mutedRef.current || !unlockedRef.current) return;
    try {
      const { sound } = await Audio.Sound.createAsync(SFX[name], {
        volume: opts?.volume ?? (name === 'tick' ? 0.18 : 0.28),
        shouldPlay: true,
      });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch {
      // ignore
    }
  }, []);

  const playCue = useCallback(async (cue: MusicCue, volume = 0.22) => {
    if (mutedRef.current || !unlockedRef.current) return;
    try {
      const { sound } = await Audio.Sound.createAsync(MUSIC_CUE[cue], {
        volume,
        shouldPlay: true,
      });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch {
      // ignore
    }
  }, []);

  const stopMusicBed = useCallback(async () => {
    if (musicBedRef.current) {
      await musicBedRef.current.stopAsync().catch(() => {});
      await musicBedRef.current.unloadAsync().catch(() => {});
      musicBedRef.current = null;
    }
  }, []);

  const startMusicBed = useCallback(
    async (era: AmbientEra, volume = 0.1) => {
      await stopMusicBed();
      if (mutedRef.current || !unlockedRef.current) return;
      try {
        const { sound } = await Audio.Sound.createAsync(MUSIC_BED[era], {
          isLooping: true,
          volume,
          shouldPlay: true,
        });
        musicBedRef.current = sound;
      } catch {
        // optional
      }
    },
    [stopMusicBed],
  );

  const setAmbient = useCallback(async (era: AmbientEra | null) => {
    setAmbientEraState(era);
    eraRef.current = era;
    try {
      if (ambientRef.current) {
        await ambientRef.current.stopAsync().catch(() => {});
        await ambientRef.current.unloadAsync().catch(() => {});
        ambientRef.current = null;
      }
      if (!era || mutedRef.current || !unlockedRef.current) return;
      const { sound } = await Audio.Sound.createAsync(AMBIENT[era], {
        isLooping: true,
        volume: 0.08,
        shouldPlay: true,
      });
      ambientRef.current = sound;
    } catch {
      // ambient optional
    }
  }, []);

  const beginMusicSequence = useCallback(
    async (era: AmbientEra) => {
      eraRef.current = era;
      setMusicPhase('intro');
      await playCue('intro', 0.24);
      await setAmbient(era);
      await startMusicBed(era, 0.09);
      setMusicPhase('ambient');
    },
    [playCue, setAmbient, startMusicBed],
  );

  const peakMusic = useCallback(async () => {
    setMusicPhase('peak');
    if (musicBedRef.current) {
      musicBedRef.current.setVolumeAsync(0.06).catch(() => {});
    }
    await playCue('peak', 0.26);
    await play('riser', { volume: 0.2 });
  }, [playCue, play]);

  const resolveMusic = useCallback(
    async (opts?: { coda?: boolean }) => {
      setMusicPhase('resolve');
      await playCue('resolve', 0.24);
      await play('sting', { volume: 0.22 });
      if (opts?.coda) {
        const era = eraRef.current ?? 'cold';
        await stopMusicBed();
        if (!mutedRef.current && unlockedRef.current) {
          try {
            const { sound } = await Audio.Sound.createAsync(MUSIC_CUE.coda, {
              isLooping: true,
              volume: 0.1,
              shouldPlay: true,
            });
            musicBedRef.current = sound;
            setMusicPhase('coda');
          } catch {
            setMusicPhase('idle');
          }
        }
      } else {
        if (musicBedRef.current) {
          musicBedRef.current.setVolumeAsync(0.08).catch(() => {});
        }
        setMusicPhase('ambient');
      }
    },
    [playCue, play, stopMusicBed],
  );

  const playMenuMusic = useCallback(async () => {
    setMusicPhase('ambient');
    await startMusicBed('modern', 0.07);
  }, [startMusicBed]);

  const stopMusic = useCallback(async () => {
    await stopMusicBed();
    setMusicPhase('idle');
  }, [stopMusicBed]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      if (next) {
        ambientRef.current?.setVolumeAsync(0).catch(() => {});
        ambientRef.current?.pauseAsync().catch(() => {});
        musicBedRef.current?.setVolumeAsync(0).catch(() => {});
        musicBedRef.current?.pauseAsync().catch(() => {});
      } else if (unlockedRef.current) {
        if (ambientRef.current) {
          ambientRef.current.setVolumeAsync(0.08).catch(() => {});
          ambientRef.current.playAsync().catch(() => {});
        }
        if (musicBedRef.current) {
          musicBedRef.current.setVolumeAsync(0.09).catch(() => {});
          musicBedRef.current.playAsync().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!muted && unlocked && ambientEra) {
      setAmbient(ambientEra);
    }
    if (muted && ambientRef.current) {
      ambientRef.current.pauseAsync().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, unlocked]);

  const value = useMemo<SoundApi>(
    () => ({
      unlocked,
      muted,
      unlock,
      toggleMute,
      play,
      setAmbient,
      ambientEra,
      musicPhase,
      beginMusicSequence,
      peakMusic,
      resolveMusic,
      playMenuMusic,
      stopMusic,
    }),
    [
      unlocked,
      muted,
      unlock,
      toggleMute,
      play,
      setAmbient,
      ambientEra,
      musicPhase,
      beginMusicSequence,
      peakMusic,
      resolveMusic,
      playMenuMusic,
      stopMusic,
    ],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
}
