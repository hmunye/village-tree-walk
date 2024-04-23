import { colors } from "@/styles";
import { Tree } from "@/types/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TreeCard({ item }: { item: Tree }) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>{item.id}</Text>
      <Text style={styles.text}>{item.latitude}</Text>
      <Text style={styles.text}>{item.longitude}</Text>
      <Text style={styles.text}>{item.address}</Text>
      <Text style={styles.text}>{item.dbh}</Text>
      <Text style={styles.text}>{item.species}</Text>
      <Text style={styles.text}>{item.description}</Text>
      <Text style={styles.text}>{item.created_at}</Text>
      <Text style={styles.text}>{item.updated_at}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 200,
    height: 500,
    padding: 20,
    marginVertical: "60%",
    marginHorizontal: 20,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    fontFamily: "Barlow",
    color: colors.foreground,
  },
});
