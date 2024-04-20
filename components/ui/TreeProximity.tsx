import colors from "@/styles/colors";
import { Tree } from "@/types/types";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TreeProximity({ closestTree }: { closestTree: Tree }) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["20%", "40%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.info("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Tree Nearby</Text>
          <Text>Name: {closestTree.id}</Text>
          <Text>Species: {closestTree.species}</Text>
          <Text>Location: {closestTree.address}</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
