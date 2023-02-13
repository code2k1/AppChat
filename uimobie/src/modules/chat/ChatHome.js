import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  FlatList,
  HStack,
  NativeBaseProvider,
  VStack,
} from "native-base";
import * as React from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ListFriendOnl } from "./components/layout/ListFriendOnl";
import { PinChat } from "./components/layout/PinChat";
import { data } from "./data/User";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import { addRoom, getRoomByPhone } from "../../apis/room/room.api";
import Socket from "../../common/socket";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import ItemFriend from "./components/layout/Friend/ItemFriend";
import { getFriend, getUserByPhone } from "../../apis/user/user.api";
import FriendRequest from "./components/layout/Friend/FriendRequest";
import FriendRequestSend from "./components/layout/Friend/FriendRequestSend";
import { RemoveUser } from "../../redux/actions/auth/GetUserAction";

export default function ChatHome({ navigation }) {
  const user = useSelector((state) => state.User);
  var temp;
  const [listRoom, setListRoom] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleNotifi, setVisibleNotifi] = useState(false);
  const [visibleCreateRoom, setVisibleCreateRoom] = useState(false);
  const [value, setValue] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("0377723460");
  const [listRequests, setListRequests] = useState([]);
  const [listAwait, setListAwait] = useState([]);
  const [listFriend, setListFriend] = useState([]);
  const [listFriendTemp, setListFriendTemp] = useState([]);
  const [listMemberAdd, setListMemberAdd] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataTemp, setDataTemp] = useState([]);
  const [checkSearch, setCheckSearch] = useState(false);
  const [textNameGroupNew, setTextNameGroupNew] = useState("");

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../../../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../../../assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    Socket;

    // Socket.emit("join_room", user.phone);
    getRoomByPhone().then((data) => {
      // console.log(data.data.data);
      data && setListRoom(data.data.data
        );
    });

    getFriend().then((data) => {
      setIsLoading(false);
      data && setListAwait(data.data.list_wait);
      data && setListRequests(data.data.list_request);
      data && setListFriend(data.data.list_friend);
      data && setListFriendTemp(data.data.list_friend);
    });
  }, []);

  useEffect(() => {
    Socket.emit("join_room", user.phone);
  }, [user]);

  useEffect(() => {
    Socket.on("receive_Request_Add_Friend", (data) => {
      if (data) {
        if (data.phone === user.phone || data.phoneMe === user.phone) {
          // console.log(data.phone === user.phone);
          // console.log(data.phoneMe === user.phone);
          getFriend().then((data) => {
            setListAwait(data.data.list_wait);
            setListRequests(data.data.list_request);
            setListFriend(data.data.list_friend);
            setListFriendTemp(data.data.list_friend);
          });
          getRoomByPhone().then((data) => {
            setListRoom(data.data.data);
          });
        }
      }
    });

    Socket.on("receive_ChatGroup", (data) => {
      data &&
        data.id_room.forEach((room) => {
          if (room.phone === user.phone) {
            setListRoom((list) => [...list, data.data]);
          }
        });
    });
  }, [Socket, user]);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const handleSearch = async (e) => {
    await getUserByPhone({ phone: phoneNumber })
      .then((data) => {
        const result = {};
        result.name = data.data.first_name + " " + data.data.last_name;
        result.phone = data.data.phone;
        result.uri = data.data.avatar;
        setPhoneNumber("");
        setValue(result);
      })
      .catch(() => {
        setValue(null);
      });
  };

  const searchPhone = async () => {
    await getUserByPhone({ phone: phoneNumber }).then((data) => {
      setDataTemp(data.data);
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#FFFAFA",
      }}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        backgroundColor="#f8f8f8"
        hidden={false}
        barStyle={"dark-content"}
      />
      <LinearGradient
        start={{ x: 0.1, y: 0.2 }}
        colors={["#f8f8f8", "#f6f6f6"]}
        style={{ flex: 1 }}
      >
        <NativeBaseProvider>
          <VStack pl={5} space={3}>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <ListFriendOnl item={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
            <HStack style={{ alignItems: "baseline" }} space={1}>
              <Text style={{ fontFamily: "Poppins-Bold", fontSize: 23 }}>
                Message
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 21,
                  color: "#329db6",
                }}
              >
                48 <Text style={{ fontSize: 18 }}>new</Text>{" "}
              </Text>
              <HStack flex={1} justifyContent={"flex-end"} pr={5}>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                  }}
                  style={{ height: 35, width: 35, opacity: 0.6 }}
                >
                  <Entypo
                    name="plus"
                    size={12}
                    color="#329db6"
                    style={{
                      position: "absolute",
                      marginLeft: 12,
                      marginTop: -3,
                    }}
                  />
                  <Ionicons name="person" size={20} color="#329db6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ height: 35, width: 35, opacity: 0.6 }}
                  onPress={() => {
                    setVisibleCreateRoom(true);
                    // Goi Model Add Room ne
                  }}
                >
                  <Entypo
                    name="plus"
                    size={12}
                    color="#329db6"
                    style={{
                      position: "absolute",
                      marginLeft: 19,
                      marginTop: -3,
                    }}
                  />
                  <FontAwesome name="group" size={20} color="#329db6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVisibleNotifi(true);
                  }}
                  style={{ height: 35, width: 35, opacity: 0.6 }}
                >
                  <Text
                    style={{
                      marginLeft: 17,
                      marginTop: -5,
                      fontSize: 13,
                      fontFamily: "Poppins-Bold",
                      color: "red",
                      position: "absolute",
                      zIndex: 1,
                    }}
                  >
                    9+
                  </Text>
                  <Ionicons
                    name="notifications"
                    size={22}
                    color="#329db6"
                    style={{ zIndex: 0 }}
                  />
                </TouchableOpacity>
              </HStack>
            </HStack>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ModalScreen");
              }}
              style={{
                alignItems: "center",
                flexDirection: "row",
                width: "90%",
                backgroundColor: "white",
                height: 40,
                borderRadius: 20,
                overflow: "hidden",
                justifyContent: "space-evenly",
              }}
            >
              <Text
                editable="false"
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins-Light",
                  width: "80%",
                  backgroundColor: "#fff",
                  height: "100%",
                  textAlignVertical: "center",
                  opacity: 0.5,
                }}
              >
                Search anything...
              </Text>
              <Ionicons
                name="search-outline"
                size={22}
                color="rgba(0,0,0,0.3)"
              />
            </TouchableOpacity>
            <ScrollView style={{ height: "62%", marginTop: "3%" }}>
              <VStack pr={5} space={2}>
                <HStack alignItems={"baseline"} space={2}>
                  <AntDesign name="pushpin" size={17} color="rgba(0,0,0,0.6)" />
                  <Text
                    style={{
                      fontSize: 15,
                      textTransform: "uppercase",
                      fontFamily: "Poppins-Medium",
                      color: "rgba(0,0,0,0.4)",
                    }}
                  >
                    pin chats
                  </Text>
                </HStack>

                {!isLoading &&
                  listRoom.map((item, index) => {
                    return item.count_member === 2 ? (
                      <PinChat
                        item={item}
                        key={index}
                        navigation={navigation}
                        // socket={Socket.socket}
                      />
                    ) : null;
                  })}
              </VStack>
              <VStack pr={5} space={2}>
                <HStack alignItems={"baseline"} space={2}>
                  <MaterialCommunityIcons
                    name="order-bool-ascending"
                    size={17}
                    color="rgba(0,0,0,0.6)"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      textTransform: "uppercase",
                      fontFamily: "Poppins-Medium",
                      color: "rgba(0,0,0,0.4)",
                    }}
                  >
                    groups & channels
                  </Text>
                </HStack>
                {!isLoading &&
                  listRoom.map((item, index) => {
                    return item.count_member >= 3 ? (
                      <PinChat
                        item={item}
                        key={index}
                        navigation={navigation}
                        // socket={Socket.socket}
                      />
                    ) : null;
                  })}
                {/* {data1.map((item, index) => {
                  return <PinChat item={item} key={index} />;
                })} */}
              </VStack>
              <VStack pr={5} space={2}>
                <HStack alignItems={"baseline"} space={2}>
                  <Text
                    style={{
                      fontSize: 15,
                      textTransform: "uppercase",
                      fontFamily: "Poppins-Medium",
                      color: "rgba(0,0,0,0.4)",
                    }}
                  >
                    all message
                  </Text>
                </HStack>
                {/* {data1.map((item, index) => {
                  return <PinChat item={item} key={index} border={true} />;
                })} */}
              </VStack>
            </ScrollView>
          </VStack>
          <Modal transparent={true} visible={visible} animationType={"fade"}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VStack
                space={2}
                style={{
                  paddingHorizontal: "5%",
                  paddingVertical: "5%",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  width: "100%",
                  // minHeight: 230,
                  maxHeight: 300,
                  borderRadius: 15,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 10.24,
                  elevation: 13,
                }}
              >
                <TouchableOpacity
                  style={{ position: "absolute", right: "5%", top: "5%" }}
                  onPress={() => {
                    setValue(null);
                    setVisible(false);
                  }}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                <View
                  style={{
                    width: "95%",
                    flexDirection: "row",
                    alignItems: "baseline",
                  }}
                >
                  <AntDesign name="adduser" size={25} color="#329db6" />
                  <Text
                    style={{
                      paddingLeft: 5,
                      fontFamily: "Poppins-Bold",
                      fontSize: 16,
                    }}
                  >
                    Add friend
                  </Text>
                </View>
                {/* <TextInput
                  keyboardType="phone-pad"
                  keyboardAppearance="dark"
                  placeholder="enter number phone..."
                  style={{
                    borderColor: "#329db6",
                    fontSize: 16,
                    paddingHorizontal: 10,
                    width: "95%",
                    height: 35,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                /> */}
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  keyboardAppearance="dark"
                  placeholder="enter number phone..."
                  style={{
                    borderColor: "#329db6",
                    fontSize: 16,
                    paddingHorizontal: 10,
                    width: "95%",
                    height: 35,
                    borderWidth: 1,
                    borderRadius: 5,
                    fontFamily: "Poppins-Medium",
                    fontSize: 14,
                  }}
                />
                <View style={{ width: "95%", alignItems: "flex-start" }}>
                  <TouchableOpacity
                    onPress={() => {
                      handleSearch();
                    }}
                    style={{
                      backgroundColor: "#329db6",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Poppins-Medium",
                        fontSize: 14,
                      }}
                    >
                      Search
                    </Text>
                  </TouchableOpacity>
                </View>
                <HStack
                  space={1}
                  style={{
                    width: "95%",
                    fontFamily: "Poppins-Light",
                    fontSize: 14,
                  }}
                >
                  <MaterialIcons
                    name="access-time"
                    size={18}
                    color="rgba(0,0,0,0.5)"
                  />
                  <Text
                    style={{
                      fontFamily: "Poppins-Light",
                      fontSize: 14,
                    }}
                  >
                    Search resulst
                  </Text>
                </HStack>
                <ItemFriend
                  value={value}
                  phoneMe={user.phone}
                  setValue={setValue}
                />
              </VStack>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={visibleNotifi}
            animationType={"fade"}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VStack
                space={4}
                style={{
                  flex: 1,
                  paddingVertical: "5%",
                  backgroundColor: "#f8f8f8",
                  alignItems: "center",
                  width: "100%",
                  Height: "100%",
                }}
              >
                <HStack
                  style={{
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      setValue(null);
                      setVisibleNotifi(false);
                    }}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                  <HStack
                    style={{
                      alignItems: "center",
                      justifyContent: "space-around",
                      borderRadius: 20,
                      width: "88%",
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      shadowColor: "#000000",
                      shadowOffset: {
                        width: 0,
                        height: 18,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 20.0,
                      elevation: 24,
                    }}
                  >
                    <Ionicons
                      name="search-outline"
                      size={22}
                      color="rgba(0,0,0,0.3)"
                      style={{ position: "absolute", zIndex: 1, left: 5 }}
                    />
                    <TextInput
                      placeholder="Search friend..."
                      style={{
                        paddingLeft: 25,
                        fontFamily: "Poppins-Light",
                        fontSize: 13,
                        opacity: 0.5,
                        width: "85%",
                        height: 35,
                        backgroundColor: "#fff",
                      }}
                    />
                    <TouchableOpacity onPress={() => {}}>
                      <Ionicons
                        name="close"
                        size={20}
                        color="rgba(0,0,0,0.4)"
                      />
                    </TouchableOpacity>
                  </HStack>
                </HStack>
                <View
                  style={{
                    width: "95%",
                    flexDirection: "row",
                    alignItems: "baseline",
                  }}
                >
                  <Ionicons name="notifications" size={23} color="#329db6" />
                  <Text
                    style={{
                      paddingLeft: 5,
                      fontFamily: "Poppins-Bold",
                      fontSize: 18,
                      opacity: 0.6,
                    }}
                  >
                    Notification
                  </Text>
                </View>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  overScrollMode={"never"}
                  style={{
                    flex: 1,
                    backgroundColor: "#f8f8f8",
                    width: "100%",
                  }}
                >
                  <HStack
                    space={1}
                    style={{
                      width: "95%",
                      height: 35,
                      alignItems: "center",
                      paddingHorizontal: "2%",
                    }}
                  >
                    <Ionicons name="list" size={20} color="rgba(0,0,0,0.5)" />
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 14,
                        height: 20,
                        opacity: 0.5,
                      }}
                    >
                      FRIEND REQUESTS
                    </Text>
                  </HStack>
                  <VStack
                    space={4}
                    style={{ alignItems: "center", paddingVertical: 15 }}
                  >
                    {!isLoading &&
                      listAwait &&
                      listAwait.map((item, index) => {
                        return (
                          <FriendRequest
                            value={item}
                            key={index}
                            phoneMe={user.phone}
                            avatar={item.avatar}
                          />
                        );
                      })}
                  </VStack>
                  <HStack
                    space={1}
                    style={{
                      width: "95%",
                      height: 35,
                      alignItems: "center",
                      paddingHorizontal: "2%",
                    }}
                  >
                    <Ionicons name="list" size={20} color="rgba(0,0,0,0.5)" />
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 14,
                        height: 20,
                        opacity: 0.5,
                      }}
                    >
                      FRIEND REQUESTS SEND
                    </Text>
                  </HStack>
                  <VStack
                    space={4}
                    style={{ alignItems: "center", paddingVertical: 15 }}
                  >
                    {!isLoading &&
                      listRequests &&
                      listRequests.map((item, index) => {
                        return (
                          <FriendRequestSend
                            value={item}
                            key={index}
                            phoneMe={user.phone}
                            avatar={item.avatar}
                          />
                        );
                      })}
                  </VStack>
                </ScrollView>
              </VStack>
            </View>
          </Modal>
          <Modal
            // Model Add Room ne
            visible={visibleCreateRoom}
            animationType={"slide"}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fafafa",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setVisibleCreateRoom(false);
                  setListMemberAdd([]);
                }}
              >
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: "700" }}>New Group</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "95%",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#edeff1",
                    borderRadius: 50,
                  }}
                  onPress={() => {}}
                >
                  <FontAwesome name="camera" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                  value={textNameGroupNew}
                  onChangeText={setTextNameGroupNew}
                  placeholder="Set group name"
                  style={{ fontSize: 16, marginLeft: 20 }}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  height: 40,
                  borderRadius: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "90%",
                  backgroundColor: "#fafafa",
                }}
              >
                <View style={{}}>
                  <EvilIcons name="search" size={24} color="gray" />
                </View>
                <TextInput
                  onChangeText={setPhoneNumber}
                  placeholder="Search name or phone number"
                  style={{ width: 250 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (phoneNumber != "") {
                      searchPhone();
                      setCheckSearch(true);
                    } else {
                      setCheckSearch(false);
                    }
                  }}
                >
                  <Text style={{}}>Search</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 1,
                  width: "100%",
                  marginLeft: 0,
                  backgroundColor: "#bababa",
                  marginTop: 10,
                }}
              />
              <View style={{ marginTop: 10, width: "100%" }}>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{ marginLeft: 10, fontSize: 18, fontWeight: "700" }}
                  >
                    List Members
                  </Text>
                </View>
                {checkSearch ? (
                  <View
                    style={{
                      borderRadius: 30,
                      height: 80,
                      width: "90%",
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 20,
                      marginTop: 20,
                      backgroundColor: "#fafafa",
                      paddingHorizontal: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Image
                        source={{
                          uri: dataTemp.avatar ? dataTemp.avatar : null,
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 100,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        minWidth: "40%",
                        // backgroundColor: "red",
                      }}
                    >
                      <Text>
                        {dataTemp.first_name} {dataTemp.last_name}
                      </Text>
                      <Text>{dataTemp.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        borderRadius: 10,
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 80,
                        height: 40,
                      }}
                      onPress={() => {
                        // dataTemp.push({name: item.name, phone: item.phone})
                        setListMemberAdd((prev) => [
                          ...prev,
                          {
                            name:
                              dataTemp.first_name + " " + dataTemp.last_name,
                            phone: dataTemp.phone,
                            avatar: dataTemp.avatar,
                          },
                        ]);
                        setCheckSearch(false);
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <FlatList
                    style={{ height: 250, marginTop: 10 }}
                    data={listFriendTemp}
                    renderItem={({ item }) => {
                      return (
                        <View
                          style={{
                            borderRadius: 30,
                            height: 80,
                            width: "90%",
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 20,
                            marginTop: 20,
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <View>
                            <Image
                              source={{ uri: item.avatar }}
                              style={{
                                marginLeft: 15,
                                width: 60,
                                height: 60,
                                borderRadius: 100,
                              }}
                            />
                          </View>
                          <View style={{ marginLeft: 20, width: 130 }}>
                            <Text numberOfLines={1}>{item.name}</Text>
                            <Text>{item.phone}</Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              borderRadius: 10,
                              backgroundColor: "red",
                              justifyContent: "center",
                              alignItems: "center",
                              width: 80,
                              height: 40,
                            }}
                            onPress={() => {
                              // dataTemp.push({name: item.name, phone: item.phone})
                              setListMemberAdd((prev) => [
                                ...prev,
                                {
                                  name: item.name,
                                  phone: item.phone,
                                  avatar: item.avatar,
                                },
                              ]);

                              setListFriendTemp((prev) =>
                                prev.filter(
                                  (item1) => item1.phone !== item.phone
                                )
                              );
                            }}
                          >
                            <Text style={{ color: "#fff" }}>Add</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
              <View style={{ marginTop: 10, width: "100%" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 18,
                      fontWeight: "700",
                      width: 240,
                    }}
                  >
                    List add member
                  </Text>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 100,
                      height: 30,
                      backgroundColor: "#0091ff",
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      let list_member = [];
                      listMemberAdd.forEach((element) => {
                        list_member.push({ phone: element.phone });
                      });
                      addRoom({
                        name_room: textNameGroupNew,
                        list_member: list_member,
                      })
                        .then((data) => {
                          data &&
                            Socket.emit("create_ChatGroup", {
                              data: {
                                data: data.data,
                                id_room: data.data.list_member,
                              },
                            });

                          setVisibleCreateRoom(false);
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Create Room</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{ height: 240, marginTop: 10 }}
                  data={listMemberAdd}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          borderRadius: 30,
                          height: 80,
                          width: "90%",
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 20,
                          marginTop: 20,
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: item.avatar }}
                            style={{
                              marginLeft: 15,
                              width: 60,
                              height: 60,
                              borderRadius: 100,
                            }}
                          />
                        </View>
                        <View style={{ marginLeft: 20, width: 135 }}>
                          <Text numberOfLines={1}>{item.name}</Text>
                          <Text>{item.phone}</Text>
                        </View>
                        <TouchableOpacity
                          style={{
                            borderRadius: 10,
                            backgroundColor: "red",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 80,
                            height: 40,
                          }}
                          onPress={() => {
                            setListMemberAdd((prev) =>
                              prev.filter((item1) => item1.phone !== item.phone)
                            );

                            setListFriendTemp((prev) => [
                              ...prev,
                              { name: item.name, phone: item.phone },
                            ]);
                          }}
                        >
                          <Text style={{ color: "#fff" }}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        </NativeBaseProvider>
      </LinearGradient>
    </SafeAreaView>
  );
}
