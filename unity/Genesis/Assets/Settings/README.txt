URP / volume assets are created by:

  Genesis → Rebuild Theater Play Slice
  Genesis → Ensure URP Pipeline Assets

Expected outputs:
  Genesis_URP_Renderer.asset
  Genesis_URP_Pipeline.asset
  Genesis_TheaterVolume.asset   (Bloom, Vignette, Color Adjustments, Film Grain,
                                 Lift Gamma Gain, ACES Tonemapping, SMH)

Runtime material grade (no .mat assets required):
  TheaterMaterialFactory — DeepWater, CoastFoam, OpsGrid, BeaconIdle/Selected
  TheaterBoardBuilder — coast foam ring + faint ops grid under land
  TheaterPlayBootstrap — Key/Fill/Rim/Bounce + HorizonLight under-glow

Runtime fallback: TheaterPlayBootstrap builds the same volume grade if assets are missing.
Play Mode capture awaits local worker / licensed Hub — do not block repo polish on it.
