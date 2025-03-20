import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"; // Added signInWithEmailAndPassword


// ... your Firebase configuration ...

const firebaseConfig = {
  apiKey: "AIzaSyCFcAzIbkyu33GuRAS_oYtc6IUlmxqFEdM",
  authDomain: "evnt-320a0.firebaseapp.com",
  projectId: "evnt-320a0",
  storageBucket: "evnt-320a0.firebasestorage.app",
  messagingSenderId: "146980889296",
  appId: "1:146980889296:web:85312e3d4a0c3f396d74d5"
  // ... your config ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const fetchData = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.uid);
      getDocs(collection(db, "EventManagement"))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
          });
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    } else {
      console.error("User is not authenticated.");
      // Redirect to sign-in or show a message.
    }
  });
};

