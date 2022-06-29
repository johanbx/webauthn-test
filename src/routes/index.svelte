<script lang="ts">
	import { loginWithYubiKey, registerYubiKey } from '../lib/utils';

	export let randomStringFromServer: string;
	let credentialId: Uint8Array;

	async function register() {
		const { base64ClientDataJSON, base64AttestationObject } = await registerYubiKey({
			id: 'UZSL85T9AFC',
			name: 'johan.bx@yubico.com',
			displayName: 'Johan',
			randomString: randomStringFromServer
		});

		const base64CredentialId = await fetch('/register.json', {
			method: 'POST',
			body: JSON.stringify({
				base64ClientDataJSON,
				base64AttestationObject
			}),
			headers: { 'Content-Type': 'application/json' }
		})?.then((res) => res.text());

		console.log(base64CredentialId);

		credentialId = Uint8Array.from(atob(base64CredentialId), (c) => c.charCodeAt(0));
	}

	async function login() {
		const { base64AuthenticatorDataBytes, base64ClientDataJSON, base64Signature } =
			await loginWithYubiKey({
				credentialId,
				randomString: randomStringFromServer
			});

		const isVerified = await fetch('/login.json', {
			method: 'POST',
			body: JSON.stringify({
				base64Signature,
				base64ClientDataJSON,
				base64AuthenticatorDataBytes
			}),
			headers: { 'Content-Type': 'application/json' }
		})?.then((res) => res.text());

		console.log(isVerified);
	}
</script>

<div class="flex items-center w-screen h-screen justify-center">
	<div class="flex flex-col gap-3 bg-gray-300 rounded-lg p-10">
		<div>
			<div>Random string from server</div>
			<div>{randomStringFromServer}</div>
		</div>

		<div>
			<button class="bock rounded-full bg-blue-400 px-4 py-2 text-white" on:click={register}
				>Register</button
			>
		</div>

		<div>
			<button class="bock rounded-full bg-blue-400 px-4 py-2 text-white" on:click={login}
				>Login</button
			>
		</div>
	</div>
</div>
