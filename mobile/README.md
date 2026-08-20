# Renfo Trail — mobile (Expo / React Native)

Native rewrite of the "Renfo Trail" PWA (`../src`), built with Expo + React Native + TypeScript.
See `/root/.claude/plans/quel-est-le-plan-prancy-cray.md` in the original session, or the repo's
`git log` on this branch, for the full rewrite plan and phase breakdown.

## Status: Phase 0–6 (scaffold, core logic, all 4 screens, notifications, bottom-sheet modals)

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
- A minimal Done screen (stats grid + recent history list + back button) closes the loop.
- `ExerciseVideo.tsx` added on `expo-video` (`useVideoPlayer` + `VideoView`) and wired in wherever
  the web app shows one: the exercise detail modal (when `exercise.video` is set) and the Player
  screen's hero during the `work` phase (replacing the circular media/lottie).
- `HistoryModal.tsx` (stats grid + full scrollable history list) and `ProfileModal.tsx` (stats +
  weekly-goal picker, both backed by the already-ported `useWorkoutHistory`/`useProfile` hooks) are
  now real modals reachable from the Home screen's 📋/👤 buttons — no more placeholder alerts.
- `useNotifications.ts` rewritten on `expo-notifications`: a **local, on-device daily reminder**
  (not Web Push). This is a deliberate architecture change from the web version, not just a 1:1
  port — see the comment at the top of that file. The web app's Cloudflare Worker evaluates hourly
  whether each device has met its weekly goal and only pushes if not; reproducing that "goal-aware"
  suppression with local notifications would need periodic rescheduling that only happens when the
  app is opened (no background execution without a dev-client build), which isn't reliable enough
  to be worth the complexity. Instead: pick a time in the Profile modal, get a daily reminder at
  that time, unconditionally — no backend involved. `ProfileModal`'s notification section is now a
  real `Switch` + `@react-native-community/datetimepicker` time picker, permission-request flow
  included.

- `Sheet.tsx` added: a shared wrapper around `@gorhom/bottom-sheet`'s `BottomSheetModal`
  (drag handle, backdrop, tap-outside/drag-down to dismiss, theme colors) that
  `HistoryModal.tsx`, `ProfileModal.tsx` and `ExerciseDetailModal.tsx` are now built on, replacing
  the plain RN `<Modal>` + `Pressable` backdrop from earlier phases with a real native-feeling
  sheet. Needed `react-native-reanimated` (v4 — note its new split-out `react-native-worklets`
  peer dependency, a separate package as of v4) and `react-native-gesture-handler`
  (`GestureHandlerRootView` wraps the app root in `App.tsx`; `import 'react-native-gesture-handler'`
  is the very first line of `index.ts`, as required). `HistoryModal` uses fixed snap points
  (`['55%', '90%']`) with a `BottomSheetScrollView` for its list; `ProfileModal`/`ExerciseDetailModal`
  use dynamic sizing.
- `ExercisePhoto.tsx` tuned: `cachePolicy` bumped to `memory-disk` (the same photo URL is reused
  between the Home screen's small card and the bigger detail-modal/player views — keeping decoded
  bitmaps in memory avoids a re-decode/flicker switching between them) plus a `transition={150}`
  fade-in on load.

The full loop (home → player → done → home, with streak/history persisted, exercise videos
playing, History/Profile reachable via real bottom sheets, and a working daily reminder) is
testable end-to-end on a real device now — this is feature-complete relative to the web app
except for its "goal-aware" push logic (see above).

## Not yet built (later phases)

- EAS build + store submission (Phase 7 — `eas.json` scaffolded, see below)

## Note on the Cloudflare Worker (`../worker`)

It's now only used by the web app (Web Push). The mobile app's reminders are fully local and never
call it. If the web app is ever retired, the worker's push-subscription code can be deleted too.

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
