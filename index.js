const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, getDocs, updateDoc, collection } = require("firebase/firestore");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 4000;


//  ============== FIREBASE CONFIG ============== //
const firebaseConfig = {
    apiKey: "AIzaSyBC5MNHkmJEPA-W1lsBeg9uDBZPpVdjxoQ",
    authDomain: "bettereventsco-e28be.firebaseapp.com",
    projectId: "bettereventsco-e28be",
    storageBucket: "bettereventsco-e28be.appspot.com",
    messagingSenderId: "771360651927",
    appId: "1:771360651927:web:ac8d027078becd6fabc7d2",
    measurementId: "G-B7SEH10BTL"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const app = express();
app.use(bodyParser.json())
app.use(cors())


async function userExists(username) {
  const querySnapshot = await getDocs(collection(db, "users"));
  for (const userDoc of querySnapshot.docs) {
    if (userDoc.data().email === username) {
      return userDoc.data().token; // Successfully hashed and updated
    }
  }
  return false; // User with the given email not found
}

// =========== APIs - WEBSITE =========== //

app.post("/api/login", async (req, res) => {
  res.json(await userExists(req.body.username));
});




// CONFIG - LOCAL SERVER
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});