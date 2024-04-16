import { openDatabase } from "@/utils/database";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite/next";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
    "Barlow-Thin": require("../assets/fonts/BarlowSemiCondensed-Thin.otf"),
    "Barlow-ExtraLight": require("../assets/fonts/BarlowSemiCondensed-ExtraLight.otf"),
    "Barlow-Light": require("../assets/fonts/BarlowSemiCondensed-Light.otf"),
    Barlow: require("../assets/fonts/BarlowSemiCondensed-Regular.otf"),
    "Barlow-Medium": require("../assets/fonts/BarlowSemiCondensed-Medium.otf"),
    "Barlow-SemiBold": require("../assets/fonts/BarlowSemiCondensed-SemiBold.otf"),
    "Barlow-Bold": require("../assets/fonts/BarlowSemiCondensed-Bold.otf"),
    "Barlow-ExtraBold": require("../assets/fonts/BarlowSemiCondensed-ExtraBold.otf"),
    "Barlow-Black": require("../assets/fonts/BarlowSemiCondensed-Black.otf"),
  });
  const [dbLoaded, setDbLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadDb() {
      await openDatabase()
        .then(() => setDbLoaded(true))
        // TODO: Better error handling
        .catch((error) => console.log(error));
    }
    loadDb();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontLoaded && dbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, dbLoaded]);

  if (!fontLoaded || !dbLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="sqlite3.db">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
