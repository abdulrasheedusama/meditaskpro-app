# MediTaskPro

## How to Run the App

### Prerequisites
Make sure the following are installed on your machine:

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) or a physical Android device
- Xcode (optional, for iOS development on macOS)

### Install Dependencies
```bash
npm install
```
### Start the Development Server
```bash
npm run start
```
### Run on Android
```bash
npm run android
```

## How to Deploy the App
### CI/CD Pipeline

This project should include the following pipeline file:

```bash
.github/workflows/mobile-ci.yml
```

The pipeline should:

* Install dependencies
* Run lint
* Run TypeScript check
* Build Android APK
* Archive build artifacts

### Android Build and Release

Generate Signed APK

Using EAS Build:

```bash
npm install -g eas-cli
eas login
eas build -p android
```

#### Firebase App Distribution

The project is configured for Firebase App Distribution on Android.

1. Build an Android APK with EAS:

```bash
npm run build:firebase
```

2. Authenticate Firebase CLI using either `firebase login` or a service account:

```bash
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\firebase-service-account.json"
```

3. Upload the generated APK or AAB to Firebase App Distribution:

```bash
npm run distribute:firebase -- path\to\app.apk --groups qa-team
```

Notes:

* `app.json` points Expo to `google-services.json` for Android builds.
* The default Firebase Android App ID is loaded from the current `google-services.json`.
* You can override it with `FIREBASE_APP_ID`.
* You can pass any Firebase CLI distribution flags after the artifact path, for example `--testers`, `--groups`, or `--release-notes`.

#### Release Options

After generating the signed APK / AAB, upload it to one of the following:

* Firebase App Distribution
* Google Play Internal Testing

### iOS Build and Release

#### Build via Xcode
Open the iOS project in Xcode and create a release build.

#### Deploy via TestFlight
Upload the build to App Store Connect and distribute it using TestFlight.
