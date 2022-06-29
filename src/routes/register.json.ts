import type { RequestHandler } from './__types/register.json';
import cbor from 'cbor';
import { lolbd } from '../lib/memdb';

export const post: RequestHandler = async ({ request }) => {
	console.log('REGISTER START');
	const { base64ClientDataJSON, base64AttestationObject } = await request.json();

	const clientDataObj = JSON.parse(
		new TextDecoder('utf-8').decode(Buffer.from(base64ClientDataJSON, 'base64'))
	);

	const decodedAttestationObj: {
		authData: ArrayBuffer;
	} = cbor.decode(Buffer.from(base64AttestationObject, 'base64'));
	const { authData } = decodedAttestationObj;

	// get the length of the credential ID
	const dataView = new DataView(new ArrayBuffer(2));
	const idLenBytes = authData.slice(53, 55);
	idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
	const credentialIdLength = dataView.getUint16();

	// get the credential ID
	const credentialId = authData.slice(55, 55 + credentialIdLength);

	// get the public key object
	const publicKeyBytes = authData.slice(55 + credentialIdLength);

	// the publicKeyBytes are encoded again as CBOR
	const publicKeyObject = cbor.decode(publicKeyBytes.buffer);

	console.log(publicKeyObject);

	console.log(decodedAttestationObj);

	/*
	console.log(clientDataObj);
	console.log(decodedAttestationObj);
	console.log(credentialId);
	console.log(publicKeyBytes);
  */

	console.log({
		credentialId,
		publicKeyBytes,
		base64ClientDataJSON
	});

	lolbd['johan'] = {
		credentialId,
		publicKeyBytes,
		base64ClientDataJSON
	};

	console.log(lolbd);

	console.log('REGISTER END');
	return {
		status: 200,
		body: btoa(String.fromCharCode(...new Uint8Array(credentialId)))
	};
};
