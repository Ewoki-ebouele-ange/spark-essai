// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc29dM6Kao0npnZIB2KAOekRM2qvpPdcg",
  authDomain: "sparkdb-d1924.firebaseapp.com",
  projectId: "sparkdb-d1924",
  storageBucket: "sparkdb-d1924.appspot.com",
  messagingSenderId: "571499067172",
  appId: "1:571499067172:web:a12eacc31a4afa318425b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//export const auth = getAuth(app);
export const db = getFirestore();