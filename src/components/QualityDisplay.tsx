"use client"

import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Card, ProgressBar } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import { COLORS } from "@constants/index"
import type { QualityAnalysis } from "@types/index"

interface QualityDisplayProps {
  analysis: QualityAnalysis
}

export const QualityDisplay: React.FC<QualityDisplayProps> = ({ analysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return COLORS.success
    if (score >= 6) return COLORS.warning
    return COLORS.error
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return "check-circle"
    if (score >= 6) return "warning"
    return "error"
  }

  const renderScoreItem = (label: string, score: number) => (
    <View style={styles.scoreItem}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreLabel}>{label}</Text>
        <View style={styles.scoreValue}>
          <Icon name={getScoreIcon(score)} size={16} color={getScoreColor(score)} />
          <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>{score.toFixed(1)}</Text>
        </View>
      </View>
      <ProgressBar progress={score / 10} color={getScoreColor(score)} style={styles.progressBar} />
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Overall Score */}
      <Card style={styles.overallCard}>
        <Card.Content>
          <View style={styles.overallScore}>
            <View style={styles.overallLeft}>
              <Text style={styles.overallLabel}>Skor Keseluruhan</Text>
              <Text style={[styles.overallValue, { color: getScoreColor(analysis.overallScore) }]}>
                {analysis.overallScore.toFixed(1)}/10
              </Text>
            </View>
            <View style={[styles.overallBadge, { backgroundColor: getScoreColor(analysis.overallScore) + "20" }]}>
              <Icon name={getScoreIcon(analysis.overallScore)} size={32} color={getScoreColor(analysis.overallScore)} />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Detailed Scores */}
      <Card style={styles.detailCard}>
        <Card.Title title="Detail Analisis" titleStyle={styles.cardTitle} />
        <Card.Content>
          {renderScoreItem("Keterbacaan", analysis.readabilityScore)}
          {renderScoreItem("Tata Bahasa", analysis.grammarScore)}
          {renderScoreItem("Koherensi", analysis.coherenceScore)}
          {renderScoreItem("Engagement", analysis.engagementScore)}
          {renderScoreItem("SEO", analysis.seoScore)}
        </Card.Content>
      </Card>

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card style={styles.feedbackCard}>
          <Card.Title
            title="Kelebihan"
            titleStyle={styles.cardTitle}
            left={() => <Icon name="thumb-up" size={20} color={COLORS.success} />}
          />
          <Card.Content>
            {analysis.strengths.map((strength, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Icon name="check" size={16} color={COLORS.success} />
                <Text style={styles.feedbackText}>{strength}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <Card style={styles.feedbackCard}>
          <Card.Title
            title="Saran"
            titleStyle={styles.cardTitle}
            left={() => <Icon name="lightbulb" size={20} color={COLORS.warning} />}
          />
          <Card.Content>
            {analysis.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Icon name="lightbulb-outline" size={16} color={COLORS.warning} />
                <Text style={styles.feedbackText}>{suggestion}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Improvements */}
      {analysis.improvements && analysis.improvements.length > 0 && (
        <Card style={styles.feedbackCard}>
          <Card.Title
            title="Perbaikan"
            titleStyle={styles.cardTitle}
            left={() => <Icon name="build" size={20} color={COLORS.primary} />}
          />
          <Card.Content>
            {analysis.improvements.map((improvement, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Icon name="build" size={16} color={COLORS.primary} />
                <Text style={styles.feedbackText}>{improvement}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  overallCard: {
    backgroundColor: COLORS.surface,
  },
  overallScore: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overallLeft: {
    flex: 1,
  },
  overallLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  overallValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  overallBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  detailCard: {
    backgroundColor: COLORS.surface,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  scoreItem: {
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  scoreValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  feedbackCard: {
    backgroundColor: COLORS.surface,
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  feedbackText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
})
