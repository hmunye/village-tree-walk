import { colors, dimensions } from "@/styles";
import { Tree } from "@/types/types";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import CustomPressable from "./CustomPressable";

export default function TreeDetails({
  tree,
  modalVisible,
  setModalVisible,
  toggleModal,
}: {
  tree: Tree;
  modalVisible: boolean;
  setModalVisible: (value: React.SetStateAction<boolean>) => void;
  toggleModal: () => void;
}) {
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
        <ScrollView style={styles.scrollView}>
          <Text style={styles.species}>{tree.species}</Text>
          <Text style={styles.address}>{tree.address}</Text>
          <Text style={styles.dbh}>DBH: {tree.dbh}</Text>
          <Text style={styles.description}>{tree.description}</Text>
        </ScrollView>
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
    height: "70%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  closeModal: {
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: -290,
  },
  scrollView: {
    padding: 40,
  },
  species: {
    fontSize: 42,
    fontFamily: "Barlow-Black",
    color: colors.primary,
    textTransform: "uppercase",
  },
  address: {
    fontSize: 28,
    marginTop: 15,
    fontFamily: "Barlow-Bold",
    color: colors.foreground,
  },
  dbh: {
    fontSize: 28,
    marginTop: 15,
    fontFamily: "Barlow-Bold",
    color: colors.foreground,
  },
  description: {
    fontSize: 24,
    marginTop: 15,
    marginBottom: 80,
    fontFamily: "Barlow-SemiBold",
    color: colors.foreground,
  },
});
