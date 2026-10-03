# Play / EAS secrets (gitignored)

Place Google Play service-account JSON here for EAS Submit:

- Expected path (see `eas.json` → `submit.production.android.serviceAccountKeyPath`):
  `./secrets/play-service-account.json`

Do **not** commit that JSON. Upload it via `eas credentials --platform android` or keep it local only.

Also required outside this folder (EAS Secrets / local `.env`, never committed):

- `EXPO_PUBLIC_REVENUECAT_KEY`
- Optional: `EXPO_PUBLIC_OPENAI_API_KEY`, `EXPO_PUBLIC_LEADERBOARD_API_URL`
- Real EAS `projectId` in `app.json` → `extra.eas.projectId` (replace `REPLACE_WITH_EAS_PROJECT_ID`)
