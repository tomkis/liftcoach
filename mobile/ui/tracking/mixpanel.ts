import { Mixpanel } from 'mixpanel-react-native'

const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN

export const mixpanel = token ? new Mixpanel(token, false, false) : null

export const mixpanelReady: Promise<void> = mixpanel
  ? mixpanel.init().then(() => {
      mixpanel.setServerURL('https://api-eu.mixpanel.com')
    })
  : Promise.resolve()
