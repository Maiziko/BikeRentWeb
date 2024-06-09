// components/NotificationComponent.js
import React, { useEffect, useState } from 'react';
import { firestore, firebaseAuth } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import Router, { useRouter } from 'next/router'
const NotificationComponent = () => {
  const router = useRouter();
  const { userId } = router.query
  console.log(router.query)
  const [notification, setNotification] = useState([]);

  useEffect( async () => {

    const notificationRef = collection(firestore, "notifikasi");
    const notificationQuery = query(notificationRef, where("userId", "==", userId))
    const notificationSnapshot = await getDocs(notificationQuery)

    const notificationData = []

    notificationSnapshot.forEach((notif) => {
        notificationData.push(notif);
    })

    notificationData.sort((a,b) => b.timeStamp-a.timeStamp)

    setNotification(notificationData);
    // Dummy data for notifications
    // const dummyNotifications = [
    //   {
    //     message: "You have ended rental on bike 1",
    //     timestamp: new Date('2024-06-08T10:00:00'),
    //     userID: 123
    //   },
    //   {
    //     message: "You have ended rental on bike 2",
    //     timestamp: new Date('2024-06-08T09:30:00'),
    //     userID: 124
    //   },
    //   {
    //     message: "You have started rental on bike 1",
    //     timestamp: new Date('2024-06-08T09:00:00'),
    //     userID: 123
    //   },
    //   {
    //     message: "You have started rental on bike 2",
    //     timestamp: new Date('2024-06-08T08:00:00'),
    //     userID: 124
    //   },
    //   {
    //     message: "You have started rental on bike 1",
    //     timestamp: new Date('2024-06-08T07:00:00'),
    //     userID: 123
    //   },
    //   {
    //     message: "You have started rental on bike 2",
    //     timestamp: new Date('2024-06-08T06:00:00'),
    //     userID: 124
    //   }
    // ];

    // // Sort notifications in descending order based on timestamp
    // dummyNotifications.sort((a, b) => b.timestamp - a.timestamp);

    // // Set the notification state
    // setNotification(dummyNotifications);
  }, []);

  return (
    <div style={{padding: 20}}>
      <p style={{textAlign: 'center'}}>NOTIFICATION</p>
      {notification && notification.map((notif, index) => (
        <div key={index} style={{borderRadius: 20, backgroundColor: '#FFD4A8', marginTop: 20, height: 'fit-content', padding: 20}}>
          <p style={{textAlign: 'center'}}>{notif.message}</p>
          <p style={{textAlign: 'center', color: '#898B8C'}}>{notif.timeStamp.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
