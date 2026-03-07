# Code Standards

## Nullability

Don't mark props or variables as optional (`?`, `| undefined`, `| null`) when the value is guaranteed to exist by domain invariants. Instead, gate on the loading state so that by the time the code runs, the value is non-nullable.

**Bad** — leaking loading uncertainty into component props:
```tsx
const Component = ({ unit }: { unit?: Unit }) => {
  return <Text>{unit === Unit.Metric ? 'kg' : 'lbs'}</Text>
}

// parent
const { data } = trpc.user.getOnboardingInfo.useQuery()
return <Component unit={data?.unit} />
```

**Good** — gate on loading, pass required value:
```tsx
const Component = ({ unit }: { unit: Unit }) => {
  return <Text>{unit === Unit.Metric ? 'kg' : 'lbs'}</Text>
}

// parent
const { data } = trpc.user.getOnboardingInfo.useQuery()
const isLoading = !data
if (isLoading) return <Spinner />
return <Component unit={data.unit} />
```

## No Silent Defaults

Never use fallback values (`??`, `||`, default parameters) to mask missing data that should exist by domain invariants. If the data is expected to be present, throw an explicit error instead. Silent defaults hide bugs and violate data integrity.

**Bad** — silently defaulting when data must exist:
```ts
const onboardingData = await getOnboardingData(userId)
const unit = onboardingData?.unit ?? Unit.Metric  // hides a missing-data bug
```

**Good** — enforce the constraint explicitly:
```ts
const onboardingData = await getOnboardingData(userId)
if (!onboardingData) throw new Error('Onboarding data not found')
const unit = onboardingData.unit
```

Fallbacks are appropriate only at true system boundaries (e.g. feature flags, user-facing config where a default genuinely makes sense). Within internal domain logic, missing data that should exist is always an error.
