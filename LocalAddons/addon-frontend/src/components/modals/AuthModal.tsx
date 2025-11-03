"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Phone, BookOpen, Calendar } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		username: "",
		mobile: "",
		confirmPassword: "",
		course: "", // New course field
		year: "", // New year field
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);

	const { login, register, isLoading } = useAuthStore();
	const { getCart } = useCartStore();
	const { openForgotPasswordModal } = useModalStore();

	// Validation helper function
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isValidMobile = (mobile: string): boolean => {
		const mobileRegex = /^\d{10}$/;
		return mobileRegex.test(mobile);
	};

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

	// Reset form when modal opens/closes or switches between login/register
	useEffect(() => {
		setFormData({
			email: "",
			password: "",
			username: "",
			mobile: "",
			confirmPassword: "",
			course: "",
			year: "",
		});
		setErrors({});
		setCaptchaToken(null);
	}, [isOpen, isLogin]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!isLogin) {
			if (!formData.username) {
				newErrors.username = "Username is required";
			} else if (formData.username.length < 3) {
				newErrors.username = "Username must be at least 3 characters";
			} else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
				newErrors.username = "Username can only contain letters, numbers, and underscores";
			}
			if (!formData.mobile) {
				newErrors.mobile = "Mobile number is required";
			} else if (!isValidMobile(formData.mobile)) {
				newErrors.mobile = "Please enter a valid 10-digit mobile number";
			}
			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
			}
			// if (!captchaToken) {
			// 	newErrors.captcha = "Please complete the reCAPTCHA verification";
			// }
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		if (isLogin) {
			try {
				await login({
					email: formData.email,
					mobile: "",
					password: formData.password,
				});

				await getCart();
				onClose();
			} catch (error: unknown) {
				// Handle validation errors from API
				const err = error as { validationErrors?: Record<string, string[]> };

				if (err.validationErrors) {
					const validationErrors: Record<string, string> = {};

					// Map API field names to form field names
					const fieldMapping: Record<string, string> = {
						email: "email",
						password: "password",
					};

					// Parse validation errors
					Object.entries(err.validationErrors).forEach(([field, messages]) => {
						const formField = fieldMapping[field] || field;
						if (Array.isArray(messages) && messages.length > 0) {
							validationErrors[formField] = messages[0]; // Take first error message
						}
					});

					setErrors(validationErrors);
				} else {
					setErrors({ general: "Login failed. Please check your credentials." });
				}
			}
		} else {
			try {
				await register({
					username: formData.username,
					email: formData.email,
					mobile: formData.mobile,
					password: formData.password,
					cnf_password: formData.confirmPassword,
					captcha_token: captchaToken,
					course: formData.course,
					year: formData.year,
				});
				onClose();
			} catch (error: unknown) {
				// Handle validation errors from API
				const err = error as { validationErrors?: Record<string, string[]> };

				if (err.validationErrors) {
					const validationErrors: Record<string, string> = {};

					// Map API field names to form field names
					const fieldMapping: Record<string, string> = {
						username: "username",
						mobile: "mobile",
						cnf_password: "confirmPassword",
						email: "email",
						password: "password",
					};

					// Parse validation errors
					Object.entries(err.validationErrors).forEach(([field, messages]) => {
						const formField = fieldMapping[field] || field;
						if (Array.isArray(messages) && messages.length > 0) {
							validationErrors[formField] = messages[0]; // Take first error message
						}
					});

					setErrors(validationErrors);
				} else {
					setErrors({ general: "Registration failed. Please try again." });
				}
			}
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div
			className={`fixed inset-0 z-50 flex ${isLogin ? "items-center" : "items-start sm:items-center"} justify-center bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto p-4`}
			aria-labelledby="auth-dialog-title"
			role="dialog"
			aria-modal="true"
		>
			{/* Overlay */}
			<div className="absolute inset-0" onClick={onClose}></div>

			{/* Mobile-friendly scrollable container */}
			<div className="relative w-full flex items-center justify-center">
				{/* Modal Panel */}
				<div
					className={`relative w-full ${
						isLogin ? "max-w-md" : "max-w-lg lg:max-w-xl"
					} p-6 sm:p-8 bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 animate-fade-in-up`}
				>
					{/* Close Button */}
					<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close dialog">
						<X size={24} />
					</button>

					{/* Header */}
					<div className="text-center mb-6">
						<h2 id="auth-dialog-title" className="text-xl sm:text-2xl font-bold text-white mb-2">
							{isLogin ? "Welcome Back" : "Join Us"}
						</h2>
						<p className="text-slate-400 text-xs sm:text-sm">{isLogin ? "Sign in to access workshops" : "Create your account to start learning"}</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className={`space-y-4 ${!isLogin ? "lg:space-y-5" : ""}`}>
						{/* General Error */}
						{errors.general && (
							<div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
								<p className="text-red-400 text-xs sm:text-sm leading-relaxed">{errors.general}</p>
							</div>
						)}

						{/* Login Fields */}
						{isLogin && (
							<>
								{/* Email Field */}
								<div>
									<label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
										Email Address
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
										<input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
												errors.email ? "border-red-500" : "border-slate-600"
											}`}
											placeholder="Enter your email address"
										/>
									</div>
									{errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
								</div>

								{/* Password Field */}
								<div>
									<label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
										Password
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											value={formData.password}
											onChange={(e) => handleInputChange("password", e.target.value)}
											className={`w-full pl-10 pr-12 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
												errors.password ? "border-red-500" : "border-slate-600"
											}`}
											placeholder="Enter your password"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
									{errors.password && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.password}</p>}
								</div>

								{/* Forgot Password Link */}
								<div className="text-right">
									<button
										type="button"
										onClick={() => {
											onClose();
											openForgotPasswordModal();
										}}
										className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
									>
										Forgot password?
									</button>
								</div>
							</>
						)}

						{/* Registration Fields */}
						{!isLogin && (
							<>
								{/* First Row: Username and Mobile */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{/* Username Field */}
									<div>
										<label htmlFor="username" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Username
										</label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<input
												id="username"
												type="text"
												value={formData.username}
												onChange={(e) => handleInputChange("username", e.target.value)}
												className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.username ? "border-red-500" : "border-slate-600"
												}`}
												placeholder="Choose a username"
											/>
										</div>
										{errors.username && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.username}</p>}
									</div>

									{/* Mobile Field */}
									<div>
										<label htmlFor="mobile" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Mobile Number
										</label>
										<div className="relative">
											<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<input
												id="mobile"
												type="tel"
												value={formData.mobile}
												onChange={(e) => handleInputChange("mobile", e.target.value.replace(/\D/g, ""))} // only digits
												maxLength={10}
												className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.mobile ? "border-red-500" : "border-slate-600"
												}`}
												placeholder="Enter your mobile number"
											/>
										</div>
										{errors.mobile && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.mobile}</p>}
									</div>
								</div>

								{/* Email Field (Full Width) */}
								<div>
									<label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
										Email Address
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
										<input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
												errors.email ? "border-red-500" : "border-slate-600"
											}`}
											placeholder="Enter your email"
										/>
									</div>
									{errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
								</div>

								{/* Password Fields Grid */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{/* Password Field */}
									<div>
										<label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Password
										</label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<input
												id="password"
												type={showPassword ? "text" : "password"}
												value={formData.password}
												onChange={(e) => handleInputChange("password", e.target.value)}
												className={`w-full pl-10 pr-12 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.password ? "border-red-500" : "border-slate-600"
												}`}
												placeholder="Enter your password"
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
											>
												{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
											</button>
										</div>
										{errors.password && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.password}</p>}
									</div>

									{/* Confirm Password Field */}
									<div>
										<label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Confirm Password
										</label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<input
												id="confirmPassword"
												type="password"
												value={formData.confirmPassword}
												onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
												className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.confirmPassword ? "border-red-500" : "border-slate-600"
												}`}
												placeholder="Confirm your password"
											/>
										</div>
										{errors.confirmPassword && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
									</div>
								</div>

								{/* Course and Year Fields */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
									{/* Course Field */}
									<div>
										<label htmlFor="course" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Course
										</label>
										<div className="relative">
											<BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<input
												id="course"
												type="text"
												value={formData.course}
												onChange={(e) => handleInputChange("course", e.target.value)}
												className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.course ? "border-red-500" : "border-slate-600"
												}`}
												placeholder="Enter your course"
											/>
										</div>
										{errors.course && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.course}</p>}
									</div>

									{/* Year Field - Dropdown */}
									<div>
										<label htmlFor="year" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
											Year
										</label>
										<div className="relative">
											<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
											<select
												id="year"
												value={formData.year}
												onChange={(e) => handleInputChange("year", e.target.value)}
												className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
													errors.year ? "border-red-500" : "border-slate-600"
												}`}
											>
												<option value="" disabled className="text-slate-400">
													Select year
												</option>
												<option value="2022">2022</option>
												<option value="2023">2023</option>
												<option value="2024">2024</option>
												<option value="2025">2025</option>
												<option value="2026">2026</option>
												<option value="2027">2027</option>
												<option value="2028">2028</option>
											</select>
										</div>
										{errors.year && <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.year}</p>}
									</div>
								</div>
							</>
						)}

						{/* Google reCAPTCHA (Registration only) */}
						{/* {!isLogin && (
							<div className="flex flex-col items-center py-2">
								<div className="flex justify-center w-full">
									<ReCAPTCHA
										sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY || ""}
										onChange={(token: string | null) => setCaptchaToken(token)}
										onExpired={() => setCaptchaToken(null)}
										onError={() => setCaptchaToken(null)}
										className="transform scale-90 sm:scale-100"
									/>
								</div>
								{errors.captcha && <p className="text-red-400 text-xs sm:text-sm mt-2 text-center">{errors.captcha}</p>}
							</div>
						)} */}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
						>
							{isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
						</button>
					</form>

					{/* Toggle between Login/Register */}
					<div className="mt-5 sm:mt-6 text-center">
						<p className="text-slate-400 text-xs sm:text-sm">
							{isLogin ? "Don't have an account?" : "Already have an account?"}
							<button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
								{isLogin ? "Sign up" : "Sign in"}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
