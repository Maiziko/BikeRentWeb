import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { findNearest, isPointWithinRadius } from 'geolib';
import { useRouter } from 'next/router';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// const customIcon = new L.Icon({
//   iconUrl: require('../../assets/nav/pos.svg'),
//   iconSize: [40, 55],
// });

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(module => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(module => module.Popup), { ssr: false });

const Map = ({ userId }) => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bikeLocation, setBikeLocation] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const pos = collection(firestore, "Pos");
        const querySnapshot = await getDocs(pos);
        const posData = querySnapshot.docs.map(doc => ({
          idpos: doc.data().idpos,
          latitude: doc.data().location.latitude,
          longitude: doc.data().location.longitude,
          nBike: doc.data().nBike,
          name: doc.data().name,
        }));
        setPos(posData);
      } catch (error) {
        console.error("Error fetching pos data:", error);
      }
    };

    fetchPos();
    const intervalId = setInterval(fetchPos, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          setInitialRegion({
            lat: latitude,
            lng: longitude,
          });
          setUserLocation({ latitude, longitude });
        });
      }
    };

    getLocation();
    const intervalId = setInterval(getLocation, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getBikeLocation();
    const intervalId = setInterval(getBikeLocation, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    updateNumberOfBikeInPos();
    const intervalId = setInterval(updateNumberOfBikeInPos, 3000);
    return () => clearInterval(intervalId);
  }, [bikeLocation]);

  const handleMarkerPress = (pos) => {
    setSelectedPos(pos);
    setShowModal(true);
  };

  const findNearestBikeStation = () => {
    if (!userLocation) return;

    const bikeStations = posSepeda.map(pos => ({
      latitude: pos.latitude,
      longitude: pos.longitude,
    }));

    const nearestStation = findNearest(userLocation, bikeStations);
    const { latitude, longitude } = nearestStation;
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${latitude},${longitude}`;

    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

    // if (typeof window !== 'undefined') {
    //   window.open(googleMapsURL, '_blank');
    // } else {
    //   console.log('Window object is not available');
    // }
  };

  const getBikeLocation = async () => {
    const bikeRef = collection(firestore, "bike");
    const bikeQuery = query(bikeRef);
    const bikeSnapshot = await getDocs(bikeQuery);

    const newBikeLocation = bikeSnapshot.docs.map(doc => ({
      bikeID: doc.data().bikeID,
      latitude: doc.data().location.latitude,
      longitude: doc.data().location.longitude,
    }));

    setBikeLocation(newBikeLocation);
  };

  const updateNumberOfBikeInPos = async () => {
    posSepeda.forEach(async (pos) => {
      const posLocation = { latitude: pos.latitude, longitude: pos.longitude };
      const radius = 2;
      let nBike = 0;
      for (const bike of bikeLocation) {
        const bikePosition = { latitude: bike.latitude, longitude: bike.longitude };
        if (isPointWithinRadius(bikePosition, posLocation, radius)) {
          const bikeRef = collection(firestore, "bike");
          const bikeQuery = query(bikeRef, where("bikeID", "==", bike.bikeID));
          const bikeSnapshot = await getDocs(bikeQuery);
          if (bikeSnapshot.docs[0].data().rented === false) {
            nBike++;
          }
        }
      }
      const posRef = collection(firestore, "Pos");
      const posQuery = query(posRef, where("idpos", "==", pos.idpos));
      const posSnapshot = await getDocs(posQuery);
      await updateDoc(posSnapshot.docs[0].ref, { nBike: nBike });
    });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
        {/* <p>halo</p> */}
      {initialRegion && (
        <MapContainer center={[initialRegion.latitude, initialRegion.longitude]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {initialRegion && (
            <Marker position={[initialRegion.latitude, initialRegion.longitude]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>User Location</Popup>
            </Marker>
          )}
          {bikeLocation.map((bikeLocation, index) => (
            <Marker
              key={index}
              position={[bikeLocation.latitude, bikeLocation.longitude]}
              title={`BikeID: ${bikeLocation.bikeID}`}
            >
              <Popup>BikeID: {bikeLocation.bikeID}</Popup>
            </Marker>
          ))}
          {posSepeda.map((pos, index) => (
            <Marker
              key={index}
              position={[pos.latitude, pos.longitude]}
              icon={customIcon}
              title={pos.name}
              eventHandlers={{ click: () => handleMarkerPress(pos) }}
            >
              <Popup>{pos.name} - Bikes Available: {pos.nBike}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center' }}>
        <button onClick={findNearestBikeStation} style={{ padding: '10px 20px', backgroundColor: '#D93F1E', color: 'white', border: 'none', borderRadius: '20px' }}>
          Tampilkan Pos Terdekat
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: '20px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
        }}>
          <button onClick={() => setShowModal(false)} style={{ float: 'right', fontWeight: 'bold' }}>X</button>
          <h2>Pos sepeda: {selectedPos.name}</h2>
          <p>Jumlah Sepeda: {selectedPos.nBike}</p>
          <Link href={`/barcodeScanner?userId=${userId}`}>
            <a style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#EB7802', color: 'white', borderRadius: '20px', textDecoration: 'none' }}>Scan QR Sepeda</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Map;
