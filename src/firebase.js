import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCqyFtT2kmDCncsDDPWAq2wJol2CsB-mL8",
    authDomain: "dichotomy-ro.firebaseapp.com",
    databaseURL: "https://dichotomy-ro.firebaseio.com",
    projectId: "dichotomy-ro",
    storageBucket: "dichotomy-ro.appspot.com",
    messagingSenderId: "372054597535",
    appId: "1:372054597535:web:a6ede5f4ebdda239d2e7aa",
    measurementId: "G-RK1Z48PBKJ",
  });
} else {
  firebase.app();
}

export const auth = firebase.auth();
export default firebase;
