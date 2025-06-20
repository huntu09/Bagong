"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, Alert, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Card, Switch, Button, List, Divider, Portal, Dialog, TextInput } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import DeviceInfo from "react-native-device-info"
import Share from "react-native-share"

import { useStorage } from "@hooks/useStorage"
import { useToast } from "@hooks/useToast"
import { COLORS, CONTENT_TYPES, WRITING_STYLES } from "@constants/index"
import type { AppSettings } from "@types/index"

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, exportData, importData, clearAllData } = useStorage()
  const { showSuccess, showError, showWarning } = useToast()

  const [appVersion, setAppVersion] = useState("")
  const [buildNumber, setBuildNumber] = useState("")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importText, setImportText] = useState("")

  useEffect(() => {
    loadAppInfo()
  }, [])

  const loadAppInfo = async () => {
    try {
      const version = DeviceInfo.getVersion()
      const build = DeviceInfo.getBuildNumber()
      setAppVersion(version)
      setBuildNumber(build)
    } catch (error) {
      console.error("Error loading app info:", error)
    }
  }

  const handleSettingChange = async (key: keyof AppSettings, value: any) => {
    if (!settings) return

    const success = await updateSettings({ [key]: value })
    if (success) {
      showSuccess("Pengaturan berhasil disimpan")
    } else {
      showError("Gagal menyimpan pengaturan")
    }
  }

  const handleExportData = async () => {
    try {
      const data = await exportData()

      const shareOptions = {
        title: "Export Data AI Writer Pro",
        message: "Data backup dari AI Writer Pro",
        url: `data:application/json;base64,${btoa(data)}`,
        filename: `aiwriter_backup_${new Date().toISOString().split("T")[0]}.json`,
      }

      await Share.open(shareOptions)
      setShowExportDialog(false)
      showSuccess("Data berhasil diekspor")
    } catch (error) {
      showError("Gagal mengekspor data")
    }
  }

  const handleImportData = async () => {
    if (!importText.trim()) {
      showWarning("Masukkan data yang akan diimpor")
      return
    }

    try {
      const success = await importData(importText)
      if (success) {
        setShowImportDialog(false)
        setImportText("")
        showSuccess("Data berhasil diimpor")
      } else {
        showError("Format data tidak valid")
      }
    } catch (error) {
      showError("Gagal mengimpor data")
    }
  }

  const handleClearAllData = () => {
    Alert.alert(
      "Hapus Semua Data",
      "Apakah Anda yakin ingin menghapus semua konten dan pengaturan? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            const success = await clearAllData()
            if (success) {
              showSuccess("Semua data berhasil dihapus")
            } else {
              showError("Gagal menghapus data")
            }
          },
        },
      ],
    )
  }

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      showError("Gagal membuka link")
    })
  }

  if (!settings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Memuat pengaturan...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <Card style={styles.card}>
          <Card.Title title="Pengaturan Umum" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Simpan Otomatis"
              description="Simpan konten secara otomatis setelah generate"
              left={() => <Icon name="save" size={24} color={COLORS.primary} />}
              right={() => (
                <Switch value={settings.autoSave} onValueChange={(value) => handleSettingChange("autoSave", value)} />
              )}
            />

            <Divider />

            <List.Item
              title="Mode Gelap"
              description="Gunakan tema gelap untuk aplikasi"
              left={() => <Icon name="dark-mode" size={24} color={COLORS.primary} />}
              right={() => (
                <Switch value={settings.darkMode} onValueChange={(value) => handleSettingChange("darkMode", value)} />
              )}
            />

            <Divider />

            <List.Item
              title="Notifikasi"
              description="Terima notifikasi dari aplikasi"
              left={() => <Icon name="notifications" size={24} color={COLORS.primary} />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => handleSettingChange("notifications", value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Content Settings */}
        <Card style={styles.card}>
          <Card.Title title="Pengaturan Konten" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Tipe Konten Default"
              description={CONTENT_TYPES.find((t) => t.id === settings.defaultContentType)?.name || "Artikel"}
              left={() => <Icon name="article" size={24} color={COLORS.primary} />}
              onPress={() => {
                // TODO: Show picker dialog
              }}
            />

            <Divider />

            <List.Item
              title="Gaya Penulisan Default"
              description={WRITING_STYLES.find((s) => s.id === settings.defaultWritingStyle)?.name || "Formal"}
              left={() => <Icon name="style" size={24} color={COLORS.primary} />}
              onPress={() => {
                // TODO: Show picker dialog
              }}
            />

            <Divider />

            <List.Item
              title="Maksimal Konten Tersimpan"
              description={`${settings.maxSavedContents} konten`}
              left={() => <Icon name="storage" size={24} color={COLORS.primary} />}
              onPress={() => {
                // TODO: Show slider dialog
              }}
            />
          </Card.Content>
        </Card>

        {/* Data Management */}
        <Card style={styles.card}>
          <Card.Title title="Manajemen Data" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Button mode="outlined" icon="download" onPress={() => setShowExportDialog(true)} style={styles.button}>
              Ekspor Data
            </Button>

            <Button mode="outlined" icon="upload" onPress={() => setShowImportDialog(true)} style={styles.button}>
              Impor Data
            </Button>

            <Button
              mode="outlined"
              icon="delete-forever"
              onPress={handleClearAllData}
              style={[styles.button, styles.dangerButton]}
              textColor={COLORS.error}
            >
              Hapus Semua Data
            </Button>
          </Card.Content>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <Card.Title title="Tentang Aplikasi" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Item
              title="Versi Aplikasi"
              description={`${appVersion} (${buildNumber})`}
              left={() => <Icon name="info" size={24} color={COLORS.primary} />}
            />

            <Divider />

            <List.Item
              title="Kebijakan Privasi"
              left={() => <Icon name="privacy-tip" size={24} color={COLORS.primary} />}
              right={() => <Icon name="open-in-new" size={20} color={COLORS.textSecondary} />}
              onPress={() => openURL("https://your-website.com/privacy")}
            />

            <Divider />

            <List.Item
              title="Syarat & Ketentuan"
              left={() => <Icon name="description" size={24} color={COLORS.primary} />}
              right={() => <Icon name="open-in-new" size={20} color={COLORS.textSecondary} />}
              onPress={() => openURL("https://your-website.com/terms")}
            />

            <Divider />

            <List.Item
              title="Hubungi Support"
              left={() => <Icon name="support" size={24} color={COLORS.primary} />}
              right={() => <Icon name="open-in-new" size={20} color={COLORS.textSecondary} />}
              onPress={() => openURL("mailto:support@aiwriterpro.com")}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Export Dialog */}
      <Portal>
        <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
          <Dialog.Title>Ekspor Data</Dialog.Title>
          <Dialog.Content>
            <Text>Ekspor semua konten tersimpan dan pengaturan ke file backup?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowExportDialog(false)}>Batal</Button>
            <Button onPress={handleExportData}>Ekspor</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Import Dialog */}
      <Portal>
        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Impor Data</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Paste data backup yang akan diimpor:</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={4}
              value={importText}
              onChangeText={setImportText}
              placeholder="Paste JSON data di sini..."
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Batal</Button>
            <Button onPress={handleImportData}>Impor</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginBottom: 8,
  },
  dangerButton: {
    borderColor: COLORS.error,
  },
  dialogText: {
    color: COLORS.text,
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: COLORS.surface,
  },
})
