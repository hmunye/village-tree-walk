import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";

import { CustomPressableProps } from "@/types/types";
import React from "react";

export default function CustomPressable({
  onPress,
  children,
  buttonStyle,
  textStyle,
}: CustomPressableProps) {
  const triggerHapticFeedback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={triggerHapticFeedback}
      style={({ pressed }) => [buttonStyle, { opacity: pressed ? 0.8 : 1 }]}
    >
      {/* Render children and apply textStyle if children is a string */}
      {typeof children === "string" ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
