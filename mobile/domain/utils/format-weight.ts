export const formatWeight = (weight: number | null) => weight === null ? '–' : String(Math.round(weight * 10) / 10)

export const formatUserWeight = (weight: number | null) => weight === null ? '–' : String(Math.round(weight * 100) / 100)
