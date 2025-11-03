"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Loader2, BookOpen, Clock, Star, Lock, CreditCard, CheckCircle, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import AuthGuard from "@/components/AuthGuard";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { useCartStore, Course } from "@/stores/cartStore";

export default function CartPage() {
	const { cart, getTotalItems, removeFromCart, clearCart, getCart, isLoading } = useCartStore();
	const { isAuthenticated, user } = useAuthStore();
	const [enrollmentSuccessDialogOpen, setEnrollmentSuccessDialogOpen] = useState(false);

	const isCimageUser = user?.email?.endsWith("cimage.in") || false;
	const { discountedTotal, originalTotal } = useMemo(() => {
		if (!cart?.items) {
			return { discountedTotal: 0, originalTotal: 0 };
		}

		const displayedPriceForUser = (product: Course) => {
			if (isCimageUser) {
				return product.discounted_price ?? product.original_price ?? 0;
			}
			return product.original_price ?? product.discounted_price ?? 0;
		};

		const original = cart.items.reduce((sum, item) => sum + (item.product.original_price ?? item.product.discounted_price ?? 0) * item.quantity, 0);
		const discounted = cart.items.reduce((sum, item) => sum + displayedPriceForUser(item.product) * item.quantity, 0);
		return {
			discountedTotal: discounted,
			originalTotal: original,
		};
	}, [cart?.items, isCimageUser]);

	// Load cart on page mount
	useEffect(() => {
		if (isAuthenticated) {
			getCart();
		}
	}, [isAuthenticated, getCart]);

	const handleClearCart = async () => {
		if (confirm("Are you sure you want to clear your cart?")) {
			await clearCart();
		}
	};

	// Use the calculated totals from useMemo above

	return (
		<AuthGuard>
			<div className="min-h-screen bg-slate-950 text-white pt-20">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
					{/* Loading State */}
					{isLoading ? (
						<div className="flex items-center justify-center py-16">
							<Loader2 className="w-8 h-8 animate-spin text-cyan-400 mr-3" />
							<span className="text-slate-400">Loading cart...</span>
						</div>
					) : !cart || !cart.items || cart.items.length === 0 ? (
						/* Empty Cart State */
						<div className="text-center py-16">
							<div className="bg-slate-900 rounded-xl border border-slate-800 p-12 max-w-2xl mx-auto">
								<ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-6" />
								<h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
								<p className="text-slate-400 mb-8">Explore our workshops and add some courses to get started with your learning journey.</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Link href="/#courses" className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors">
										Browse Workshops
									</Link>
									<Link
										href="/dashboard/enrolled-courses"
										className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
									>
										View My Courses
									</Link>
								</div>
							</div>
						</div>
					) : (
						/* Cart Content */
						<div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
							{/* Cart Items */}
							<div className="lg:col-span-2">
								<div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
									{/* Cart Header */}
									<div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800">
										<h2 className="text-xl font-bold text-white">Course List ({getTotalItems()})</h2>
										{cart.items && cart.items.length > 0 && (
											<button onClick={handleClearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors" disabled={isLoading}>
												Clear Cart
											</button>
										)}
									</div>

									{/* Cart Items */}
									<div className="divide-y divide-slate-800">
										{cart.items &&
											cart.items.map((item) => (
												<div key={item.id} className="p-4 sm:p-6 hover:bg-slate-800/30 transition-colors">
													<div className="flex items-start gap-3 sm:gap-4">
														{/* Course Thumbnail */}
														<div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
															{item.product.thumbnail ? (
																<Image src={item.product.thumbnail} alt={item.product.title} width={80} height={80} className="w-full h-full object-cover" />
															) : (
																<div className="w-full h-full flex items-center justify-center">
																	<BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600" />
																</div>
															)}
														</div>

														{/* Course Info */}
														<div className="flex-1 min-w-0">
															<Link href={`/workshops/${item.product.slug}`} className="block group">
																<h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 sm:truncate">
																	{item.product.title}
																</h3>
															</Link>
															<p className="text-sm text-slate-400 mt-1">by {item.product.instructor.name}</p>

															{/* Course Metadata */}
															<div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 text-xs text-slate-500">
																{item.product.duration && (
																	<div className="flex items-center">
																		<Clock className="w-3 h-3 mr-1" />
																		{item.product.duration}
																	</div>
																)}
																{item.product.avg_rating && (
																	<div className="flex items-center">
																		<Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
																		{item.product.avg_rating}
																	</div>
																)}
																<span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">{item.product.level}</span>
															</div>

															{/* Price and Quantity */}
															<div className="flex items-center justify-between gap-2 mt-3">
																<div className="flex items-center gap-2">
																	{/* Per requirement: show only discounted price for CIMAGE students, only original price for outsiders. */}
																	{(() => {
																		const displayPrice = isCimageUser
																			? item.product.discounted_price ?? item.product.original_price ?? 0
																			: item.product.original_price ?? item.product.discounted_price ?? 0;
																		return <span className="text-2xl sm:text-3xl font-bold text-white">₹{displayPrice}</span>;
																	})()}
																	{item.quantity > 1 && <span className="text-sm text-slate-400">× {item.quantity}</span>}
																</div>
															</div>

															{/* Enrollment Status */}
															{!item.product.open_for_enrollment && (
																<div className="mt-2 px-2 sm:px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
																	<p className="text-xs text-red-400 font-medium">⚠ Enrollment currently closed</p>
																</div>
															)}

															{item.product.is_enrolled && (
																<div className="mt-2 px-2 sm:px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
																	<p className="text-xs text-green-400 font-medium">✓ Already enrolled</p>
																</div>
															)}
														</div>

														{/* Remove Button and Refundable Offer */}
														<div className="flex flex-col items-end justify-start gap-3">
															<button
																onClick={() => removeFromCart(item.product.id)}
																className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
																disabled={isLoading}
																title="Remove from cart"
															>
																<Trash2 className="w-4 h-4" />
															</button>

															{/* Refundable Offer Badge - Per Course */}
															{isCimageUser && (
																<div className="w-20 sm:w-24">
																	<Image
																		src="/refundable.png"
																		alt="100% Refundable Offer"
																		width={80}
																		height={80}
																		className="animate-pulse w-full h-auto rounded-full shadow-xl"
																		style={{ height: "auto" }}
																	/>
																</div>
															)}
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>

							{/* Order Summary */}
							<div className="lg:col-span-1">
								<div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-6 lg:sticky lg:top-24">
									<h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Order Summary</h2>
									<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
										{/* Order summary: show only items count and final amount (no discount breakdown) */}
										<div className="flex justify-between text-base sm:text-lg text-slate-300">
											<span>Items ({getTotalItems()})</span>
											<span className="font-semibold">₹{isCimageUser ? discountedTotal : originalTotal}</span>
										</div>

										<div className="border-t border-slate-700 pt-3 sm:pt-4">
											<div className="flex justify-between text-2xl sm:text-3xl font-bold text-white">
												<span>Total</span>
												<span>₹{isCimageUser ? discountedTotal : originalTotal}</span>
											</div>
											{/* Savings message intentionally removed per requirements */}
										</div>
									</div>
									{/* CIMAGE Student Info */}
									{isCimageUser && (
										<div className="mb-4">
											<p className="text-sm text-slate-400 leading-relaxed text-center font-semibold">
												The ₹{discountedTotal} is only a commitment token (Fully Refundable) — attend all sessions and get your money back!
											</p>
										</div>
									)}
									{/* Checkout Button */}
									<CheckoutButton totalPrice={isCimageUser ? discountedTotal : originalTotal} /> {/* Security Badge */}
									<div className="flex items-center justify-center mt-3 sm:mt-4 text-xs text-slate-500">
										<Lock className="w-3 h-3 mr-1" />
										Secure SSL encrypted payment
									</div>
									{/* Additional Info */}
									<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-800 rounded-lg">
										<h3 className="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">What&apos;s Included</h3>
										<ul className="space-y-1.5 sm:space-y-2 text-xs text-slate-400">
											<li>Interactive exercises and projects</li>
											<li>Certificate of completion</li>
											<li>Community support access</li>
											{isCimageUser && <li>Full refund on 100% attendance</li>}
										</ul>
									</div>
									{/* Payment Methods */}
									<div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-slate-800 rounded-lg">
										<h3 className="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
											<CreditCard className="w-4 h-4 text-cyan-400 mr-2" />
											Payment Methods
										</h3>
										<div className="flex items-center gap-2 text-xs text-slate-400">
											<span>UPI</span>
											<span>•</span>
											<span>Cards</span>
											<span>•</span>
											<span>Net Banking</span>
										</div>
									</div>
								</div>
							</div>

							{/* Enrollment Success Dialog */}
							{enrollmentSuccessDialogOpen && (
								<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
									<div className="bg-slate-900 rounded-xl border border-slate-800 p-6 sm:p-8 max-w-sm mx-auto shadow-2xl">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-lg font-semibold text-white">Enrolled! 🎉</h3>
											<button onClick={() => setEnrollmentSuccessDialogOpen(false)} className="text-slate-400 hover:text-slate-300 transition-colors" aria-label="Close">
												<X className="w-5 h-5" />
											</button>
										</div>
										<div className="space-y-4">
											<p className="text-slate-300 text-sm">
												Congratulations! You have been successfully enrolled. Check your courses at <strong>My Courses</strong>.
											</p>
											<div className="flex flex-col sm:flex-row gap-3">
												<Link
													href="/dashboard/enrolled-courses"
													className="flex items-center justify-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors text-center"
													onClick={() => setEnrollmentSuccessDialogOpen(false)}
												>
													<CheckCircle className="w-4 h-4 mr-2" />
													My Courses
												</Link>
												<button
													onClick={() => setEnrollmentSuccessDialogOpen(false)}
													className="flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-colors"
												>
													Continue
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</AuthGuard>
	);
}
