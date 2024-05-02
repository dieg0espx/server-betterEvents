



export const cron = () => {
  const { initializeApp } = require("firebase/app");
  const { getFirestore, doc, getDoc, getDocs, updateDoc, collection, deleteDoc } = require("firebase/firestore");
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
        name: doc.data().name, 
        lastName: doc.data().lastName, 
        phone: doc.data().phone, 
        email: doc.data().email, 
        address: doc.data().address, 
        dates: doc.data().bookingDates[0], 
        image: doc.data().inflatableImage, 
        paid: doc.data().paid, 
        specificTime:doc.data().specificTime, 
        created:doc.data().created, 
      });
    })
    checkExpiredBookings()
  }
    
  async function checkExpiredBookings(){
    for(let i = 0; i < arrayBookings.length; i++){
      const dateStr = arrayBookings[i].created.split(' |')[0];
      const date = new Date(dateStr); 
      await compareDates(arrayBookings[i].id, date, arrayBookings[i].paid, arrayBookings[i]);
    }
  }

  async function compareDates(id, date, paid, data){
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((new Date() - date) / oneDay));

    if (diffDays > 2 && paid == false) {
      // console.log('CANCELING: ' + id);
      await sendNotification(data, id)
    }
      // await deleteDoc(doc(db, "bookings", id));
    // } else {
    //   console.log('ON TIME: ' + id);
    // }
  }

  async function sendNotification(data, reservationID){
    console.log("SENDING NOTIFICATION ...");
    try {
      const response = await fetch('https://better-stays-mailer.vercel.app/api/bebookingCancellation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, reservationID })
      });
      if(response.status == 200){
        // await deleteDoc(doc(db, "bookings", reservationID));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  getBookings()

  console.log("DONE");
}
