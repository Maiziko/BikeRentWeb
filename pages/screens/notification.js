// components/NotificationComponent.js
import React, { useEffect, useState } from 'react';
import styles from './NotificationComponent.module.css';

const NotificationComponent = () => {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    // Dummy data for notifications
    const dummyNotifications = [
      {
        message: "You have ended rental on bike 1",
        timestamp: new Date('2024-06-08T10:00:00'),
        userID: 123
      },
      {
        message: "You have ended rental on bike 2",
        timestamp: new Date('2024-06-08T09:30:00'),
        userID: 124
      },
      {
        message: "You have started rental on bike 1",
        timestamp: new Date('2024-06-08T09:00:00'),
        userID: 123
      },
      {
        message: "You have started rental on bike 2",
        timestamp: new Date('2024-06-08T08:00:00'),
        userID: 124
      },
      {
        message: "You have started rental on bike 1",
        timestamp: new Date('2024-06-08T07:00:00'),
        userID: 123
      },
      {
        message: "You have started rental on bike 2",
        timestamp: new Date('2024-06-08T06:00:00'),
        userID: 124
      }
    ];

    // Sort notifications in descending order based on timestamp
    dummyNotifications.sort((a, b) => b.timestamp - a.timestamp);

    // Set the notification state
    setNotification(dummyNotifications);
  }, []);

  // Helper function to format date and time
  const formatDate = (date) => {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className={styles.container}>
      {notification && notification.map((notif, index) => (
        <div key={index} className={styles.notification}>
          <p className={styles.message}>{notif.message}</p>
          <p className={styles.timestamp}>{formatDate(notif.timestamp)}</p>
          <p className={styles.userID}>UserID: {notif.userID}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
