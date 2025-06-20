"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SavedContent, AppSettings } from "@types/index"
import { STORAGE_KEYS } from "@constants/index"

class StorageService {
  // Default settings
  private defaultSettings: AppSettings = {
    defaultContentType: "article",
    defaultWritingStyle: "informative",
    defaultTargetAudience: "general",
    defaultWordCount: 500,
    autoSave: true,
    showQualityAnalysis: true,
    theme: "dark",
    language: "id",
    notifications: {
      enabled: true,
      contentReady: true,
      qualityAlerts: true,
    },
  }

  // Saved Contents Management
  async getSavedContents(): Promise<SavedContent[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CONTENTS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error getting saved contents:", error)
      return []
    }
  }

  async saveContent(content: SavedContent): Promise<boolean> {
    try {
      const existingContents = await this.getSavedContents()
      const updatedContents = [content, ...existingContents]
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CONTENTS, JSON.stringify(updatedContents))
      return true
    } catch (error) {
      console.error("Error saving content:", error)
      return false
    }
  }

  async updateContent(id: string, updates: Partial<SavedContent>): Promise<boolean> {
    try {
      const contents = await this.getSavedContents()
      const updatedContents = contents.map((content) =>
        content.id === id ? { ...content, ...updates, updatedAt: new Date().toISOString() } : content,
      )
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CONTENTS, JSON.stringify(updatedContents))
      return true
    } catch (error) {
      console.error("Error updating content:", error)
      return false
    }
  }

  async deleteContent(id: string): Promise<boolean> {
    try {
      const contents = await this.getSavedContents()
      const filteredContents = contents.filter((content) => content.id !== id)
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CONTENTS, JSON.stringify(filteredContents))
      return true
    } catch (error) {
      console.error("Error deleting content:", error)
      return false
    }
  }

  // Settings Management
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS)
      return data ? { ...this.defaultSettings, ...JSON.parse(data) } : this.defaultSettings
    } catch (error) {
      console.error("Error getting settings:", error)
      return this.defaultSettings
    }
  }

  async saveSettings(settings: AppSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error("Error saving settings:", error)
      return false
    }
  }

  // Onboarding Management
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED)
      return data === "true"
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      return false
    }
  }

  async setOnboardingCompleted(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true")
      return true
    } catch (error) {
      console.error("Error setting onboarding completed:", error)
      return false
    }
  }

  // Data Export/Import
  async exportData(): Promise<string> {
    try {
      const [contents, settings] = await Promise.all([this.getSavedContents(), this.getSettings()])

      const exportData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        contents,
        settings,
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      console.error("Error exporting data:", error)
      throw new Error("Gagal mengekspor data")
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)

      // Validate data structure
      if (!data.contents || !Array.isArray(data.contents)) {
        throw new Error("Format data tidak valid")
      }

      // Import contents
      if (data.contents.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_CONTENTS, JSON.stringify(data.contents))
      }

      // Import settings
      if (data.settings) {
        await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(data.settings))
      }

      return true
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }

  // Clear All Data
  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SAVED_CONTENTS,
        STORAGE_KEYS.APP_SETTINGS,
        STORAGE_KEYS.USER_PREFERENCES,
      ])
      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    }
  }

  // Search Contents
  async searchContents(query: string): Promise<SavedContent[]> {
    try {
      const contents = await this.getSavedContents()
      const lowercaseQuery = query.toLowerCase()

      return contents.filter(
        (content) =>
          content.title.toLowerCase().includes(lowercaseQuery) ||
          content.content.toLowerCase().includes(lowercaseQuery) ||
          content.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      )
    } catch (error) {
      console.error("Error searching contents:", error)
      return []
    }
  }

  // Get Contents by Type
  async getContentsByType(contentType: string): Promise<SavedContent[]> {
    try {
      const contents = await this.getSavedContents()
      return contents.filter((content) => content.contentType === contentType)
    } catch (error) {
      console.error("Error getting contents by type:", error)
      return []
    }
  }

  // Get Favorite Contents
  async getFavoriteContents(): Promise<SavedContent[]> {
    try {
      const contents = await this.getSavedContents()
      return contents.filter((content) => content.isFavorite)
    } catch (error) {
      console.error("Error getting favorite contents:", error)
      return []
    }
  }

  // Storage Statistics
  async getStorageStats(): Promise<{
    totalContents: number
    totalSize: string
    favoriteContents: number
    contentsByType: Record<string, number>
  }> {
    try {
      const contents = await this.getSavedContents()
      const totalSize = JSON.stringify(contents).length

      const contentsByType: Record<string, number> = {}
      contents.forEach((content) => {
        contentsByType[content.contentType] = (contentsByType[content.contentType] || 0) + 1
      })

      return {
        totalContents: contents.length,
        totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
        favoriteContents: contents.filter((c) => c.isFavorite).length,
        contentsByType,
      }
    } catch (error) {
      console.error("Error getting storage stats:", error)
      return {
        totalContents: 0,
        totalSize: "0 KB",
        favoriteContents: 0,
        contentsByType: {},
      }
    }
  }
}

export const storageService = new StorageService()
