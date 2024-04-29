import { TreeImages } from "@/assets/images";
import { colors } from "@/styles";
import { Tree } from "@/types/types";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import CustomPressable from "./CustomPressable";
import TreeDetails from "./TreeDetails";

export default function TreeCard({ item }: { item: Tree }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <Skeleton.Group show={isLoading}>
        <MotiView>
          <Skeleton colorMode="light" radius={30}>
            <ImageBackground
              source={TreeImages[item.species]}
              style={styles.image}
              imageStyle={{ borderRadius: 30 }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.speciesText}>{item.species}</Text>
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
              <CustomPressable
                onPress={handlePress}
                buttonStyle={styles.cardButton}
              >
                <Text style={styles.cardButtonText}>Learn More</Text>
              </CustomPressable>
            </ImageBackground>
          </Skeleton>
        </MotiView>
      </Skeleton.Group>
      <TreeDetails
        tree={item}
        modalVisible={isModalVisible}
        setModalVisible={() => toggleModal()}
        toggleModal={toggleModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 350,
    height: 400,
    justifyContent: "center",
    borderRadius: 10,
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    position: "absolute",
    bottom: 80,
    left: 10,
  },
  speciesText: {
    color: colors.background,
    fontSize: 28,
  },
  addressText: {
    color: colors.background,
    fontSize: 16,
  },
  cardButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  cardButtonText: {
    fontSize: 20,
    fontFamily: "Barlow-Bold",
    color: colors.primary,
  },
});
