const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, getDocs, updateDoc, collection } = require("firebase/firestore");
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



export const cron = () => {


  let arrayBookings = [];
  async function getBookings(){
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    querySnapshot.docs.map(async (doc) => {
      arrayBookings.push({
        id: doc.id,
        created:doc.data().created
      });
    })
  }
    
  function checkExpiredBookings(){
    for(let i = 0; i < arrayBookings.length; i++){
      const dateStr = arrayBookings[i].created.split(' |')[0];
      const date = new Date(dateStr); 
      compareDates(arrayBookings[i].id, date);
    }
  }

  function compareDates(id, date){
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((new Date() - date) / oneDay));

    if (diffDays > 2) {
      console.log('CANCELING: ' + id);
    } else {
      console.log('ON TIME: ' + id);
    }
  }

  // getBookings()

  console.log("WORKS");
}
