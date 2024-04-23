import { colors } from "@/styles";
import { PreviewRouteProps } from "@/types/types";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomPressable from "./CustomPressable";

export default function PreviewRoute({
  onConfirmRoute,
  onCancel,
}: PreviewRouteProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    // TODO: Make use of this
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
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.cardText}>
          After confirming your route, you'll be redirected to Google or Apple
          Maps for the first tree's directions. Once you arrive, return to the
          app.
        </Text>
        <View style={styles.cardContainer}>
          <CustomPressable onPress={onCancel} buttonStyle={styles.backButton}>
            <Text style={styles.backButtonText}>Cancel</Text>
          </CustomPressable>
          <CustomPressable
            onPress={onConfirmRoute}
            buttonStyle={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm Route</Text>
          </CustomPressable>
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  cardText: {
    margin: 20,
    fontFamily: "Barlow-Bold",
    fontSize: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 15,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.destructive,
    padding: 15,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  confirmButtonText: {
    fontSize: 20,
    fontFamily: "Barlow-Bold",
    color: colors.background,
  },
  backButtonText: {
    fontSize: 20,
    fontFamily: "Barlow-Bold",
    color: colors.background,
  },
});
