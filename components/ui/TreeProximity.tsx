import treeImage from "@/assets/images/tree.png";
import colors from "@/styles/colors";
import { Tree } from "@/types/types";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function TreeProximity({
  closestTree,
  closestDistance,
}: {
  closestTree: Tree;
  closestDistance: number;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["15%", "52%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.info("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.modalBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitleText}>Tree Nearby!</Text>
          <Text style={styles.cardItemText}>{closestTree.species}</Text>
          <View style={styles.imageContainer}>
            <Image
              source={treeImage}
              style={{ width: 300, height: 250, resizeMode: "cover" }}
            />
          </View>
        </View>
        <Text style={styles.cardItemDescription}>{closestTree.address}</Text>
        <Text style={styles.cardItemDescription}>
          {closestDistance} Meters Away
        </Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: colors.default,
    borderRadius: 50,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    borderRadius: 50,
  },
  cardContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  cardTitleText: {
    fontSize: 28,
    fontFamily: "Barlow-Black",
    color: colors.primary,
    textTransform: "uppercase",
  },
  imageContainer: {
    width: 300,
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  cardItemText: {
    fontSize: 18,
    fontFamily: "Barlow-Bold",
    color: colors.foreground,
    textTransform: "uppercase",
    marginTop: 10,
  },
  cardItemDescription: {
    fontSize: 16,
    fontFamily: "Barlow-Medium",
    color: colors.foreground,
    textAlign: "center",
    marginTop: 15,
  },
});
