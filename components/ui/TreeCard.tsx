import { TreeImages } from "@/assets/images";
import { colors } from "@/styles";
import { Tree } from "@/types/types";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function TreeCard({ item }: { item: Tree }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={TreeImages[item.species]}
        style={styles.image}
        imageStyle={{ borderRadius: 30 }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.speciesText}>{item.species}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: 380,
    height: 430,
    justifyContent: "center",
    borderRadius: 10,
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 50,
  },
  speciesText: {
    color: colors.background,
    fontSize: 28,
  },
  addressText: {
    color: colors.background,
    fontSize: 16,
  },
});
