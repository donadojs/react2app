const config = {
  projectName: null,
  displayName: null,
  appId: null,
  version: "1.0.0",
  design: {
    icon: "./assets/images/icon.png",
    splash: "./assets/images/splash.png",
  },
  ios: {
    teamId: process.env.N2A_IOS_TEAM_ID,
  },
  android: {
    keyStore: {
      keystorePath: "./release.keystore",
      keystorePassword: process.env.N2A_ANDROID_KEYSTORE_PASSWORD,
      keyAlias: "upload",
      keyPassword: process.env.N2A_ANDROID_KEY_PASSWORD,
    },
  },
};

module.exports = config;
