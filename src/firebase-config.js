import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC-ftWIzAVwjThs1sOLbBSV5hcKTI6aeos",
    authDomain: "healthrecordssystem-bf0c5.firebaseapp.com",
    projectId: "healthrecordssystem-bf0c5",
    storageBucket: "healthrecordssystem-bf0c5.appspot.com",
    messagingSenderId: "1078662161850",
    appId: "1:1078662161850:web:b4950d8a6026f760446983",
    measurementId: "G-RE98B33N2D"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  const auth = getAuth();

  export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  export function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
    
  export function logout() {
    return signOut(auth);
  }