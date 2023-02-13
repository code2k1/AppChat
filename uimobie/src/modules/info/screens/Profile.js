import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { CheckBox } from "react-native-elements";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../../../apis/user/user.api";
import * as SecureStore from "expo-secure-store";
import { removeUser } from "../../../redux/reducers/UserReducer";
export default function Profile(props) {
  const route = useRoute();

  const user = useSelector((state) => state.User);

  const [visible, setVisible] = useState(false);

  const [checkMale, setCheckMale] = useState(true);
  const [checkFemale, setCheckFemale] = useState(false);

  const [firstName, setFirstName] = useState(user.first_name);

  const [lastName, setLastName] = useState(user.last_name);

  const [gender, setGender] = useState(user.gender);

  const [birthDay, setBirthDay] = useState(new Date(user.dateOfBirth));

  const [anhDaiDien, setAnhDaiDien] = useState(user.avatar);
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
    });
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setBirthDay(currentDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["#e2dcdc", "#e7dbd7", "#e8dad9"]}
        style={styles.linearGradient}
      >
        <ScrollView>
          <View style={{ alignItems: "center", height: 900 }}>
            <View style={{ marginTop: 0 }}>
              <Image
                source={{ uri: anhDaiDien }}
                style={{
                  width: 360,
                  height: 350,
                  borderBottomLeftRadius: 50,
                  borderBottomRightRadius: 50,
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "#ebe7e5",
                width: "90%",
                borderRadius: 20,
                marginTop: -60,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  marginLeft: 30,
                }}
              >
                <Image
                  source={require("../../../../assets/profile/user.png")}
                  style={{ width: 30, height: 30 }}
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 17, color: "#625d5a" }}>
                    {firstName} {lastName}
                  </Text>
                  <Text style={{ color: "gray" }}>Name</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  marginLeft: 30,
                }}
              >
                <Image
                  source={require("../../../../assets/profile/telephone.png")}
                  style={{ width: 30, height: 30 }}
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 17, color: "#625d5a" }}>
                    {user.phone}
                  </Text>
                  <Text style={{ color: "gray" }}>Phone number</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  marginLeft: 30,
                }}
              >
                <Image
                  source={require("../../../../assets/profile/gender.png")}
                  style={{ width: 30, height: 30 }}
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 17, color: "#625d5a" }}>
                    {gender}
                  </Text>
                  <Text style={{ color: "gray" }}>Gender</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                  marginLeft: 30,
                }}
              >
                <Image
                  source={require("../../../../assets/profile/birthday.png")}
                  style={{ width: 30, height: 30 }}
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 17, color: "#625d5a" }}>
                    {birthDay.getDate()}/{birthDay.getMonth() + 1}/
                    {birthDay.getFullYear()}
                  </Text>
                  <Text style={{ color: "gray" }}>Date of birth</Text>
                </View>
              </View>
              <View style={{ height: 20, width: 0 }}></View>
            </View>
            <View
              style={{
                backgroundColor: "#ebe7e5",
                width: "90%",
                borderRadius: 20,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  padding: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 10,
                }}
                onPress={() => {
                  if (checkMale == true) {
                    setCheckMale(true);
                    setCheckFemale(false);
                  } else {
                    setCheckMale(false);
                    setCheckFemale(true);
                  }
                  setVisible(true);
                }}
              >
                <Image
                  source={require("../../../../assets/profile/edit.png")}
                  style={{ height: 30, width: 30 }}
                />
                <Text
                  style={{
                    color: "#625d5a",
                    fontSize: 17,
                    marginLeft: 20,
                    width: "70%",
                  }}
                >
                  Edit Profile
                </Text>
                <Image
                  source={require("../../../../assets/profile/next.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "100%",
                  padding: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 10,
                }}
                onPress={() => {
                  SecureStore.deleteItemAsync("secure_token");
                  dispatch(removeUser());
                  props.navigation.navigate("Home");
                }}
              >
                <Image
                  source={require("../../../../assets/profile/group.png")}
                  style={{ height: 30, width: 30 }}
                />
                <Text
                  style={{
                    color: "#625d5a",
                    fontSize: 17,
                    marginLeft: 20,
                    width: "70%",
                  }}
                >
                  Sign out
                </Text>
                <Image
                  source={require("../../../../assets/profile/next.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "100%",
                  padding: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10,
                  marginTop: 10,
                }}
                onPress={() => {}}
              >
                <Image
                  source={require("../../../../assets/profile/setting.png")}
                  style={{ height: 30, width: 30 }}
                />
                <Text
                  style={{
                    color: "#625d5a",
                    fontSize: 17,
                    marginLeft: 20,
                    width: "70%",
                  }}
                >
                  Settings
                </Text>
                <Image
                  source={require("../../../../assets/profile/next.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
              <View style={{ height: 10, width: 0 }}></View>
            </View>
          </View>
        </ScrollView>
        <Modal visible={visible}>
          <View>
            <View
              style={{
                backgroundColor: "#0a9cf9",
                height: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => {
                  setVisible(false);
                }}
              >
                <Text style={{ color: "white" }}>Close</Text>
              </TouchableOpacity>
              <Text style={{ marginLeft: 80, color: "white", fontSize: 18 }}>
                Personal information
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", marginTop: 15, marginLeft: 15 }}
            >
              <View>
                <Image
                  source={{ uri: anhDaiDien }}
                  style={{ height: 70, width: 70, borderRadius: 100 }}
                />
              </View>
              <View style={{ marginLeft: 30, width: "70%" }}>
                <View>
                  <TextInput
                    value={firstName}
                    style={{ fontSize: 17 }}
                    placeholder="Enter your first name"
                    onChangeText={setFirstName}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: "#bbbbbb",
                    width: "100%",
                    height: 1,
                    marginTop: 5,
                  }}
                ></View>
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    value={lastName}
                    style={{ fontSize: 17 }}
                    placeholder="Enter your last name"
                    onChangeText={setLastName}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: "#bbbbbb",
                    width: "100%",
                    height: 1,
                    marginTop: 10,
                  }}
                ></View>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity onPress={showMode}>
                    <Text style={{ fontSize: 17 }}>
                      {birthDay.getDate()}/{birthDay.getMonth() + 1}/
                      {birthDay.getFullYear()}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: "#bbbbbb",
                    width: "100%",
                    height: 1,
                    marginTop: 10,
                  }}
                ></View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CheckBox
                    checked={checkMale}
                    onPress={() => {
                      setCheckMale(true);
                      setCheckFemale(false);
                      setGender("Male");
                    }}
                  />
                  <Text>Male</Text>
                  <CheckBox
                    checked={checkFemale}
                    onPress={() => {
                      setCheckMale(false);
                      setCheckFemale(true);
                      setGender("Female");
                    }}
                  />
                  <Text>Female</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 120,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(0,101,255,255)",
                  width: "100%",
                  borderRadius: 20,
                  padding: 12,
                  alignItems: "center",
                  width: "80%",
                }}
                onPress={() => {
                  const birthDayTemp =
                    birthDay.getFullYear() +
                    "-" +
                    (birthDay.getMonth() + 1) +
                    "-" +
                    birthDay.getDate();
                  editProfile({
                    first_name: firstName,
                    last_name: lastName,
                    gender: gender,
                    birthday: birthDayTemp,
                  }).then(() => {
                    setVisible(false);
                  });
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "700", fontSize: 16 }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {},
});
