"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, Card } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import { FlatList } from "react-native-gesture-handler"

import { COLORS, ONBOARDING_STEPS } from "@constants/index"
import type { OnboardingStep } from "@types/index"

const { width: screenWidth } = Dimensions.get("window")

interface OnboardingScreenProps {
  onComplete: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  const goToNext = () => {
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    } else {
      onComplete()
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true })
    }
  }

  const renderOnboardingItem = ({ item, index }: { item: OnboardingStep; index: number }) => (
    <View style={styles.slide}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primary }]}>
              <Icon name={item.icon} size={48} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card.Content>
      </Card>
    </View>
  )

  const renderPagination = () => {
    const inputRange = ONBOARDING_STEPS.map((_, i) => i * screenWidth)

    return (
      <View style={styles.pagination}>
        {ONBOARDING_STEPS.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: ONBOARDING_STEPS.map((_, i) => (i === index ? 1 : 0.3)),
            extrapolate: "clamp",
          })

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: ONBOARDING_STEPS.map((_, i) => (i === index ? 1.2 : 1)),
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  opacity,
                  transform: [{ scale }],
                  backgroundColor: index === currentIndex ? COLORS.primary : COLORS.textMuted,
                },
              ]}
            />
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <View style={styles.header}>
        <Button mode="text" onPress={onComplete} textColor={COLORS.textSecondary}>
          Lewati
        </Button>
      </View>

      {/* Onboarding Content */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_STEPS}
        renderItem={renderOnboardingItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
          setCurrentIndex(index)
        }}
        style={styles.flatList}
      />

      {/* Pagination */}
      {renderPagination()}

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={goToPrevious}
          disabled={currentIndex === 0}
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          textColor={currentIndex === 0 ? COLORS.textMuted : COLORS.primary}
        >
          Kembali
        </Button>

        <Button
          mode="contained"
          onPress={goToNext}
          style={styles.navButton}
          icon={currentIndex === ONBOARDING_STEPS.length - 1 ? "check" : "arrow-forward"}
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          {currentIndex === ONBOARDING_STEPS.length - 1 ? "Mulai" : "Lanjut"}
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    minWidth: 100,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
})
