# Expo Prebuild Project

This project is built using [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/) to generate native code.

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- Android Sdk
- JDK

### Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/mhmtsni/Video-Diary.git
   cd Video-Diary
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App
#### Android
For Android, the app **must** be started with:
```sh
npx expo run:android
```
Ensure that an Android device or emulator is running before executing the command.

#### iOS
This app has **not been tested on iPhones**. If you want to run it on iOS, you may need a Mac with Xcode installed. You can try:
```sh
npx expo run:ios
```

## Additional Notes
- If you encounter issues, ensure that Expo and your dependencies are up to date.
- If the Android build fails, check that Android Studio is properly set up with the necessary SDKs.

