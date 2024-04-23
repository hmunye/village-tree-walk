import { colors, dimensions } from "@/styles";
import { SelectRouteProps } from "@/types/types";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import CustomPressable from "./CustomPressable";
import RouteCard from "./RouteCard";

export default function SelectRoute({
  modalVisible,
  setModalVisible,
  toggleModal,
  routes,
  handleRouteSelect,
}: SelectRouteProps) {
  return (
    <Modal
      isVisible={modalVisible}
      backdropOpacity={Platform.OS == "ios" ? 0.6 : 0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionInTiming={0}
      backdropTransitionOutTiming={0}
      onBackdropPress={() => setModalVisible(false)}
      statusBarTranslucent
      deviceWidth={dimensions.deviceWidth}
      deviceHeight={dimensions.deviceHeight + 100}
      style={styles.modal}
    >
      <View style={styles.modalView}>
        <CustomPressable onPress={toggleModal} buttonStyle={styles.closeModal}>
          <FontAwesome name="close" size={24} color={colors.foreground} />
        </CustomPressable>

        <FlatList
          horizontal
          initialNumToRender={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal
          data={routes}
          renderItem={({ item }) => (
            <RouteCard item={item} onSelect={handleRouteSelect} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={styles.swipeContainer}>
        <FontAwesome name="arrow-left" size={24} color={colors.background} />
        <Text style={styles.swipeText}>Swipe For More</Text>
        <FontAwesome name="arrow-right" size={24} color={colors.background} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 0,
  },
  modalView: {
    height: "65%",
    width: "auto",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.muted,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  swipeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  swipeText: {
    fontSize: 24,
    fontFamily: "Barlow-Bold",
    margin: 15,
    color: colors.background,
  },
});
