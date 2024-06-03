import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/config/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import UploadImage from '../components/uploadimage';
import getBlobFromUri from '../utils/getblobfromuri';

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
    console.log('handleUpdateData called');
    console.log('selectedImage:', selectedImage);

    if (!selectedImage) {
      const colRef = doc(firestore, 'users', userId);
      const dataUpdate = {
        fullname: inputs.fullname.value || fullname,
        nomorTelp: inputs.nomorTelp.value || nomorTelp,
        umur: inputs.umur.value || umur,
      };

      console.log('Updating profile without image:', dataUpdate);

      setIsLoading(true);
      try {
        await updateDoc(colRef, dataUpdate);
        alert('Profile updated successfully');
        router.replace(`/profile?userId=${userId}`);
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Updating profile with image');

      const blobFile = await getBlobFromUri(selectedImage);

      try {
        const colRef = doc(firestore, 'users', userId);
        const docSnapshot = await getDoc(colRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.imageUri) {
            const imgRef = ref(storage, userData.imageUri);
            await deleteObject(imgRef);
            alert('Old image deleted');
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
            alert(`Progress upload ${progress.toFixed(0)}%`);
          },
          (err) => {
            alert('Error uploading image:', err);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Image uploaded, download URL:', downloadURL);

            const dataUpdateWithImage = {
              fullname: inputs.fullname.value || fullname,
              imageUri: downloadURL,
              nomorTelp: inputs.nomorTelp.value || nomorTelp,
              umur: inputs.umur.value || umur,
            };

            await updateDoc(colRef, dataUpdateWithImage);
            alert('Profile updated with image successfully');
            router.replace(`/profile?userId=${userId}`);
          }
        );
      } catch (error) {
        console.error('Error updating profile with image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <UploadImage fullname={fullname} imageUri={imageUri} onImageUpload={uploadImageHandler} />
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
        <button
          className="w-[300px] h-[60px] rounded-md text-white font-bold shadow-lg"
          onClick={handleUpdateData}
          style={{ backgroundImage: 'linear-gradient(90deg, #EA7604 0%, #DC4919 100%)' }}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
