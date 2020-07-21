import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, { interpolate, Extrapolate } from "react-native-reanimated";
import { useValue, translateZ } from "react-native-redash";

import GestureHandler from "./GestureHandler";
import { ITEM_HEIGHT, VISIBLE_ITEMS } from "./Constants";

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  item: {
    ...StyleSheet.absoluteFillObject,
    height: ITEM_HEIGHT,
  },
  label: {
    color: "white",
    fontFamily: "SFProText-Semibold",
    fontSize: 24,
    padding: 4,
    textAlign: "center",
  },
});
const perspective = 600;
const RADIUS = 3;

interface PickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
}

const Picker = ({ values, defaultValue }: PickerProps) => {
  const value = useValue(defaultValue);
  return (
    <View style={styles.container}>
      {values.map((v, i) => {
        const translateY = interpolate(value, {
          inputRange: [i - 2, i, i + 2],
          outputRange: [0, ITEM_HEIGHT * 2, ITEM_HEIGHT * 4],
        });
        const rotateX = interpolate(value, {
          inputRange: [i - RADIUS, i, i + RADIUS],
          outputRange: [Math.PI / 2, 0, -Math.PI / 2],
          extrapolate: Extrapolate.CLAMP,
        });
        const z = interpolate(value, {
          inputRange: [i - RADIUS, i, i + RADIUS],
          outputRange: [-RADIUS * ITEM_HEIGHT, 0, -RADIUS * ITEM_HEIGHT],
        });

        return (
          <Animated.View
            key={v.value}
            style={[
              styles.item,
              {
                transform: [
                  { perspective },
                  { translateY },
                  { rotateX },
                  translateZ(perspective, z),
                ],
              },
            ]}
          >
            <Text style={styles.label}>{v.label}</Text>
          </Animated.View>
        );
      })}
      <GestureHandler max={values.length} {...{ value, defaultValue }} />
    </View>
  );
};

export default Picker;
