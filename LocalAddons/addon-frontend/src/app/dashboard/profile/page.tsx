"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "../../../stores/authStore";
import { User, Mail, Smartphone, Calendar, Lock, Save, X, Check, Edit3, Shield, UserCircle, FileText } from "lucide-react";
import { format } from "date-fns";

interface ProfileFormData {
	username: string;
	name: string;
	bio: string;
}

interface FormErrors {
	username?: string;
	name?: string;
	bio?: string;
	general?: string;
	[key: string]: string | undefined;
}

interface PasswordFormData {
	newPassword: string;
	confirmPassword: string;
}

interface PasswordErrors {
	newPassword?: string;
	confirmPassword?: string;
	general?: string;
	[key: string]: string | undefined;
}

const ProfilePage = () => {
	const { user, updateProfile, updatePassword } = useAuthStore();
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

	const [profileForm, setProfileForm] = useState<ProfileFormData>({
		username: "",
		name: "",
		bio: "",
	});

	const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (user) {
			setProfileForm({
				username: user.username || "",
				name: user.name || "",
				bio: user.bio || "",
			});
		}
	}, [user]);

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setMessage("");

		try {
			await updateProfile(profileForm);
			setMessage("Profile updated successfully!");
			setIsEditing(false);
			setFormErrors({});
			setTimeout(() => setMessage(""), 3000);
		} catch (err: unknown) {
			// Handle validation errors from API
			const error = err as { validationErrors?: Record<string, string[]> };

			if (error.validationErrors) {
				const validationErrors: FormErrors = {};

				// Map API field names to form field names
				const fieldMapping: Record<string, string> = {
					username: "username",
					name: "name",
					bio: "bio",
					email: "email",
				};

				// Parse validation errors
				Object.entries(error.validationErrors).forEach(([field, messages]) => {
					const formField = fieldMapping[field] || field;
					if (Array.isArray(messages) && messages.length > 0) {
						validationErrors[formField] = messages[0]; // Take first error message
					}
				});

				// Handle non_field_errors
				if (error.validationErrors.non_field_errors && Array.isArray(error.validationErrors.non_field_errors)) {
					validationErrors.general = error.validationErrors.non_field_errors[0];
				}

				setFormErrors(validationErrors);
				if (validationErrors.general) {
					setError(validationErrors.general);
				}
			} else {
				setError(err instanceof Error ? err.message : "Failed to update profile");
			}
			setTimeout(() => {
				setError("");
				setFormErrors({});
			}, 8000);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordLoading(true);
		setError("");
		setMessage("");
		setPasswordErrors({});

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPasswordErrors({ confirmPassword: "New passwords do not match" });
			setPasswordLoading(false);
			return;
		}

		if (passwordForm.newPassword.length < 8) {
			setPasswordErrors({ newPassword: "New password must be at least 8 characters long" });
			setPasswordLoading(false);
			return;
		}

		try {
			await updatePassword(passwordForm.newPassword, passwordForm.confirmPassword);
			setMessage("Password updated successfully!");
			setIsChangingPassword(false);
			setPasswordForm({
				newPassword: "",
				confirmPassword: "",
			});
			setPasswordErrors({});
			setTimeout(() => setMessage(""), 3000);
		} catch (err: unknown) {
			// Handle validation errors from API
			const error = err as { validationErrors?: Record<string, string[]> };

			if (error.validationErrors) {
				const validationErrors: PasswordErrors = {};

				// Map API field names to form field names
				const fieldMapping: Record<string, string> = {
					old_password: "currentPassword",
					new_password1: "newPassword",
					new_password2: "confirmPassword",
				};

				// Parse validation errors
				Object.entries(error.validationErrors).forEach(([field, messages]) => {
					const formField = fieldMapping[field] || field;
					if (Array.isArray(messages) && messages.length > 0) {
						validationErrors[formField] = messages[0]; // Take first error message
					}
				});

				// Handle non_field_errors
				if (error.validationErrors.non_field_errors && Array.isArray(error.validationErrors.non_field_errors)) {
					validationErrors.general = error.validationErrors.non_field_errors[0];
				}

				setPasswordErrors(validationErrors);
				if (validationErrors.general) {
					setError(validationErrors.general);
				}
			} else {
				setError(err instanceof Error ? err.message : "Failed to update password");
			}
			setTimeout(() => {
				setError("");
				setPasswordErrors({});
			}, 8000);
		} finally {
			setPasswordLoading(false);
		}
	};

	const handleCancelEdit = () => {
		if (user) {
			setProfileForm({
				username: user.username || "",
				name: user.name || "",
				bio: user.bio || "",
			});
		}
		setIsEditing(false);
		setError("");
	};

	const handleCancelPasswordChange = () => {
		setPasswordForm({
			newPassword: "",
			confirmPassword: "",
		});
		setPasswordErrors({});
		setIsChangingPassword(false);
		setError("");
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-white text-center">
					<div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p>Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Profile Settings</h1>
					<p className="text-slate-400">Manage your account settings and preferences</p>
				</div>

				{/* Success/Error Messages */}
				{message && (
					<div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
						<Check className="w-5 h-5 text-green-400" />
						<span className="text-green-400">{message}</span>
					</div>
				)}

				{error && (
					<div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
						<X className="w-5 h-5 text-red-400" />
						<span className="text-red-400">{error}</span>
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Profile Overview */}
					<div className="lg:col-span-1">
						<div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
							<div className="text-center">
								{/* Avatar */}
								<div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
									{user.avatar ? (
										<Image src={user.avatar} alt={user.name || user.username} width={96} height={96} className="w-full h-full rounded-full object-cover" />
									) : (
										<User className="w-12 h-12 text-white" />
									)}
								</div>

								<h2 className="text-xl font-bold text-white mb-1">{user.name || user.username}</h2>
								<p className="text-slate-400 mb-4">@{user.username}</p>

								{user.bio && <p className="text-sm text-slate-300 italic">{user.bio}</p>}
							</div>

							<div className="mt-6 space-y-3">
								<div className="flex items-center gap-3 text-sm">
									<Mail className="w-4 h-4 text-slate-400" />
									<span className="text-slate-300">{user.email}</span>
									{user.email_verified && <Check className="w-4 h-4 text-green-400" />}
								</div>

								<div className="flex items-center gap-3 text-sm">
									<Smartphone className="w-4 h-4 text-slate-400" />
									<span className="text-slate-300">{user.mobile}</span>
									{user.mobile_verified && <Check className="w-4 h-4 text-green-400" />}
								</div>

								<div className="flex items-center gap-3 text-sm">
									<Calendar className="w-4 h-4 text-slate-400" />
									<span className="text-slate-300">Joined {format(new Date(user.created_at), "MMM yyyy")}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Profile Settings */}
					<div className="lg:col-span-2 space-y-8">
						{/* Personal Information */}
						<div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<UserCircle className="w-6 h-6 text-cyan-400" />
									<h3 className="text-xl font-semibold text-white">Personal Information</h3>
								</div>
								{!isEditing && (
									<button
										onClick={() => setIsEditing(true)}
										className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
									>
										<Edit3 className="w-4 h-4" />
										Edit Profile
									</button>
								)}
							</div>

							<form onSubmit={handleProfileSubmit}>
								{/* General Error Display */}
								{formErrors.general && (
									<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
										<p className="text-red-400 text-sm">{formErrors.general}</p>
									</div>
								)}

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
											<User className="w-4 h-4" />
											Username
										</label>
										<input
											type="text"
											value={profileForm.username}
											onChange={(e) => {
												setProfileForm({ ...profileForm, username: e.target.value });
												if (formErrors.username) {
													setFormErrors({ ...formErrors, username: undefined });
												}
											}}
											disabled={!isEditing}
											className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
												formErrors.username ? "border-red-500" : "border-slate-700"
											}`}
											placeholder="Enter username"
										/>
										{formErrors.username && <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>}
									</div>

									<div>
										<label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
											<UserCircle className="w-4 h-4" />
											Full Name
										</label>
										<input
											type="text"
											value={profileForm.name}
											onChange={(e) => {
												setProfileForm({ ...profileForm, name: e.target.value });
												if (formErrors.name) {
													setFormErrors({ ...formErrors, name: undefined });
												}
											}}
											disabled={!isEditing}
											className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
												formErrors.name ? "border-red-500" : "border-slate-700"
											}`}
											placeholder="Enter full name"
										/>
										{formErrors.name && <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>}
									</div>
								</div>

								<div className="mt-6">
									<label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
										<FileText className="w-4 h-4" />
										Bio
									</label>
									<textarea
										value={profileForm.bio}
										onChange={(e) => {
											setProfileForm({ ...profileForm, bio: e.target.value });
											if (formErrors.bio) {
												setFormErrors({ ...formErrors, bio: undefined });
											}
										}}
										disabled={!isEditing}
										rows={4}
										className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none ${
											formErrors.bio ? "border-red-500" : "border-slate-700"
										}`}
										placeholder="Tell us about yourself..."
									/>
									{formErrors.bio && <p className="mt-1 text-sm text-red-400">{formErrors.bio}</p>}
									<p className="mt-1 text-xs text-slate-500">{profileForm.bio.length}/500 characters</p>
								</div>

								{isEditing && (
									<div className="flex gap-3 mt-6">
										<button
											type="submit"
											disabled={isLoading}
											className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isLoading ? (
												<>
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													Saving...
												</>
											) : (
												<>
													<Save className="w-4 h-4" />
													Save Changes
												</>
											)}
										</button>
										<button type="button" onClick={handleCancelEdit} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
											Cancel
										</button>
									</div>
								)}
							</form>
						</div>

						{/* Password Change */}
						<div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<Shield className="w-6 h-6 text-cyan-400" />
									<h3 className="text-xl font-semibold text-white">Security Settings</h3>
								</div>
								{!isChangingPassword && (
									<button
										onClick={() => setIsChangingPassword(true)}
										className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
									>
										<Lock className="w-4 h-4" />
										Change Password
									</button>
								)}
							</div>

							{isChangingPassword ? (
								<form onSubmit={handlePasswordSubmit}>
									{/* Password General Error Display */}
									{passwordErrors.general && (
										<div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
											<p className="text-red-400 text-sm">{passwordErrors.general}</p>
										</div>
									)}

									<div className="space-y-6">
										<div>
											<label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
												<Lock className="w-4 h-4" />
												New Password
											</label>
											<input
												type="password"
												value={passwordForm.newPassword}
												onChange={(e) => {
													setPasswordForm({ ...passwordForm, newPassword: e.target.value });
													if (passwordErrors.newPassword) {
														setPasswordErrors({ ...passwordErrors, newPassword: undefined });
													}
												}}
												className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
													passwordErrors.newPassword ? "border-red-500" : "border-slate-700"
												}`}
												placeholder="Enter new password"
												required
												minLength={8}
											/>
											{passwordErrors.newPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>}
										</div>

										<div>
											<label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
												<Shield className="w-4 h-4" />
												Confirm New Password
											</label>
											<input
												type="password"
												value={passwordForm.confirmPassword}
												onChange={(e) => {
													setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
													if (passwordErrors.confirmPassword) {
														setPasswordErrors({ ...passwordErrors, confirmPassword: undefined });
													}
												}}
												className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
													passwordErrors.confirmPassword ? "border-red-500" : "border-slate-700"
												}`}
												placeholder="Confirm new password"
												required
												minLength={8}
											/>
											{passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>}
										</div>
									</div>

									<div className="flex gap-3 mt-6">
										<button
											type="submit"
											disabled={passwordLoading}
											className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{passwordLoading ? (
												<>
													<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
													Updating...
												</>
											) : (
												<>
													<Shield className="w-4 h-4" />
													Update Password
												</>
											)}
										</button>
										<button
											type="button"
											onClick={handleCancelPasswordChange}
											className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
										>
											Cancel
										</button>
									</div>
								</form>
							) : (
								<p className="text-slate-400">Keep your account secure by using a strong password.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
