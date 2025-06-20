"use client"

import type React from "react"
import { View, Text, StyleSheet, Modal } from "react-native"
import { ActivityIndicator, ProgressBar } from "react-native-paper"
import * as Animatable from "react-native-animatable"

import { COLORS } from "@constants/index"

interface LoadingOverlayProps {
  visible: boolean
  message?: string
  progress?: number
  showProgress?: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Loading...",
  progress = 0,
  showProgress = false,
}) => {
  if (!visible) return null

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animatable.View animation="fadeInUp" duration={300} style={styles.container}>
          {/* Loading Animation */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />

            {/* AI Animation Effect */}
            <Animatable.View animation="pulse" iterationCount="infinite" duration={2000} style={styles.aiEffect}>
              <View style={styles.aiRing1} />
              <View style={styles.aiRing2} />
              <View style={styles.aiRing3} />
            </Animatable.View>
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Progress Bar */}
          {showProgress && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress / 100} color={COLORS.primary} style={styles.progressBar} />
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
          )}

          {/* Loading Steps */}
          <View style={styles.stepsContainer}>
            <Animatable.Text
              animation="fadeIn"
              delay={0}
              style={[styles.stepText, progress > 20 && styles.stepCompleted]}
            >
              🧠 Memproses permintaan...
            </Animatable.Text>
            <Animatable.Text
              animation="fadeIn"
              delay={1000}
              style={[styles.stepText, progress > 40 && styles.stepCompleted]}
            >
              ✨ Menganalisis konten...
            </Animatable.Text>
            <Animatable.Text
              animation="fadeIn"
              delay={2000}
              style={[styles.stepText, progress > 60 && styles.stepCompleted]}
            >
              📝 Membuat konten...
            </Animatable.Text>
            <Animatable.Text
              animation="fadeIn"
              delay={3000}
              style={[styles.stepText, progress > 80 && styles.stepCompleted]}
            >
              🔍 Mengecek kualitas...
            </Animatable.Text>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 32,
    margin: 32,
    alignItems: "center",
    minWidth: 280,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingContainer: {
    position: "relative",
    marginBottom: 24,
  },
  spinner: {
    zIndex: 2,
  },
  aiEffect: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  aiRing1: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.3,
  },
  aiRing2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.primary,
    opacity: 0.2,
  },
  aiRing3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    opacity: 0.1,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  stepsContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  stepText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
    opacity: 0.6,
  },
  stepCompleted: {
    color: COLORS.success,
    opacity: 1,
  },
})
