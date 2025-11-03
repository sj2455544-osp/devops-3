"use client";

import React, { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";

const DashboardCart = () => {
	const { cart, removeFromCart, clearCart, getCart, isLoading } = useCartStore();
	const { token } = useAuthStore();

	useEffect(() => {
		if (token) {
			getCart();
		}
	}, [token, getCart]);

	if (isLoading) {
		return (
			<div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center text-white">
					<ShoppingCart className="w-5 h-5 mr-2" />
					My Cart
				</h3>
				<div className="animate-pulse">
					<div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
					<div className="h-4 bg-slate-700 rounded w-1/2"></div>
				</div>
			</div>
		);
	}

	if (!cart || !cart.items || cart.items.length === 0) {
		return (
			<div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center text-white">
					<ShoppingCart className="w-5 h-5 mr-2" />
					My Cart
				</h3>
				<p className="text-slate-500 text-center py-8">Your cart is empty</p>
				<Link href="/#courses" className="block text-center bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors">
					Browse Courses
				</Link>
			</div>
		);
	}

	const handleRemove = (courseId: number) => {
		removeFromCart(courseId);
	};

	const handleClearCart = () => {
		if (window.confirm("Are you sure you want to clear your cart?")) {
			clearCart();
		}
	};

	return (
		<div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold flex items-center text-white">
					<ShoppingCart className="w-5 h-5 mr-2" />
					My Cart ({cart.items.length} items)
				</h3>
				{cart.items.length > 0 && (
					<button onClick={handleClearCart} className="text-red-400 hover:text-red-300 text-sm flex items-center">
						<Trash2 className="w-4 h-4 mr-1" />
						Clear All
					</button>
				)}
			</div>

			<div className="space-y-3 max-h-64 overflow-y-auto">
				{cart.items.map((item) => (
					<div key={item.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors">
						<div className="flex-1">
							<h4 className="font-medium text-sm text-white">{item.product.title}</h4>
							<div className="flex items-center gap-2">{item.quantity > 1 && <span className="text-xs text-slate-400">× {item.quantity}</span>}</div>
							{!item.product.open_for_enrollment && <p className="text-xs text-red-400 mt-1">⚠ Enrollment closed</p>}
						</div>
						<button onClick={() => handleRemove(item.product.id)} className="text-red-400 hover:text-red-300 p-1">
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>

			<div className="mt-4 pt-4 border-t border-slate-700">
				<Link href="/dashboard/cart" className="block text-center bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors">
					View Full Cart
				</Link>
			</div>
		</div>
	);
};

export default DashboardCart;
