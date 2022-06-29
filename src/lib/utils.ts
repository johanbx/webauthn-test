export const registerYubiKey = async ({
	id,
	name,
	displayName,
	randomString
}: {
	id: string;
	name: string;
	displayName: string;
	randomString: string;
}) => {
	const credential = (await navigator.credentials.create({
		publicKey: {
			challenge: Uint8Array.from(randomString, (c) => c.charCodeAt(0)),
			rp: {
				name: 'Webauthn Demo',
				id: 'webauthn.local'
			},
			user: {
				id: Uint8Array.from(id, (c) => c.charCodeAt(0)),
				name,
				displayName
			},
			pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
			authenticatorSelection: {
				authenticatorAttachment: 'cross-platform'
			},
			timeout: 60000,
			attestation: 'direct'
		}
	})) as Omit<PublicKeyCredential, 'response'> & { response: AuthenticatorAttestationResponse };

	return {
		base64ClientDataJSON: btoa(
			String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))
		),
		base64AttestationObject: btoa(
			String.fromCharCode(...new Uint8Array(credential.response.attestationObject))
		)
	};
};

export const loginWithYubiKey = async ({
	credentialId,
	randomString
}: {
	credentialId: Uint8Array;
	randomString: string;
}) => {
	const assertion = (await navigator.credentials.get({
		publicKey: {
			challenge: Uint8Array.from(randomString, (c) => c.charCodeAt(0)),
			allowCredentials: [
				{
					id: credentialId,
					type: 'public-key',
					transports: ['usb', 'ble', 'nfc']
				}
			],
			timeout: 60000
		}
	})) as Omit<PublicKeyCredential, 'response'> & { response: AuthenticatorAssertionResponse };

	console.log(assertion);

	return {
		base64Signature: btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature))),
		base64ClientDataJSON: btoa(
			String.fromCharCode(...new Uint8Array(assertion.response.clientDataJSON))
		),
		base64AuthenticatorDataBytes: btoa(
			String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData))
		)
	};
};
