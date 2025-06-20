import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Icon from "react-native-vector-icons/MaterialIcons"

import { HomeScreen } from "@screens/HomeScreen"
import { SavedContentsScreen } from "@screens/SavedContentsScreen"
import { SettingsScreen } from "@screens/SettingsScreen"
import { COLORS } from "@constants/index"

const Tab = createBottomTabNavigator()

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          switch (route.name) {
            case "Home":
              iconName = "auto-awesome"
              break
            case "Saved":
              iconName = "bookmark"
              break
            case "Settings":
              iconName = "settings"
              break
            default:
              iconName = "help"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Generator",
          tabBarLabel: "Generator",
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedContentsScreen}
        options={{
          title: "Tersimpan",
          tabBarLabel: "Tersimpan",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Pengaturan",
          tabBarLabel: "Pengaturan",
        }}
      />
    </Tab.Navigator>
  )
}
