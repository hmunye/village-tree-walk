import colors from "@/styles/colors";
import { MapRoute } from "@/types/types";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * TODO: Change description to "Embark on a scenic tree walk starting from Brockport's Welcome Center at 11 Water Street.
 * Follow the canal westward to Main Street, where you'll encounter a picturesque route. Journey south on Holley Street,
 * surrounded by London Plane trees and flowering crabapples. Turn right onto Utica Street, then north to Clinton. Cross
 * the bridge via the sidewalk and descend onto Smith Street, leading you to Corbett Park amidst lush greenery."
 */

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
          <Pressable style={styles.button} onPress={() => onSelect(item.id)}>
            <Text style={styles.buttonText}>Select</Text>
          </Pressable>
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
    height: "auto",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#EEEFFF",
    borderWidth: 1,
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
    marginVertical: 10,
    marginHorizontal: 10,
    textTransform: "uppercase",
  },
  cardItemDescription: {
    fontSize: 16,
    fontFamily: "Barlow-Medium",
    color: colors.foreground,
    textAlign: "center",
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
