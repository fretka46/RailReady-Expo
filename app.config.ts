 import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'RailReady (Dev)' : 'RailReady',
  slug: 'RailReady',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/AppIcon.png',
  scheme: 'railready',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'cz.cvut.vondrjon.railready.dev' : 'cz.cvut.vondrjon.railready',
    icon: IS_DEV ? './assets/AppIconDev.png' : './assets/AppIcon.png',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    package: IS_DEV ? 'cz.cvut.vondrjon.railready.dev' : 'cz.cvut.vondrjon.railready',
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: IS_DEV ? './assets/AppIconDev.png' : './assets/AppIcon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        android: {
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: '97bfe1de-886d-40d7-9aa1-7a17262c5cb0',
    },
  },
});
