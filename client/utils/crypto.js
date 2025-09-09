import forge from 'node-forge';

function generateUserKeys() {
    const keypair = forge.pki.rsa.generateKeyPair({bits: 2048});
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    return { publicKey, privateKey };
}

function encryptMessage(message, receiverPublicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(receiverPublicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
        md: forge.md.sha256.create()
    });
    return forge.util.encode64(encrypted);
}

function decryptMessage(encryptedMessage, receiverPrivateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(receiverPrivateKeyPem);
    const encrypted = forge.util.decode64(encryptedMessage);
    const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
        md: forge.md.sha256.create()
    });
    return decrypted;
}

export { generateUserKeys, encryptMessage, decryptMessage };