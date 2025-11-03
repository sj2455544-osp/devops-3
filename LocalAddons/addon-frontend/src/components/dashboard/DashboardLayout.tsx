"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, LogOut, Menu, X, ChevronRight, Users, User, ShoppingCart, Search, BookOpen } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "@/stores/cartStore";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

interface NavigationItemProps {
	item: {
		name: string;
		href: string;
		icon: React.ComponentType<{ size: number; className?: string }>;
		current: boolean;
		disabled?: boolean;
		badge?: number | null;
	};
	setSidebarOpen: (open: boolean) => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, setSidebarOpen }) => {
	const Icon = item.icon;
	const isDisabled = item.disabled;

	if (isDisabled) {
		return (
			<div className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-not-allowed opacity-50">
				<Icon size={18} className="mr-3 text-slate-500" />
				<span className="flex-1 text-slate-500">{item.name}</span>
				<span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded-full">Soon</span>
			</div>
		);
	}

	return (
		<Link
			href={item.href}
			onClick={() => setSidebarOpen(false)}
			className={`
				group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
				${item.current ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-slate-300 hover:bg-slate-700 hover:text-white"}
				cursor-pointer
			`}
		>
			<Icon size={18} className={`mr-3 transition-colors ${item.current ? "text-cyan-400" : "text-slate-400 group-hover:text-white"}`} />
			<span className="flex-1">{item.name}</span>
			{item.badge && (
				<span className="bg-cyan-500 text-white text-xs font-bold min-w-[1.25rem] h-5 rounded-full flex items-center justify-center px-1">{item.badge > 99 ? "99+" : item.badge}</span>
			)}
			{item.current && <ChevronRight size={16} className="text-cyan-400 ml-2" />}
		</Link>
	);
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	const { user, logout, isAuthenticated } = useAuthStore();
	const { getTotalItems, getCart, cart } = useCartStore();

	// Initialize cart when user is authenticated
	useEffect(() => {
		if (isAuthenticated) {
			// Only fetch cart if we don't have it yet
			if (!cart) {
				getCart();
			}
		}
	}, [isAuthenticated, getCart, cart]);

	// Safely get total items count
	const getCartItemCount = () => {
		try {
			return getTotalItems();
		} catch (error) {
			console.warn("Error getting cart items:", error);
			return 0;
		}
	};

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

	const navigation = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: Home,
			current: pathname === "/dashboard",
			section: "main",
		},
		{
			name: "Browse Workshops",
			href: "/#courses",
			icon: Search,
			current: pathname === "/#courses",
			section: "learning",
		},
		{
			name: "My Courses",
			href: "/dashboard/enrolled-courses",
			icon: BookOpen,
			current: pathname === "/dashboard/enrolled-courses",
			section: "learning",
		},
		{
			name: "Cart",
			href: "/dashboard/cart",
			icon: ShoppingCart,
			current: pathname === "/dashboard/cart",
			section: "shopping",
			badge: (() => {
				const itemCount = getCartItemCount();
				return itemCount > 0 ? itemCount : null;
			})(),
		},
		{
			name: "Profile",
			href: "/dashboard/profile",
			icon: User,
			current: pathname === "/dashboard/profile",
			section: "account",
		},
		{
			name: "Community",
			href: "/dashboard/community",
			icon: Users,
			current: pathname === "/dashboard/community",
			section: "account",
			disabled: true,
		},
	];

	// Group navigation items by section
	const navigationSections = {
		main: navigation.filter((item) => item.section === "main"),
		learning: navigation.filter((item) => item.section === "learning"),
		shopping: navigation.filter((item) => item.section === "shopping"),
		account: navigation.filter((item) => item.section === "account"),
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="h-screen bg-slate-950 flex w-full overflow-hidden">
			{/* Mobile sidebar overlay */}
			{sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

			{/* Sidebar */}
			<div
				className={`
					fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
					lg:relative lg:translate-x-0
					${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
					${sidebarOpen ? "block" : "hidden lg:block"}
				`}
			>
				{/* Sidebar Header */}
				<div className="flex items-center justify-between h-20 px-4 border-b border-slate-800">
					<Link href="/" className="flex items-center justify-center w-full">
						<Image src="/cimage.webp" alt="CIMAGE Logo" width={224} height={60} className="w-full max-w-56 h-auto object-contain" />
					</Link>
					<button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white absolute top-4 right-4">
						<X size={24} />
					</button>
				</div>

				{/* User Info */}
				<div className="px-6 py-4 border-b border-slate-800">
					<div className="flex items-center space-x-3">
						{user?.avatar ? (
							<Image src={user.avatar} alt={user.name || user.username} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
						) : (
							<div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
								<span className="text-white font-semibold text-sm">{getInitials(user?.name || null, user?.username || "U")}</span>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">{user?.name || user?.username}</p>
							<p className="text-xs text-slate-400 truncate">{user?.email}</p>
						</div>
					</div>

					{/* Quick Cart Info */}
					{(() => {
						const totalItems = getCartItemCount();
						return totalItems > 0 ? (
							<div className="mt-3 p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
								<div className="flex items-center justify-between text-xs">
									<span className="text-cyan-300">
										Cart: {totalItems} item{totalItems > 1 ? "s" : ""}
									</span>
									<Link href="/dashboard/cart" className="text-cyan-400 hover:text-cyan-300 font-medium">
										View →
									</Link>
								</div>
							</div>
						) : null;
					})()}
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
					{/* Main Section */}
					<div>
						{navigationSections.main.map((item) => (
							<NavigationItem key={item.name} item={item} setSidebarOpen={setSidebarOpen} />
						))}
					</div>

					{/* Learning Section */}
					<div>
						<h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Learning</h3>
						<div className="space-y-1">
							{navigationSections.learning.map((item) => (
								<NavigationItem key={item.name} item={item} setSidebarOpen={setSidebarOpen} />
							))}
						</div>
					</div>

					{/* Cart Section */}
					<div>
						<h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Cart</h3>
						<div className="space-y-1">
							{navigationSections.shopping.map((item) => (
								<NavigationItem key={item.name} item={item} setSidebarOpen={setSidebarOpen} />
							))}
						</div>
					</div>

					{/* Account Section */}
					<div>
						<h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</h3>
						<div className="space-y-1">
							{navigationSections.account.map((item) => (
								<NavigationItem key={item.name} item={item} setSidebarOpen={setSidebarOpen} />
							))}
						</div>
					</div>
				</nav>

				{/* Logout Button */}
				<div className="px-4 py-4 border-t border-slate-800">
					<button
						onClick={handleLogout}
						className="w-full flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-200"
					>
						<LogOut size={18} className="mr-3" />
						Logout
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 h-full">
				{/* Top Bar */}
				<div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 lg:border-l">
					<div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
						<div className="flex items-center space-x-4">
							<button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
								<Menu size={24} />
							</button>
							<div className="hidden lg:block">
								<h1 className="text-xl font-semibold text-white">{navigation.find((item) => item.current)?.name || "Dashboard"}</h1>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
								← Back to Home
							</Link>
						</div>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 overflow-y-auto bg-slate-950 p-0 m-0">{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
