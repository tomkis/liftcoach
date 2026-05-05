import { describe, expect, it } from 'vitest'

import { carryForwardCustomSets } from './custom-carry-forward'

describe('carryForwardCustomSets', () => {
  it('preserves distinct per-set values (top set + back-offs)', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 0, weight: 100, reps: 5 },
        { orderIndex: 1, weight: 80, reps: 8 },
        { orderIndex: 2, weight: 70, reps: 10 },
      ],
      3
    )

    expect(result).toEqual([
      { weight: 100, reps: 5 },
      { weight: 80, reps: 8 },
      { weight: 70, reps: 10 },
    ])
  })

  it('carries null weight/reps as null', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 0, weight: null, reps: null },
        { orderIndex: 1, weight: null, reps: null },
      ],
      2
    )

    expect(result).toEqual([
      { weight: null, reps: null },
      { weight: null, reps: null },
    ])
  })

  it('blanks new positions when target grew (user added set)', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 0, weight: 100, reps: 5 },
        { orderIndex: 1, weight: 80, reps: 8 },
      ],
      4
    )

    expect(result).toEqual([
      { weight: 100, reps: 5 },
      { weight: 80, reps: 8 },
      { weight: null, reps: null },
      { weight: null, reps: null },
    ])
  })

  it('drops trailing positions when target shrank (user removed set)', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 0, weight: 100, reps: 5 },
        { orderIndex: 1, weight: 80, reps: 8 },
        { orderIndex: 2, weight: 70, reps: 10 },
      ],
      2
    )

    expect(result).toEqual([
      { weight: 100, reps: 5 },
      { weight: 80, reps: 8 },
    ])
  })

  it('treats mixed null/value sets independently', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 0, weight: 100, reps: 5 },
        { orderIndex: 1, weight: null, reps: null },
        { orderIndex: 2, weight: 70, reps: 10 },
      ],
      3
    )

    expect(result).toEqual([
      { weight: 100, reps: 5 },
      { weight: null, reps: null },
      { weight: 70, reps: 10 },
    ])
  })

  it('orders by orderIndex, not array order', () => {
    const result = carryForwardCustomSets(
      [
        { orderIndex: 2, weight: 70, reps: 10 },
        { orderIndex: 0, weight: 100, reps: 5 },
        { orderIndex: 1, weight: 80, reps: 8 },
      ],
      3
    )

    expect(result).toEqual([
      { weight: 100, reps: 5 },
      { weight: 80, reps: 8 },
      { weight: 70, reps: 10 },
    ])
  })

  it('returns empty array when targetSetCount is 0', () => {
    const result = carryForwardCustomSets(
      [{ orderIndex: 0, weight: 100, reps: 5 }],
      0
    )

    expect(result).toEqual([])
  })
})
