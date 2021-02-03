import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";

const Container = styled.View`
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export default function App() {
  const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
  const [premission, setPremission] = useState("noValue");
  const [cameraSetting, setCameraSetting] = useState({
    side: "back",
    icon: "camera-reverse",
  });
  const getPremission = async () => {
    try {
      const { status } = await Camera.requestPermissionsAsync();
      setPremission(true);
    } catch (error) {
      console.log(error);
      setPremission(false);
    }
  };
  const handleCameraSideChangeBtnClick = () => {
    if (cameraSetting.side === "back") {
      setCameraSetting({ side: "front", icon: "camera-reverse-outline" });
    } else {
      setCameraSetting({ side: "back", icon: "camera-reverse" });
    }
  };
  useEffect(() => {
    getPremission();
  }, []);
  if (premission === true) {
    return (
      <Container>
        <Camera
          style={{ width: WIDTH - 30, height: HEIGHT / 1.5 }}
          type={cameraSetting.side}
        />
        <IconContainer>
          <TouchableOpacity onPress={handleCameraSideChangeBtnClick}>
            <Ionicons name={cameraSetting.icon} size={50} color="black" />
          </TouchableOpacity>
        </IconContainer>
      </Container>
    );
  } else if (premission === false) {
    return (
      <Container style={styles.container}>
        <Text>DENIED</Text>
      </Container>
    );
  } else {
    return (
      <Container style={styles.container}>
        <ActivityIndicator></ActivityIndicator>
      </Container>
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
