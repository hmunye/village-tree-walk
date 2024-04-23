import { ColorScheme } from "@/types/types";
import { Dimensions } from "react-native";

export const dimensions = {
  deviceHeight: Dimensions.get("window").height,
  deviceWidth: Dimensions.get("window").width,
};

export const colors: ColorScheme = {
  background: "#EDE5D4",
  foreground: "#0D0A0B",
  primary: "#14553A",
  secondary: "#59546C",
  destructive: "#BA1200",
  muted: "#BFBDC1",
  default: "#F3EDE2",
};
