"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const HeaderCartIcon = () => {
	const { getTotalItems } = useCartStore();
	const itemCount = getTotalItems();

	return (
		<Link href="/dashboard/cart" className="relative flex items-center justify-center w-10 h-10 text-slate-300 hover:text-amber-300 transition-colors duration-200">
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 && (
				<span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
					{itemCount > 99 ? "99+" : itemCount}
				</span>
			)}
		</Link>
	);
};

export default HeaderCartIcon;
