"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useModalStore } from "../../stores/modalStore";
import { useCartStore } from "@/stores/cartStore";

interface CartIconProps {
	courseId: number;
	courseName?: string;
	className?: string;
	size?: "sm" | "md" | "lg";
	showBadge?: boolean;
	isEnrolled?: boolean;
}

export default function CartIcon({ courseId, courseName, className = "", size = "md", showBadge = true, isEnrolled = false }: CartIconProps) {
	const { addToCart, removeFromCart, isInCart } = useCartStore();
	const { isAuthenticated } = useAuthStore();
	const { openAuthModal, openEnrollmentClosedModal, closeModal, isAnyModalOpen, isAuthModalOpen } = useModalStore();
	const [isAdding, setIsAdding] = useState(false);
	const [justAdded, setJustAdded] = useState(false);

	const inCart = isAuthenticated ? isInCart(courseId) : false;
	const showAuthModal = isAuthModalOpen();
	const isAnyModalOpenGlobal = isAnyModalOpen();

	// Size configurations following the theme
	const sizeConfig = {
		sm: {
			button: "w-8 h-8",
			icon: "w-4 h-4",
			text: "text-xs",
		},
		md: {
			button: "w-10 h-10",
			icon: "w-5 h-5",
			text: "text-sm",
		},
		lg: {
			button: "w-12 h-12",
			icon: "w-6 h-6",
			text: "text-base",
		},
	};

	const config = sizeConfig[size];

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			openAuthModal({ courseName, courseId });
			return;
		}

		if (inCart) {
			try {
				setIsAdding(true);
				await removeFromCart(courseId);
			} catch (error) {
				console.error("Failed to remove from cart:", error);
			} finally {
				setIsAdding(false);
			}
		} else {
			try {
				setIsAdding(true);
				await addToCart(courseId);
				setJustAdded(true);
			} catch (error) {
				console.error("Failed to add to cart:", error);
				if (error instanceof Error && (error.message === "ENROLLMENT_CLOSED" || error.message === "ENROLLMENT_NOT_ACTIVE")) {
					openEnrollmentClosedModal({ courseName, courseId });
				}
			} finally {
				setIsAdding(false);
			}
		}
	};

	// Reset justAdded after 2 seconds
	useEffect(() => {
		if (justAdded) {
			const timer = setTimeout(() => setJustAdded(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [justAdded]);

	// Close auth modal when user becomes authenticated
	useEffect(() => {
		if (isAuthenticated && showAuthModal) {
			closeModal();
		}
	}, [isAuthenticated, showAuthModal, closeModal]);

	const buttonLoading = isAdding;
	const isModalOpen = isAnyModalOpenGlobal;

	// Show enrolled status instead of cart icon if user is already enrolled
	if (isEnrolled) {
		return (
			<div className={`${config.button} flex items-center justify-center bg-green-500/20 border border-green-500/50 rounded-lg relative group ${className}`}>
				<Check className={`${config.icon} text-green-400`} />
				<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
					Already enrolled
				</div>
			</div>
		);
	}

	return (
		<>
			<button
				onClick={handleClick}
				disabled={buttonLoading}
				className={`
					${config.button}
					relative group flex items-center justify-center
					${isModalOpen ? "bg-slate-900/30 blur-sm opacity-50" : "bg-slate-900/50 hover:bg-slate-800"}
					border border-slate-800 ${isModalOpen ? "" : "hover:border-cyan-500/50"}
					rounded-lg transition-all duration-200 shadow-lg
					disabled:opacity-50 disabled:cursor-not-allowed
					${inCart ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" : `text-slate-400 ${isModalOpen ? "" : "hover:text-cyan-400"}`}
					${justAdded ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : ""}
					z-10
					${className}
				`}
				title={!isAuthenticated ? `Login to add ${courseName || "course"} to cart` : inCart ? `Remove ${courseName || "course"} from cart` : `Add ${courseName || "course"} to cart`}
			>
				{buttonLoading ? (
					<div className={`${config.icon} animate-spin`}>
						<div className="w-full h-full border-2 border-current border-t-transparent rounded-full"></div>
					</div>
				) : justAdded ? (
					<Check className={`${config.icon} transition-all duration-200`} />
				) : inCart ? (
					<ShoppingCart className={`${config.icon} fill-current transition-all duration-200`} />
				) : (
					<Plus className={`${config.icon} transition-all duration-200`} />
				)}

				{/* Badge for items in cart */}
				{showBadge && inCart && (
					<div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full flex items-center justify-center">
						<div className="w-2 h-2 bg-white rounded-full"></div>
					</div>
				)}

				{/* Tooltip on hover - hidden when modal is open */}
				{!isModalOpen && (
					<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
						{!isAuthenticated ? "Login to add to cart" : inCart ? "Remove from cart" : "Add to cart"}
					</div>
				)}
			</button>
		</>
	);
}
