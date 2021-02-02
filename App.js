import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
  const [premission, setPremission] = useState("noValue");
  const getPremission = async () => {
    try {
      const { status } = await Camera.requestPermissionsAsync();
      setPremission(true);
    } catch (error) {
      console.log(error);
      setPremission(false);
    }
  };
  useEffect(() => {
    getPremission();
  }, []);
  if (premission === true) {
    return (
      <View style={styles.container}>
        <Camera style={{ width: WIDTH - 30, height: HEIGHT / 1.3 }} />
      </View>
    );
  } else if (premission === false) {
    return (
      <View style={styles.container}>
        <Text>DENIED</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
