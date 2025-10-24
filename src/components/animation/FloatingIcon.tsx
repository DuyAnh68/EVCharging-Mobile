import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  name: string;
  size: number;
  x: number;
  y: number;
};

export function FloatingIcon({ name, size, x, y }: Props) {
  const { width, height } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 3000 }),
        withTiming(-8, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: y * height,
          left: x * width,
        },
        animatedStyle,
      ]}
    >
      {name === "leaf" && (
        <FontAwesome5 name="leaf" size={size} color="rgba(255,255,255,0.15)" />
      )}
      {name === "wind" && (
        <Feather name="wind" size={size} color="rgba(255,255,255,0.12)" />
      )}
      {name === "drop" && (
        <Entypo name="drop" size={size} color="rgba(255,255,255,0.1)" />
      )}
    </Animated.View>
  );
}
