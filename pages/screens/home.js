import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });
import Router, { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "@/config/firebase";
const Map = dynamic(() => import("./map"), {ssr: false})

export default function Home() {
  const router = useRouter();
  const {userId} = router.query
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
    // getAuth.onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is signed in, you can get session data here
    //     const userId = user.uid;
    //     db.collection("sessions").doc(userId).get()
    //       .then((doc) => {
    //         if (doc.exists) {
    //           console.log("Session data:", doc.data());
    //         } else {
    //           console.log("No session data found");
    //         }
    //       })
    //       .catch((error) => {
    //         console.error("Error getting session data: ", error);
    //       });
    //   } else {
    //     // No user is signed in
    //     console.log("No user is signed in");
    //   }
    // });
    // console.log(firebaseAuth.getAuth());
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/auth.user
  //       const uid = user.uid;
  //       setUserId(uid)
  //       console.log(uid)
  //       console.log('userId', userId)
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }, [])

  const handleHistoryClick = () => {
    router.replace(`/screens/history?userId=${userId}`);
  }
  const handleHomeClick = () => {
    router.replace(`/screens/home?userId=${userId}`);
  }
  const handleNotificationClick = () => {
    router.replace(`/screens/notification?userId=${userId}`);
  }
  const handleProfileClick = () => {
    router.replace(`/screens/profil?userId=${userId}`);
  }
  
  return (
    <main style={{position: 'relative', height: '100vh', width: '100vw'}}>
      <Map></Map>
      <div style={{padding: '20px', height: '100vh', position: 'absolute', left: 0, top: 0, backgroundColor: 'white', zIndex: 9999, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
        <button style={{display: 'block'}} onClick={handleHomeClick}>Home</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleHistoryClick}>History</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleNotificationClick}>Notification</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleProfileClick}>Profile</button>
      </div>
    </main>
  );
}