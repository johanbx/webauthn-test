import type { RequestHandler } from './__types/login.json';
import { createHash, createVerify, createPublicKey } from 'node:crypto';
import { lolbd } from '../lib/memdb';

export const post: RequestHandler = async ({ request }) => {
	console.log('LOGIN START');
	const { base64AuthenticatorDataBytes, base64Signature, base64ClientDataJSON } =
		await request.json();

	const { publicKeyBytes } = lolbd['johan'];

	console.log(publicKeyBytes);

	console.log('generate public key');
	const publicKey = createPublicKey({
		key: publicKeyBytes,
		format: 'der',
		type: 'pkcs1'
	});

	console.log(publicKey);

	const hash = createHash('sha256');
	hash.update(Buffer.from(base64ClientDataJSON, 'base64'));
	const hashedClientDataJSON = hash.digest();

	const signedData = Buffer.concat([
		Buffer.from(base64AuthenticatorDataBytes, 'base64'),
		hashedClientDataJSON
	]);

	console.log({
		signedData,
		publicKey,
		signature: Buffer.from(base64Signature, 'base64')
	});

	const verify = createVerify('SHA256');
	verify.update(signedData);
	verify.end();
	const isVerified = verify.verify(publicKey, Buffer.from(base64Signature, 'base64'));

	/*
	const isVerified = verify(
		'sha256',
		signedData,
		publicKeyBytes,
		Buffer.from(base64Signature, 'base64')
	);
  */

	console.log(isVerified);
	console.log('LOGIN END');

	return {
		status: 200
	};
};
