import treeMarker from "@/assets/images/tree_marker.webp";
import CustomPressable from "@/components/ui/CustomPressable";
import RouteCard from "@/components/ui/RouteCard";
import colors from "@/styles/colors";
import { darkMapStyle } from "@/styles/mapStyle";
import { MapRoute, RouteCoordinates, Tree } from "@/types/types";
import { deviceHeight, deviceWidth } from "@/utils/deviceDimensions";
import redirectMap from "@/utils/redirectMap";
import { FontAwesome } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite/next";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Modal from "react-native-modal";

export default function Map() {
  const db = useSQLiteContext();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [routeCords, setRouteCords] = useState<RouteCoordinates[]>([]);

  const markerRefs = useRef<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseTreeWalkVisible, setChooseTreeWalkVisible] = useState(true);

  // Need this for marker performance on Android
  const doRedraw = (index: number) => {
    markerRefs.current[index].redraw();
  };

  const handleRouteSelect = async (routeId: number) => {
    try {
      const routeCordsRows: RouteCoordinates[] = await db.getAllAsync(
        "SELECT * FROM route_coordinates WHERE route_id = ?",
        [routeId]
      );
      setRouteCords(routeCordsRows);
      setModalVisible(false);
      setChooseTreeWalkVisible(false);
      // Redirect user to their maps application for directions to first tree on route
      if (routeCordsRows && routeCordsRows.length > 0) {
        redirectMap(routeCordsRows[0].latitude, routeCordsRows[0].longitude);
      } else {
        console.error("routeCords is undefined or empty");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStopRoute = () => {
    setRouteCords([]);
    setChooseTreeWalkVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const treeRows = await db.getAllAsync("SELECT * FROM tree");
        const routeRows = await db.getAllAsync("SELECT * FROM map_route");

        setTrees(treeRows as Tree[]);
        setRoutes(routeRows as MapRoute[]);
      } catch (error) {
        // TODO: Better error handling
        console.error(error);
      }
    }

    fetchData();
  }, [db]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.213679182884576,
          longitude: -77.9390734326327,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={darkMapStyle}
        showsCompass={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsScale
        toolbarEnabled={false}
        userLocationCalloutEnabled
      >
        {trees.map((tree, index) => (
          <Marker
            ref={(ref) => (markerRefs.current[index] = ref)}
            coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
            key={tree.id}
            title={tree.species}
            description={tree.address}
          >
            <Image
              source={treeMarker}
              fadeDuration={0}
              onLoad={() =>
                Platform.OS == "ios" ? undefined : doRedraw(index)
              }
              style={{ width: 48, height: 48, resizeMode: "contain" }}
            />
          </Marker>
        ))}
        {routeCords.length > 0 && (
          <Polyline
            coordinates={routeCords.map((item) => ({
              latitude: item.latitude,
              longitude: item.longitude,
            }))}
            strokeWidth={8}
            strokeColor={colors.background}
          />
        )}
      </MapView>
      {chooseTreeWalkVisible && (
        <CustomPressable
          onPress={() => setModalVisible(true)}
          buttonStyle={styles.button}
        >
          <Text style={styles.buttonText}>Choose Tree Walk</Text>
        </CustomPressable>
      )}
      {!chooseTreeWalkVisible && (
        <CustomPressable
          onPress={handleStopRoute}
          buttonStyle={[
            styles.button,
            !chooseTreeWalkVisible
              ? { backgroundColor: colors.destructive }
              : {},
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              !chooseTreeWalkVisible ? { color: colors.background } : {},
            ]}
          >
            Stop Route
          </Text>
        </CustomPressable>
      )}
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
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight + 100}
        style={styles.modal}
      >
        <View style={styles.modalView}>
          <CustomPressable
            onPress={toggleModal}
            buttonStyle={styles.closeModal}
          >
            <FontAwesome name="close" size={24} color={colors.foreground} />
            <Text style={styles.selectText}>Select Route</Text>
          </CustomPressable>

          <FlatList
            horizontal
            initialNumToRender={3}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: Platform.OS == "ios" ? "104%" : "100%",
  },
  button: {
    position: "absolute",
    top: 80,
    right: 20,
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Barlow-Bold",
    color: colors.primary,
  },
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
  selectText: {
    fontSize: 24,
    fontFamily: "Barlow-Black",
    color: colors.foreground,
    marginLeft: 32,
  },
  closeModal: {
    padding: 10,
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
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
