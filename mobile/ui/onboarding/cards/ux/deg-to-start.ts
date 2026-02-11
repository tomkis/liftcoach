export function degToStartEnd(deg: number) {
  const rad = (deg % 360) * (Math.PI / 180)

  // Calculate the x and y components
  const x = Math.cos(rad)
  const y = Math.sin(rad)

  // Map the -1 to 1 range to 0 to 1 for React Native
  const startX = 0.5 - x / 2
  const startY = 0.5 - y / 2
  const endX = 0.5 + x / 2
  const endY = 0.5 + y / 2

  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
  }
}
