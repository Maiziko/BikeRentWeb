import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const BarcodeScannerComponent = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

const BarcodeScanner = () => {
  const [data, setData] = useState('Not Found');
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false)
  const { userId } = router.query;

  const handleUpdate = async (err, result) => {
    setIsLoading(true)
    if (result) {
      setData(result.text);
      try {
        // const docRef = await addDoc(collection(firestore, 'scannedData'), {
        //   userId: userId || 'anonymous',
        //   barcodeData: result.text,
        //   timestamp: new Date(),
        // });

        const bikeID = data;
        const userID = userId;
        const currentTimestamp = Timestamp.now();

        try {
            // Query for the rental document where bikeID matches and rentalEnd is null
            const rentalQuery = query(
                collection(firestore, 'Rental'),
                where('bikeID', '==', bikeID),
                where('rentalEnd', '==', null)
            );

            const querySnapshot = await getDocs(rentalQuery);

            if (!querySnapshot.empty) {
                let documentUpdated = false;
                const updateDocuments = querySnapshot.docs.map(async (doc) => {
                if (doc.data().userID === userID) {
                    await updateDoc(doc.ref, { rentalEnd: currentTimestamp });
                    const bikeRef = collection(firestore, "bike")
                    const bikeQuery = query(bikeRef, where("bikeID", "==", bikeID))
                    const bikeSnapshot = await getDocs(bikeQuery);
                    await updateDoc(bikeSnapshot.docs[0].ref, { rented: false })
                    documentUpdated = true;
                    Alert.alert('Rental ended!', `Bike ID: ${bikeID}\nRental ID: ${doc.id}\nRental ended successfully.`);
                }
                });

                await Promise.all(updateDocuments);

                if (!documentUpdated) {
                Alert.alert('Error', 'You can only end your own rental.');
                }
            } else {
                // If no matching document is found, create a new rental document
                const rentalDocRef = await addDoc(collection(firestore, 'Rental'), {
                bikeID,
                userID,
                rentalStart: currentTimestamp,
                rentalEnd: null,
                });

                const bikeRef = collection(firestore, "bike")
                const bikeQuery = query(bikeRef, where("bikeID", "==", bikeID))
                const bikeSnapshot = await getDocs(bikeQuery);
                await updateDoc(bikeSnapshot.docs[0].ref, { rented: true })

                Alert.alert('Rental started!', `Bike ID: ${bikeID}\nRental ID: ${rentalDocRef.id}`);
            }
        } catch (error) {
            console.error("Error handling barcode scan: ", error);
            Alert.alert('Error', 'There was an error processing your request.');
        }
        router.push('/screens/home')
        // navigation.navigate('Home', {userId: currentUser});
        console.log('Document written with ID: ', docRef.id);
        alert('Barcode scanned and data saved successfully!');
      } catch (e) {
        console.error('Error adding document: ', e);
        // alert('Failed to save data. Please try again.');
      }
    } else if (err) {
      console.error('Error scanning barcode: ', err);
    }
    setIsLoading(false)
  };

  if(isloading) {
    return (
        <div>loading...</div>
    )
  }

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <BarcodeScannerComponent
        onUpdate={handleUpdate}
      />
      <p>{data}</p>
    </div>
  );
};

export default BarcodeScanner;
