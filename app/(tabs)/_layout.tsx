import { colors } from "@/styles";
import {
  Entypo,
  Ionicons as IIcons,
  MaterialCommunityIcons as MCIcon,
} from "@expo/vector-icons";
import React from "react";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import Map from ".";
import Directory from "./directory";
import Favorites from "./favorites";
import Settings from "./settings";

export default function TabLayout() {
  const Tabs = AnimatedTabBarNavigator();

  return (
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: colors.background,
        inactiveTintColor: colors.muted,
        tabStyle: {
          backgroundColor: colors.default,
          elevation: 0,
          bottom: 15,
        },
        labelStyle: {
          fontSize: 18,
          fontFamily: "Barlow-Bold",
          lineHeight: 20,
        },
      }}
      appearance={{
        topPadding: 15,
        horizontalPadding: 10,
        bottomPadding: 15,
        activeTabBackgrounds: colors.primary,
        floating: true,
      }}
    >
      <Tabs.Screen
        name="index"
        component={Map}
        options={{
          title: "Map",
          tabBarIcon: ({
            focused,
            color,
          }: {
            focused: boolean;
            color: string;
          }) => (
            <IIcons
              name={focused ? "map" : "map-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        component={Favorites}
        options={{
          title: "Favorites",
          tabBarIcon: ({
            focused,
            color,
          }: {
            focused: boolean;
            color: string;
          }) => (
            <MCIcon
              name={focused ? "heart-circle" : "heart-circle-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="directory"
        component={Directory}
        options={{
          title: "Directory",
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name={"tree"} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({
            focused,
            color,
          }: {
            focused: boolean;
            color: string;
          }) => (
            <IIcons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
