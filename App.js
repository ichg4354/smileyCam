import { StatusBar } from "expo-status-bar";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";

const Container = styled.View`
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
`;

export default function App() {
  const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
  const [premission, setPremission] = useState("noValue");
  const [cameraSetting, setCameraSetting] = useState({
    side: "back",
    icon: "camera-reverse",
    smile: null,
  });
  const camera = useRef();

  const getPremission = async () => {
    try {
      const { status } = await Camera.requestPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setPremission(true);
    } catch (error) {
      console.log(error);
      setPremission(false);
    }
  };

  const handleCameraSideChangeBtnClick = () => {
    if (cameraSetting.side === "back") {
      setCameraSetting({
        side: "front",
        icon: "camera-reverse-outline",
        smile: false,
      });
    } else {
      setCameraSetting({
        side: "back",
        icon: "camera-reverse",
        smile: false,
      });
    }
  };

  const takePicture = async () => {
    let photo = await camera.current.takePictureAsync();
    setTimeout(
      () =>
        setCameraSetting({
          side: cameraSetting.side,
          icon: cameraSetting.icon,
          smile: false,
        }),
      2000
    );
    savePicture(photo);
  };

  const savePicture = async ({ uri }) => {
    let asset = await MediaLibrary.createAssetAsync(uri);
    let Album = await MediaLibrary.getAlbumAsync("SMILE");
    if (Album === null) {
      console.log("null");
      const library = await MediaLibrary.createAlbumAsync(
        "SMILE",
        Platform.OS !== "ios" ? asset : null
      );
      await MediaLibrary.addAssetsToAlbumAsync([asset], library.id);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], Album.id);
    }
  };
  const handleFaceDetection = (face) => {
    const smilingProbability = face?.faces[0]?.smilingProbability;
    if (smilingProbability >= 0.7) {
      setCameraSetting({
        side: cameraSetting.side,
        icon: cameraSetting.icon,
        smile: true,
      });
      takePicture();
    }
  };

  useLayoutEffect(() => {
    getPremission();
  }, []);

  if (premission === true) {
    return (
      <Container>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Camera
            style={{
              width: WIDTH - 30,
              height: HEIGHT / 1.5,
              borderRadius: 30,
              overflow: "hidden",
            }}
            type={cameraSetting.side}
            onFacesDetected={
              cameraSetting.smile ? null : (e) => handleFaceDetection(e)
            }
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Landmarks.none,
              runClassifications: FaceDetector.Constants.Classifications.all,
              minDetectionInterval: 100,
              tracking: true,
            }}
            ref={camera}
          />
          <IconContainer>
            <TouchableOpacity onPress={handleCameraSideChangeBtnClick}>
              <Ionicons name={cameraSetting.icon} size={60} color="black" />
            </TouchableOpacity>
          </IconContainer>
        </LinearGradient>
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
