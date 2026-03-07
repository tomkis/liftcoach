import { describe, expect, it } from 'vitest'

import { Unit } from './onboarding'
import { EquipmentType, getSliderStep, snapWeight } from './weight-snapping'

describe('snapWeight', () => {
  describe('metric', () => {
    it('barbell snaps to 2.5kg increments', () => {
      expect(snapWeight(37, EquipmentType.Barbell, Unit.Metric)).toBe(37.5)
      expect(snapWeight(36, EquipmentType.Barbell, Unit.Metric)).toBe(35)
      expect(snapWeight(60, EquipmentType.Barbell, Unit.Metric)).toBe(60)
      expect(snapWeight(61, EquipmentType.Barbell, Unit.Metric)).toBe(60)
      expect(snapWeight(61.5, EquipmentType.Barbell, Unit.Metric)).toBe(62.5)
    })

    it('dumbbell snaps to 1kg under 10kg', () => {
      expect(snapWeight(7.3, EquipmentType.Dumbbell, Unit.Metric)).toBe(7)
      expect(snapWeight(7.6, EquipmentType.Dumbbell, Unit.Metric)).toBe(8)
      expect(snapWeight(9, EquipmentType.Dumbbell, Unit.Metric)).toBe(9)
    })

    it('dumbbell snaps to 2kg at 10kg and above', () => {
      expect(snapWeight(11, EquipmentType.Dumbbell, Unit.Metric)).toBe(12)
      expect(snapWeight(13, EquipmentType.Dumbbell, Unit.Metric)).toBe(14)
      expect(snapWeight(15, EquipmentType.Dumbbell, Unit.Metric)).toBe(16)
      expect(snapWeight(20, EquipmentType.Dumbbell, Unit.Metric)).toBe(20)
    })

    it('machine snaps to 2.5kg increments', () => {
      expect(snapWeight(37, EquipmentType.Machine, Unit.Metric)).toBe(37.5)
      expect(snapWeight(36, EquipmentType.Machine, Unit.Metric)).toBe(35)
      expect(snapWeight(41, EquipmentType.Machine, Unit.Metric)).toBe(40)
    })
  })

  describe('imperial', () => {
    it('barbell snaps to 5lbs increments', () => {
      expect(snapWeight(82, EquipmentType.Barbell, Unit.Imperial)).toBe(80)
      expect(snapWeight(83, EquipmentType.Barbell, Unit.Imperial)).toBe(85)
    })

    it('dumbbell snaps to 5lbs increments', () => {
      expect(snapWeight(22, EquipmentType.Dumbbell, Unit.Imperial)).toBe(20)
      expect(snapWeight(23, EquipmentType.Dumbbell, Unit.Imperial)).toBe(25)
    })

    it('machine snaps to 5lbs increments', () => {
      expect(snapWeight(82, EquipmentType.Machine, Unit.Imperial)).toBe(80)
      expect(snapWeight(83, EquipmentType.Machine, Unit.Imperial)).toBe(85)
    })
  })

  it('handles zero', () => {
    expect(snapWeight(0, EquipmentType.Barbell, Unit.Metric)).toBe(0)
    expect(snapWeight(0, EquipmentType.Machine, Unit.Imperial)).toBe(0)
  })
})

describe('getSliderStep', () => {
  it('returns 2.5 for barbell metric', () => {
    expect(getSliderStep(EquipmentType.Barbell, Unit.Metric)).toBe(2.5)
  })

  it('returns 1 for dumbbell metric (smallest valid increment)', () => {
    expect(getSliderStep(EquipmentType.Dumbbell, Unit.Metric)).toBe(1)
  })

  it('returns 2.5 for machine metric', () => {
    expect(getSliderStep(EquipmentType.Machine, Unit.Metric)).toBe(2.5)
  })

  it('returns 5 for barbell imperial', () => {
    expect(getSliderStep(EquipmentType.Barbell, Unit.Imperial)).toBe(5)
  })

  it('returns 5 for dumbbell imperial', () => {
    expect(getSliderStep(EquipmentType.Dumbbell, Unit.Imperial)).toBe(5)
  })

  it('returns 5 for machine imperial', () => {
    expect(getSliderStep(EquipmentType.Machine, Unit.Imperial)).toBe(5)
  })

  it.each([
    [EquipmentType.Barbell, Unit.Metric],
    [EquipmentType.Dumbbell, Unit.Metric],
    [EquipmentType.Machine, Unit.Metric],
    [EquipmentType.Barbell, Unit.Imperial],
    [EquipmentType.Dumbbell, Unit.Imperial],
    [EquipmentType.Machine, Unit.Imperial],
  ])('slider step for %s/%s evenly divides all snapped weights', (equipment, unit) => {
    const step = getSliderStep(equipment, unit)
    // Every snapped weight must be reachable by the slider (a multiple of its step)
    for (let w = 0; w <= 100; w++) {
      const snapped = snapWeight(w, equipment, unit)
      expect(snapped % step).toBe(0)
    }
  })
})
