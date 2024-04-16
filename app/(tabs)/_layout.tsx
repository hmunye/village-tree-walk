import colors from "@/utils/colors";
import { Ionicons as IIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: "#EEEEEE",
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: "Barlow-Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: "Barlow-Medium",
          },
          tabBarIcon: ({
            focused,
            color,
          }: {
            focused: boolean;
            color: string;
          }) => (
            <IIcons
              name={focused ? "map" : "map-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: "Barlow-Medium",
          },
          tabBarIcon: ({
            focused,
            color,
          }: {
            focused: boolean;
            color: string;
          }) => (
            <IIcons
              name={focused ? "settings" : "settings-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
