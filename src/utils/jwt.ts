import jwt_decode, { JwtDecodeOptions } from 'jwt-decode';

export const decodeJwt = (token: string, options?: JwtDecodeOptions) => {
	if (!token) return null;

	return jwt_decode(token, options) || null;
};

export const isAuthenticatedJwt = (token: string) => {
	const data: any = decodeJwt(token);

	if (Date.now() >= data?.exp * 1000) {
		return false;
	}

	return true;
};
