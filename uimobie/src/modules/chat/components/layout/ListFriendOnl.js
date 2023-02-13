import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Container, VStack } from "native-base";
import * as React from "react";
import { GetListRoomByID } from "../../../../redux/actions/room/GetListRoomByIDAction";
import { useDispatch } from "react-redux";
export const ListFriendOnl = (props) => {
  const link =
    "https://th.bing.com/th/id/R.d3dc8025cb042a7df472465dbee26ad3?rik=3jpC3jxSM75D4A&riu=http%3a%2f%2fthuvienanhdep.net%2fwp-content%2fuploads%2f2015%2f11%2fnhung-hinh-anh-dep-de-thuong-va-dang-yeu-cua-dong-vat-trong-cuoc-song-9.jpg&ehk=l9eBKKAk1S3wrXMG0GbGY85e3gmZG2yX1QV10veyIgM%3d&risl=&pid=ImgRaw&r=0";
  const dispatch = useDispatch();
  const { item } = props;
  return (
    <Pressable
      onPress={() => {
        dispatch(GetListRoomByID(listRoom.data[0]._id));
        props.navigation.navigate("ChatRoom");
      }}
    >
      <VStack style={styles.container}>
        <View style={styles.imgBorder}>
          <Image source={{ uri: link }} style={styles.img}></Image>
        </View>
        <Text style={styles.text} numberOfLines={2}>
          {item.name}
        </Text>
      </VStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 98,
  },
  imgBorder: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#f778a7",
    padding: 1,
    width: 61,
    height: 61,
  },
  img: {
    width: 55,
    height: 55,
    borderRadius: 50,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Poppins-Light",
    fontSize: 14,
    width: 80,
    textAlign: "center",
    lineHeight: 15,
    marginTop: 5,
  },
});
