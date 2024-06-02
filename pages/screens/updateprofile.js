import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/config/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import getBlobFromUri from '../utils/getBlobFromUri';
// import UploadImage from '../components/UploadImage';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import Topbar_2 from '../components/Topbar_2';
// import Snackbar from '@mui/material/Snackbar';
// import CircularProgress from '@mui/material/CircularProgress';

const UpdateProfile = () => {
  const router = useRouter();
  const { userId, fullname, imageUri, nomorTelp, umur } = router.query;

  const [selectedImage, setSelectedImage] = useState('');
  const [inputs, setInputs] = useState({
    fullname: { value: fullname || '', isValid: true },
    nomorTelp: { value: nomorTelp || '', isValid: true },
    umur: { value: umur || '', isValid: true },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((currentInputs) => ({
      ...currentInputs,
      [inputIdentifier]: { value: enteredValue, isValid: true },
    }));
  };

  const uploadImageHandler = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const handleUpdateData = async () => {
    if (!selectedImage) {
      const colRef = doc(firestore, 'users', userId);
      const dataUpdate = {
        fullname: inputs.fullname.value || fullname,
        nomorTelp: inputs.nomorTelp.value || nomorTelp,
        umur: inputs.umur.value || umur,
      };

      setIsLoading(true);
      try {
        await updateDoc(colRef, dataUpdate);
        // setSnackbarMessage('Profile Updated');
        // setSnackbarVisible(true);
        router.replace(`/profile?userId=${userId}`);
      } catch (error) {
        // setSnackbarMessage(error.message);
        // setSnackbarVisible(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      const blobFile = await getBlobFromUri(selectedImage);

      if (selectedImage) {
        try {
          const colref = doc(firestore, 'users', userId);
          const docSnapshot = await getDoc(colref);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData && userData.imageUri) {
              const imgRef = ref(storage, userData.imageUri);
              await deleteObject(imgRef);
            //   setSnackbarMessage('Old image deleted');
            //   setSnackbarVisible(true);
            }
          }

          setIsLoading(true);
          const storagePath = 'imgUsers/' + new Date().getTime();
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, blobFile);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //   setSnackbarMessage(`Progress upload ${progress.toFixed(0)}%`);
            //   setSnackbarVisible(true);
            },
            (err) => {
            //   setSnackbarMessage(`Error: ${err.message}`);
            //   setSnackbarVisible(true);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const colRef = doc(firestore, 'users', userId);
              const dataUpdateWithImage = {
                fullname: inputs.fullname.value || fullname,
                imageUri: downloadURL,
                nomorTelp: inputs.nomorTelp.value || nomorTelp,
                umur: inputs.umur.value || umur,
              };

              await updateDoc(colRef, dataUpdateWithImage);
            //   setSnackbarMessage('Profile updated');
            //   setSnackbarVisible(true);
              router.replace(`/profile?userId=${userId}`);
            }
          );
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };

  return (
    <div style={{ flex: 1, padding: '20px', margin: '0 auto', maxWidth: '480px' }}>
      {/* <Topbar_2 title="UPDATE PROFILE" /> */}
      {/* <UploadImage fullname={fullname} imageUri={imageUri} onImageUpload={uploadImageHandler} /> */}
      <div className="mt-10 w-4/5">
        <input
          className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md"
          label="Fullname"
          invalid={!inputs.fullname.isValid}
          defaultValue={fullname}
          onChange={(e) => inputChangeHandler('fullname', e.target.value)}
        />
        <input
          className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md"
          label="No. Telp"
          invalid={!inputs.nomorTelp.isValid}
          defaultValue={nomorTelp}
          onChange={(e) => inputChangeHandler('nomorTelp', e.target.value)}
        />
        <input
          className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md"
          label="Usia"
          invalid={!inputs.umur.isValid}
          defaultValue={umur}
          onChange={(e) => inputChangeHandler('umur', e.target.value)}
        />
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button className='w-[300px] h-[60px] rounded-md text-white font-bold shadow-lg' onClick={handleUpdateData} style={{ backgroundImage: 'linear-gradient(90deg, #EA7604 0%, #DC4919 100%)' }}>
            Update Profile
          {/* {isLoading ? <CircularProgress color="inherit" /> : 'Update profile'} */}
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
