import { Linking, Platform } from "react-native";

export default function redirectMap(lat: number, lng: number) {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${lat},${lng}`;
  const label = "Directions to First Tree";
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  return Linking.openURL(url as string);
}
