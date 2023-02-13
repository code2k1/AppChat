import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import React from "react";
import { useState } from "react";
import OTPTextView from "react-native-otp-textinput";
import { firebaseConfig } from "../../../firebase/config";
import firebase from "firebase/compat/app";
import { useRef } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Alert } from "react-native";

const QuenMatKhau = (props) => {
  const [host, setHost] = useState("172.16.20.170");

  const [visible, setVisible] = useState(false);
  const recaptchaVerifier = useRef(null);
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [checkValidPhone, setCheckValidPhone] = useState(false);

  const handleCheckPhone = (text) => {
    const regexPhoneNumber = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    setPhoneNumber(text);
    if (regexPhoneNumber.test(text)) {
      setCheckValidPhone(false);
    } else {
      setCheckValidPhone(true);
    }
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

  const onSubmitConfirm = (otp) => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        setVisible(false);
        props.navigation.navigate("ResetMatKhau", {
          phoneNumber: phoneNumber,
          host: host,
        });
      })
      .catch(() => {
        Alert.alert("Wrong otp please re-enter");
      });
  };

  const setVisibleTrue = () => {
    setVisible(true);
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
          Alert.alert("Phone Not Exist");
        } else {
          onSignInSubmit(phone);
        }
      });
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ marginTop: 20 }}>
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
            source={require("../../../../assets/QuenMatKhaulogo.png")}
            style={{ height: 260, width: 300 }}
          />
        </View>
        <View style={{ marginLeft: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>
            Forgot {"\n"}Password?
          </Text>
        </View>
        <View style={{ marginTop: 15, marginLeft: 40 }}>
          <Text style={{ color: "#8993a5" }}>
            Don't worry! It happens. Please enter the address associated with
            your account.
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/phone.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChangeText={(text) => handleCheckPhone(text)}
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (checkValidPhone == false) {
                    findPhone(phoneNumber);
                    // props.navigation.navigate("ResetMatKhau",{
                    //   phoneNumber: phoneNumber,
                    //   host: host
                    // });
                  } else {
                    Alert.alert(
                      "Notification",
                      "Please enter the correct format"
                    );
                  }
                }}
              >
                <Text style={styles.buttonText}>Submit</Text>
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
    </View>
  );
};

export default QuenMatKhau;

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
    paddingHorizontal: 15,
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
    marginTop: 60,
  },
});
