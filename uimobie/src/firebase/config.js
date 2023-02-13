import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"


export const firebaseConfig = {
    apiKey: "AIzaSyDW6Z01ZAt2GxLQcX3Z5pbYmD7UEzBHUmo",
    authDomain: "appchat-e0494.firebaseapp.com",
    projectId: "appchat-e0494",
    storageBucket: "appchat-e0494.appspot.com",
    messagingSenderId: "757202941080",
    appId: "1:757202941080:web:598ee0305ae43c94414ced",
    measurementId: "G-EKF2ZEKB0K"
};
    
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}




