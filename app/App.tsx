import { NavigationContainer } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'
import * as Font from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { initDb } from '@/mobile/db'
import { createLocalContext } from '@/mobile/local-context'
import { localTRPCLink } from '@/mobile/local-trpc-link'
import { trpc } from '@/mobile/trpc'
import { EmptyWrapper } from '@/mobile/ui/components/empty-wrapper'
import { RootStack } from '@/mobile/ui/root/root-stack'
import { MixpanelProvider } from '@/mobile/ui/tracking/with-mixpanel'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.EXPO_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      client: 'mobile',
      platform: 'react-native',
    },
  },
})

const handleError = (err: unknown) => {
  if (err instanceof TRPCClientError) {
    console.error('tRPC error:', err.message)
  }
}

const AppComponent = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        await Font.loadAsync({
          Orbitron_400Regular: require('../assets/fonts/orbitron/Orbitron-Regular.ttf'),
          Orbitron_500Medium: require('../assets/fonts/orbitron/Orbitron-Medium.ttf'),
          Orbitron_700Bold: require('../assets/fonts/orbitron/Orbitron-Bold.ttf'),
          SairaC_400Regular: require('../assets/fonts/saira-condensed/SairaCondensed-Regular.ttf'),
          SairaC_600SemiBold: require('../assets/fonts/saira-condensed/SairaCondensed-SemiBold.ttf'),
          SairaC_700Bold: require('../assets/fonts/saira-condensed/SairaCondensed-Bold.ttf'),
          Saira_400Regular: require('../assets/fonts/saira/Saira-Regular.ttf'),
          Saira_600SemiBold: require('../assets/fonts/saira/Saira-SemiBold.ttf'),
          Saira_700Bold: require('../assets/fonts/saira/Saira-Bold.ttf'),
        })
        await initDb()
      } catch (ex) {
        console.error(ex)
      } finally {
        setReady(true)
      }
    }
    init()
  }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleError,
        }),
        mutationCache: new MutationCache({
          onError: handleError,
        }),
      })
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [localTRPCLink(createLocalContext())],
    })
  )

  if (!ready) {
    return <EmptyWrapper />
  }

  return (
    <SafeAreaProvider>
      <MixpanelProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <RootStack />
              <StatusBar style="light" />
            </NavigationContainer>
          </QueryClientProvider>
        </trpc.Provider>
      </MixpanelProvider>
    </SafeAreaProvider>
  )
}

export const RootComponent = Sentry.wrap(AppComponent)
