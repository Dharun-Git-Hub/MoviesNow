const AES = require('crypto-js/aes')
const Utf8 = require('crypto-js/enc-utf8')
const aeskeys = require('./keys.cjs')

const encryptRandom = (data) => {
    const aesKey = aeskeys[Math.floor(Math.random() * aeskeys.length)]
    console.log(Math.floor(Math.random() * aeskeys.length))
    const encrypted = AES.encrypt(data,aesKey).toString()
    return encrypted
}

const decryptRandom = (data) => {
    console.log('Data',data)
    for(let i=0;i<aeskeys.length;i++){
        try{
            if(AES.decrypt(data, aeskeys[i]).toString(Utf8).trim() === '')
                continue
            else
                return AES.decrypt(data, aeskeys[i]).toString(Utf8)
        }
        catch(err){}
    }
}

module.exports = {
    encryptRandom,
    decryptRandom,
}