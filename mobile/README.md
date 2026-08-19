# Renfo Trail — mobile (Expo / React Native)

Native rewrite of the "Renfo Trail" PWA (`../src`), built with Expo + React Native + TypeScript.
See `/root/.claude/plans/quel-est-le-plan-prancy-cray.md` in the original session, or the repo's
`git log` on this branch, for the full rewrite plan and phase breakdown.

## Status: Phase 0–3 (scaffold, core logic, Home + Player + Done screens)

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
- `src/lib/audio.ts` rewritten on `expo-audio`: the web version synthesizes beeps on the fly with
  a Web Audio oscillator, which has no RN equivalent, so 3 short sine-wave beeps were pre-rendered
  as WAV assets (`assets/sounds/`, generator script not committed) and are played back instead.
- `useTimer.ts` (unchanged) and `useWakeLock.ts` (rewritten on `expo-keep-awake`, much simpler than
  the web's manual `navigator.wakeLock` + visibilitychange dance) power the Player screen.
- Player screen rebuilt: SVG progress ring (`react-native-svg`), progress bar/dots, phase label,
  exercise media, quit-confirm modal, Android hardware-back routed into the same quit flow.
- A minimal Done screen (stats grid + recent history list + back button) closes the loop — full
  History/Profile *modals* (reachable from the Home screen buttons) are still Phase 4.

The full loop (home → player → done → home, with streak/history persisted) is testable end-to-end
on a real device now.

## Not yet built (later phases)

- History/Profile modals (buttons on Home screen still show a placeholder alert), exercise video
  playback in the detail modal (Phase 4)
- Push notifications + Cloudflare Worker adaptation (Phase 5)
- Media/asset polish, bottom-sheet modals (Phase 6)
- EAS build + store submission (Phase 7)

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

## Building a real, installable Android APK (no Expo Go)

`eas.json` is set up with a `preview` profile (`buildType: apk`, internal distribution — no Play
Store needed). Building requires **your own free Expo account**, which this session can't create
or log into on your behalf. From the `mobile/` directory, on your own machine:

```bash
npx eas-cli login          # creates/logs into a free account at expo.dev if needed
npx eas-cli build:configure --platform android   # links this project to your account (one-time)
npx eas-cli build --platform android --profile preview
```

The build runs in Expo's cloud (~10–15 min, free tier). When it finishes, the terminal prints a
link (and Expo emails you one) to download the `.apk` directly — open that link on your Android
phone, download, and Android will prompt to install it (you'll need to allow "install unknown
apps" for your browser once). This gives you a real installed app icon, no dev server or QR code
needed afterwards — though at this stage it still needs the internet for `expo-image`-loaded
exercise photos/videos (`src/config.ts`'s `MEDIA_BASE_URL`), which isn't bundled offline yet.

Store submission (Play Store `production` profile → signed `.aab`) is still Phase 7 — it needs a
Google Play Console account and app-signing setup, not just `eas.json`.
