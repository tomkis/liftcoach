import { describe, expect, it } from 'vitest'

import { formatUserWeight, formatWeight } from './format-weight'

describe('formatWeight', () => {
  it('displays whole numbers without decimal', () => {
    expect(formatWeight(67)).toBe('67')
    expect(formatWeight(100)).toBe('100')
    expect(formatWeight(0)).toBe('0')
  })

  it('displays fractional weights with decimal', () => {
    expect(formatWeight(67.5)).toBe('67.5')
    expect(formatWeight(2.5)).toBe('2.5')
    expect(formatWeight(0.5)).toBe('0.5')
  })

  it('caps at 1 decimal place to prevent float drift', () => {
    expect(formatWeight(67.50000001)).toBe('67.5')
    expect(formatWeight(67.49999999)).toBe('67.5')
    expect(formatWeight(20.000000001)).toBe('20')
  })
})

describe('formatUserWeight', () => {
  it('preserves up to 2 decimal places', () => {
    expect(formatUserWeight(17.55)).toBe('17.55')
    expect(formatUserWeight(20.25)).toBe('20.25')
  })

  it('displays whole numbers without decimal', () => {
    expect(formatUserWeight(20)).toBe('20')
    expect(formatUserWeight(100)).toBe('100')
  })

  it('displays single decimal without trailing zero', () => {
    expect(formatUserWeight(17.5)).toBe('17.5')
    expect(formatUserWeight(2.5)).toBe('2.5')
  })

  it('caps at 2 decimal places to prevent float drift', () => {
    expect(formatUserWeight(17.500000001)).toBe('17.5')
    expect(formatUserWeight(20.254999999)).toBe('20.25')
  })
})
