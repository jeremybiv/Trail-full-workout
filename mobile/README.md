# Renfo Trail — mobile (Expo / React Native)

Native rewrite of the "Renfo Trail" PWA (`../src`), built with Expo + React Native + TypeScript.
See `/root/.claude/plans/quel-est-le-plan-prancy-cray.md` in the original session, or the repo's
`git log` on this branch, for the full rewrite plan and phase breakdown.

## Status: Phase 0–2 (scaffold, core logic, Home screen)

- Project scaffold (Expo SDK 57, TypeScript)
- Core logic ported from `../src/lib`, `../src/data`, `../src/animations` (session generation,
  RNG, exercise catalog, stick-figure Lottie animations) — copied as-is, no DOM dependency.
- `src/lib/storage.ts` rewritten on `@react-native-async-storage/async-storage` (same `sg`/`ss`
  interface as the web app).
- `src/hooks/useProfile.ts` ported with `expo-crypto` replacing `crypto.randomUUID()`.
- Home screen fully rebuilt with React Native primitives (see `src/components/screens/HomeScreen.tsx`),
  theme tokens ported from `../src/index.css` custom properties (`src/theme/tokens.ts`).
- Exercise photos/videos are **not bundled** in the app — `src/config.ts`'s `MEDIA_BASE_URL` points
  at the deployed web app's origin and exercise media is fetched over HTTP via `expo-image`
  (disk-cached). **Update `MEDIA_BASE_URL` to the real production domain** before testing on a
  device or doing an EAS build.

## Not yet built (later phases)

- Player screen, timer, audio, wake lock, quit-confirm (Phase 3)
- Done screen, History/Profile modals, exercise video playback (Phase 4)
- Push notifications + Cloudflare Worker adaptation (Phase 5)
- Media/asset polish, bottom-sheet modals (Phase 6)
- EAS build + store submission (Phase 7)

`useTimer.ts` was intentionally **not** copied yet — it imports `../lib/audio`, which doesn't
have a React Native implementation until Phase 3.

## Why files are duplicated instead of imported from `../src`

The web app's `tsconfig` targets the DOM lib and Vite/Rollup bundling; this project targets
Hermes/Metro with no DOM. Cross-importing would require unifying both toolchains. Instead, the
portable logic/data files under `src/lib`, `src/data`, `src/animations` are **copied** here.
If you change exercise data, session math, or the RNG in the web app, mirror the change here too
(or, once the web app is retired/frozen, promote these into a shared workspace package).

## Development

```bash
npm install
npx expo start   # scan the QR code with Expo Go on your phone
npx tsc --noEmit # typecheck
```

No iOS/Android simulator is available in the sandboxed session that built this — verification
there was limited to `tsc --noEmit`, `expo export`, and `expo-doctor`. Please test on a real
device via Expo Go and report back anything that looks wrong.
