const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, getDocs, updateDoc, collection } = require("firebase/firestore");
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
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
app.use(express.json());
const { cron } = require('./controllers/cron.js');
app.use('/cron', cron);


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
app.get('/api/calculateDistance', async (req, res) => {
  const APIKEY = 'AIzaSyBJLc7G1TkrBTRq3cge-TsYgNpEvDz3pyM';

  // Get addresses from query parameters
  const vendorAddress = '4911 Hydraulic Rd, Rockford, IL';
  const deliveryAddress = req.query.deliveryAddress;

  // Check if deliveryAddress parameter is provided
  if (!deliveryAddress) {
    return res.status(400).json({ error: 'Delivery address parameter is missing' });
  }

  const apiURL = `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?destinations=${encodeURIComponent(deliveryAddress)}` +
    `&mode=driving` +
    `&origins=${encodeURIComponent(vendorAddress)}` +
    `&units=imperial` +
    `&key=${APIKEY}`;

  try {
    const response = await axios.get(apiURL);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});






// CONFIG - LOCAL SERVER
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




