import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

import { firestore } from '../../config/firebase';

const MapDash = () => {
  const [pos, setPos] = useState([]);
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const posRef = collection(firestore, 'pos');
      const posSnapshot = await getDocs(posRef);
      const posData = posSnapshot.docs.map(doc => ({
        idpos: doc.data().idpos,
        latitude: doc.data().location.latitude,
        longitude: doc.data().location.longitude,
        nBike: doc.data().nBike,
        name: doc.data().name,
      }));
    };

    fetchData();
  }, []);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div style={{ width: 'auto', height:'70vh', position: 'relative' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ width: '100%', height: '100%', borderRadius:10 }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pos.map((pos) => (
          <Marker key={pos.id} position={[pos.latitude, pos.longitude]}>
            <Popup>
              {pos.name}
            </Popup>
          </Marker>
        ))}
        {bikes.map((bike) => (
          <Marker key={bike.id} position={[bike.latitude, bike.longitude]}>
            <Popup>
              {bike.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapDash;