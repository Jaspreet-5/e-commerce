const ImageKit = require("@imagekit/nodejs");
const {toFile} = require('@imagekit/nodejs')

const client = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

const uploadPhoto = async (file) => {

    const imageFile = await toFile(
        file.buffer ,
        file.originalname
    )

    return client.files.upload({
        file: imageFile,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/product-images"
    });

};

const deletePhoto = (fileId) => {
 
    return client.files.delete(fileId);
}



module.exports = {uploadPhoto , deletePhoto};
