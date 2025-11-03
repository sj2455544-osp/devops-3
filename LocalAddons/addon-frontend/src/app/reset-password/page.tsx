"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

function ResetPasswordContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token");

	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { completePasswordReset } = useAuthStore();

	useEffect(() => {
		if (!token) {
			setErrors({ general: "Invalid or missing reset token. Please request a new password reset link." });
		}
	}, [token]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.newPassword) {
			newErrors.newPassword = "Password is required";
		} else if (formData.newPassword.length < 8) {
			newErrors.newPassword = "Password must be at least 8 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			setErrors({ general: "Invalid or missing reset token." });
			return;
		}

		if (!validateForm()) return;

		setIsLoading(true);
		setErrors({});

		try {
			await completePasswordReset(token, formData.newPassword, formData.confirmPassword);
			setIsSuccess(true);

			// Redirect to home page after 3 seconds
			setTimeout(() => {
				router.push("/");
			}, 3000);
		} catch (error: unknown) {
			const err = error as { validationErrors?: Record<string, string[]> };

			if (err.validationErrors) {
				const validationErrors: Record<string, string> = {};
				Object.entries(err.validationErrors).forEach(([field, messages]) => {
					if (Array.isArray(messages) && messages.length > 0) {
						if (field === "detail") {
							validationErrors.general = messages[0];
						} else {
							validationErrors[field] = messages[0];
						}
					}
				});

				// Handle specific error format
				if (err.validationErrors.detail) {
					validationErrors.general = Array.isArray(err.validationErrors.detail) ? err.validationErrors.detail[0] : String(err.validationErrors.detail);
				}

				setErrors(validationErrors);
			} else {
				setErrors({ general: "Failed to reset password. Please try again or request a new reset link." });
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{!isSuccess ? (
					<div className="bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 p-6 sm:p-8">
						{/* Header */}
						<div className="text-center mb-6">
							<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
								<KeyRound className="w-8 h-8 text-cyan-400" />
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Your Password</h1>
							<p className="text-slate-400 text-sm">Enter your new password below</p>
						</div>

						{/* Error Alert */}
						{errors.general && (
							<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start">
								<AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
								<div>
									<p className="text-red-400 text-sm font-medium mb-1">Error</p>
									<p className="text-red-400/80 text-sm">{errors.general}</p>
								</div>
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* New Password Field */}
							<div>
								<label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
									New Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
									<input
										id="newPassword"
										type={showPassword ? "text" : "password"}
										value={formData.newPassword}
										onChange={(e) => handleInputChange("newPassword", e.target.value)}
										className={`w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
											errors.newPassword || errors.new_password ? "border-red-500" : "border-slate-600"
										}`}
										placeholder="Enter your new password"
										disabled={isLoading || !token}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
										tabIndex={-1}
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{(errors.newPassword || errors.new_password) && <p className="text-red-400 text-sm mt-1">{errors.newPassword || errors.new_password}</p>}
								<p className="text-slate-500 text-xs mt-1">Must be at least 8 characters</p>
							</div>

							{/* Confirm Password Field */}
							<div>
								<label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
									Confirm New Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
									<input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										value={formData.confirmPassword}
										onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
										className={`w-full pl-10 pr-12 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
											errors.confirmPassword || errors.confirm_password ? "border-red-500" : "border-slate-600"
										}`}
										placeholder="Confirm your new password"
										disabled={isLoading || !token}
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
										tabIndex={-1}
									>
										{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
								{(errors.confirmPassword || errors.confirm_password) && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword || errors.confirm_password}</p>}
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isLoading || !token}
								className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 flex items-center justify-center mt-6"
							>
								{isLoading ? (
									<>
										<Loader2 className="w-5 h-5 mr-2 animate-spin" />
										Resetting Password...
									</>
								) : (
									"Reset Password"
								)}
							</button>
						</form>

						{/* Back to Login Link */}
						<div className="mt-6 text-center">
							<Link href="/" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">
								← Back to home
							</Link>
						</div>
					</div>
				) : (
					<div className="bg-slate-900 rounded-2xl shadow-2xl shadow-green-500/10 border border-slate-800 p-6 sm:p-8">
						{/* Success State */}
						<div className="text-center py-4">
							<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center">
								<CheckCircle className="w-8 h-8 text-green-400" />
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Password Reset Successful!</h1>
							<p className="text-slate-400 text-sm mb-6">Your password has been successfully reset. You can now log in with your new password.</p>

							<div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg mb-6">
								<p className="text-slate-300 text-sm">Redirecting you to the home page...</p>
							</div>

							{/* Manual Navigation */}
							<Link
								href="/"
								className="inline-block w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-md shadow-cyan-500/20"
							>
								Go to Home
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
				</div>
			}
		>
			<ResetPasswordContent />
		</Suspense>
	);
}
