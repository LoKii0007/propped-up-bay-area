import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmIOJhy5Mzh4opgZf0BV44qQ_ZeVocPnc",
  authDomain: "fir-f47fc.firebaseapp.com",
  projectId: "fir-f47fc",
  storageBucket: "fir-f47fc.appspot.com",
  messagingSenderId: "582794886613",
  appId: "1:582794886613:web:d4c17efdaf83c0a823d15c",
  measurementId: "G-LLEFLGQHGT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
