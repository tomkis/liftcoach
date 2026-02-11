const increments = 2
const lowIncrementTreshold = 20

export const prettifyWeight = (weight: number) => {
  const roundedWeight = Math.round(weight)

  if (roundedWeight < lowIncrementTreshold) {
    return Math.round(roundedWeight)
  }

  const remainder = roundedWeight % increments
  return roundedWeight - remainder
}
