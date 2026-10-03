#!/usr/bin/env python3
"""Generate modern, quiet, royalty-safe thriller beds + soft SFX for Genesis."""
from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

import numpy as np

OUT = Path("/workspace/assets/sfx")
OUT.mkdir(parents=True, exist_ok=True)
SR = 44100


def write_wav(path: Path, samples: np.ndarray, sr: int = SR) -> None:
    samples = np.clip(samples, -1.0, 1.0)
    pcm = (samples * 32767.0).astype(np.int16)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    print(f"wrote {path.name}  {len(samples)/sr:.1f}s  {path.stat().st_size} bytes")


def env_ad(n: int, attack: float, release: float, sr: int = SR) -> np.ndarray:
    a = max(1, int(attack * sr))
    r = max(1, int(release * sr))
    e = np.ones(n, dtype=np.float64)
    e[:a] = np.linspace(0, 1, a)
    if r < n:
        e[-r:] = np.linspace(1, 0, r)
    return e


def soft_pad(duration: float, freqs: list[float], detune: float = 0.004) -> np.ndarray:
    """Warm multi-sine pad — no harsh noise beds."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n, dtype=np.float64)
    for i, f in enumerate(freqs):
        amp = 0.22 / (1 + i * 0.35)
        # slight chorus
        sig += amp * np.sin(2 * math.pi * f * (1 - detune) * t)
        sig += amp * 0.7 * np.sin(2 * math.pi * f * (1 + detune) * t)
        # soft 5th
        sig += amp * 0.25 * np.sin(2 * math.pi * f * 1.5 * t)
    # slow amplitude breathe
    breathe = 0.82 + 0.18 * np.sin(2 * math.pi * 0.07 * t)
    # gentle low-pass via moving average
    kernel = np.ones(48) / 48
    sig = np.convolve(sig * breathe, kernel, mode="same")
    sig *= env_ad(n, 1.2, 1.5)
    # peak normalize softly
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.38


def soft_pulse(duration: float, bpm: float = 68, tone: float = 55.0) -> np.ndarray:
    """Subtle thriller pulse — low sine thumps, not industrial."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    beat = 60.0 / bpm
    sig = np.zeros(n, dtype=np.float64)
    i = 0.0
    while i < duration:
        start = int(i * SR)
        length = int(0.18 * SR)
        if start + length > n:
            break
        tt = np.arange(length) / SR
        thump = np.sin(2 * math.pi * tone * tt) * np.exp(-tt * 14)
        # soft sub
        thump += 0.4 * np.sin(2 * math.pi * (tone * 0.5) * tt) * np.exp(-tt * 10)
        sig[start : start + length] += thump * 0.35
        i += beat
    # very quiet filtered hiss for air (not abrasive)
    rng = np.random.default_rng(42)
    hiss = rng.normal(0, 0.012, n)
    kernel = np.ones(96) / 96
    hiss = np.convolve(hiss, kernel, mode="same")
    sig = sig + hiss
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.32


def ambient_bed(seed: int, character: str) -> np.ndarray:
    """~8s looping ambient — airy, modern, low energy."""
    rng = np.random.default_rng(seed)
    duration = 8.0
    bases = {
        "early": [110.0, 164.8, 220.0],
        "war": [98.0, 146.8, 196.0],
        "cold": [87.3, 130.8, 174.6],
        "modern": [82.4, 123.5, 164.8],
    }[character]
    pad = soft_pad(duration, bases, detune=0.003 + rng.random() * 0.002)
    # sparse soft chimes
    n = len(pad)
    t = np.arange(n) / SR
    chime = np.zeros(n, dtype=np.float64)
    for k in range(4):
        f = bases[k % len(bases)] * 2
        start = int((1.2 + k * 1.7) * SR)
        length = int(1.4 * SR)
        if start + length > n:
            continue
        tt = np.arange(length) / SR
        tone = np.sin(2 * math.pi * f * tt) * np.exp(-tt * 2.2)
        tone += 0.3 * np.sin(2 * math.pi * f * 2 * tt) * np.exp(-tt * 3.5)
        chime[start : start + length] += tone * 0.08
    out = pad + chime
    # crossfade edges for seamless loop
    fade = int(0.4 * SR)
    ramp = np.linspace(0, 1, fade)
    out[:fade] *= ramp
    out[-fade:] *= ramp[::-1]
    # mix start into end for loop
    out[-fade:] += out[:fade][::-1] * 0.0  # already faded
    peak = np.max(np.abs(out)) or 1.0
    return out / peak * 0.34


def music_bed(seed: int, character: str) -> np.ndarray:
    """~14s scored bed — subtle tension, premium game score feel."""
    rng = np.random.default_rng(seed + 7)
    duration = 14.0
    roots = {
        "early": [65.4, 98.0, 130.8, 196.0],
        "war": [61.7, 92.5, 123.5, 185.0],
        "cold": [55.0, 82.4, 110.0, 164.8],
        "modern": [49.0, 73.4, 98.0, 146.8],
    }[character]
    pad = soft_pad(duration, roots[:3], detune=0.0025)
    pulse = soft_pulse(duration, bpm=62 + rng.integers(0, 8), tone=roots[0])
    # high soft shimmer (not screech)
    n = len(pad)
    t = np.arange(n) / SR
    shimmer = 0.04 * np.sin(2 * math.pi * roots[3] * t) * (0.5 + 0.5 * np.sin(2 * math.pi * 0.11 * t))
    kernel = np.ones(64) / 64
    shimmer = np.convolve(shimmer, kernel, mode="same")
    out = pad * 0.75 + pulse * 0.45 + shimmer
    fade = int(0.6 * SR)
    ramp = np.linspace(0, 1, fade)
    out[:fade] *= ramp
    out[-fade:] *= ramp[::-1]
    peak = np.max(np.abs(out)) or 1.0
    return out / peak * 0.36


def cue_intro() -> np.ndarray:
    duration = 2.4
    n = int(duration * SR)
    t = np.arange(n) / SR
    sig = (
        0.35 * np.sin(2 * math.pi * 98 * t)
        + 0.22 * np.sin(2 * math.pi * 147 * t)
        + 0.12 * np.sin(2 * math.pi * 196 * t)
    )
    sig *= env_ad(n, 0.35, 0.9)
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.4


def cue_peak() -> np.ndarray:
    duration = 3.2
    n = int(duration * SR)
    t = np.arange(n) / SR
    # rising soft fifths — thriller swell without grit
    f0 = 90 + 40 * (t / duration)
    sig = 0.3 * np.sin(2 * math.pi * f0 * t)
    sig += 0.18 * np.sin(2 * math.pi * f0 * 1.5 * t)
    sig += 0.1 * np.sin(2 * math.pi * f0 * 2 * t)
    sig *= env_ad(n, 0.2, 0.5)
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.38


def cue_resolve() -> np.ndarray:
    duration = 2.0
    n = int(duration * SR)
    t = np.arange(n) / SR
    sig = (
        0.32 * np.sin(2 * math.pi * 130.8 * t)
        + 0.2 * np.sin(2 * math.pi * 164.8 * t)
        + 0.12 * np.sin(2 * math.pi * 196 * t)
    )
    sig *= np.exp(-t * 1.4)
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.36


def cue_coda() -> np.ndarray:
    return soft_pad(10.0, [82.4, 123.5, 164.8], detune=0.002)


def sfx_tick() -> np.ndarray:
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    sig = 0.4 * np.sin(2 * math.pi * 880 * t) * np.exp(-t * 80)
    return sig


def sfx_deploy() -> np.ndarray:
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    sig = 0.35 * np.sin(2 * math.pi * 220 * t) * np.exp(-t * 8)
    sig += 0.15 * np.sin(2 * math.pi * 440 * t) * np.exp(-t * 12)
    return sig


def sfx_commit() -> np.ndarray:
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    sig = 0.3 * np.sin(2 * math.pi * 110 * t) * np.exp(-t * 5)
    sig += 0.2 * np.sin(2 * math.pi * 165 * t) * np.exp(-t * 6)
    sig += 0.1 * np.sin(2 * math.pi * 330 * t) * np.exp(-t * 10)
    return sig


def sfx_riser() -> np.ndarray:
    """Soft tension rise — no white-noise scream."""
    duration = 1.6
    n = int(duration * SR)
    t = np.arange(n) / SR
    f = 120 + 180 * (t / duration)
    sig = 0.28 * np.sin(2 * math.pi * f * t)
    sig += 0.12 * np.sin(2 * math.pi * f * 1.5 * t)
    sig *= env_ad(n, 0.15, 0.25)
    peak = np.max(np.abs(sig)) or 1.0
    return sig / peak * 0.34


def sfx_sting() -> np.ndarray:
    """Soft resolve hit — muted, not abrasive."""
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    sig = 0.28 * np.sin(2 * math.pi * 98 * t) * np.exp(-t * 4)
    sig += 0.16 * np.sin(2 * math.pi * 147 * t) * np.exp(-t * 5)
    sig += 0.08 * np.sin(2 * math.pi * 294 * t) * np.exp(-t * 9)
    return sig


def main() -> None:
    eras = ["early", "war", "cold", "modern"]
    for i, era in enumerate(eras):
        write_wav(OUT / f"ambient_era_{era}.wav", ambient_bed(100 + i, era))
        write_wav(OUT / f"music_{era}.wav", music_bed(200 + i, era))

    write_wav(OUT / "music_intro.wav", cue_intro())
    write_wav(OUT / "music_peak.wav", cue_peak())
    write_wav(OUT / "music_resolve.wav", cue_resolve())
    write_wav(OUT / "music_coda.wav", cue_coda())

    write_wav(OUT / "tick.wav", sfx_tick())
    write_wav(OUT / "deploy.wav", sfx_deploy())
    write_wav(OUT / "commit.wav", sfx_commit())
    write_wav(OUT / "riser.wav", sfx_riser())
    write_wav(OUT / "sting.wav", sfx_sting())
    print("done")


if __name__ == "__main__":
    main()
