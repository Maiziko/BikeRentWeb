import React, { useEffect, useState } from 'react';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';

const History = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;

      try {
        // const rentalRef = collection(firestore, "Rental");
        // const historyQuery = query(rentalRef, where("userID", "==", userId), where("rentalEnd", "!=", null));
        // const historySnapshot = await getDocs(historyQuery);

        // console.log('historysnapshot', historySnapshot.docs[0].data())

        // const historiesData = [];
        // historySnapshot.forEach((history) => {
        //   const historyData = history.data();
        //   historiesData.push(historyData);
        // });

        // console.log('historydata', historiesData)

        // setHistory(historiesData);
        console.log('userid', userId);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
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
      <p style={{ textAlign: 'center' }}>HISTORY</p>
      {history.map((history, index) => (
        <div key={index} style={{ borderRadius: 20, backgroundColor: '#FFD4A8', marginTop: 20, height: 'fit-content', padding: 20 }}>
          <p style={{ textAlign: 'center' }}>Bike ID: {history.bikeID}</p>
          <p style={{ textAlign: 'center', color: '#898B8C' }}>Retal Start: +{new Date(history.rentalStart.seconds * 1000).toLocaleString()}</p>
          <p style={{ textAlign: 'center', color: '#898B8C' }}>Rental End: +{new Date(history.rentalEnd.seconds * 1000).toLocaleString()}</p>
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

export default History;
