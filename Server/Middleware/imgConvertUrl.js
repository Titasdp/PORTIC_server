const Blob = require("cross-blob")

const convertImage = (img) => {
    let arrayBufferView = new Uint8Array(img);
    let blob = new Blob([arrayBufferView], {
        type: "image/png"
    });
    console.log(blob);
    let link = URL.createObjectURL(blob);
    let img = new Image();

    img.onload = () => URL.revokeObjectURL(link);
    img.src = link;
    return img.src


    let urlCreator = window.URL || window.webkitURL;
    let image = urlCreator.createObjectURL(blob);

    return image;
}


const supremeConvert = (data) => {
    let binary = Buffer.from(data); //or Buffer.from(data, 'binary')
    let imgData = new Blob(binary.buffer, {
        type: 'application/octet-binary'
    });
    let link = URL.createObjectURL(imgData);

    let img = new Image();
    img.onload = () => URL.revokeObjectURL(link);
    img.src = link;

    return img.src
}






module.exports = {
    convertImage,
    supremeConvert


}