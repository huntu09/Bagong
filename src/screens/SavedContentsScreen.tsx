"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
  RefreshControl,
} from "react-native"
import { Header, Card, SearchBar } from "react-native-elements"
import Icon from "react-native-vector-icons/MaterialIcons"

import { StorageService } from "../services/storageService"
import { useToast } from "../hooks/useToast"
import type { SavedContent } from "../types"
import { COLORS, CONTENT_TYPES } from "../constants"

export function SavedContentsScreen() {
  const [contents, setContents] = useState<SavedContent[]>([])
  const [filteredContents, setFilteredContents] = useState<SavedContent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { showSuccess, showError } = useToast()

  useEffect(() => {
    loadContents()
  }, [])

  useEffect(() => {
    filterContents()
  }, [contents, searchQuery, selectedFilter])

  const loadContents = async () => {
    try {
      setIsLoading(true)
      const savedContents = await StorageService.getSavedContents()
      setContents(savedContents)
    } catch (error) {
      showError("Gagal memuat konten tersimpan")
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadContents()
    setRefreshing(false)
  }, [])

  const filterContents = () => {
    let filtered = contents

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (content) =>
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by content type
    if (selectedFilter !== "all") {
      if (selectedFilter === "favorites") {
        filtered = filtered.filter((content) => content.isFavorite)
      } else {
        filtered = filtered.filter((content) => content.contentType === selectedFilter)
      }
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredContents(filtered)
  }

  const handleDeleteContent = (content: SavedContent) => {
    Alert.alert("Hapus Konten", `Apakah Anda yakin ingin menghapus "${content.title}"?`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await StorageService.deleteContent(content.id)
            await loadContents()
            showSuccess("Konten berhasil dihapus")
          } catch (error) {
            showError("Gagal menghapus konten")
          }
        },
      },
    ])
  }

  const handleToggleFavorite = async (content: SavedContent) => {
    try {
      const updatedContent = { ...content, isFavorite: !content.isFavorite }
      await StorageService.saveContent(updatedContent)
      await loadContents()
      showSuccess(content.isFavorite ? "Dihapus dari favorit" : "Ditambahkan ke favorit")
    } catch (error) {
      showError("Gagal mengubah status favorit")
    }
  }

  const handleCopyContent = async (content: SavedContent) => {
    try {
      await Clipboard.setString(content.content)
      showSuccess("Konten berhasil disalin")
    } catch (error) {
      showError("Gagal menyalin konten")
    }
  }

  const handleShareContent = async (content: SavedContent) => {
    try {
      await Share.share({
        message: `${content.title}\n\n${content.content}`,
        title: content.title,
      })
    } catch (error) {
      showError("Gagal membagikan konten")
    }
  }

  const getContentTypeIcon = (contentType: string) => {
    const type = CONTENT_TYPES.find((t) => t.id === contentType)
    return type?.icon || "article"
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return COLORS.success
    if (score >= 60) return COLORS.warning
    return COLORS.error
  }

  const renderFilterButton = (filterId: string, label: string, icon: string) => (
    <TouchableOpacity
      key={filterId}
      style={[styles.filterButton, selectedFilter === filterId && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filterId)}
    >
      <Icon name={icon} size={16} color={selectedFilter === filterId ? COLORS.white : COLORS.textSecondary} />
      <Text style={[styles.filterButtonText, selectedFilter === filterId && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )

  const renderContentItem = ({ item }: { item: SavedContent }) => (
    <Card containerStyle={styles.contentCard}>
      <View style={styles.contentHeader}>
        <View style={styles.contentInfo}>
          <View style={styles.contentTitleRow}>
            <Icon name={getContentTypeIcon(item.contentType)} size={20} color={COLORS.primary} />
            <Text style={styles.contentTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => handleToggleFavorite(item)}>
              <Icon
                name={item.isFavorite ? "favorite" : "favorite-border"}
                size={20}
                color={item.isFavorite ? COLORS.error : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.contentPreview} numberOfLines={2}>
            {item.content}
          </Text>
        </View>
      </View>

      <View style={styles.contentMeta}>
        <View style={styles.qualityBadge}>
          <Text style={[styles.qualityScore, { color: getQualityColor(item.qualityAnalysis.overallScore) }]}>
            {item.qualityAnalysis.overallScore}%
          </Text>
        </View>
        <Text style={styles.contentDate}>{new Date(item.createdAt).toLocaleDateString("id-ID")}</Text>
        <Text style={styles.wordCount}>{item.metadata.wordCount} kata</Text>
      </View>

      <View style={styles.contentActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleCopyContent(item)}>
          <Icon name="content-copy" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShareContent(item)}>
          <Icon name="share" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteContent(item)}>
          <Icon name="delete" size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </Card>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="bookmark-border" size={64} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>Belum Ada Konten Tersimpan</Text>
      <Text style={styles.emptyStateDescription}>
        Konten yang Anda generate akan muncul di sini. Mulai buat konten pertama Anda!
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header
        centerComponent={{
          text: "Konten Tersimpan",
          style: { color: "#fff", fontSize: 20, fontWeight: "bold" },
        }}
        backgroundColor={COLORS.primary}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Cari konten..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          containerStyle={styles.searchBar}
          inputContainerStyle={styles.searchInput}
          inputStyle={styles.searchText}
          searchIcon={{ color: COLORS.textSecondary }}
          clearIcon={{ color: COLORS.textSecondary }}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "Semua", "list")}
        {renderFilterButton("favorites", "Favorit", "favorite")}
        {CONTENT_TYPES.slice(0, 3).map((type) => renderFilterButton(type.id, type.name, type.icon))}
      </View>

      {/* Content List */}
      <FlatList
        data={filteredContents}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  searchText: {
    color: COLORS.text,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    padding: 16,
  },
  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: COLORS.border,
  },
  contentHeader: {
    marginBottom: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  contentTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  contentPreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  contentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.card,
  },
  qualityScore: {
    fontSize: 12,
    fontWeight: "600",
  },
  contentDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  wordCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  contentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
})
