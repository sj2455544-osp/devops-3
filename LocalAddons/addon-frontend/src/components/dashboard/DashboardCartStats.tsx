"use client";

import React, { useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";

const DashboardCartStats = () => {
	const { cart, getTotalItems, getTotalPrice, getCart, isLoading } = useCartStore();
	const { token } = useAuthStore();

	useEffect(() => {
		if (token) {
			getCart();
		}
	}, [token, getCart]);

	const totalItems = getTotalItems();
	const totalPrice = getTotalPrice();

	const stats = [
		{
			label: "Items in Cart",
			value: totalItems,
			icon: Package,
			color: "text-cyan-400",
			bgColor: "bg-cyan-500/10",
		},
		{
			label: "Total Value",
			value: `₹${totalPrice}`,
			icon: DollarSign,
			color: "text-green-400",
			bgColor: "bg-green-500/10",
		},
	];

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, index) => (
					<div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse">
						<div className="flex items-center justify-between">
							<div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
							<div className="h-4 bg-slate-700 rounded w-16"></div>
						</div>
						<div className="mt-4">
							<div className="h-6 bg-slate-700 rounded w-20 mb-2"></div>
							<div className="h-4 bg-slate-700 rounded w-24"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat, index) => {
				const IconComponent = stat.icon;
				return (
					<div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
						<div className="flex items-center justify-between">
							<div className={`p-3 rounded-lg ${stat.bgColor}`}>
								<IconComponent className={`w-6 h-6 ${stat.color}`} />
							</div>
							<div className="text-right">
								<p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
							</div>
						</div>
						<div className="mt-4">
							<p className="text-slate-300 font-medium">{stat.label}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default DashboardCartStats;
