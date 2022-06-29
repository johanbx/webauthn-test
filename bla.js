import { generateKeyPairSync, createSign, createVerify } from 'node:crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();

const signature = sign.sign(privateKey);

console.log(signature.toString('base64'));

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();

console.log(verify.verify(publicKey, signature));
