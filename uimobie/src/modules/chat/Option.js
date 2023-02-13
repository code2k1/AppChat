import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Button, HStack, NativeBaseProvider, VStack } from "native-base";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { getUserByPhone } from "../../apis/user/user.api";
import {
  addMember,
  changeRole,
  deleteMember,
  outRoom,
} from "../../apis/room/room.api";

export default function Option(props) {
  const room = useSelector((state) => state.Room);
  const user = useSelector((state) => state.User);

  const [nameRoom, setNameRoom] = useState(room.name_room);
  const [viewMember, setViewMember] = useState(false);
  const [showChangeNameRoom, setShowChangeNameRoom] = useState(false);

  const [mediaColor, setMediaColor] = useState("#0091ff");
  const [fileColor, setFileColor] = useState("#fff");
  const [linkColor, setLinkColor] = useState("#fff");

  const [listMember, setListMember] = useState(room.list_member);

  const [screen, setScreen] = useState(0);
  const [addMember1, setAddMember1] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState();

  const [checkSearch, setCheckSearch] = useState();
  const [listMemberAdd, setListMemberAdd] = useState("");

  const handleChangeScreen = () => {
    switch (screen) {
      case 0:
        return showMedia();
      case 1:
        return showFile();
      case 2:
        return showLink();
    }
  };

  const [dataTemp, setDataTemp] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  const searchPhone = async () => {
    await getUserByPhone({ phone: phoneNumber }).then((data) => {
      setDataTemp(data.data);
    });
  };

  return (
    <NativeBaseProvider>
      <View
        style={{
          height: 40,
          justifyContent: "flex-start",
          alignItems: "flex-end",
          flexDirection: "row",
          backgroundColor: "#fae7e1",
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: 20,
            height: 30,
            width: 30,
            marginBottom: 8,
            justifyContent: "center",
          }}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 15,
            color: "black",
            fontSize: 20,
            marginBottom: 8,
          }}
        >
          Options
        </Text>
      </View>
      <ScrollView style={{ height: "95%" }}>
        <LinearGradient
          style={{ alignItems: "center" }}
          colors={["#f7dad5", "#ffd0f6", "#eaebf0"]}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
            }}
            style={{ height: 100, width: 100, marginTop: 20, borderRadius: 50 }}
          />
          <TouchableOpacity
            style={{ marginTop: 15, flexDirection: "row" }}
            onPress={() => {
              setShowChangeNameRoom(true);
            }}
          >
            <Text style={{ fontSize: 22 }}>{nameRoom}</Text>
            <Image
              source={{
                uri: "https://icons.veryicon.com/png/o/education-technology/onemind/edit-97.png",
              }}
              style={{ width: 33, height: 33, left: 10 }}
            />
            <Dialog.Container visible={showChangeNameRoom}>
              <Dialog.Title>Set group name</Dialog.Title>
              <Dialog.Input value={nameRoom} onChangeText={setNameRoom} />
              <Dialog.Button
                label="Cancel"
                onPress={() => {
                  setShowChangeNameRoom(false);
                }}
              />
              <Dialog.Button
                label="Save"
                onPress={() => {
                  setShowChangeNameRoom(false);
                }}
              />
            </Dialog.Container>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#bababa",
              marginTop: 10,
            }}
          />
          <View style={{ width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginTop: 20,
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: "https://static.thenounproject.com/png/544983-200.png",
                }}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ marginLeft: 10, fontSize: 17 }}>Shared Media</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  setMediaColor("#0091ff");
                  setFileColor("#fff");
                  setLinkColor("#fff");
                  setScreen(0);
                }}
              >
                <Text>MEDIA</Text>
                <View
                  style={{
                    height: 3,
                    width: 80,
                    backgroundColor: mediaColor,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  setMediaColor("#fff");
                  setFileColor("#0091ff");
                  setLinkColor("#fff");
                  setScreen(1);
                }}
              >
                <Text>FILES</Text>
                <View
                  style={{
                    height: 3,
                    width: 80,
                    backgroundColor: fileColor,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={() => {
                  setMediaColor("#ffff");
                  setFileColor("#fff");
                  setLinkColor("#0091ff");
                  setScreen(2);
                }}
              >
                <Text>LINKS</Text>
                <View
                  style={{
                    height: 3,
                    width: 80,
                    backgroundColor: linkColor,
                    marginTop: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View
                style={{
                  height: 300,
                  backgroundColor: "#adf",
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {handleChangeScreen()}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#bababa",
              marginTop: 20,
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: 10,
              alignItems: "center",
              marginLeft: 20,
            }}
            onPress={() => {
              setViewMember(true);
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2956/2956777.png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 16, width: 330 }}>
              View members
            </Text>
            <Ionicons name="chevron-forward" size={25} color="black" />
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              width: "85%",
              marginLeft: 60,
              backgroundColor: "#bababa",
              marginTop: 10,
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              marginTop: 10,
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/702/702626.png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 16, width: 330 }}>
              Delete chat history
            </Text>
            <Ionicons name="chevron-forward" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50,
              flexDirection: "row",
              width: "100%",
              marginTop: 0,
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3840/3840829.png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{ marginLeft: 10, fontSize: 16, width: 330, color: "red" }}
            >
              Leave group
            </Text>
            <Ionicons name="chevron-forward" size={25} color="black" />
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
      <Modal visible={viewMember}>
        <LinearGradient
          style={{ flex: 1, flexDirection: "column" }}
          colors={["#f7dad5", "#ffd0f6", "#eaebf0"]}
        >
          <View
            style={{
              height: 46,
              justifyContent: "flex-start",
              alignItems: "flex-end",
              flexDirection: "row",
              backgroundColor: "#fae7e1",
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 20,
                height: 30,
                width: 30,
                marginBottom: 6,
              }}
              onPress={() => {
                setViewMember(false);
              }}
            >
              <Ionicons name="chevron-back-outline" size={25} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 15,
                color: "black",
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Member management
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginLeft: 20,
            }}
            onPress={() => {
              setAddMember1(true);
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/5368/5368938.png",
              }}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontSize: 16, marginLeft: 10 }}>Add members</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#bababa",
              marginTop: 20,
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: "blue", marginLeft: 20 }}>
              Members {"("}
              {room.count_member}
              {")"}
            </Text>
          </View>
          <FlatList
            data={listMember}
            renderItem={({ item }) => {
              if (item.role == "Admin" && item.phone == user.phone) {
                setIsAdmin("Admin");
              }
              if (item.role == "Admin") {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop: 20,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                    />
                    <View style={{ marginLeft: 10, width: "43%" }}>
                      <Text style={{}}>{item.nickname}</Text>
                      <Text style={{ color: "gray" }}>{item.role}</Text>
                    </View>
                  </View>
                );
              }
              if (item.phone == user.phone) {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop: 20,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                    />
                    <View style={{ marginLeft: 10, width: "43%" }}>
                      <Text style={{}}>{item.nickname}</Text>
                      <Text style={{ color: "gray" }}>{item.role}</Text>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop: 20,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                    />
                    <View style={{ marginLeft: 10, width: "43%" }}>
                      <Text style={{}}>{item.nickname}</Text>
                      <Text style={{ color: "gray" }}>{item.role}</Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        height: 40,
                        width: 60,
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        const temp = {
                          room_id: room._id,
                          phone: item.phone,
                        };
                        if (isAdmin == "Admin") {
                          deleteMember(temp).then(() => {
                            setListMember((prev) =>
                              prev.filter((item1) => item1.phone !== item.phone)
                            );
                          });
                        } else {
                          Alert.alert("You are not Admin");
                        }
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginLeft: 10,
                        height: 40,
                        width: 60,
                        backgroundColor: "red",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        const temp = {
                          room_id: room._id,
                          phone: item.phone,
                        };
                        if (isAdmin == "Admin") {
                          changeRole(temp).then(() => {
                            setIsAdmin("");
                          });
                        } else {
                          Alert.alert("You are not Admin");
                        }
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Change Role</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />
        </LinearGradient>
      </Modal>
      <Modal transparent={true} visible={addMember1} animationType={"fade"}>
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
              maxHeight: 1000,
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
                setAddMember1(false);
                setPhoneNumber("");
                setCheckSearch(false);
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
                Add Member
              </Text>
            </View>
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
                  if (phoneNumber != "") {
                    searchPhone();
                    setCheckSearch(true);
                  } else {
                    setCheckSearch(false);
                  }
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
                flexDirection: "column",
              }}
            >
              <View style={{ flexDirection: "row" }}>
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
              </View>
              {checkSearch ? (
                <View
                  style={{
                    borderRadius: 30,
                    height: 80,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 0,
                    marginTop: 10,
                    backgroundColor: "#fafafa",
                    paddingHorizontal: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={{ uri: dataTemp.avatar }}
                    style={{
                      marginLeft: 15,
                      width: 50,
                      height: 50,
                      borderRadius: 100,
                    }}
                  />
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
                      setListMemberAdd((prev) => [
                        ...prev,
                        {
                          name: dataTemp.first_name + " " + dataTemp.last_name,
                          phone: dataTemp.phone,
                          avatar: dataTemp.avatar,
                        },
                      ]);
                    }}
                  >
                    <Text style={{ color: "#fff" }}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text></Text>
              )}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    fontWeight: "700",
                    width: "70%",
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
                    let value = {
                      room_id: room._id,
                      list_member: list_member,
                    };
                    addMember(value);
                  }}
                >
                  <Text style={{ color: "#fff" }}>Add Member</Text>
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
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 0,
                        marginTop: 0,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <View>
                        <Image
                          source={{ uri: item.avatar }}
                          style={{
                            marginLeft: 15,
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                          }}
                        />
                      </View>
                      <View style={{ marginLeft: 20, width: "40%" }}>
                        <Text>{item.name}</Text>
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
                        }}
                      >
                        <Text style={{ color: "#fff" }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </HStack>
          </VStack>
        </View>
      </Modal>
    </NativeBaseProvider>
  );
}

const showMedia = () => {
  return <Text>Media nè</Text>;
};
const showFile = () => {
  return <Text>Flie nè</Text>;
};
const showLink = () => {
  return <Text>Link nè</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
