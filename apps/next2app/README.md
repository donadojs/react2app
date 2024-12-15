# next2app (beta)

next2app lets you turn your React or Next.js web apps into iOS and Android mobile apps easily.
No mobile development experience needed - just use your React skills and we'll handle the rest.

## Warning

The most of the features are under development, so let me know if you find any bugs!

## Prerequisites

- Node.js 14.0 or higher
- npm or yarn package manager
- Next.js project
- iOS App Store / Google Play Store developer accounts

## Quick Start

### 1. Start Development Server (beta)

```bash
npx next2app dev
```

Preview your app instantly using 'Expo Go' (You can download on the App Store and Play Store).

### 2. Build Your App

```bash
npx next2app build
```

Creates production-ready builds for both iOS and Android platforms.

** Currently only iOS is supported **
Before run build, you need to create Apple Developer account and setup [Apple Developer Program](https://developer.apple.com/programs/). Also, you need to login to Xcode if you haven't done that yet.

### 3. Deploy (under development)

```bash
npx next2app deploy
```

Automates the app store submission process with guided form filling.

## ⚙️ Configuration

Create `next2app.config.js` in your project root:

```javascript
module.exports = {
  port: 3000,
  output: "build",
  publicPath: "/",
  app: {
    name: "My App",
    version: "1.0.0",
    identifier: "com.myapp.app",
    icon: "./assets/icon.png",
  },
  // Additional configuration options
};
```

## Documentation

For detailed documentation, visit:

- [Docs](https://next2app.com/docs)

## Issue Reporting

Found a bug? Please report it on our [GitHub Issues](https://github.com/donadojs/next2app/issues) page.
