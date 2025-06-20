"use client"

import { useState, useEffect, useCallback } from "react"
import { storageService } from "@services/storageService"
import type { SavedContent, AppSettings } from "@types/index"

export const useStorage = () => {
  const [savedContents, setSavedContents] = useState<SavedContent[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [contents, userSettings] = await Promise.all([
        storageService.getSavedContents(),
        storageService.getSettings(),
      ])

      setSavedContents(contents)
      setSettings(userSettings)
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = useCallback(async (content: SavedContent): Promise<boolean> => {
    try {
      const success = await storageService.saveContent(content)
      if (success) {
        setSavedContents((prev) => [content, ...prev])
        return true
      }
      return false
    } catch (error) {
      console.error("Error saving content:", error)
      return false
    }
  }, [])

  const updateContent = useCallback(async (id: string, updates: Partial<SavedContent>): Promise<boolean> => {
    try {
      const success = await storageService.updateContent(id, updates)
      if (success) {
        setSavedContents((prev) =>
          prev.map((content) =>
            content.id === id ? { ...content, ...updates, updatedAt: new Date().toISOString() } : content,
          ),
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating content:", error)
      return false
    }
  }, [])

  const deleteContent = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await storageService.deleteContent(id)
      if (success) {
        setSavedContents((prev) => prev.filter((content) => content.id !== id))
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting content:", error)
      return false
    }
  }, [])

  const toggleFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      const content = savedContents.find((c) => c.id === id)
      if (!content) return false

      return updateContent(id, { isFavorite: !content.isFavorite })
    },
    [savedContents, updateContent],
  )

  const updateSettings = useCallback(
    async (newSettings: Partial<AppSettings>): Promise<boolean> => {
      try {
        const updatedSettings = { ...settings, ...newSettings } as AppSettings
        const success = await storageService.saveSettings(updatedSettings)
        if (success) {
          setSettings(updatedSettings)
          return true
        }
        return false
      } catch (error) {
        console.error("Error updating settings:", error)
        return false
      }
    },
    [settings],
  )

  const exportData = useCallback(async (): Promise<string | null> => {
    try {
      return await storageService.exportData()
    } catch (error) {
      console.error("Error exporting data:", error)
      return null
    }
  }, [])

  const importData = useCallback(async (data: string): Promise<boolean> => {
    try {
      const success = await storageService.importData(data)
      if (success) {
        await loadInitialData() // Reload data after import
        return true
      }
      return false
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }, [])

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      const success = await storageService.clearAllData()
      if (success) {
        setSavedContents([])
        setSettings(null)
        return true
      }
      return false
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    }
  }, [])

  return {
    savedContents,
    settings,
    isLoading,
    saveContent,
    updateContent,
    deleteContent,
    toggleFavorite,
    updateSettings,
    exportData,
    importData,
    clearAllData,
    refreshData: loadInitialData,
  }
}
