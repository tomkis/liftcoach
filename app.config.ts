import type { ConfigContext, ExpoConfig } from 'expo/config'

const IS_PROD = process.env.APP_VARIANT !== 'development'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? 'LiftCoach' : '(DEV) LiftCoach',
  slug: 'liftcoach',
  privacy: 'unlisted',
  scheme: 'liftcoach',
  version: '3.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#121212',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.liftcoach.app',
    config: {
      usesNonExemptEncryption: false,
    },
  },
  extra: {
    eas: {
      projectId: '0292fa2b-2a5f-4a29-a07d-9990e99bfdce',
    },
  },
  updates: {},
  runtimeVersion: {
    policy: 'appVersion',
  },
  plugins: [
    [
      '@sentry/react-native/expo',
      {
        organization: 'trainer-mh',
        project: 'trainer-dev',
      },
    ],
  ],
})
