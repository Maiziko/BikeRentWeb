import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

import { firestore } from '../../config/firebase';

const Map = dynamic(() => import('../components/mapDash'), { ssr: false });

const Dashboard = () => {
  const [pos, setPos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPos, setSelectedPos] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const posRef = collection(firestore, 'Pos');
      const posSnapshot = await getDocs(posRef);
      const posData = posSnapshot.docs.map(doc => ({
        idpos: doc.data().idpos,
        latitude: doc.data().location.latitude,
        longitude: doc.data().location.longitude,
        nBike: doc.data().nBike,
        name: doc.data().name,
      }));
      setPos(posData);
    };
      
    fetchData();
  }, []);

  const nextPos = () => {
    if (currentIndex < pos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const prevPos = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const currentPos = pos[currentIndex];


  return (
    <div style={{ marginBottom:50 }}>
      <div style={{ display:'flex', backgroundColor:'orange', width:150, height:50, justifyContent:'center', alignItems:'center', borderBottomRightRadius:10 }}>
        <h1 style={{fontSize:21, fontWeight:'bold'}}>Dashboard</h1>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Map />
        </div>
        <div style={{ flex: 1, position:'absolute', zIndex:1000, right:10, paddingRight:10, paddingTop:20 }}>
          <div>
            {currentPos && (
              <div style={{ backgroundColor:'#FFFFFF', padding:5, borderRadius:5 }}>
                <div style={{ width:'100%', display:'flex', justifyContent:'space-between' }}>
                  <button onClick={prevPos} disabled={currentIndex === 0} style={{ backgroundColor:'orange', color:'#FFFFFF', width:75 }}>Previous</button>
                  <button onClick={nextPos} disabled={currentIndex === pos.length - 1} style={{ backgroundColor:'orange', color:'#FFFFFF', width:75 }}>Next</button>
                </div>
                <h3 style={{ color:'#000000' }}>Pos : {currentPos.name}</h3>
                <table style={{ borderCollapse:'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ backgroundColor:'lightslategrey', color:'#000000' }}>Sepeda Tersedia</td>
                      <td style={{ backgroundColor:'lightslategrey', color:'#000000', width:50, textAlign:'end' }}>{currentPos.nBike}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor:'lightgrey', color:'#000000' }}>Sepeda Disewakan</td>
                      <td style={{ backgroundColor:'lightgrey', color:'#000000', width:50 }}>{currentPos.rentedBikes}</td>
                    </tr>
                    <tr>
                      <td style={{ backgroundColor:'lightslategrey', color:'#000000' }}>Penyewaan Hari Ini</td>
                      <td style={{ backgroundColor:'lightslategrey', color:'#000000', width:50 }}>{currentPos.todayRentals}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '20px', justifyContent:'space-between', paddingInline:10 }}>
        <div style={{ width:'47.5%' }}>
          <h3 style={{ backgroundColor:'orange', color:'#FFFFFF' }}>Menambahkan Pos Baru</h3>
          <form style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={async (e) => {
              e.preventDefault();
              const newPos = {
                name: e.target.posName.value,
                latitude: parseFloat(e.target.posLat.value),
                longitude: parseFloat(e.target.posLon.value),
                availableBikes: 0,
                rentedBikes: 0,
                todayRentals: 0,
              };
              await firestore.collection('pos').add(newPos);
          }}>
            <input name='posName' placeholder='Pos Name' required />
            <input name='posLat' placeholder='Latitude' type='number' step='any' required />
            <input name='posLon' placeholder='Longitude' type='number' step='any' required />
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button type='submit' style={{ backgroundColor:'orange', color:'#FFFFFF', width:250 }}>Tambahkan Pos</button>
            </div>
          </form>
        </div>
        <div style={{ width:'47.5%' }}>
          <h3 style={{ backgroundColor:'orange', color:'#FFFFFF' }}>Menambahkan Sepeda Baru</h3>
          <form style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={async (e) => {
              e.preventDefault();
              const newBike = {
                name: e.target.bikeName.value,
                posId: selectedPos,
                latitude: parseFloat(e.target.bikeLat.value),
                longitude: parseFloat(e.target.bikeLon.value),
              };
              await realtimeDatabase.ref('bikes').push(newBike);
          }}>
            <select onChange={(e) => setSelectedPos(e.target.value)}>
              <option value=''>Select Pos</option>
              {pos.map((pos) => (
                <option key={pos.id} value={pos.id}>{pos.name}</option>
              ))}
            </select>
            <input name='bikeName' placeholder='Bike Name' required />
            <input name='bikeLat' placeholder='Latitude' type='number' step='any' required />
            <input name='bikeLon' placeholder='Longitude' type='number' step='any' required />
            <div style={{ display:'flex', justifyContent:'center' }}>
              <button type='submit' style={{ backgroundColor:'orange', color:'#FFFFFF', width:250 }}>Tambahkan Sepeda</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;