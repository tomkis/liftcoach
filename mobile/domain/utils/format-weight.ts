export const formatWeight = (weight: number | null) => {
  if (weight === null) {
    console.warn('formatWeight called with null weight')
    return '–'
  }
  return String(Math.round(weight * 10) / 10)
}

export const formatUserWeight = (weight: number | null) => {
  if (weight === null) {
    console.warn('formatUserWeight called with null weight')
    return '–'
  }
  return String(Math.round(weight * 100) / 100)
}
