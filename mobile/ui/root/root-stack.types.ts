enum RootStackRoutesEnum {
  Home = 'Home',
  Onboarding = 'Onboarding',
}

export interface RootStackRoutes extends Record<string, Readonly<object> | undefined> {
  [RootStackRoutesEnum.Home]: Record<string, never>
  [RootStackRoutesEnum.Onboarding]: Record<string, never>
}

