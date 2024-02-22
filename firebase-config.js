// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSMrvttu0Zrk5gPp92rpd6Y-A3UTlgKEI",
    authDomain: "cannaxion-cf460.firebaseapp.com",
    databaseURL: "https://cannaxion-cf460-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cannaxion-cf460",
    storageBucket: "cannaxion-cf460.appspot.com",
    messagingSenderId: "395100127514",
    appId: "1:395100127514:web:cd5ec14a80aa06bb5feca3"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Authentification Firebase
export const auth = getAuth(app);

// Firebase Realtime Database
export const database = getDatabase(app);

// Firebase Storage
export const storage = getStorage(app);
