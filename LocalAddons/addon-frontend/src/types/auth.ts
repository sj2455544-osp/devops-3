export interface User {
	id: number;
	avatar: string | null;
	username: string;
	name: string | null;
	email: string;
	bio: string | null;
	mobile: string;
	email_verified: boolean;
	mobile_verified: boolean;
	is_active: boolean;
	user_type: string;
	created_at: string;
	updated_at: string;
}

export interface Token {
	access_token: string;
}

export interface AuthResponse {
	user: User;
	token: Token;
}

export interface LoginCredentials {
	email: string;
	mobile: string;
	password: string;
}

export interface RegisterCredentials {
	username: string;
	email: string;
	mobile: string;
	password: string;
	cnf_password: string;
	captcha_token?: string | null;
	course?: string;
	year?: string;
}
