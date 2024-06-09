import React, { useEffect, useState } from 'react';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';

const NotificationComponent = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;

      try {
        const notificationRef = collection(firestore, "notifikasi");
        const notificationQuery = query(notificationRef, where("userId", "==", userId));
        const notificationSnapshot = await getDocs(notificationQuery);

        const notificationData = [];
        notificationSnapshot.forEach((notif) => {
          const notifData = notif.data();
          notificationData.push(notifData);
        });

        notificationData.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds);
        setNotifications(notificationData);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <p style={{ textAlign: 'center' }}>NOTIFICATION</p>
      {notifications.map((notif, index) => (
        <div key={index} style={{ borderRadius: 20, backgroundColor: '#FFD4A8', marginTop: 20, height: 'fit-content', padding: 20 }}>
          <p style={{ textAlign: 'center' }}>{notif.message}</p>
          <p style={{ textAlign: 'center', color: '#898B8C' }}>{new Date(notif.timeStamp.seconds * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
