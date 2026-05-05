type CarrySet = { orderIndex: number; weight: number | null; reps: number | null }
type CarryResult = { weight: number | null; reps: number | null }

export const carryForwardCustomSets = (prevSets: CarrySet[], targetSetCount: number): CarryResult[] => {
  const sortedPrev = [...prevSets].sort((a, b) => a.orderIndex - b.orderIndex)

  return Array.from({ length: targetSetCount }).map((_, position) => {
    const source = sortedPrev[position]
    if (!source) return { weight: null, reps: null }
    return { weight: source.weight, reps: source.reps }
  })
}
