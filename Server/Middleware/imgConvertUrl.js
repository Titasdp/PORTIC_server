const convertImage = (img) => {
    let arrayBufferView = new Uint8Array(img);
    let blob = new Blob([arrayBufferView], {
        type: "image/png"
    });
    let urlCreator = window.URL || window.webkitURL;
    let image = urlCreator.createObjectURL(blob);

    return image;
}







module.exports = {
    convertImage


}