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
