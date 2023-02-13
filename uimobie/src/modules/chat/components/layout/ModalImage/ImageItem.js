import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { Image } from "react-native";
import { useState } from "react";

export default function ImageItem(props) {
  const [chooseImage, setChooseImage] = useState(false);
  useEffect(() => {
    if (props.visible === false) {
      setChooseImage(false);
    }
  }, [props.visible]);
  return (
    <Pressable
      style={{ width: "33%", padding: "1%" }}
      onPress={() => {
        if (chooseImage) props.onPressNotChooseImage(props);
        else props.onPressChooseImage(props);
        setChooseImage(!chooseImage);
      }}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: chooseImage ? "green" : "red",
          width: 20,
          height: 20,
          zIndex: 1,
          borderRadius: 50,
          right: 10,
          top: 10,
        }}
      ></View>
      <Image
        source={{ uri: props.uri }}
        style={{ width: "100%", height: 100 }}
        alt="image"
      />
    </Pressable>
  );
}
