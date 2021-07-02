const generateRandomPass = () => {

    const numbChar = 8
    const charPack = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let generatedPassword = "";
    for (var i = 0, n = charPack.length; i < numbChar; ++i) {
        generatedPassword += charPack.charAt(Math.floor(Math.random() * n));
    }

    return (generatedPassword);
    // return generatedPassword;

}

module.exports = {
    generateRandomPass,
}