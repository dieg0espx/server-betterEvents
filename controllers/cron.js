



export const cron = () => {
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


  let arrayBookings = [];
  async function getBookings(){
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    querySnapshot.docs.map(async (doc) => {
      arrayBookings.push({
        id: doc.id,
        created:doc.data().created, 
        paid: doc.data().paid
      });
    })
    checkExpiredBookings()
  }
    
  function checkExpiredBookings(){
    for(let i = 0; i < arrayBookings.length; i++){
      const dateStr = arrayBookings[i].created.split(' |')[0];
      const date = new Date(dateStr); 
      compareDates(arrayBookings[i].id, date, arrayBookings[i].paid);
    }
  }

  function compareDates(id, date, paid){
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((new Date() - date) / oneDay));

    if (diffDays > 2 && paid == 'false') {
      console.log('CANCELING: ' + id);
    } else {
      console.log('ON TIME: ' + id);
    }
  }

  getBookings()

  console.log("DONE");
}
