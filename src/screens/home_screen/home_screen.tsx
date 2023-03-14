import React from "react";
import { View, Text } from "react-native";

import { styles } from "./home_styles";

export default function HomeScreen() : JSX.Element {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}