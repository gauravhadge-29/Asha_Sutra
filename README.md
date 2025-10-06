<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Village Health Monitor (Asha Sutra)

A lightweight React + Capacitor mobile application for ASHA workers to manage patient records, view training, coordinate with community peers, and sync data offline.

This repository uses Vite, React (TypeScript), Tailwind CSS styling, and Capacitor for Android packaging.

## Key Features

- Patient entry and family health modules with validation and feedback
- Training modules with embedded video support
- Community directory and messaging (mobile-optimized UI)
- Quick Actions dashboard for common workflows
- Dark/Light theme with system preference
- Offline sync and background data sync (Capacitor-based)

## Project structure (important files)

- `App.tsx` - App root and navigation
- `components/` - React components (Dashboard, Community, Training, etc.)
- `hooks/` - Custom hooks (auth, sync, theme, network)
- `services/` - API and local data adapters
- `android/` - Capacitor Android project and Gradle build

## Prerequisites

- Node.js >= 18 (tested with Node 22)
- npm >= 9
- Java JDK 11+ (for Android Gradle build)
- Android SDK and platform tools
- Android Studio (recommended for signing, emulators, and debugging)
- Capacitor CLI (installed automatically via npm dev deps)

## Quick setup (development)

1. Install dependencies:

```powershell
cd "g:\village-health-monitor (1)"
npm install
```

2. Start dev server (Vite):

```powershell
npm run dev
```

3. Open the app in the browser at the printed URL (hot reload enabled).

## Build for production (web)

```powershell
npm run build
```

The production build goes into `dist/` and is used by Capacitor when packaging for Android.

## Build Android APK (debug)

The repository includes Capacitor configuration and an Android project under `android/`.

1. Sync web assets to Android:

```powershell
npx cap sync android
```

2. Build the debug APK with Gradle (PowerShell example):

```powershell
cd android
.\gradlew assembleDebug
```

3. After a successful build, the debug APK will be located at:

```
android\app\build\outputs\apk\debug\app-debug.apk
```

For convenience, during the last build we copied the debug APK to the repo root as `asha-sutra.apk`.

## Release / Signed APK

To build a release (signed) APK you must provide a Java keystore and signing information. Typical steps:

1. Generate a keystore (only once):

```powershell
keytool -genkeypair -v -keystore release-keystore.jks -alias asha-key -keyalg RSA -keysize 2048 -validity 10000
```

2. Add signing configuration to `android/app/build.gradle` (or use Android Studio's signing config). Example properties to set in `~/.gradle/gradle.properties` or `android/gradle.properties`:

```
RELEASE_STORE_FILE=/absolute/path/to/release-keystore.jks
RELEASE_STORE_PASSWORD=your_keystore_password
RELEASE_KEY_ALIAS=asha-key
RELEASE_KEY_PASSWORD=your_key_password
```

3. Build release APK or bundle via Gradle:

```powershell
cd android
.\gradlew assembleRelease
# or to generate an AAB
.\gradlew bundleRelease
```

4. Sign and align: The Gradle signing config usually handles signing if properties are present. If you need to sign manually, use `jarsigner` and `zipalign`.

## Environment & Config

- App-level configuration exists in `capacitor.config.ts` and `metadata.json`.
- API endpoints and feature flags live in `services/api.ts` and `constants.ts`.

## Troubleshooting

- Build warnings about large chunks: consider dynamic imports or manual chunking in `vite.config.ts`.
- If Capacitor asks for signing options on `npx cap build android`, either build via Gradle (`assembleDebug`) or provide signing props for release builds.
- If `npm run dev` fails, check the console for JSX or TypeScript errors; the project uses Vite's fast refresh and will show exact file/line details.

## Testing

- The project does not currently include a test harness; adding unit and integration tests is recommended using Jest + React Testing Library.

## Contributing

1. Fork the repo and create a feature branch.
2. Implement changes and add tests where possible.
3. Open a pull request with a concise description of the change.

## License

Add your project license here (e.g., MIT) or keep proprietary if required.

---

If you'd like, I can also:
- Add a `CONTRIBUTING.md` or `CHANGELOG.md`.
- Add a CI workflow to build the APK automatically (GitHub Actions).
- Add automated tests and a code-splitting improvement for the large Vite chunk.

Which of these would you like next?
