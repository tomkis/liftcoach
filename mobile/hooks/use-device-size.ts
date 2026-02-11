import { useWindowDimensions } from 'react-native'

export const useDeviceSize = () => {
  const { width, height } = useWindowDimensions()

  // Common breakpoints for mobile devices
  const isSmallDevice = width <= 375 // iPhone SE, small Android phones
  const isMediumDevice = width > 375 && width < 414 // iPhone 12/13/14, most Android phones
  const isLargeDevice = width >= 414 && width < 768 // iPhone 12/13/14 Pro Max, large Android phones
  const isTablet = width >= 768 // iPads, Android tablets

  // Alternative: use height-based detection
  const isShortDevice = height < 667 // iPhone SE, small devices
  const isTallDevice = height >= 667 // Most modern phones

  // Combined flags for common use cases
  const isCompactDevice = isSmallDevice || isShortDevice
  const isStandardDevice = isMediumDevice && !isShortDevice
  const isLargePhone = isLargeDevice && !isTablet

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    isShortDevice,
    isTallDevice,
    isCompactDevice,
    isStandardDevice,
    isLargePhone,
  }
}
