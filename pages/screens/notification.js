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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, position: 'relative' }}>
      <p style={{ textAlign: 'center' }}>NOTIFICATION</p>
      {notifications.map((notif, index) => (
        <div key={index} style={{ borderRadius: 20, backgroundColor: '#FFD4A8', marginTop: 20, height: 'fit-content', padding: 20 }}>
          <p style={{ textAlign: 'center' }}>{notif.message}</p>
          <p style={{ textAlign: 'center', color: '#898B8C' }}>{new Date(notif.timeStamp.seconds * 1000).toLocaleString()}</p>
        </div>
      ))}
      <div style={{padding: '20px', height: '100vh', position: 'absolute', left: 0, top: 0, backgroundColor: 'white', zIndex: 9999, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
        <button style={{display: 'block'}} onClick={handleHomeClick}>Home</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleHistoryClick}>History</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleNotificationClick}>Notification</button>
        <button style={{display: 'block', marginTop: 20}} onClick={handleProfileClick}>Profile</button>
      </div>
    </div>
  );
};

export default NotificationComponent;
