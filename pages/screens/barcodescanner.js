import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const BarcodeScannerComponent = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false });

const BarcodeScanner = () => {
  const [data, setData] = useState('Not Found');
  const router = useRouter();
  const { userId } = router.query;

  const handleUpdate = async (err, result) => {
    if (result) {
      setData(result.text);
      try {
        // const docRef = await addDoc(collection(firestore, 'scannedData'), {
        //   userId: userId || 'anonymous',
        //   barcodeData: result.text,
        //   timestamp: new Date(),
        // });
        console.log('Document written with ID: ', docRef.id);
        alert('Barcode scanned and data saved successfully!');
      } catch (e) {
        console.error('Error adding document: ', e);
        alert('Failed to save data. Please try again.');
      }
    } else if (err) {
      console.error('Error scanning barcode: ', err);
    }
  };

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
