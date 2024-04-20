import treeMarker from "@/assets/images/tree_marker.webp";
import CustomPressable from "@/components/ui/CustomPressable";
import SelectRoute from "@/components/ui/SelectRoute";
import TreeProximity from "@/components/ui/TreeProximity";
import colors from "@/styles/colors";
import { darkMapStyle } from "@/styles/mapStyle";
import { MapRoute, RouteCoordinates, Tree } from "@/types/types";
import redirectMap from "@/utils/redirectMap";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useSQLiteContext } from "expo-sqlite/next";
import { getPreciseDistance } from "geolib";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function Map() {
  const db = useSQLiteContext();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [closestTree, setClosestTree] = useState<Tree | null>(null);
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [routeCords, setRouteCords] = useState<RouteCoordinates[]>([]);

  const markerRefs = useRef<any[]>([]);
  const mapRef = useRef<MapView>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [chooseTreeWalkVisible, setChooseTreeWalkVisible] = useState(true);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObjectCoords>();
  const [markerCoordinates, setMarkerCoordinates] = useState({
    latitude: 43.0936772,
    longitude: -77.7845867,
  });

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

  const animateToLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      });
    }
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

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      console.info(
        Platform.OS == "android"
          ? `Android: Current Location: ${location.coords.latitude}, ${location.coords.longitude}`
          : ""
      );
      console.info(
        Platform.OS == "ios"
          ? `IOS: Current Location: ${location.coords.latitude}, ${location.coords.longitude}`
          : ""
      );
    };
    getLocation();
  }, []);

  useEffect(() => {
    // Distance is in meters
    if (currentLocation) {
      let closestDistance = Infinity;
      let closestTree: Tree | null = null;

      trees.forEach((tree) => {
        const distance = getPreciseDistance(
          [currentLocation.longitude, currentLocation.latitude],
          [tree.longitude, tree.latitude],
          1
        );

        if (distance < closestDistance && distance <= 20000) {
          closestDistance = distance;
          closestTree = tree;
        }
      });

      setClosestTree(closestTree);

      console.info(
        Platform.OS == "android"
          ? `Android: Distance to closest tree: ${closestDistance} meters`
          : ""
      );
      console.info(
        Platform.OS == "ios"
          ? `IOS: Distance to closest tree: ${closestDistance} meters`
          : ""
      );
    }
  }, [currentLocation, trees]);

  if (!currentLocation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          size={"large"}
          color={colors.primary}
          style={{
            padding: 12,
            backgroundColor: "#F3EDE2",
            borderRadius: 12,
          }}
        />
        <Text
          style={{ marginTop: 15, fontFamily: "Barlow-Bold", fontSize: 20 }}
        >
          Getting Location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude ?? 43.213679182884576,
          longitude: currentLocation?.longitude ?? -77.9390734326327,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={darkMapStyle}
        showsCompass={false}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsScale
        toolbarEnabled={false}
        userLocationCalloutEnabled
      >
        {trees.map((tree, index) => (
          <Marker
            ref={(ref) => (markerRefs.current[index] = ref)}
            coordinate={{
              latitude: tree.latitude,
              longitude: tree.longitude,
            }}
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
        <Marker
          coordinate={{
            latitude: 43.0936772,
            longitude: -77.7845867,
          }}
          //43.09347722056475, -77.78492871132381
          tracksInfoWindowChanges={false}
          tracksViewChanges={false}
        />
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
      <CustomPressable
        onPress={animateToLocation}
        buttonStyle={styles.locationButton}
      >
        <FontAwesome5 name="location-arrow" size={18} color={colors.primary} />
      </CustomPressable>
      <SelectRoute
        modalVisible={modalVisible}
        setModalVisible={() => setModalVisible(false)}
        toggleModal={toggleModal}
        routes={routes}
        handleRouteSelect={handleRouteSelect}
      />
      {closestTree && <TreeProximity closestTree={closestTree} />}
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
    height: Platform.OS == "ios" ? "110%" : "106%",
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
  locationButton: {
    position: "absolute",
    top: 160,
    right: 20,
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
  },
});
