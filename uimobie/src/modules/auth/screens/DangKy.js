import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import React, { useState, useRef, useEffect } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../../firebase/config";
import firebase from "firebase/compat/app";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { Modal } from "react-native";
import axios from "axios";
import OTPTextView from "react-native-otp-textinput";

const DangKy = (props) => {
  const [host, setHost] = useState("172.16.20.170");

  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState("Võ Minh");
  const [lastName, setLastName] = useState("Hiếu");
  const [passWord, setPassWord] = useState("hieu123");
  const [phoneNumber, setPhoneNumber] = useState("0377723460");

  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);

  const recaptchaVerifier = useRef(null);

  const [checkValidFirstName, setCheckValidFirstName] = useState(false);
  const [checkValidLastName, setCheckValidLastName] = useState(false);
  const [checkValidPhone, setCheckValidPhone] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);

  const handleCheckPhone = (text) => {
    const regexPhoneNumber = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    setPhoneNumber(text);
    if (regexPhoneNumber.test(text)) {
      setCheckValidPhone(false);
    } else {
      setCheckValidPhone(true);
    }
  };

  const handleCheckFirstName = (text) => {
    const regextFirstName =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
    setFirstName(text);
    if (regextFirstName.test(text)) {
      setCheckValidFirstName(false);
    } else {
      setCheckValidFirstName(true);
    }
  };

  const handleCheckLastName = (text) => {
    const regextLastName =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/;
    setLastName(text);
    if (regextLastName.test(text)) {
      setCheckValidLastName(false);
    } else {
      setCheckValidLastName(true);
    }
  };

  const handleCheckPassword = (text) => {
    const regexPassWord = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
    setPassWord(text);
    if (regexPassWord.test(text)) {
      setCheckValidPassword(false);
    } else {
      setCheckValidPassword(true);
    }
  };

  const setVisibleTrue = () => {
    setVisible(true);
  };

  const onSignInSubmit = async (phone) => {
    let phoneNumber = `+84${phone.slice(1)}`;
    await firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then((confirmationResult) => {
        console.log("OTP have send");
        window.confirmationResult = confirmationResult;
      })
      .then(() => {
        setVisibleTrue();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Register = async () => {
    await fetch("http://" + host + ":4001/auth/register", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        password: passWord,
      }),
    });
  };

  const onSubmitConfirm = (otp) => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        Register();
        setVisible(false);
        props.navigation.navigate("DangNhap");
      })
      .catch(() => {
        Alert.alert("Wrong otp please re-enter");
      });
  };

  const [data, setData] = useState();
  const findPhone = async (phone) => {
    await fetch("http://" + host + ":4001/user/findPhone", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone }),
    })
      .then((data) => data.json())
      .then((data) => {
        setData(data);
        console.log(data);
        if (data == null) {
          onSignInSubmit(phone);
        } else {
          Alert.alert("Phone Already Exist");
        }
      });
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ marginTop: 40 }}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        ></FirebaseRecaptchaVerifierModal>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../../assets/logoDangKy.png")}
            style={{ height: 200, width: 260, marginLeft: 0 }}
          />
        </View>
        <View style={{ marginLeft: 40, marginTop: 0 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Sign Up</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../../assets/user.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={(text) => handleCheckFirstName(text)}
                  style={styles.input}
                />
              </View>
            </View>
            {checkValidFirstName ? (
              <Text style={{ color: "red", marginLeft: 200 }}>
                Wrong format First Name
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../../assets/user.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={(text) => handleCheckLastName(text)}
                  style={styles.input}
                />
              </View>
            </View>
            {checkValidLastName ? (
              <Text style={{ color: "red", marginLeft: 200 }}>
                Wrong format Last Name
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/phone.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={(text) => handleCheckPhone(text)}
                  // value={phone}
                  // onChangeText={setPhone}
                  style={styles.input}
                />
              </View>
            </View>
            {checkValidPhone ? (
              <Text style={{ color: "red", marginLeft: 200 }}>
                Wrong format Phone
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Image
                source={require("../../../../assets/lock.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  value={passWord}
                  onChangeText={(text) => handleCheckPassword(text)}
                  style={styles.input}
                  secureTextEntry
                />
              </View>
            </View>
            {checkValidPassword ? (
              <Text style={{ color: "red", marginLeft: 150, width: "50%" }}>
                Minimum seven characters, at least one letter and one number
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    checkValidFirstName == false &&
                    checkValidLastName == false &&
                    checkValidPhone == false &&
                    checkValidPassword == false
                  ) {
                    findPhone(phoneNumber);
                  } else {
                    Alert.alert(
                      "Notification",
                      "Please enter the correct format"
                    );
                  }
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 25, flexDirection: "row" }}>
              <Text style={{ color: "rgba(136,147,165,255)" }}>
                Joined us before?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("DangNhap");
                }}
              >
                <Text
                  style={{
                    marginLeft: 5,
                    color: "rgba(28,100,209,255)",
                    fontWeight: "500",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
      <Modal visible={visible}>
        <View style={{ backgroundColor: "#fff", flex: 1, marginTop: 0 }}>
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          ></FirebaseRecaptchaVerifierModal>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}
            style={{ alignItems: "flex-end", marginTop: 0, marginRight: 20 }}
          >
            <Text style={{ fontSize: 18, color: "black" }}>Close</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../../assets/NhapOTP.png")}
                style={{ height: 260, width: 300 }}
              />
            </View>
            <View style={{ marginLeft: 40 }}>
              <Text style={{ fontSize: 28, fontWeight: "700" }}>Enter OTP</Text>
            </View>
            <View style={{ marginLeft: 40, marginTop: 20 }}>
              <Text style={{ fontSize: 17 }}>
                An 6 digit code has been sent to {"\n"}
                {phoneNumber}
              </Text>
            </View>
            <View style={{ marginTop: 0 }}>
              <View style={styles.container} behavior="padding">
                {/* <View style={{ flexDirection: "row" }}>
                  <Image
                    source={require("../../../../assets/otp.png")}
                    style={{ height: 25, width: 25, marginTop: 20 }}
                  />
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Nhập mã OTP"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                </View> */}
                <View styl={{ marginTop: 30 }}>
                  <OTPTextView inputCount={6} handleTextChange={setCode} />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      onSubmitConfirm(code);
                    }}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DangKy;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginLeft: 10,
    width: "70%",
    borderBottomWidth: 1,
    borderColor: "rgba(232,233,236,255)",
    flexDirection: "row",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "rgba(0,101,255,255)",
    width: "100%",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
