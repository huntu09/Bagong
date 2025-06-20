"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Card, Button, Chip, Portal, Dialog } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"

import { COLORS } from "@constants/index"
import type { ContentTemplate } from "@types/index"

interface TemplateSelectorProps {
  contentType: string
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

// Mock templates data - in real app, this would come from API or storage
const TEMPLATES: Record<string, ContentTemplate[]> = {
  article: [
    {
      id: "news",
      name: "Berita",
      description: "Template untuk artikel berita",
      contentType: "article",
      structure: ["Headline", "Lead", "Body", "Conclusion"],
      placeholders: {
        headline: "Judul berita yang menarik",
        lead: "Paragraf pembuka yang merangkum inti berita",
        body: "Isi berita dengan detail dan fakta",
        conclusion: "Kesimpulan atau call-to-action",
      },
      example: 'Contoh: "Teknologi AI Mengubah Cara Kerja di Indonesia"',
    },
    {
      id: "tutorial",
      name: "Tutorial",
      description: "Template untuk artikel tutorial",
      contentType: "article",
      structure: ["Introduction", "Prerequisites", "Steps", "Conclusion"],
      placeholders: {
        introduction: "Pengenalan topik tutorial",
        prerequisites: "Yang dibutuhkan sebelum memulai",
        steps: "Langkah-langkah detail",
        conclusion: "Ringkasan dan tips tambahan",
      },
      example: 'Contoh: "Cara Membuat Website dengan React Native"',
    },
    {
      id: "review",
      name: "Review",
      description: "Template untuk artikel review",
      contentType: "article",
      structure: ["Overview", "Pros", "Cons", "Rating", "Conclusion"],
      placeholders: {
        overview: "Gambaran umum produk/layanan",
        pros: "Kelebihan yang ditemukan",
        cons: "Kekurangan yang ditemukan",
        rating: "Penilaian keseluruhan",
        conclusion: "Rekomendasi akhir",
      },
      example: 'Contoh: "Review iPhone 15: Apakah Worth It?"',
    },
  ],
  blog: [
    {
      id: "personal",
      name: "Personal Blog",
      description: "Template untuk blog personal",
      contentType: "blog",
      structure: ["Hook", "Story", "Lesson", "Call-to-Action"],
      placeholders: {
        hook: "Pembuka yang menarik perhatian",
        story: "Cerita atau pengalaman personal",
        lesson: "Pelajaran yang bisa diambil",
        cta: "Ajakan untuk berinteraksi",
      },
      example: 'Contoh: "Perjalanan Saya Belajar Coding dari Nol"',
    },
    {
      id: "business",
      name: "Business Blog",
      description: "Template untuk blog bisnis",
      contentType: "blog",
      structure: ["Problem", "Solution", "Benefits", "Case Study", "CTA"],
      placeholders: {
        problem: "Masalah yang dihadapi target audience",
        solution: "Solusi yang ditawarkan",
        benefits: "Manfaat dari solusi tersebut",
        case_study: "Contoh kasus atau testimoni",
        cta: "Call-to-action untuk bisnis",
      },
      example: 'Contoh: "5 Strategi Digital Marketing untuk UMKM"',
    },
  ],
  social: [
    {
      id: "instagram",
      name: "Instagram Post",
      description: "Template untuk post Instagram",
      contentType: "social",
      structure: ["Hook", "Value", "CTA", "Hashtags"],
      placeholders: {
        hook: "Kalimat pembuka yang eye-catching",
        value: "Konten yang memberikan value",
        cta: "Ajakan untuk engage",
        hashtags: "Hashtag yang relevan",
      },
      example: "Contoh: Post tentang tips productivity",
    },
    {
      id: "linkedin",
      name: "LinkedIn Post",
      description: "Template untuk post LinkedIn",
      contentType: "social",
      structure: ["Professional Hook", "Insight", "Experience", "Question"],
      placeholders: {
        hook: "Pembuka yang profesional",
        insight: "Insight atau pembelajaran",
        experience: "Pengalaman yang relevan",
        question: "Pertanyaan untuk engagement",
      },
      example: "Contoh: Post tentang career development",
    },
  ],
  marketing: [
    {
      id: "sales",
      name: "Sales Copy",
      description: "Template untuk sales copy",
      contentType: "marketing",
      structure: ["Attention", "Interest", "Desire", "Action"],
      placeholders: {
        attention: "Menarik perhatian target audience",
        interest: "Membangun ketertarikan",
        desire: "Menciptakan keinginan",
        action: "Mendorong untuk bertindak",
      },
      example: "Contoh: Sales copy untuk produk digital",
    },
    {
      id: "email",
      name: "Email Marketing",
      description: "Template untuk email marketing",
      contentType: "marketing",
      structure: ["Subject Line", "Greeting", "Value Proposition", "CTA"],
      placeholders: {
        subject: "Subject line yang menarik",
        greeting: "Salam pembuka yang personal",
        value: "Proposisi nilai yang jelas",
        cta: "Call-to-action yang kuat",
      },
      example: "Contoh: Email newsletter untuk subscribers",
    },
  ],
  academic: [
    {
      id: "essay",
      name: "Essay",
      description: "Template untuk essay akademik",
      contentType: "academic",
      structure: ["Introduction", "Thesis", "Arguments", "Conclusion"],
      placeholders: {
        introduction: "Pengenalan topik dan konteks",
        thesis: "Pernyataan tesis yang jelas",
        arguments: "Argumen pendukung dengan bukti",
        conclusion: "Kesimpulan yang merangkum",
      },
      example: "Contoh: Essay tentang dampak teknologi",
    },
    {
      id: "research",
      name: "Research Paper",
      description: "Template untuk paper penelitian",
      contentType: "academic",
      structure: ["Abstract", "Introduction", "Methodology", "Results", "Discussion", "Conclusion"],
      placeholders: {
        abstract: "Ringkasan penelitian",
        introduction: "Latar belakang dan tujuan",
        methodology: "Metode penelitian",
        results: "Hasil penelitian",
        discussion: "Pembahasan hasil",
        conclusion: "Kesimpulan dan saran",
      },
      example: "Contoh: Penelitian tentang AI dalam pendidikan",
    },
  ],
  creative: [
    {
      id: "story",
      name: "Short Story",
      description: "Template untuk cerita pendek",
      contentType: "creative",
      structure: ["Setting", "Characters", "Conflict", "Resolution"],
      placeholders: {
        setting: "Latar tempat dan waktu",
        characters: "Karakter utama dan pendukung",
        conflict: "Konflik atau masalah",
        resolution: "Penyelesaian cerita",
      },
      example: "Contoh: Cerita tentang petualangan",
    },
    {
      id: "poem",
      name: "Poem",
      description: "Template untuk puisi",
      contentType: "creative",
      structure: ["Theme", "Imagery", "Emotion", "Message"],
      placeholders: {
        theme: "Tema utama puisi",
        imagery: "Gambaran dan metafora",
        emotion: "Emosi yang ingin disampaikan",
        message: "Pesan atau makna",
      },
      example: "Contoh: Puisi tentang alam",
    },
  ],
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  contentType,
  selectedTemplate,
  onTemplateSelect,
}) => {
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState<ContentTemplate | null>(null)

  const availableTemplates = TEMPLATES[contentType] || []
  const currentTemplate = availableTemplates.find((t) => t.id === selectedTemplate)

  const handleTemplateSelect = (template: ContentTemplate) => {
    onTemplateSelect(template.id)
    setShowTemplateDialog(false)
  }

  const handleTemplatePreview = (template: ContentTemplate) => {
    setSelectedTemplateDetail(template)
  }

  return (
    <View style={styles.container}>
      {/* Template Selector Button */}
      <Button
        mode="outlined"
        onPress={() => setShowTemplateDialog(true)}
        style={styles.selectorButton}
        contentStyle={styles.selectorButtonContent}
        icon="description"
      >
        {currentTemplate?.name || "Pilih template"}
      </Button>

      {/* Selected Template Info */}
      {currentTemplate && (
        <Card style={styles.templateInfo}>
          <Card.Content>
            <View style={styles.templateHeader}>
              <Text style={styles.templateName}>{currentTemplate.name}</Text>
              <Button mode="text" onPress={() => handleTemplatePreview(currentTemplate)} compact>
                Preview
              </Button>
            </View>
            <Text style={styles.templateDescription}>{currentTemplate.description}</Text>
            <View style={styles.templateStructure}>
              <Text style={styles.structureTitle}>Struktur:</Text>
              <View style={styles.structureList}>
                {currentTemplate.structure.map((item, index) => (
                  <Chip key={index} style={styles.structureChip} textStyle={styles.structureChipText}>
                    {item}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Template Selection Dialog */}
      <Portal>
        <Dialog visible={showTemplateDialog} onDismiss={() => setShowTemplateDialog(false)} style={styles.dialog}>
          <Dialog.Title>Pilih Template</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView style={styles.templateList}>
              {availableTemplates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[styles.templateItem, selectedTemplate === template.id && styles.templateItemSelected]}
                  onPress={() => handleTemplateSelect(template)}
                >
                  <View style={styles.templateItemHeader}>
                    <Text style={styles.templateItemName}>{template.name}</Text>
                    {selectedTemplate === template.id && <Icon name="check-circle" size={20} color={COLORS.primary} />}
                  </View>
                  <Text style={styles.templateItemDescription}>{template.description}</Text>
                  <Text style={styles.templateItemExample}>{template.example}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowTemplateDialog(false)}>Tutup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Template Preview Dialog */}
      <Portal>
        <Dialog
          visible={!!selectedTemplateDetail}
          onDismiss={() => setSelectedTemplateDetail(null)}
          style={styles.dialog}
        >
          <Dialog.Title>{selectedTemplateDetail?.name} - Preview</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView style={styles.previewContent}>
              <Text style={styles.previewDescription}>{selectedTemplateDetail?.description}</Text>

              <Text style={styles.previewSectionTitle}>Struktur Template:</Text>
              {selectedTemplateDetail?.structure.map((section, index) => (
                <View key={index} style={styles.previewSection}>
                  <Text style={styles.previewSectionName}>
                    {index + 1}. {section}
                  </Text>
                  <Text style={styles.previewSectionDesc}>
                    {selectedTemplateDetail.placeholders[section.toLowerCase()] ||
                      `Bagian ${section.toLowerCase()} dari konten`}
                  </Text>
                </View>
              ))}

              <Text style={styles.previewExample}>
                <Text style={styles.previewExampleTitle}>Contoh: </Text>
                {selectedTemplateDetail?.example}
              </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setSelectedTemplateDetail(null)}>Tutup</Button>
            <Button
              mode="contained"
              onPress={() => {
                if (selectedTemplateDetail) {
                  handleTemplateSelect(selectedTemplateDetail)
                  setSelectedTemplateDetail(null)
                }
              }}
            >
              Pilih Template
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selectorButton: {
    justifyContent: "flex-start",
    borderColor: COLORS.border,
  },
  selectorButtonContent: {
    justifyContent: "flex-start",
  },
  templateInfo: {
    marginTop: 12,
    backgroundColor: COLORS.card,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  templateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  templateStructure: {
    marginTop: 8,
  },
  structureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  structureList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  structureChip: {
    backgroundColor: COLORS.primary,
    marginRight: 4,
    marginBottom: 4,
  },
  structureChipText: {
    color: COLORS.white,
    fontSize: 12,
  },
  dialog: {
    backgroundColor: COLORS.surface,
  },
  templateList: {
    maxHeight: 400,
  },
  templateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  templateItemSelected: {
    backgroundColor: COLORS.card,
  },
  templateItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  templateItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  templateItemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  templateItemExample: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
  previewContent: {
    maxHeight: 500,
  },
  previewDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  previewSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  previewSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  previewSectionName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  previewSectionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  previewExample: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  previewExampleTitle: {
    fontWeight: "600",
    color: COLORS.text,
  },
})
