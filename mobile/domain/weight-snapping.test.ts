import { describe, expect, it } from 'vitest'

import { Unit } from './onboarding'
import { LoadingType, getIncrement, snapWeight } from './weight-snapping'

describe('snapWeight', () => {
  describe('metric', () => {
    it('double plates snaps to 2.5kg increments', () => {
      expect(snapWeight(37, LoadingType.DoublePlates, Unit.Metric)).toBe(37.5)
      expect(snapWeight(36, LoadingType.DoublePlates, Unit.Metric)).toBe(35)
      expect(snapWeight(60, LoadingType.DoublePlates, Unit.Metric)).toBe(60)
      expect(snapWeight(61, LoadingType.DoublePlates, Unit.Metric)).toBe(60)
      expect(snapWeight(61.5, LoadingType.DoublePlates, Unit.Metric)).toBe(62.5)
    })

    it('dumbbell snaps to 1kg increments', () => {
      expect(snapWeight(7.3, LoadingType.Dumbbell, Unit.Metric)).toBe(7)
      expect(snapWeight(7.6, LoadingType.Dumbbell, Unit.Metric)).toBe(8)
      expect(snapWeight(11, LoadingType.Dumbbell, Unit.Metric)).toBe(11)
      expect(snapWeight(15.4, LoadingType.Dumbbell, Unit.Metric)).toBe(15)
      expect(snapWeight(20, LoadingType.Dumbbell, Unit.Metric)).toBe(20)
    })

    it('stack snaps to 2.5kg increments', () => {
      expect(snapWeight(37, LoadingType.Stack, Unit.Metric)).toBe(37.5)
      expect(snapWeight(36, LoadingType.Stack, Unit.Metric)).toBe(35)
      expect(snapWeight(41, LoadingType.Stack, Unit.Metric)).toBe(40)
    })

    it('plates snaps to 2.5kg increments', () => {
      expect(snapWeight(37, LoadingType.Plates, Unit.Metric)).toBe(37.5)
      expect(snapWeight(36, LoadingType.Plates, Unit.Metric)).toBe(35)
      expect(snapWeight(41, LoadingType.Plates, Unit.Metric)).toBe(40)
    })
  })

  describe('imperial', () => {
    it('double plates snaps to 5lbs increments', () => {
      expect(snapWeight(82, LoadingType.DoublePlates, Unit.Imperial)).toBe(80)
      expect(snapWeight(83, LoadingType.DoublePlates, Unit.Imperial)).toBe(85)
    })

    it('dumbbell snaps to 5lbs increments', () => {
      expect(snapWeight(22, LoadingType.Dumbbell, Unit.Imperial)).toBe(20)
      expect(snapWeight(23, LoadingType.Dumbbell, Unit.Imperial)).toBe(25)
    })

    it('stack snaps to 5lbs increments', () => {
      expect(snapWeight(82, LoadingType.Stack, Unit.Imperial)).toBe(80)
      expect(snapWeight(83, LoadingType.Stack, Unit.Imperial)).toBe(85)
    })

    it('plates snaps to 5lbs increments', () => {
      expect(snapWeight(82, LoadingType.Plates, Unit.Imperial)).toBe(80)
      expect(snapWeight(83, LoadingType.Plates, Unit.Imperial)).toBe(85)
    })
  })

  it('handles zero', () => {
    expect(snapWeight(0, LoadingType.DoublePlates, Unit.Metric)).toBe(0)
    expect(snapWeight(0, LoadingType.Stack, Unit.Imperial)).toBe(0)
  })
})

describe('getIncrement', () => {
  it('returns 2.5 for double plates metric', () => {
    expect(getIncrement(LoadingType.DoublePlates, Unit.Metric)).toBe(2.5)
  })

  it('returns 1 for dumbbell metric', () => {
    expect(getIncrement(LoadingType.Dumbbell, Unit.Metric)).toBe(1)
  })

  it('returns 2.5 for stack metric', () => {
    expect(getIncrement(LoadingType.Stack, Unit.Metric)).toBe(2.5)
  })

  it('returns 2.5 for plates metric', () => {
    expect(getIncrement(LoadingType.Plates, Unit.Metric)).toBe(2.5)
  })

  it('returns 5 for all imperial loading types', () => {
    expect(getIncrement(LoadingType.DoublePlates, Unit.Imperial)).toBe(5)
    expect(getIncrement(LoadingType.Dumbbell, Unit.Imperial)).toBe(5)
    expect(getIncrement(LoadingType.Stack, Unit.Imperial)).toBe(5)
    expect(getIncrement(LoadingType.Plates, Unit.Imperial)).toBe(5)
  })

  it.each([
    [LoadingType.DoublePlates, Unit.Metric],
    [LoadingType.Dumbbell, Unit.Metric],
    [LoadingType.Stack, Unit.Metric],
    [LoadingType.Plates, Unit.Metric],
    [LoadingType.DoublePlates, Unit.Imperial],
    [LoadingType.Dumbbell, Unit.Imperial],
    [LoadingType.Stack, Unit.Imperial],
    [LoadingType.Plates, Unit.Imperial],
  ])('increment for %s/%s evenly divides all snapped weights', (loadingType, unit) => {
    const step = getIncrement(loadingType, unit)
    for (let w = 0; w <= 100; w++) {
      const snapped = snapWeight(w, loadingType, unit)
      expect(snapped % step).toBe(0)
    }
  })
})
