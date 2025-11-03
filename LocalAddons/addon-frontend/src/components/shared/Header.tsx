"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Menu, LogOut, User, Award, Settings } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import AuthModal from "@/components/modals/AuthModal";
import HeaderCartIcon from "../cart/HeaderCartIcon";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { isAuthenticated, user, logout, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsAvatarDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Generate initials from user name or username
	const getInitials = (name: string | null, username: string) => {
		if (name) {
			return name
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase())
				.slice(0, 2)
				.join("");
		}
		return username.charAt(0).toUpperCase();
	};

	const menuItems = [
		{ name: "Home", href: "/#home" },
		{ name: "Features", href: "/#features" },
		{ name: "Trainers", href: "/#trainers" },
		{ name: "Workshops", href: "/#courses" },
		{ name: "Contact", href: "/#contact" },
	];

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-emerald-500/20">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						{/* Logo Section */}
						<div className="flex items-center">
							<Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
								<Image src="/cimage.webp" alt="CIMAGE Logo" width={200} height={48} className="h-12 w-auto filter brightness-150" />
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center space-x-8">
							{menuItems.map((item, index) => (
								<a
									key={index}
									href={item.href}
									className="text-slate-300 hover:text-amber-300 px-3 py-2 rounded-md text-sm font-medium transition-colors tracking-wide uppercase relative group"
								>
									{item.name}
									<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
								</a>
							))}
						</div>

						{/* CTA and Mobile Menu Button */}
						<div className="flex items-center space-x-4">
							{/* Show different buttons based on auth status */}
							{isAuthenticated ? (
								<>
									{/* Cart Icon - Always visible when authenticated */}
									<HeaderCartIcon />
									<div className="hidden lg:flex items-center space-x-3">
										{/* Avatar Dropdown */}
										<div className="relative" ref={dropdownRef}>
											<button
												onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
												className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
											>
												{user?.avatar ? (
													<Image src={user.avatar} alt={user.name || user.username} width={40} height={40} className="w-full h-full rounded-full object-cover" />
												) : (
													<span className="text-white font-bold text-sm">{getInitials(user?.name || null, user?.username || "U")}</span>
												)}
											</button>

											{/* Dropdown Menu */}
											{isAvatarDropdownOpen && (
												<div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
													{/* User Info Header */}
													<div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600">
														<div className="flex items-center space-x-3">
															<div className="flex-shrink-0">
																{user?.avatar ? (
																	<Image src={user.avatar} alt={user.name || user.username} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
																) : (
																	<div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
																		<span className="text-white font-bold text-sm">{getInitials(user?.name || null, user?.username || "U")}</span>
																	</div>
																)}
															</div>
															<div className="min-w-0 flex-1">
																<p className="text-sm font-medium text-white truncate">{user?.name || user?.username}</p>
																<p className="text-xs text-slate-400 truncate">{user?.email}</p>
															</div>
														</div>
													</div>

													{/* Menu Items */}
													<div className="py-1">
														<Link
															href="/dashboard"
															onClick={() => setIsAvatarDropdownOpen(false)}
															className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
														>
															<Settings className="w-4 h-4 mr-3" />
															Dashboard
														</Link>

														<Link
															href="/dashboard/profile"
															onClick={() => setIsAvatarDropdownOpen(false)}
															className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
														>
															<User className="w-4 h-4 mr-3" />
															Profile
														</Link>
														<Link
															href="/dashboard/enrolled-courses"
															onClick={() => setIsAvatarDropdownOpen(false)}
															className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
														>
															<Award className="w-4 h-4 mr-3" />
															My Courses
														</Link>
													</div>

													{/* Logout */}
													<div className="border-t border-slate-700">
														<button
															onClick={() => {
																logout();
																setIsAvatarDropdownOpen(false);
															}}
															className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
														>
															<LogOut className="w-4 h-4 mr-3" />
															Sign out
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
								</>
							) : (
								<button
									onClick={() => setIsAuthModalOpen(true)}
									className="hidden lg:inline-block bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 uppercase tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transform"
								>
									Join US
								</button>
							)}

							{/* Mobile Menu Button - visible only on mobile */}
							<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-emerald-300 hover:text-amber-300 transition-colors p-2" aria-label="Open menu">
								{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
							</button>
						</div>
					</div>

					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-emerald-500/20 shadow-2xl">
							<div className="px-4 py-6 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
								{menuItems.map((item, index) => (
									<a
										key={index}
										href={item.href}
										onClick={() => setIsMenuOpen(false)}
										className="block text-slate-300 hover:text-amber-300 px-4 py-3 rounded-lg text-base font-medium transition-colors tracking-wide uppercase hover:bg-slate-800/50"
									>
										{item.name}
									</a>
								))}
								<div className="pt-4 border-t border-slate-700">
									{isAuthenticated ? (
										<div className="space-y-3">
											{/* Mobile User Profile */}
											<div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-lg">
												<div className="flex-shrink-0">
													{user?.avatar ? (
														<Image src={user.avatar} alt={user.name || user.username} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
													) : (
														<div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center">
															<span className="text-white font-bold text-sm">{getInitials(user?.name || null, user?.username || "U")}</span>
														</div>
													)}
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-white truncate">{user?.name || user?.username}</p>
													<p className="text-xs text-slate-400 truncate">{user?.email}</p>
												</div>
											</div>

											{/* Mobile Menu Items */}
											<Link
												href="/dashboard"
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center w-full bg-slate-800/30 hover:bg-slate-700/50 text-white px-4 py-3 rounded-lg text-base font-medium transition-all"
											>
												<User className="w-5 h-5 mr-3" />
												Dashboard
											</Link>

											<Link
												href="/dashboard/profile"
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center w-full bg-slate-800/30 hover:bg-slate-700/50 text-white px-4 py-3 rounded-lg text-base font-medium transition-all"
											>
												<Settings className="w-5 h-5 mr-3" />
												Profile
											</Link>
											<Link
												href="/dashboard/enrolled-courses"
												onClick={() => setIsMenuOpen(false)}
												className="flex items-center w-full bg-slate-800/30 hover:bg-slate-700/50 text-white px-4 py-3 rounded-lg text-base font-medium transition-all"
											>
												<Award className="w-5 h-5 mr-3" />
												My Courses
											</Link>
											<button
												onClick={() => {
													logout();
													setIsMenuOpen(false);
												}}
												className="flex items-center w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-base font-medium transition-all border border-red-500/20"
											>
												<LogOut className="w-5 h-5 mr-3" />
												Sign out
											</button>
										</div>
									) : (
										<button
											onClick={() => setIsAuthModalOpen(true)}
											className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-6 py-3 rounded-full text-base font-bold transition-all duration-300 uppercase tracking-wide"
										>
											Register Now
										</button>
									)}
								</div>
							</div>
						</div>
					)}
				</nav>
			</header>

			<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
		</>
	);
};

export default Header;
