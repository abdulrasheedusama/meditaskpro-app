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

#### Release Options

After generating the signed APK / AAB, upload it to one of the following:

* Firebase App Distribution
* Google Play Internal Testing

### iOS Build and Release

#### Build via Xcode
Open the iOS project in Xcode and create a release build.

#### Deploy via TestFlight
Upload the build to App Store Connect and distribute it using TestFlight.