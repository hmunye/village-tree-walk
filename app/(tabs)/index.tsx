import treeMarker from "@/assets/images/tree_marker.webp";
import CustomPressable from "@/components/ui/CustomPressable";
import GettingLocation from "@/components/ui/GettingLocation";
import PreviewRoute from "@/components/ui/PreviewRoute";
import SelectRoute from "@/components/ui/SelectRoute";
import TreeProximity from "@/components/ui/TreeProximity";
import { colors } from "@/styles";
import { darkMapStyle } from "@/styles/mapStyle";
import {
  MapRoute,
  RouteCoordinates,
  Tree,
  animateLocationProps,
} from "@/types/types";
import redirectMap from "@/utils/redirectMap";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useSQLiteContext } from "expo-sqlite/next";
import { getCenter, getPreciseDistance } from "geolib";
import React, { useEffect, useRef, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

// Distance from user to closest tree in meters
const DISTANCE_THRESHOLD_IN_METERS = 10;

export default function Map() {
  const db = useSQLiteContext();

  const [trees, setTrees] = useState<Tree[]>([]);
  const [closestTree, setClosestTree] = useState<Tree | null>(null);
  const [closestDistance, setClosestDistance] = useState<number>(Infinity);
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [routeCords, setRouteCords] = useState<RouteCoordinates[]>([]);

  const markerRefs = useRef<any[]>([]);
  const mapRef = useRef<MapView>(null);

  const [isRouteActive, setIsRouteActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isTreeWalkButtonVisible, setIsTreeWalkButtonVisible] = useState(true);

  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObjectCoords>();

  // Need this for custom map marker performance on Android
  const doRedraw = (index: number) => {
    markerRefs.current[index].redraw();
  };

  const animateToLocation = ({
    latitude,
    longitude,
  }: animateLocationProps = {}) => {
    // If no specific coordinates are provided, use currentLocation
    if (!latitude && !longitude && currentLocation && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      });
    } else if (
      latitude !== undefined &&
      longitude !== undefined &&
      mapRef.current
    ) {
      // If specific coordinates are provided, use them
      mapRef.current.animateCamera({
        center: {
          latitude: latitude,
          longitude: longitude,
        },
      });
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleRouteSelect = async (routeId: number) => {
    try {
      const routeCordsRows: RouteCoordinates[] = await db.getAllAsync(
        "SELECT * FROM map_route_coordinates WHERE route_id = ?",
        [routeId]
      );
      toggleModal();
      setIsTreeWalkButtonVisible(false);
      setRouteCords(routeCordsRows);
      setIsPreviewVisible(true);

      const center = previewRoute(routeCordsRows);

      if (center) {
        animateToLocation({
          latitude: center.latitude,
          longitude: center.longitude,
        });
      }
    } catch (error) {
      console.error("Handle Route Select error: ", error);
    }
  };

  const previewRoute = (routeCordsRows: RouteCoordinates[]) => {
    if (routeCordsRows && routeCordsRows.length > 0) {
      const coordsForCenter = routeCordsRows.map(({ latitude, longitude }) => ({
        latitude,
        longitude,
      }));
      return getCenter(coordsForCenter);
    } else {
      console.error("routeCordsRows is undefined or empty");
    }
  };

  const handleConfirmRoute = () => {
    setIsPreviewVisible(false);
    setIsRouteActive(true);
    animateToLocation();
    // Redirect user to their maps application for directions to first tree on route
    if (routeCords && routeCords.length > 0) {
      redirectMap(routeCords[0].latitude, routeCords[0].longitude);
    } else {
      console.error("routeCords is undefined or empty");
    }
  };

  const handleCancelRoutePreview = () => {
    toggleModal();
    setIsPreviewVisible(false);
    setIsTreeWalkButtonVisible(true);
    setRouteCords([]);
  };

  const handleStopRoute = () => {
    setRouteCords([]);
    setIsTreeWalkButtonVisible(true);
    setIsRouteActive(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const treeRows = await db.getAllAsync("SELECT * FROM trees");
        const routeRows = await db.getAllAsync("SELECT * FROM map_routes");

        setTrees(treeRows as Tree[]);
        setRoutes(routeRows as MapRoute[]);
      } catch (error) {
        // TODO: Better error handling
        console.error("Fetch Map Trees or Routes error: ", error);
      }
    }

    fetchData();
  }, [db]);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setCurrentLocation(location.coords);
      console.info(
        Platform.OS === "android"
          ? "Android: New location update: " +
              location.coords.latitude +
              ", " +
              location.coords.longitude
          : ""
      );
      console.info(
        Platform.OS === "ios"
          ? "IOS: New location update: " +
              location.coords.latitude +
              ", " +
              location.coords.longitude
          : ""
      );
    };

    const intervalDuration = isRouteActive ? 1000 : 5000; // If route is active, every 1 second, else every 5 seconds
    const intervalId = setInterval(fetchLocation, intervalDuration);

    return () => clearInterval(intervalId);
  }, [isRouteActive]);

  useEffect(() => {
    if (currentLocation) {
      let closestDistance = Infinity;
      let closestTree: Tree | null = null;

      trees.forEach((tree) => {
        // Distance is in meters
        const distance = getPreciseDistance(
          [currentLocation.longitude, currentLocation.latitude],
          [tree.longitude, tree.latitude],
          1
        );

        if (
          distance < closestDistance &&
          distance <= DISTANCE_THRESHOLD_IN_METERS
        ) {
          closestDistance = distance;
          closestTree = tree;
        }
      });

      setClosestTree(closestTree);
      setClosestDistance(closestDistance);

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
    return <GettingLocation />;
  }

  const waypoints = [
    43.2157498293752, -77.93641625945612, 43.215910606642865,
    -77.93670660857263, 43.21603307120707, -77.93707908557067,
    43.216134888250615, -77.93712726425933, 43.21634013445997,
    -77.93766303550952, 43.216488204509176, -77.93810761164826,
    43.216452042220546, -77.93809688281254, 43.2145510145356,
    -77.93864931579384, 43.214600386501644, -77.93893860399209,
    43.214438926680586, -77.93896423712359, 43.21374904807174,
    -77.93916747125577, 43.214094627834974, -77.94213620026122,
    43.216279850482515, -77.94148306216373, 43.215799770532385,
    -77.94338692128933, 43.2158918406595, -77.94342537098656, 43.21640823141541,
    -77.94370550450544, 43.21651631264591, -77.94371465919527,
    43.216534993332964, -77.94361945042114, 43.21831530968133,
    -77.94377775402057, 43.21828683284221, -77.94393601296684, 43.2181446935413,
    -77.94394233831656, 43.2180054705533, -77.94405408036526, 43.21791221724206,
    -77.94425053009607, 43.21772045645842, -77.94461639520478,
    43.21745120229293, -77.94490295949099, 43.217436754474846,
    -77.94500569008416,
  ];

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
              style={{ width: 52, height: 52, resizeMode: "contain" }}
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
      {isTreeWalkButtonVisible && !isPreviewVisible && (
        <CustomPressable
          onPress={() => toggleModal()}
          buttonStyle={styles.button}
        >
          <Text style={styles.buttonText}>Choose Tree Walk</Text>
        </CustomPressable>
      )}
      {!isTreeWalkButtonVisible && !isPreviewVisible && (
        <CustomPressable
          onPress={handleStopRoute}
          buttonStyle={[
            styles.button,
            !isTreeWalkButtonVisible
              ? { backgroundColor: colors.destructive }
              : {},
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              !isTreeWalkButtonVisible ? { color: colors.background } : {},
            ]}
          >
            Stop Route
          </Text>
        </CustomPressable>
      )}
      {!isPreviewVisible && (
        <CustomPressable
          onPress={animateToLocation}
          buttonStyle={styles.locationButton}
        >
          <FontAwesome5
            name="location-arrow"
            size={18}
            color={colors.primary}
          />
        </CustomPressable>
      )}
      <SelectRoute
        modalVisible={isModalVisible}
        setModalVisible={() => toggleModal()}
        toggleModal={toggleModal}
        routes={routes}
        handleRouteSelect={handleRouteSelect}
      />
      {closestTree && closestDistance <= DISTANCE_THRESHOLD_IN_METERS && (
        <TreeProximity
          closestTree={closestTree}
          closestDistance={closestDistance}
        />
      )}
      {isPreviewVisible && (
        <PreviewRoute
          onCancel={handleCancelRoutePreview}
          onConfirmRoute={handleConfirmRoute}
        />
      )}
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
    height: Platform.OS == "ios" ? "105%" : "100%",
  },
  button: {
    position: "absolute",
    top: 80,
    right: 21,
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
    top: 240,
    right: 21,
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
  },
});
