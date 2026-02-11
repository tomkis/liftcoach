import { LiftingExperience, Unit } from '@/mobile/domain'
import * as React from 'react'

const TrackingContext = React.createContext<boolean>(false)

export const useTracking = () => {
  const initialized = React.useContext(TrackingContext)
  if (!initialized) {
    throw new Error('useTracking must be used within a TrackingProvider')
  }

  const track = (event: string, props?: Record<string, unknown>) => {
    console.log(`[tracking] ${event}`, props ?? '')
  }

  return {
    onboarding: {
      tocDisplayed: () => {
        track('Onboarding - Terms Of Use Displayed')
      },
      privacyPolicyDisplayed: () => {
        track('Onboarding - Privacy Policy Displayed')
      },
      tocToggled: (value: boolean) => {
        track('Onboarding - Terms Of Use Toggled', { value })
      },
      abortGoogleSignUp: () => {
        track('Auth - Abort Google Sign Up')
      },
      abortAppleSignUp: () => {
        track('Auth - Abort Apple Sign Up')
      },
      systemOfMeasureChanged: (props: { unit: Unit }) => {
        track('Onboarding - System Of Measure Changed', props)
      },
      exerciseReplaced: (from: string, to: string) => {
        track('Onboarding - Exercise Replaced', { from, to })
      },
      funnel: {
        onboardingStarted: () => {
          track('Onboarding - Started')
        },
        genderSelected: () => {
          track('Onboarding - Gender Selected')
        },
        signUp: (provider: string) => {
          track('Onboarding - Sign Up', { provider })
        },
        liftingExperienceSelected: (props: { liftingExperience: LiftingExperience }) => {
          track('Onboarding - Lifting Experience Selected', props)
        },
        trainingFrequencyProvided: () => {
          track('Onboarding - Training Frequency Provided')
        },
        musclePreferencesProvided: (props: { type: 'well-balanced' | 'custom' }) => {
          track('Onboarding - Muscle Preferences Provided', props)
        },
        changeMesocycle: () => {
          track('Onboarding - Change Mesocycle')
        },
        mesocycleApproved: () => {
          track('Onboarding - Mesocycle Approved')
        },
        changesToMesoApproved: () => {
          track('Onboarding - Changes To Mesocycle Approved')
        },
        workoutScheduled: () => {
          track('Onboarding - Workout Scheduled')
        },
        workoutStarted: () => {
          track('Onboarding - Workout Started')
        },
      },
    },
    workout: {
      warmupToggled: () => {
        track('Workout - Warmup Toggled')
      },
    },

    appStarted: () => {
      track('App - Started')
    },
    signIn: (provider: string) => {
      track('Auth - Sign In', { provider })
    },

    showMoreMusclePreferences: (muscleGroup: string) => {
      track('Onboarding - Show More Muscle Preferences', { muscleGroup })
    },
    exerciseExtraActionsShowed: () => {
      track('Workout - Exercise Extra Actions Shown')
    },
    exerciseVideoOpened: (exerciseName: string) => {
      track('Workout - Exercise Video Opened', { exerciseName })
    },
    exerciseLoadingUndo: () => {
      track('Workout - Exercise Loading Undo')
    },
    menuItemPressed: (item: string) => {
      track('Menu Item Pressed', { item })
    },
    newTrainingPlan: () => {
      track('Training Plan - New Training Plan Button')
    },
    loggedIn: async (userId: string, email: string) => {
      track('Auth - Logged In', { userId, email })
    },
    abortGoogleSignIn: () => {
      track('Auth - Abort Google Sign In')
    },
    abortAppleSignIn: () => {
      track('Auth - Abort Apple Sign In')
    },
    workoutStarted: () => {
      track('Workout - Started')
    },
  }
}

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TrackingContext.Provider value={true}>{children}</TrackingContext.Provider>
}
