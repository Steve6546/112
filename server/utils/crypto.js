const crypto = require('crypto');

function generateUserKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    return { publicKey, privateKey };
}

function encryptMessage(message, receiverPublicKey) {
    const buffer = Buffer.from(message, 'utf-8');
    const encrypted = crypto.publicEncrypt({
        key: receiverPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    }, buffer);
    return encrypted.toString('base64');
}

function decryptMessage(encryptedMessage, receiverPrivateKey) {
    const buffer = Buffer.from(encryptedMessage, 'base64');
    const decrypted = crypto.privateDecrypt({
        key: receiverPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    }, buffer);
    return decrypted.toString('utf-8');
}

module.exports = { generateUserKeys, encryptMessage, decryptMessage };