import { ResizeMode, Video } from 'expo-av'
import React, { useRef, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { theme } from '@/mobile/theme/theme'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.newUi.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: theme.fontSize.large,
    fontFamily: theme.font.sairaRegular,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.newUi.text.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: theme.borderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
  },
  errorText: {
    color: theme.colors.newUi.text.primary,
    fontFamily: theme.font.sairaRegular,
    fontSize: theme.fontSize.small,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: theme.colors.newUi.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.small,
  },
  retryButtonText: {
    color: theme.colors.newUi.primary.contrastText,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: theme.fontSize.small,
    textTransform: 'uppercase',
  },
  closeButton: {
    backgroundColor: theme.colors.newUi.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.newUi.primary.contrastText,
    fontFamily: theme.font.sairaCondensedSemiBold,
    fontSize: theme.fontSize.medium,
    textTransform: 'uppercase',
  },
})

interface ExerciseVideoModalProps {
  visible: boolean
  videoFilename: string
  exerciseName: string
  onClose: () => void
}

export const ExerciseVideoModal = ({ visible, videoFilename, exerciseName, onClose }: ExerciseVideoModalProps) => {
  const [error, setError] = useState(false)
  const videoRef = useRef<Video>(null)

  const baseUrl = process.env.EXPO_PUBLIC_EXERCISES_BASE_URL || 'https://liftcoach.net/exercises'
  const videoUrl = `${baseUrl}/${videoFilename}`

  const handleRetry = () => {
    setError(false)
    videoRef.current?.replayAsync()
  }

  const handleClose = () => {
    videoRef.current?.pauseAsync()
    setError(false)
    onClose()
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{exerciseName}</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Video unavailable</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: videoUrl }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onError={() => setError(true)}
              />
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
