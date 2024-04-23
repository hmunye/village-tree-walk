import { colors } from "@/styles";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function GettingLocation() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={colors.primary} />
      <Text style={styles.textStyle}>Getting Location...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.default,
  },
  textStyle: {
    marginTop: 20,
    fontFamily: "Barlow-Bold",
    fontSize: 22,
    color: colors.foreground,
  },
});
