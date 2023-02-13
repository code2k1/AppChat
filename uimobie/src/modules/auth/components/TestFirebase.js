// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";
// import React, { useState, useRef } from "react";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
// import { firebaseConfig } from "../../../firebase/FireBase";
// import firebase from "firebase/compat/app";

// const Otp = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [code, setCode] = useState("");
//   const [verificationId, setVerificationId] = useState(null);
//   const recaptchaVerifier = useRef(null);
//   const sendVerification = () => {
//     const phoneProvider = new firebase.auth.PhoneAuthProvider();
//     phoneProvider
//       .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
//       .then(setVerificationId);
//     setPhoneNumber("");
//   };
//   const confirmCode = () => {
//     const credential = firebase.auth.PhoneAuthProvider.credential(
//       verificationId,
//       code
//     );
//     firebase
//       .auth()
//       .signInWithCredential(credential)
//       .then(() => {
//         setCode("");
//       })
//       .catch((error) => {});
//   };
//   return (
//     <View style={styles.container}>
//       <FirebaseRecaptchaVerifierModal
//         ref={recaptchaVerifier}
//         firebaseConfig={firebaseConfig}
//       ></FirebaseRecaptchaVerifierModal>
//       <Text style={styles.optText}>Login using OTP</Text>
//       <TextInput
//         placeholder="Phone Number With Country Code"
//         onChangeText={setPhoneNumber}
//         keyboardType={"phone-pad"}
//         autoComplete={"tel"}
//         style={styles.TextInput}
//       />
//       <TouchableOpacity
//         style={styles.sendVerification}
//         onPress={sendVerification}
//       >
//         <Text style={styles.buttonText}>Send verification</Text>
//       </TouchableOpacity>
//       <TextInput
//         placeholder="Confirm Code"
//         onChangeText={setPhoneNumber}
//         keyboardType={"number-pad"}
//         style={styles.TextInput}
//       />
//       <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
//         <Text style={styles.buttonText}>Confirm verification</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   TextInput: {
//     paddingTop: 40,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     fontSize: 24,
//     borderBottomColor: "#fff",
//     borderBottomWidth: 2,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#fff",
//   },
//   sendVerification: {
//     padding: 20,
//     backgroundColor: "#3498db",
//     borderRadius: 10,
//   },
//   sendCode: {
//     padding: 20,
//     backgroundColor: "#9b59b6",
//     borderRadius: 10,
//   },
//   buttonText: {
//     textAlign: "center",
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   optText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     margin: 20,
//   },
// });

// export default Otp;
