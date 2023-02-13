import { View, Text, FlatList } from "react-native";
import React from "react";
import { Image } from "react-native";
import { FlashList } from "@shopify/flash-list";

export default function ImageComposeRevert(props) {
  const size = props.data.length - 1;

  //   console.log(props.data);

  //   let checkSize = () => {
  //     if (parseInt(size) < 3) return parseInt(size);
  //     if (parseInt(size) === 3) return 2;
  //     if (parseInt(size) > 3) return 3;
  //   };

  return size === 1 ? (
    <View
      style={{
        borderRadius: 20,
        overflow: "hidden",
        width: "100%",
        height: 150,
        alignSelf: "flex-end",
        marginRight: 10,
      }}
    >
      <Image
        source={{
          uri: props.data[1],
        }}
        style={{
          // width: "100%",
          height: "100%",
        }}
      />
    </View>
  ) : (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignSelf: "flex-end",
        flexWrap: "wrap",
        height:
          size >= 3
            ? size % 2 === 0
              ? (size / 2) * (150 / 2) - 20
              : (size / 2 + 1) * (150 / 2) - 20
            : 150,
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 10,
        alignItems: "center",
        alignContent: "center",
        paddingLeft: 5,
      }}
    >
      {props.data.map((item, index) => {
        return item ? (
          <Image
            key={index}
            source={{
              uri: item,
            }}
            style={{
              width: "48%",
              height: size >= 3 ? 150 / 2 : 150,
              margin: 1,
              borderRadius: 10,
            }}
          />
        ) : null;
      })}
    </View>
  );
}
