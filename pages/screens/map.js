import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { findNearest, isPointWithinRadius } from 'geolib';
import { useRouter } from 'next/router';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [posSepeda, setPos] = useState([]);
  const [selectedPos, setSelectedPos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bikeLocation, setBikeLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { userId } = router.query

  const iconSepeda = L.icon({
    iconUrl: "../../iconSepeda.svg",
    iconSize: [30, 40],
  })

  const iconPos = L.icon({
    iconUrl: "../../iconPos.svg",
    iconSize: [30, 40],
  })

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
        console.log('pos data obtained', posData);
      } catch (error) {
        console.error("Error fetching pos data:", error);
      }
    };

    const getLocation = () => {
      const onSuccess = (location) => {
        const { latitude, longitude } = location.coords;
        console.log("Location obtained:", latitude, longitude);
        setInitialRegion({ lat: latitude, lng: longitude });
        setUserLocation({ latitude, longitude });
      };

      const onError = (error) => {
        console.log("Error: " + error.message);
      };

      if (!("geolocation" in navigator)) {
        onError({
          code: 0,
          message: "Geolocation not supported",
        });
      } else {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
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
      console.log('bike location obtained', newBikeLocation);
    };

    const initializeData = async () => {
      setIsLoading(true);
      await fetchPos();
      getLocation();
      await getBikeLocation();
      setIsLoading(false);
    };

    initializeData();

    const posIntervalId = setInterval(fetchPos, 3000);
    const locationIntervalId = setInterval(getLocation, 3000);
    const bikeLocationIntervalId = setInterval(getBikeLocation, 3000);

    return () => {
      clearInterval(posIntervalId);
      clearInterval(locationIntervalId);
      clearInterval(bikeLocationIntervalId);
    };
  }, []);

  useEffect(() => {
    const updateNumberOfBikeInPos = async () => {
      for (const pos of posSepeda) {
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
        await updateDoc(posSnapshot.docs[0].ref, { nBike });
      }
    };

    if (bikeLocation.length > 0) {
      updateNumberOfBikeInPos();
      const intervalId = setInterval(updateNumberOfBikeInPos, 3000);
      return () => clearInterval(intervalId);
    }
  }, [bikeLocation, posSepeda]);

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

    window.open(googleMapsURL, '_blank');
  };

  if (isLoading) {
    return (
      <div>loading</div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {initialRegion ? (
        <MapContainer center={[initialRegion.lat, initialRegion.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {bikeLocation.map((bikeLocation, index) => (
            <Marker
              key={index}
              position={[bikeLocation.latitude, bikeLocation.longitude]}
              title={`BikeID: ${bikeLocation.bikeID}`}
              icon={iconSepeda}
            >
              <Popup>BikeID: {bikeLocation.bikeID}</Popup>
            </Marker>
          ))}
          {posSepeda.map((pos, index) => (
            <Marker
              key={index}
              position={[pos.latitude, pos.longitude]}
              title={pos.name}
              icon={iconPos}
              eventHandlers={{ click: () => handleMarkerPress(pos) }}
            >
              <Popup>{pos.name} - Bike Available: {pos.nBike}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (<div>loading</div>)}

      <div style={{ position: 'absolute', bottom: 50, width: '100%', textAlign: 'center', zIndex: 999 }}>
        <button onClick={findNearestBikeStation} style={{ padding: '10px 20px', backgroundColor: '#D93F1E', color: 'white', border: 'none', borderRadius: '20px' }}>
          Tampilkan Pos Terdekat
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999, 
          backgroundColor: 'white',
          padding: '20px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
        }}>
          <button onClick={() => setShowModal(false)} style={{ float: 'right', fontWeight: 'bold' }}>X</button>
          <h2>Pos sepeda: {selectedPos?.name}</h2>
          <p>Jumlah Sepeda: {selectedPos?.nBike}</p>
          <Link href={`/screens/barcodescanner?userId=${userId}`}>
            <p style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#EB7802', color: 'white', borderRadius: '20px', textDecoration: 'none' }}>Scan QR Sepeda</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Map;
