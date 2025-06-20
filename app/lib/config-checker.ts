export interface ConfigStatus {
  openaiConfigured: boolean
  adsenseConfigured: boolean
  analyticsConfigured: boolean
  allReady: boolean
  missingConfigs: string[]
}

export function checkConfiguration(): ConfigStatus {
  const missingConfigs: string[] = []

  const openaiConfigured = !!process.env.OPENAI_API_KEY
  if (!openaiConfigured) missingConfigs.push("OPENAI_API_KEY")

  const adsenseConfigured = !!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  if (!adsenseConfigured) missingConfigs.push("NEXT_PUBLIC_ADSENSE_PUBLISHER_ID")

  const analyticsConfigured = !!process.env.NEXT_PUBLIC_APP_URL
  if (!analyticsConfigured) missingConfigs.push("NEXT_PUBLIC_APP_URL")

  return {
    openaiConfigured,
    adsenseConfigured,
    analyticsConfigured,
    allReady: missingConfigs.length === 0,
    missingConfigs,
  }
}
