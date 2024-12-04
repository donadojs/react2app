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
};

module.exports = config;
