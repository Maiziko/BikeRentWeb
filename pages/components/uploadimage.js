// pages/uploadImage.js
import React, { useState } from 'react';

const UploadImage = ({ fullname, onImageUpload, imageUri }) => {
    const [uploadImage, setUploadImage] = useState(null);

    const uploadImageHandler = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setUploadImage(fileUrl);
            onImageUpload(fileUrl);
        }
    };

    let imagePreview = (
        <img
            style={styles.userImg}
            src={imageUri ? imageUri : `https://ui-avatars.com/api/?name=${fullname}`}
            alt="User Image"
        />
    );

    if (uploadImage) {
        imagePreview = (
            <img
                style={styles.userImg}
                src={uploadImage}
                alt="Uploaded Image"
            />
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.imagePreview}>
                {imagePreview}
            </div>
            <input 
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={uploadImageHandler}
                style={styles.uploadButton}
            />
            <label htmlFor="file-upload" style={styles.uploadLabel}>
                Upload Image
            </label>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        margin: '10px auto',
    },
    imagePreview: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '12px',
    },
    userImg: {
        borderRadius: '50%',
        width: '100px',
        height: '100px',
    },
    uploadButton: {
        display: 'none',
    },
    uploadLabel: {
        display: 'inline-block',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40px',
        width: '129px',
        padding: '8px',
        marginTop: '12px',
        backgroundColor: '#FFAC33',
        borderRadius: '25px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: '40px',
        position: 'relative',
        overflow: 'hidden',
    },
    uploadLabelBefore: {
        content: '""',
        background: 'linear-gradient(to right, #EB7802, #DA421C)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        borderRadius: '25px',
    },
};

export default UploadImage;
