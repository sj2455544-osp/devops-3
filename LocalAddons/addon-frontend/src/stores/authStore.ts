import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth";
import { AUTH_ENDPOINTS } from "../config/api";
import { useCartStore } from "./cartStore";

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => void;
	checkAuth: () => void;
	updateProfile: (profileData: { username: string; name: string; bio: string }) => Promise<void>;
	updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
	initiatePasswordReset: (email: string) => Promise<void>;
	completePasswordReset: (token: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			login: async (credentials: LoginCredentials) => {
				set({ isLoading: true });
				try {
					const payload: Record<string, string> = { password: credentials.password };
					if (credentials.email) payload.email = credentials.email;
					if (credentials.mobile) payload.mobile = credentials.mobile;

					const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(payload),
					});

					if (!response.ok) {
						// Handle validation errors
						if (response.status === 400) {
							const errorData = await response.json();
							throw { validationErrors: errorData };
						}
						throw new Error("Login failed");
					}

					const data: AuthResponse = await response.json();
					set({
						user: data.user,
						token: data.token.access_token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},
			register: async (credentials: RegisterCredentials) => {
				set({ isLoading: true });
				try {
					const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(credentials),
					});

					if (!response.ok) {
						// Handle validation errors
						if (response.status === 400) {
							const errorData = await response.json();
							throw { validationErrors: errorData };
						}
						throw new Error("Registration failed");
					}

					const data: AuthResponse = await response.json();
					set({
						user: data.user,
						token: data.token.access_token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},
			logout: () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				});
				// Clear all localStorage data on logout
				localStorage.removeItem("auth-storage");
				localStorage.removeItem("cart-store");
			},
			checkAuth: () => {
				const { token, user } = get();
				if (token && user && isTokenValid(token)) {
					set({ isAuthenticated: true });
				} else {
					// Clear invalid state
					set({
						user: null,
						token: null,
						isAuthenticated: false,
					});
				}
			},
			updateProfile: async (profileData: { username: string; name: string; bio: string }) => {
				const { token } = get();
				if (!token) {
					throw new Error("Authentication required");
				}

				try {
					const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(profileData),
					});

					if (!response.ok) {
						if (response.status === 400) {
							const errorData = await response.json();
							throw { validationErrors: errorData };
						}
						throw new Error("Failed to update profile");
					}

					const updatedUser: User = await response.json();
					set({ user: updatedUser });
				} catch (error) {
					throw error;
				}
			},
			updatePassword: async (newPassword: string, confirmPassword: string) => {
				const { token } = get();
				if (!token) {
					throw new Error("Authentication required");
				}

				try {
					const response = await fetch(`${AUTH_ENDPOINTS.PROFILE}change-password/`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							confirm_password: confirmPassword,
							new_password: newPassword,
						}),
					});

					if (!response.ok) {
						if (response.status === 400) {
							const errorData = await response.json();
							if (errorData.current_password) {
								throw new Error("Current password is incorrect");
							}
							if (errorData.new_password) {
								throw new Error("New password does not meet requirements");
							}
							throw new Error("Password update failed");
						}
						throw new Error("Failed to update password");
					}
				} catch (error) {
					throw error;
				}
			},
			initiatePasswordReset: async (email: string) => {
				try {
					const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD_INITIATE, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email: email.toLowerCase() }),
					});

					if (!response.ok) {
						if (response.status === 400) {
							const errorData = await response.json();
							throw { validationErrors: errorData };
						}
						throw new Error("Failed to initiate password reset");
					}
				} catch (error) {
					throw error;
				}
			},
			completePasswordReset: async (token: string, newPassword: string, confirmPassword: string) => {
				try {
					const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD_COMPLETE, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							token,
							new_password: newPassword,
							confirm_password: confirmPassword,
						}),
					});

					if (!response.ok) {
						if (response.status === 400) {
							const errorData = await response.json();
							throw { validationErrors: errorData };
						}
						throw new Error("Failed to reset password");
					}
				} catch (error) {
					throw error;
				}
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
		}
	)
);

// Utility function for token validation
function isTokenValid(token: string): boolean {
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		const currentTime = Date.now() / 1000;
		return payload.exp > currentTime;
	} catch {
		return false;
	}
}
