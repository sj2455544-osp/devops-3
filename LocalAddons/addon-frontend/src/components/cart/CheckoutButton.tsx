"use client";

import React, { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { CART_ENDPOINTS } from "@/config/api";
import { CreditCard, Loader2, AlertCircle, X } from "lucide-react";

interface CheckoutButtonProps {
	totalPrice?: number;
}

const CheckoutButton = ({ totalPrice: propTotalPrice }: CheckoutButtonProps = {}) => {
	const { cart, getTotalPrice } = useCartStore();
	const { user } = useAuthStore();
	const [isProcessing, setIsProcessing] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const totalPrice = propTotalPrice ?? getTotalPrice();
	const hasItems = cart && cart.items && cart.items.length > 0;

	// Helper function to get auth token
	const getAuthToken = (): string | null => {
		try {
			const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}");
			return authStorage.state?.token || null;
		} catch {
			return localStorage.getItem("authToken");
		}
	};

	const handleCheckout = async () => {
		if (!hasItems) return;

		// Check if all courses are available for enrollment
		const unavailableCourses = cart?.items?.filter((item) => !item.product.open_for_enrollment) || [];

		if (unavailableCourses.length > 0) {
			const courseNames = unavailableCourses.map((item) => item.product.title).join(", ");
			setErrorMessage(`The following courses are not currently available for enrollment: ${courseNames}. Please remove them from your cart to continue.`);
			setShowErrorModal(true);
			return;
		}

		setIsProcessing(true);

		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Authentication required");
			}

			// Calculate final price based on user type
			const isCimageUser = user?.email?.endsWith("cimage.in") || false;
			const finalAmount = isCimageUser ? propTotalPrice : totalPrice;

			// Call the checkout API endpoint
			const response = await fetch(CART_ENDPOINTS.CHECKOUT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					amount: finalAmount,
					payment_method: "razorpay", // You can make this dynamic later
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Checkout failed");
			}

			const checkoutResult = await response.json();
			console.log("Checkout response:", checkoutResult);

			// Redirect to payment_url (backend will handle the rest)
			if (checkoutResult.payment_url) {
				console.log("Redirecting to payment URL:", checkoutResult.payment_url);
				window.location.href = checkoutResult.payment_url;
				return;
			}

			// If no payment_url, throw error
			throw new Error("No payment URL received from server");
		} catch (error) {
			console.error("Checkout error:", error);

			// Enhanced error messages based on error type
			let displayMessage = "There was an issue processing your payment. Please try again.";

			if (error instanceof Error) {
				const message = error.message.toLowerCase();

				if (message.includes("network") || message.includes("fetch")) {
					displayMessage = "Network error. Please check your internet connection and try again.";
				} else if (message.includes("authentication") || message.includes("unauthorized")) {
					displayMessage = "Authentication expired. Please log in again.";
				} else if (message.includes("insufficient") || message.includes("balance")) {
					displayMessage = "Insufficient balance or payment method issue. Please check your payment details.";
				} else if (message.includes("timeout")) {
					displayMessage = "Request timeout. Please try again.";
				} else if (error.message) {
					displayMessage = error.message;
				}
			}

			setErrorMessage(displayMessage);
			setShowErrorModal(true);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleCloseErrorModal = () => {
		setShowErrorModal(false);
		setErrorMessage("");
	};

	return (
		<div className="w-full">
			<button
				onClick={handleCheckout}
				disabled={!hasItems || isProcessing}
				className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
					!hasItems || isProcessing ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
				}`}
			>
				{isProcessing ? (
					<>
						<Loader2 className="w-5 h-5 mr-2 animate-spin" />
						Initiating Payment...
					</>
				) : (
					<>
						<CreditCard className="w-5 h-5 mr-2" />
						{hasItems ? `Proceed to Payment (₹${totalPrice})` : "Cart is Empty"}
					</>
				)}
			</button>

			{!hasItems && <p className="text-sm text-slate-500 text-center mt-2">Add courses to your cart to proceed with checkout</p>}

			{/* Error Modal */}
			{showErrorModal && (
				<div className="fixed inset-0 bg-black/80 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto">
					<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 my-8 sm:my-4 shadow-2xl relative">
						<div className="text-center">
							{/* Close Button */}
							<button onClick={handleCloseErrorModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-300 transition-colors">
								<X className="w-5 h-5" />
							</button>

							{/* Error Icon */}
							<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 border border-red-500/50 mb-6">
								<AlertCircle className="h-8 w-8 text-red-400" />
							</div>

							{/* Title */}
							<h3 className="text-2xl font-bold text-white mb-3">Checkout Failed</h3>

							{/* Error Message */}
							<p className="text-slate-300 mb-8 leading-relaxed">{errorMessage}</p>

							{/* Action Button */}
							<button onClick={handleCloseErrorModal} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
								Try Again
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CheckoutButton;
