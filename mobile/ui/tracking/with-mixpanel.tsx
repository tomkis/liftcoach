import { LiftingExperience, Unit } from '@/mobile/domain'
import { Mixpanel } from 'mixpanel-react-native'
import * as React from 'react'

interface MixpanelContextType {
  mixpanel: Mixpanel | null
}

const MixpanelContext = React.createContext<MixpanelContextType | null>(null)

export const useMixpanel = () => {
  const ctx = React.useContext(MixpanelContext)
  if (!ctx || !ctx.mixpanel) {
    throw new Error('useMixpanel must be used within a MixpanelProvider')
  }

  const mixpanel = ctx.mixpanel

  return {
    onboarding: {
      tocDisplayed: () => {
        mixpanel.track('Onboarding - Terms Of Use Displayed')
      },
      privacyPolicyDisplayed: () => {
        mixpanel.track('Onboarding - Privacy Policy Displayed')
      },
      tocToggled: (value: boolean) => {
        mixpanel.track('Onboarding - Terms Of Use Toggled', { value })
      },
      abortGoogleSignUp: () => {
        mixpanel.track('Auth - Abort Google Sign Up')
      },
      abortAppleSignUp: () => {
        mixpanel.track('Auth - Abort Apple Sign Up')
      },
      systemOfMeasureChanged: (props: { unit: Unit }) => {
        mixpanel.track('Onboarding - System Of Measure Changed', props)
      },
      exerciseReplaced: (from: string, to: string) => {
        mixpanel.track('Onboarding - Exercise Replaced', { from, to })
      },
      funnel: {
        onboardingStarted: () => {
          mixpanel.track('Onboarding - Started')
        },
        genderSelected: () => {
          mixpanel.track('Onboarding - Gender Selected')
        },
        signUp: (provider: string) => {
          mixpanel.track('Onboarding - Sign Up', { provider })
        },
        liftingExperienceSelected: (props: { liftingExperience: LiftingExperience }) => {
          mixpanel.track('Onboarding - Lifting Experience Selected', props)
        },
        trainingFrequencyProvided: () => {
          mixpanel.track('Onboarding - Training Frequency Provided')
        },
        musclePreferencesProvided: (props: { type: 'well-balanced' | 'custom' }) => {
          mixpanel.track('Onboarding - Muscle Preferences Provided', props)
        },
        changeMesocycle: () => {
          mixpanel.track('Onboarding - Change Mesocycle')
        },
        mesocycleApproved: () => {
          mixpanel.track('Onboarding - Mesocycle Approved')
        },
        changesToMesoApproved: () => {
          mixpanel.track('Onboarding - Changes To Mesocycle Approved')
        },
        workoutScheduled: () => {
          mixpanel.track('Onboarding - Workout Scheduled')
        },
        workoutStarted: () => {
          mixpanel.track('Onboarding - Workout Started')
        },
      },
    },
    workout: {
      warmupToggled: () => {
        mixpanel.track('Workout - Warmup Toggled')
      },
    },

    appStarted: () => {
      mixpanel.track('App - Started')
    },
    signIn: (provider: string) => {
      mixpanel.track('Auth - Sign In', { provider })
    },

    showMoreMusclePreferences: (muscleGroup: string) => {
      mixpanel.track('Onboarding - Show More Muscle Preferences', { muscleGroup })
    },
    exerciseExtraActionsShowed: () => {
      mixpanel.track('Workout - Exercise Extra Actions Shown')
    },
    exerciseVideoOpened: (exerciseName: string) => {
      mixpanel.track('Workout - Exercise Video Opened', { exerciseName })
    },
    exerciseLoadingUndo: () => {
      mixpanel.track('Workout - Exercise Loading Undo')
    },
    menuItemPressed: (item: string) => {
      mixpanel.track('Menu Item Pressed', { item })
    },
    newTrainingPlan: () => {
      mixpanel.track('Training Plan - New Training Plan Button')
    },
    loggedIn: async (userId: string, email: string) => {
      const disctinctId = await mixpanel.getDistinctId()
      if (disctinctId !== userId) {
        mixpanel.alias(userId, disctinctId)
      }

      mixpanel.identify(userId)
      mixpanel.getPeople().set({ $email: email })
    },
    abortGoogleSignIn: () => {
      mixpanel.track('Auth - Abort Google Sign In')
    },
    abortAppleSignIn: () => {
      mixpanel.track('Auth - Abort Apple Sign In')
    },
    workoutStarted: () => {
      mixpanel.track('Workout - Started')
    },
  }
}

export const MixpanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mixpanel, setMixpanel] = React.useState<Mixpanel | null>(null)
  const initialized = React.useRef(false)

  React.useEffect(() => {
    if (!initialized.current) {
      const instance = new Mixpanel(process.env.EXPO_PUBLIC_MIXPANEL_TOKEN as string, true)
      instance.setServerURL('https://api-eu.mixpanel.com')

      setMixpanel(instance)
      instance.init().then(() => {
        setMixpanel(instance)
      })
      initialized.current = true
    }
  }, [])

  if (!mixpanel) {
    return <></>
  }

  return <MixpanelContext.Provider value={{ mixpanel }}>{children}</MixpanelContext.Provider>
}
