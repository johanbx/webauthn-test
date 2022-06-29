import cryptoRandomString from 'crypto-random-string';
import type { RequestHandler } from './__types';

export const get: RequestHandler = async () => {
	return {
		body: { randomStringFromServer: cryptoRandomString({ length: 16 }) }
	};
};
