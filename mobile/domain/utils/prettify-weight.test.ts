import { describe, expect, it } from 'vitest'

import { prettifyWeight } from './prettify-weight'

describe('prettifyWeight', () => {
  it('rounds to nearest integer', () => {
    expect(prettifyWeight(10.3)).toBe(10)
    expect(prettifyWeight(10.5)).toBe(11)
    expect(prettifyWeight(10.9)).toBe(11)
    expect(prettifyWeight(67.4)).toBe(67)
    expect(prettifyWeight(67.5)).toBe(68)
  })

  it('returns exact value for integers', () => {
    expect(prettifyWeight(20)).toBe(20)
    expect(prettifyWeight(100)).toBe(100)
    expect(prettifyWeight(0)).toBe(0)
  })

  it('never returns a fractional value', () => {
    const weights = [0.1, 2.5, 10.75, 19.9, 20.1, 50.5, 99.99]
    for (const w of weights) {
      expect(Number.isInteger(prettifyWeight(w)), `${w} produced non-integer`).toBe(true)
    }
  })
})
