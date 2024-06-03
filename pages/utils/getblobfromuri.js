// lib/getBlobFromUri.js

const getBlobFromUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function () {
            reject(new TypeError("Request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });
    return blob;
};

export default getBlobFromUri;
