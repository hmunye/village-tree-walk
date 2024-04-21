import colors from "@/styles/colors";
import { MapRoute } from "@/types/types";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomPressable from "./CustomPressable";

// TODO: Update route description to be shorter
export default function RouteCard({
  item,
  onSelect,
}: {
  item: MapRoute;
  onSelect: (id: number) => void;
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardBody}>
        <View style={styles.closeContainer}>
          <Text style={styles.cardItemText}>{item.name}</Text>
          <FontAwesome5 name="route" size={32} color={colors.primary} />
        </View>
        <Text style={styles.cardItemDescription}>{item.description}</Text>
        <View style={styles.buttonContainer}>
          {/* TODO: Move text outside of pressable */}
          <CustomPressable
            buttonStyle={styles.button}
            onPress={() => onSelect(item.id)}
          >
            <Text style={styles.buttonText}>Select</Text>
          </CustomPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: 250,
  },
  cardBody: {
    width: "auto",
    height: "100%",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#EEEFFF",
    borderWidth: 2,
    borderColor: colors.foreground,
  },
  closeContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  cardItemText: {
    fontSize: 24,
    fontFamily: "Barlow-Black",
    color: colors.foreground,
    textAlign: "justify",
    marginHorizontal: 20,
    textTransform: "uppercase",
  },
  cardItemDescription: {
    fontSize: 16,
    fontFamily: "Barlow-Medium",
    color: colors.foreground,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.foreground,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontFamily: "Barlow-SemiBold",
  },
});
