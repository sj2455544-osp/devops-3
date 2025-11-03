"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useModalStore } from "@/stores/modalStore";

interface ForgotPasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { initiatePasswordReset } = useAuthStore();
	const { openAuthModal } = useModalStore();

	// Effect to handle the "Escape" key press
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleEsc);

		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	// Prevent scrolling on the body when the modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	// Reset form when modal opens/closes
	useEffect(() => {
		if (isOpen) {
			setEmail("");
			setErrors({});
			setIsSuccess(false);
		}
	}, [isOpen]);

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!email) {
			newErrors.email = "Email is required";
		} else if (!isValidEmail(email)) {
			newErrors.email = "Please enter a valid email";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			await initiatePasswordReset(email);
			setIsSuccess(true);
		} catch (error: unknown) {
			const err = error as { validationErrors?: Record<string, string[]> };

			if (err.validationErrors) {
				const validationErrors: Record<string, string> = {};
				Object.entries(err.validationErrors).forEach(([field, messages]) => {
					if (Array.isArray(messages) && messages.length > 0) {
						validationErrors[field] = messages[0];
					}
				});
				setErrors(validationErrors);
			} else {
				setErrors({ general: "Failed to send reset email. Please try again." });
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto p-4"
			aria-labelledby="forgot-password-dialog-title"
			role="dialog"
			aria-modal="true"
		>
			{/* Overlay */}
			<div className="absolute inset-0" onClick={onClose}></div>

			{/* Mobile-friendly scrollable container */}
			<div className="relative w-full flex items-center justify-center">
				{/* Modal Panel */}
				<div className="relative w-full max-w-md p-6 sm:p-8 bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 animate-fade-in-up">
					{/* Close Button */}
					<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close dialog">
						<X size={24} />
					</button>

					{!isSuccess ? (
						<>
							{/* Header */}
							<div className="text-center mb-6">
								<div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
									<Mail className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
								</div>
								<h2 id="forgot-password-dialog-title" className="text-xl sm:text-2xl font-bold text-white mb-2">
									Forgot Password?
								</h2>
								<p className="text-slate-400 text-sm sm:text-base">No worries! Enter your email and we&apos;ll send you a reset link.</p>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* General Error */}
								{errors.general && (
									<div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
										<p className="text-red-400 text-xs sm:text-sm leading-relaxed">{errors.general}</p>
									</div>
								)}

								{/* Email Field */}
								<div>
									<label htmlFor="reset-email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
										Email Address
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
										<input
											id="reset-email"
											type="email"
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
												if (errors.email) {
													setErrors((prev) => ({ ...prev, email: "" }));
												}
											}}
											className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
												errors.email ? "border-red-500" : "border-slate-600"
											}`}
											placeholder="Enter your email address"
											disabled={isLoading}
										/>
									</div>
									{errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 flex items-center justify-center"
								>
									{isLoading ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
											Sending...
										</>
									) : (
										"Send Reset Link"
									)}
								</button>
							</form>

							{/* Back to Login */}
							<div className="mt-5 sm:mt-6 text-center">
								<button
									type="button"
									onClick={() => {
										onClose();
										openAuthModal();
									}}
									className="text-slate-400 hover:text-cyan-400 text-xs sm:text-sm font-medium transition-colors"
								>
									← Back to login
								</button>
							</div>
						</>
					) : (
						<>
							{/* Success State */}
							<div className="text-center py-3 sm:py-4">
								<div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center">
									<CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
								</div>
								<h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Check Your Email</h2>
								<p className="text-slate-400 text-xs sm:text-sm mb-2">If an account exists with the email:</p>
								<p className="text-cyan-400 font-medium text-sm sm:text-base mb-3 sm:mb-4 break-all px-2">{email}</p>
								<p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
									We&apos;ve sent a password reset link. Please check your inbox and follow the instructions.
								</p>

								<div className="p-3 sm:p-4 bg-slate-800/50 border border-slate-700 rounded-lg mb-4 sm:mb-6">
									<p className="text-slate-300 text-xs sm:text-sm mb-2">
										<strong className="text-white">Important:</strong>
									</p>
									<ul className="text-slate-400 text-xs sm:text-sm space-y-1 text-left">
										<li>• The reset link expires in 30 minutes</li>
										<li>• Check your spam folder if you don&apos;t see it</li>
										<li>• You can close this window</li>
									</ul>
								</div>

								{/* Close Button */}
								<button
									type="button"
									onClick={onClose}
									className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300"
								>
									Got it, thanks!
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
