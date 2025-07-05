
import crypto, { AES } from "crypto-js"
import aeskeys from './Keys'

export const encryptRandom = (data) => {
    const aesKey = aeskeys[Math.floor(Math.random() * aeskeys.length)]
    const encrypted = AES.encrypt(data,aesKey).toString()
    return encrypted
}

export const decryptRandom = (data) => {
    for(let i=0;i<aeskeys.length;i++){
        try {
            const decrypted = AES.decrypt(data, aeskeys[i]).toString(crypto.enc.Utf8);
            if (decrypted && decrypted.trim() !== '')
                return decrypted;
        } catch (err) {}
    }
    return null;
}