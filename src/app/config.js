import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHK1lTPYL4dBJQeTr-1s0U-ObWpEHZXUE",

  authDomain: "mytodo-49f06.firebaseapp.com",

  projectId: "mytodo-49f06",

  storageBucket: "mytodo-49f06.appspot.com",

  messagingSenderId: "109639677374",

  appId: "1:109639677374:web:ab5ac907811b5a4d6575ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app };
