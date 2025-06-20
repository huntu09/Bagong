"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  Card,
  Button,
  TextInput,
  SegmentedButtons,
  Chip,
  Portal,
  Modal,
  ProgressBar,
  Divider,
} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import { useContentGeneration } from "@hooks/useContentGeneration"
import { useStorage } from "@hooks/useStorage"
import { useToast } from "@hooks/useToast"
import { ContentDisplay } from "@components/ContentDisplay"
import { QualityDisplay } from "@components/QualityDisplay"
import { TemplateSelector } from "@components/TemplateSelector"
import { LoadingOverlay } from "@components/LoadingOverlay"
import { COLORS, CONTENT_TYPES, WRITING_STYLES, TARGET_AUDIENCES } from "@constants/index"
import type { GenerationOptions, SavedContent } from "@types/index"

export const HomeScreen: React.FC = () => {
  // Hooks
  const { isGenerating, result, error, progress, generateContent, clearResult } = useContentGeneration()
  const { saveContent, settings } = useStorage()
  const { showSuccess, showError, showInfo } = useToast()

  // Form state
  const [topic, setTopic] = useState("")
  const [contentType, setContentType] = useState("article")
  const [writingStyle, setWritingStyle] = useState("formal")
  const [targetAudience, setTargetAudience] = useState("general")
  const [wordCount, setWordCount] = useState("500")
  const [keywords, setKeywords] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  // UI state
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  useEffect(() => {
    // Load default settings
    if (settings) {
      if (settings.defaultContentType) setContentType(settings.defaultContentType)
      if (settings.defaultWritingStyle) setWritingStyle(settings.defaultWritingStyle)
    }
  }, [settings])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showError("Silakan masukkan topik konten")
      return
    }

    const options: GenerationOptions = {
      topic: topic.trim(),
      contentType,
      writingStyle,
      targetAudience,
      wordCount: Number.parseInt(wordCount) || 500,
      includeKeywords: keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
      customInstructions: customInstructions.trim() || undefined,
      template: selectedTemplate || undefined,
    }

    try {
      await generateContent(options)
      showSuccess("Konten berhasil dibuat!")
    } catch (err: any) {
      showError(err.message || "Gagal membuat konten")
    }
  }

  const handleSaveContent = async () => {
    if (!result) return

    const savedContent: SavedContent = {
      id: Date.now().toString(),
      title: topic.trim() || "Konten Tanpa Judul",
      content: result.content,
      contentType,
      qualityAnalysis: result.qualityAnalysis,
      metadata: {
        ...result.metadata,
        contentType,
        writingStyle,
        targetAudience,
        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0),
      },
      tags: [contentType, writingStyle],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const success = await saveContent(savedContent)
    if (success) {
      showSuccess("Konten berhasil disimpan!")
    } else {
      showError("Gagal menyimpan konten")
    }
  }

  const handleClearForm = () => {
    Alert.alert("Hapus Form", "Apakah Anda yakin ingin menghapus semua input?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          setTopic("")
          setKeywords("")
          setCustomInstructions("")
          setSelectedTemplate("")
          clearResult()
          showInfo("Form berhasil dihapus")
        },
      },
    ])
  }

  const getContentTypeOptions = () =>
    CONTENT_TYPES.map((type) => ({
      value: type.id,
      label: type.name,
      icon: type.icon,
    }))

  const getWritingStyleOptions = () =>
    WRITING_STYLES.map((style) => ({
      value: style.id,
      label: style.name,
    }))

  const getTargetAudienceOptions = () =>
    TARGET_AUDIENCES.map((audience) => ({
      value: audience.id,
      label: audience.name,
    }))

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>AI Writer Pro</Text>
                <Text style={styles.headerSubtitle}>Buat konten berkualitas dengan AI</Text>
              </View>
              <Icon name="auto-awesome" size={32} color={COLORS.primary} />
            </View>
          </Card.Content>
        </Card>

        {/* Main Form */}
        <Card style={styles.formCard}>
          <Card.Title title="Buat Konten Baru" titleStyle={styles.cardTitle} />
          <Card.Content>
            {/* Topic Input */}
            <TextInput
              label="Topik Konten *"
              value={topic}
              onChangeText={setTopic}
              mode="outlined"
              placeholder="Masukkan topik yang ingin Anda tulis..."
              style={styles.input}
              multiline
              numberOfLines={2}
            />

            {/* Content Type Selection */}
            <Text style={styles.sectionLabel}>Jenis Konten</Text>
            <View style={styles.chipContainer}>
              {CONTENT_TYPES.slice(0, 4).map((type) => (
                <Chip
                  key={type.id}
                  selected={contentType === type.id}
                  onPress={() => setContentType(type.id)}
                  style={styles.chip}
                  icon={type.icon}
                >
                  {type.name}
                </Chip>
              ))}
            </View>

            {/* Writing Style */}
            <Text style={styles.sectionLabel}>Gaya Penulisan</Text>
            <SegmentedButtons
              value={writingStyle}
              onValueChange={setWritingStyle}
              buttons={getWritingStyleOptions().slice(0, 3)}
              style={styles.segmentedButtons}
            />

            {/* Word Count */}
            <TextInput
              label="Jumlah Kata"
              value={wordCount}
              onChangeText={setWordCount}
              mode="outlined"
              keyboardType="numeric"
              placeholder="500"
              style={styles.input}
            />

            {/* Template Selection */}
            <Button
              mode="outlined"
              onPress={() => setShowTemplateModal(true)}
              icon="template"
              style={styles.templateButton}
            >
              {selectedTemplate ? `Template: ${selectedTemplate}` : "Pilih Template (Opsional)"}
            </Button>

            {/* Advanced Options Toggle */}
            <Button
              mode="text"
              onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
              icon={showAdvancedOptions ? "expand-less" : "expand-more"}
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              Opsi Lanjutan
            </Button>

            {/* Advanced Options */}
            {showAdvancedOptions && (
              <View style={styles.advancedOptions}>
                <Divider style={styles.divider} />

                <Text style={styles.sectionLabel}>Target Audiens</Text>
                <SegmentedButtons
                  value={targetAudience}
                  onValueChange={setTargetAudience}
                  buttons={getTargetAudienceOptions().slice(0, 3)}
                  style={styles.segmentedButtons}
                />

                <TextInput
                  label="Kata Kunci (pisahkan dengan koma)"
                  value={keywords}
                  onChangeText={setKeywords}
                  mode="outlined"
                  placeholder="SEO, marketing, digital..."
                  style={styles.input}
                />

                <TextInput
                  label="Instruksi Khusus"
                  value={customInstructions}
                  onChangeText={setCustomInstructions}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  placeholder="Tambahkan instruksi khusus untuk AI..."
                  style={styles.input}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button mode="outlined" onPress={handleClearForm} icon="clear" style={styles.clearButton}>
                Hapus
              </Button>
              <Button
                mode="contained"
                onPress={handleGenerate}
                loading={isGenerating}
                disabled={isGenerating || !topic.trim()}
                icon="auto-awesome"
                style={styles.generateButton}
              >
                {isGenerating ? "Membuat..." : "Buat Konten"}
              </Button>
            </View>

            {/* Progress Bar */}
            {isGenerating && (
              <View style={styles.progressContainer}>
                <ProgressBar progress={progress / 100} color={COLORS.primary} style={styles.progressBar} />
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Error Display */}
        {error && (
          <Card style={[styles.resultCard, styles.errorCard]}>
            <Card.Content>
              <View style={styles.errorContainer}>
                <Icon name="error" size={24} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Result Display */}
        {result && (
          <>
            <Card style={styles.resultCard}>
              <Card.Title title="Hasil Konten" titleStyle={styles.cardTitle} />
              <Card.Content>
                <ContentDisplay content={result.content} metadata={result.metadata} />
                <View style={styles.resultActions}>
                  <Button mode="outlined" onPress={handleSaveContent} icon="save">
                    Simpan
                  </Button>
                  <Button mode="text" onPress={clearResult} icon="refresh">
                    Buat Ulang
                  </Button>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.resultCard}>
              <Card.Title title="Analisis Kualitas" titleStyle={styles.cardTitle} />
              <Card.Content>
                <QualityDisplay analysis={result.qualityAnalysis} />
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Template Selection Modal */}
      <Portal>
        <Modal
          visible={showTemplateModal}
          onDismiss={() => setShowTemplateModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <TemplateSelector
            contentType={contentType}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={(template) => {
              setSelectedTemplate(template)
              setShowTemplateModal(false)
            }}
            onClose={() => setShowTemplateModal(false)}
          />
        </Modal>
      </Portal>

      {/* Loading Overlay */}
      {isGenerating && <LoadingOverlay progress={progress} message="Sedang membuat konten..." />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formCard: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  templateButton: {
    marginBottom: 16,
  },
  advancedOptions: {
    marginTop: 16,
  },
  divider: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
  },
  generateButton: {
    flex: 2,
  },
  progressContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultCard: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  errorCard: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: COLORS.error,
    fontSize: 14,
  },
  resultActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    margin: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
})
