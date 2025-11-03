import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CART_ENDPOINTS } from "@/config/api";

// Helper function to get auth token
const getAuthToken = (): string | null => {
	try {
		const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}");
		return authStorage.state?.token || null;
	} catch {
		return localStorage.getItem("authToken");
	}
};

export interface Course {
	id: number;
	slug: string;
	title: string;
	description: string;
	level: string;
	thumbnail?: string;
	instructor: {
		id: number;
		name: string;
	};
	duration: string;
	discounted_price: number;
	original_price: number;
	avg_rating?: number;
	is_enrolled: boolean;
	open_for_enrollment: boolean;
}

export interface CartItem {
	id: number;
	product: Course;
	quantity: number;
	added_at: string;
	updated_at: string;
}

export interface Cart {
	id: number;
	user: number;
	items: CartItem[];
	total_items: number;
	created_at: string;
	updated_at: string;
}

interface CartStore {
	cart: Cart | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	addToCart: (courseId: number) => Promise<void>;
	removeFromCart: (courseId: number) => Promise<void>;
	clearCart: () => Promise<void>;
	getCart: () => Promise<void>;

	// Selectors
	isInCart: (courseId: number) => boolean;
	getTotalItems: () => number;
	getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			cart: null,
			isLoading: false,
			error: null,

			addToCart: async (courseId: number) => {
				const token = getAuthToken();
				if (!token) {
					throw new Error("Authentication required");
				}
				set({ isLoading: true, error: null });

				try {
					const response = await fetch(CART_ENDPOINTS.ADD, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ product_id: courseId }),
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						if (response.status === 400 && errorData.message === "Enrollment for this course is closed") {
							throw new Error("ENROLLMENT_CLOSED");
						}
						if (response.status === 404) {
							throw new Error("ENROLLMENT_NOT_ACTIVE");
						}
						throw new Error(errorData.message || "Failed to add to cart");
					}

					// Refresh cart after adding
					await get().getCart();
				} catch (error) {
					console.error("Add to cart error:", error);
					set({ error: error instanceof Error ? error.message : "Failed to add to cart" });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			removeFromCart: async (courseId: number) => {
				const token = getAuthToken();
				if (!token) {
					throw new Error("Authentication required");
				}
				set({ isLoading: true, error: null });

				try {
					const response = await fetch(CART_ENDPOINTS.REMOVE, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ product_id: courseId }),
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						throw new Error(errorData.message || "Failed to remove from cart");
					}

					// Refresh cart after removing
					await get().getCart();
				} catch (error) {
					console.error("Remove from cart error:", error);
					set({ error: error instanceof Error ? error.message : "Failed to remove from cart" });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			clearCart: async () => {
				const token = getAuthToken();
				if (!token) {
					set({ cart: null });
					return;
				}
				set({ isLoading: true, error: null });

				try {
					const response = await fetch(CART_ENDPOINTS.CLEAR, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						throw new Error(errorData.message || "Failed to clear cart");
					}

					set({ cart: null });
				} catch (error) {
					console.error("Clear cart error:", error);
					set({ error: error instanceof Error ? error.message : "Failed to clear cart" });
					throw error;
				} finally {
					set({ isLoading: false });
				}
			},

			getCart: async () => {
				const token = getAuthToken();
				if (!token) {
					set({ cart: null });
					return;
				}

				set({ isLoading: true, error: null });

				try {
					const response = await fetch(CART_ENDPOINTS.GET, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (!response.ok) {
						if (response.status === 401) {
							set({ cart: null });
							return;
						}
						const errorData = await response.json().catch(() => ({}));
						throw new Error(errorData.message || "Failed to fetch cart");
					}

					const cartData = await response.json();
					set({ cart: cartData });
				} catch (error) {
					console.error("Fetch cart error:", error);
					set({ error: error instanceof Error ? error.message : "Failed to fetch cart" });
				} finally {
					set({ isLoading: false });
				}
			},

			// Selectors
			isInCart: (courseId: number) => {
				const { cart } = get();
				return cart?.items?.some((item) => item.product.id === courseId) || false;
			},

			getTotalItems: () => {
				const { cart } = get();
				return cart?.total_items || 0;
			},

			getTotalPrice: () => {
				const { cart } = get();
				return cart?.items?.reduce((total, item) => total + item.product.discounted_price * item.quantity, 0) || 0;
			},
		}),
		{
			name: "cart-store",
			partialize: (state) => ({ cart: state.cart }),
		}
	)
);
