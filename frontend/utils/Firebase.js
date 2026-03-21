import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyC80UOXOlADRlCvX_nXFW9xEn2-7iUUvCI",
  authDomain: "vebstore-caf60.firebaseapp.com",
  projectId: "vebstore-caf60",
  storageBucket: "vebstore-caf60.firebasestorage.app",
  messagingSenderId: "937078881085",
  appId: "1:937078881085:web:e5f284751d8b9b4f4ea354",
  measurementId: "G-JPY5LLPW6K"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}

