import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjtZft5iXOdk9vh4vSLRKM7op4vt4Xe5M",
  authDomain: "learnify-45135.firebaseapp.com",
  projectId: "learnify-45135",
  storageBucket: "learnify-45135.appspot.com",
  messagingSenderId: "204235223974",
  appId: "1:204235223974:web:93f8effc2209a261ec1567"
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const exercisesRef = collection(firestore, "exercises");
const translationsRef = collection(firestore, "translations");

export { exercisesRef, translationsRef, firestore };
