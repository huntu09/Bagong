"use client"

import type React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Card, Button, Chip } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import Clipboard from "@react-native-clipboard/clipboard"
import Share from "react-native-share"

import { useToast } from "@hooks/useToast"
import { COLORS } from "@constants/index"
import type { ContentMetadata } from "@types/index"

interface ContentDisplayProps {
  content: string
  metadata: ContentMetadata
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, metadata }) => {
  const { showSuccess, showError } = useToast()

  const handleCopyContent = async () => {
    try {
      await Clipboard.setString(content)
      showSuccess("Konten berhasil disalin")
    } catch (error) {
      showError("Gagal menyalin konten")
    }
  }

  const handleShareContent = async () => {
    try {
      await Share.open({
        message: content,
        title: "Konten dari AI Writer Pro",
      })
    } catch (error) {
      // User cancelled sharing
    }
  }

  return (
    <View style={styles.container}>
      {/* Content */}
      <Card style={styles.contentCard}>
        <Card.Content>
          <ScrollView style={styles.contentScroll} nestedScrollEnabled>
            <Text style={styles.contentText} selectable>
              {content}
            </Text>
          </ScrollView>
        </Card.Content>
      </Card>

      {/* Metadata */}
      <View style={styles.metadataContainer}>
        <View style={styles.metadataRow}>
          <View style={styles.metadataItem}>
            <Icon name="text-fields" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{metadata.wordCount} kata</Text>
          </View>
          <View style={styles.metadataItem}>
            <Icon name="schedule" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{metadata.readingTime} menit baca</Text>
          </View>
          <View style={styles.metadataItem}>
            <Icon name="format-list-numbered" size={16} color={COLORS.textSecondary} />
            <Text style={styles.metadataText}>{metadata.paragraphCount} paragraf</Text>
          </View>
        </View>

        {/* Keywords */}
        {metadata.keywords && metadata.keywords.length > 0 && (
          <View style={styles.keywordsContainer}>
            <Text style={styles.keywordsLabel}>Kata Kunci:</Text>
            <View style={styles.keywordsRow}>
              {metadata.keywords.map((keyword, index) => (
                <Chip key={index} style={styles.keywordChip} textStyle={styles.keywordText}>
                  {keyword}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button mode="outlined" onPress={handleCopyContent} icon="content-copy" style={styles.actionButton}>
          Salin
        </Button>
        <Button mode="outlined" onPress={handleShareContent} icon="share" style={styles.actionButton}>
          Bagikan
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: COLORS.card,
    marginBottom: 16,
  },
  contentScroll: {
    maxHeight: 300,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  metadataContainer: {
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  keywordsContainer: {
    marginTop: 8,
  },
  keywordsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  keywordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  keywordChip: {
    backgroundColor: COLORS.primary + "20",
  },
  keywordText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
})
