// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
	LOGIN: `${API_BASE_URL}/v1/users/login/`,
	REGISTER: `${API_BASE_URL}/v1/users/register/`,
	PROFILE: `${API_BASE_URL}/v1/users/@me/`,
	RESET_PASSWORD_INITIATE: `${API_BASE_URL}/v1/users/reset-password/initiate/`,
	RESET_PASSWORD_COMPLETE: `${API_BASE_URL}/v1/users/reset-password/complete/`,
} as const;

// Technologies endpoints
export const TECHNOLOGIES_ENDPOINTS = {
	LIST: `${API_BASE_URL}/v1/technologies/`,
} as const;

// Workshop endpoints (using course endpoints since backend treats workshops as courses)
export const WORKSHOP_ENDPOINTS = {
	AVAILABLE: `${API_BASE_URL}/v1/courses/`,
	EXPLORE: `${API_BASE_URL}/v1/technologies/explore/`,
	DETAIL: (slug: string) => `${API_BASE_URL}/v1/courses/${slug}/`,
	ENROLLED: `${API_BASE_URL}/v1/courses/enrolled/`,
	ENROLL: (id: number) => `${API_BASE_URL}/v1/courses/${id}/enroll/`,
	UNENROLL: (id: number) => `${API_BASE_URL}/v1/courses/${id}/unenroll/`,
} as const;

// Cart endpoints
export const CART_ENDPOINTS = {
	GET: `${API_BASE_URL}/v1/cart/`,
	ADD: `${API_BASE_URL}/v1/cart/add/`,
	REMOVE: `${API_BASE_URL}/v1/cart/remove/`,
	CLEAR: `${API_BASE_URL}/v1/cart/clear/`,
	CHECKOUT: `${API_BASE_URL}/v1/cart/checkout/`,
} as const;

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
	VERIFY: `${API_BASE_URL}/v1/payments/verify/`,
} as const;
