import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyD5IZ-ir56U3FDLG_c6BngJZDibwa__uys",
    authDomain: "canvas-app-090621.firebaseapp.com",
    projectId: "canvas-app-090621",
    storageBucket: "canvas-app-090621.appspot.com",
    messagingSenderId: "428837731108",
    appId: "1:428837731108:web:9bbc6112afcbcd8ddcd1b1",
  });
} else {
  firebase.app();
}

export default firebase;
