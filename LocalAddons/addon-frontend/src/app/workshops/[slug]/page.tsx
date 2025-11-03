"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Users, Star, CheckCircle, Award, BookOpen, Target, Zap, ChevronDown, Video, Briefcase, Loader2, User, X, Play } from "lucide-react";
import { useWorkshopStore, Workshop, hasValidVideo } from "@/stores/workshopStore";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useModalStore } from "@/stores/modalStore";
import WorkshopNotFound from "@/components/WorkshopNotFound";
import { processMultilineText } from "@/utils/textUtils";
import { FaBullseye } from "react-icons/fa";

// --- Sub-Components ---

const VideoModal = ({ isOpen, onClose, videoUrl, title }: { isOpen: boolean; onClose: () => void; videoUrl: string | null; title: string }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
			<div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-lg overflow-hidden">
				<button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
					<X className="w-5 h-5" />
				</button>
				<div className="w-full h-full">
					{videoUrl && videoUrl.trim() !== "" ? (
						<iframe
							src={videoUrl}
							title={title}
							className="w-full h-full"
							allowFullScreen
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-slate-400">
							<div className="text-center">
								<Video className="w-16 h-16 mx-auto mb-4" />
								<p className="text-lg font-medium mb-2">Video not available</p>
								<p className="text-sm opacity-75">This workshop doesn&apos;t have a preview video yet</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const Avatar = ({ src, alt, className }: { src?: string | null; alt: string; className?: string }) => {
	const [imgError, setImgError] = useState(false);

	if (src && !imgError) {
		return (
			<div className={`${className} relative overflow-hidden`}>
				<Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" onError={() => setImgError(true)} />
			</div>
		);
	}
	return (
		<div className={`${className} bg-slate-700 flex items-center justify-center rounded-full`}>
			<User className="w-1/2 h-1/2 text-slate-400" />
		</div>
	);
};

const CourseSidebar = ({
	workshop,
	thumbnailError,
	setThumbnailError,
	onVideoPlay,
}: {
	workshop: Workshop;
	thumbnailError: boolean;
	setThumbnailError: (error: boolean) => void;
	onVideoPlay: () => void;
}) => {
	const { user, isAuthenticated } = useAuthStore();
	const { addToCart, removeFromCart, isInCart } = useCartStore();
	const { openAuthModal, openEnrollmentClosedModal } = useModalStore();
	const [isAdding, setIsAdding] = useState(false);

	const inCart = isAuthenticated ? isInCart(workshop.id) : false;
	const isCimageUser = isAuthenticated && user?.email?.endsWith("cimage.in");

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			openAuthModal({ courseName: workshop.title, courseId: workshop.id });
			return;
		}

		if (inCart) {
			try {
				setIsAdding(true);
				await removeFromCart(workshop.id);
			} catch (error) {
				console.error("Failed to remove from cart:", error);
			} finally {
				setIsAdding(false);
			}
		} else {
			try {
				setIsAdding(true);
				await addToCart(workshop.id);
			} catch (error) {
				console.error("Failed to add to cart:", error);
				if (error instanceof Error && (error.message === "ENROLLMENT_CLOSED" || error.message === "ENROLLMENT_NOT_ACTIVE")) {
					openEnrollmentClosedModal({ courseName: workshop.title, courseId: workshop.id });
				}
			} finally {
				setIsAdding(false);
			}
		}
	};

	return (
		<aside className="lg:sticky top-24 space-y-6">
			<div className="border border-slate-800 rounded-lg bg-slate-900 relative overflow-visible">
				{/* Image Preview */}
				<div className={`relative aspect-video overflow-hidden rounded-t-lg group ${hasValidVideo(workshop) ? "cursor-pointer" : ""}`} onClick={() => hasValidVideo(workshop) && onVideoPlay()}>
					{!thumbnailError && workshop.thumbnail ? (
						<Image
							src={workshop.thumbnail}
							alt={`${workshop.title} preview`}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 1024px) 100vw, 33vw"
							priority
							onError={() => setThumbnailError(true)}
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
							<div className="text-center text-slate-400">
								<Video className="w-12 h-12 mx-auto mb-2 opacity-60" />
								<p className="text-sm font-medium">Preview Image</p>
							</div>
						</div>
					)}
					{/* Video available overlay */}
					{hasValidVideo(workshop) && (
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
							<div className="absolute bottom-4 left-4 right-4">
								<p className="text-white text-sm font-semibold">Workshop Preview</p>
								<p className="text-cyan-200 text-xs">Click to play video</p>
							</div>
						</div>
					)}
					{/* Play button overlay for video */}
					{hasValidVideo(workshop) && !thumbnailError && workshop.thumbnail && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-12 h-12 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-cyan-500/30">
								<Play className="w-6 h-6 text-cyan-300 ml-0.5" />
							</div>
						</div>
					)}
				</div>

				<div className="p-6">
					{!isAuthenticated ? (
						<div className="space-y-3">
							<div className="p-4 border border-slate-800 rounded-lg bg-slate-900">
								<p className="font-bold text-green-400 text-base mb-2">For CIMAGE Students</p>
								<p className="text-3xl font-bold text-white">Course Fee: ₹0</p>
								<p className="text-sm text-slate-400 mt-1">(No Registration fee, Tuition fee, or Certificate fee)</p>
							</div>
							<div className="p-4 border border-slate-800 rounded-lg bg-slate-900">
								<p className="font-bold text-cyan-400 text-base mb-2">For Other Students</p>
								<div className="flex items-center justify-between">
									<p className="text-3xl font-bold text-white">₹{workshop.original_price || workshop.discounted_price}</p>
									<span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">BESTSELLER</span>
								</div>
							</div>
							<div className="p-3 border border-slate-800 rounded-lg bg-slate-900 text-center">
								<p className="text-sm text-slate-300">Are you a CIMAGE student?</p>
								<p className="text-xs text-slate-400 mt-1">Log in with cimage email id to access special pricing</p>
							</div>
						</div>
					) : isCimageUser ? (
						<div className="p-4 border border-slate-800 rounded-lg bg-slate-900 relative">
							{/* Refundable Badge - Desktop */}
							<div className="absolute -top-20 -right-20 z-30">
								<Image src="/refundable.png" alt="100% Refundable Offer" width={140} height={140} className="animate-pulse rounded-full shadow-2xl" priority />
							</div>
							<p className="font-bold text-green-400 text-base mb-3">Exclusively for CIMAGE Students</p>
							<p className="text-4xl font-bold text-white">₹{workshop.discounted_price}</p>
							<p className="text-sm text-slate-400 mt-2 font-semibold">Fully refundable upon 100% attendance</p>
						</div>
					) : (
						<div className="p-4 border border-slate-800 rounded-lg bg-slate-900">
							<div className="flex items-center justify-between">
								<p className="text-4xl font-bold text-white">₹{workshop.original_price || workshop.discounted_price}</p>
								<span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">BESTSELLER</span>
							</div>
						</div>
					)}

					<div className="mt-4">
						{isAuthenticated && workshop.is_enrolled ? (
							<div className="w-full h-12 px-4 font-semibold rounded-lg flex items-center justify-center border border-green-500/50 text-green-400 bg-slate-900">
								<CheckCircle className="w-5 h-5 mr-2" />
								Already Enrolled
							</div>
						) : (
							<button
								onClick={handleAddToCart}
								disabled={isAdding}
								className={`w-full h-12 px-4 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
									inCart ? "bg-green-500 hover:bg-green-600 text-white" : "bg-cyan-500 hover:bg-cyan-600 text-white"
								}`}
							>
								{isAdding ? (
									<div className="flex items-center justify-center">
										<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
										{inCart ? "Removing..." : "Adding..."}
									</div>
								) : inCart ? (
									"Remove from Cart"
								) : (
									"Add to Cart"
								)}
							</button>
						)}
					</div>
					<p className="text-center text-xs text-slate-400 mt-3">100% Secure Payment</p>
				</div>

				<div className="p-6 border-t border-slate-800">
					<h3 className="text-base font-semibold text-white mb-4 flex items-center">This Course Includes:</h3>
					<ul className="space-y-3">
						<li className="flex items-center text-slate-300 p-2 border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors duration-200">
							<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 flex-shrink-0">
								<BookOpen className="w-4 h-4 text-cyan-400" />
							</div>
							<span className="text-sm">Hands-on Projects</span>
						</li>
						<li className="flex items-center text-slate-300 p-2 border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors duration-200">
							<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 flex-shrink-0">
								<Users className="w-4 h-4 text-cyan-400" />
							</div>
							<span className="text-sm">1-on-1 Mentorship</span>
						</li>
						<li className="flex items-center text-slate-300 p-2 border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors duration-200">
							<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3 flex-shrink-0">
								<Award className="w-4 h-4 text-cyan-400" />
							</div>
							<span className="text-sm">Certificate of Completion</span>
						</li>
					</ul>
				</div>
			</div>
		</aside>
	);
};

const AccordionItem = ({
	item,
	isOpen,
	onClick,
}: {
	item: { id: number; title: string; description: string; highlights: string; duration: number; date: string };
	isOpen: boolean;
	onClick: () => void;
}) => (
	<div className="border border-slate-800 rounded-lg overflow-hidden">
		<button onClick={onClick} className="w-full flex justify-between items-center p-3 sm:p-4 lg:p-5 bg-slate-900 hover:bg-slate-800/50 transition-colors">
			<span className="font-semibold text-base sm:text-lg text-white text-left pr-2">{item.title}</span>
			<ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
		</button>
		{isOpen && (
			<div className="p-3 sm:p-4 lg:p-5 bg-slate-950 space-y-3 sm:space-y-4">
				{item.description && (
					<div>
						<p className="text-slate-300 leading-relaxed text-sm sm:text-base">{item.description}</p>
					</div>
				)}
				{item.highlights && (
					<div>
						<h4 className="text-sm font-semibold text-white mb-2">Key Highlights:</h4>
						<ul className="space-y-1.5 sm:space-y-2">
							{item.highlights
								.split("\n")
								.filter((highlight) => highlight.trim())
								.map((highlight, index) => (
									<li key={index} className="flex items-start">
										<FaBullseye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
										<span className="text-slate-400 text-xs sm:text-sm leading-relaxed">{highlight.trim()}</span>
									</li>
								))}
						</ul>
					</div>
				)}
				{(item.duration || item.date) && (
					<div className="flex flex-col sm:flex-row sm:items-center text-xs text-slate-500 gap-1 sm:gap-x-2 pt-2 border-t border-slate-800">
						{item.duration && (
							<div className="flex items-center">
								<Clock className="w-3 h-3 mr-1" />
								<span>{item.duration} minutes</span>
							</div>
						)}
						{item.duration && item.date && <span className="hidden sm:inline">•</span>}
						{item.date && <span>{item.date}</span>}
					</div>
				)}
			</div>
		)}
	</div>
);

const RelatedCourses = ({ courses }: { courses: Workshop[] }) => {
	if (courses.length === 0) return null;
	return (
		<section>
			<h2 className="text-2xl font-bold mb-4">Related Workshops</h2>
			<div className="grid sm:grid-cols-2 gap-6">
				{courses.map((course) => (
					<Link href={`/workshops/${course.slug}`} key={course.id} className="block group">
						<div className="h-full bg-slate-900 border border-slate-800 rounded-lg p-5 transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1">
							<h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{course.title}</h3>
							<p className="text-sm text-slate-400 mt-2">By {course.instructor.name}</p>
							<div className="flex items-center text-xs text-slate-500 mt-4">
								<span className="flex items-center">
									<Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" /> {course.avg_rating}
								</span>
								<span className="mx-2">·</span>
								<span>{course.duration}</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

// --- Main Page Component ---

interface WorkshopPageProps {
	params: { slug: string };
}

export default function WorkshopPage({ params }: WorkshopPageProps) {
	const { currentWorkshop: workshop, currentWorkshopLoading, currentWorkshopError, workshops, fetchWorkshopBySlug, fetchWorkshops } = useWorkshopStore();
	const { user, isAuthenticated } = useAuthStore();
	const { addToCart, removeFromCart, isInCart } = useCartStore();
	const { openAuthModal, openEnrollmentClosedModal } = useModalStore();
	const [thumbnailError, setThumbnailError] = useState(false);
	const [slug, setSlug] = useState<string>("");
	const [openWeek, setOpenWeek] = useState<number | null>(1);
	const [videoModalOpen, setVideoModalOpen] = useState(false);
	const [mobileCartAdding, setMobileCartAdding] = useState(false);

	const inCart = workshop && isAuthenticated ? isInCart(workshop.id) : false;
	const isCimageUser = isAuthenticated && user?.email?.endsWith("cimage.in");

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!workshop) return;
		if (!isAuthenticated) {
			openAuthModal({ courseName: workshop.title, courseId: workshop.id });
			return;
		}
		if (inCart) {
			try {
				setMobileCartAdding(true);
				await removeFromCart(workshop.id);
			} catch (error) {
				console.error("Failed to remove from cart:", error);
			} finally {
				setMobileCartAdding(false);
			}
		} else {
			try {
				setMobileCartAdding(true);
				await addToCart(workshop.id);
			} catch (error) {
				console.error("Failed to add to cart:", error);
				if (error instanceof Error && (error.message === "ENROLLMENT_CLOSED" || error.message === "ENROLLMENT_NOT_ACTIVE")) {
					openEnrollmentClosedModal({ courseName: workshop.title, courseId: workshop.id });
				}
			} finally {
				setMobileCartAdding(false);
			}
		}
	};

	const handleRetry = () => {
		if (slug) fetchWorkshopBySlug(slug);
	};

	useEffect(() => {
		const getSlug = async () => {
			const resolvedParams = await params;
			setSlug(resolvedParams.slug);
		};
		getSlug();
	}, [params]);

	useEffect(() => {
		if (slug) {
			fetchWorkshopBySlug(slug);
			fetchWorkshops();
		}
	}, [slug, fetchWorkshopBySlug, fetchWorkshops]);

	if (currentWorkshopLoading || (!workshop && !currentWorkshopError)) {
		return (
			<div className="mt-16 min-h-screen bg-slate-950 text-white flex items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
					<span>Loading workshop...</span>
				</div>
			</div>
		);
	}
	if (currentWorkshopError) {
		return (
			<div className="mt-16">
				{currentWorkshopError.includes("not found") ? (
					<WorkshopNotFound slug={slug} onRetry={handleRetry} />
				) : (
					<div className="mt-16 min-h-screen bg-slate-950 text-white flex items-center justify-center">
						<div className="text-center">
							<h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Workshop</h1>
							<p className="text-slate-400">{currentWorkshopError}</p>
							<button onClick={handleRetry} className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
								Try Again
							</button>
						</div>
					</div>
				)}
			</div>
		);
	}
	if (!workshop) {
		return (
			<div className="mt-16">
				<WorkshopNotFound slug={slug} onRetry={handleRetry} />
			</div>
		);
	}

	const relatedCourses = workshops.filter((c) => c.id !== workshop.id).slice(0, 4);

	return (
		<div className="mt-16 min-h-screen bg-slate-950 text-white pb-24 sm:pb-28 lg:pb-8">
			<VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} videoUrl={workshop.video} title={workshop.title} />
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12">
				<div className="lg:grid lg:grid-cols-3 lg:gap-12">
					<main className="lg:col-span-2">
						<div className="mb-6 sm:mb-8">
							<Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-3 sm:mb-4 transition-colors text-sm">
								<ArrowLeft className="w-4 h-4 mr-2" /> Back to all workshops
							</Link>
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">{workshop.title}</h1>
							<p className="text-base sm:text-lg text-slate-300 mb-4 sm:mb-6 leading-relaxed">{workshop.description}</p>
							<div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-6 sm:gap-y-2 text-sm">
								<div className="flex items-center">
									<Avatar src={workshop.instructor.avatar_url} alt={workshop.instructor.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 flex-shrink-0" />
									<span className="text-slate-400 text-sm">
										Created by <span className="text-white font-medium">{workshop.instructor.name}</span>
									</span>
								</div>
								<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
									<div className="flex items-center text-slate-400">
										<Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-current" /> {workshop.avg_rating} ({workshop.student_count} students)
									</div>
									<div className="flex items-center text-slate-400">
										<Clock className="w-4 h-4 mr-1.5" /> {workshop.duration}
									</div>
									<div className="flex items-center text-slate-400">
										<span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded">{workshop.level}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:hidden mb-6 sm:mb-8">
							<div className="bg-slate-900 rounded-lg sm:rounded-xl border border-slate-800 shadow-xl shadow-cyan-500/10 relative overflow-visible">
								<div
									className={`relative aspect-video overflow-hidden rounded-t-lg sm:rounded-t-xl group ${hasValidVideo(workshop) ? "cursor-pointer" : ""}`}
									onClick={() => hasValidVideo(workshop) && setVideoModalOpen(true)}
								>
									{!thumbnailError && workshop.thumbnail ? (
										<Image
											src={workshop.thumbnail}
											alt={`${workshop.title} preview`}
											fill
											className="object-cover transition-transform duration-300 group-hover:scale-105"
											sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 50vw"
											priority
											onError={() => setThumbnailError(true)}
										/>
									) : (
										<div className="w-full h-full bg-slate-800 flex items-center justify-center">
											<div className="text-center text-slate-400 px-4">
												<Video className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3" />
												<p className="text-sm sm:text-base font-medium">Workshop Preview</p>
												{hasValidVideo(workshop) ? (
													<p className="text-xs sm:text-sm opacity-75">Tap to play video</p>
												) : (
													<p className="text-xs sm:text-sm opacity-75">No video available</p>
												)}
											</div>
										</div>
									)}
									{hasValidVideo(workshop) && !thumbnailError && workshop.thumbnail && (
										<>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
													<p className="text-white text-xs sm:text-sm font-medium">Workshop Preview</p>
													<p className="text-white/80 text-xs">Tap to play video</p>
												</div>
											</div>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
													<Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-0.5 sm:ml-1" />
												</div>
											</div>
										</>
									)}
								</div>

								<div className="p-4 sm:p-6">
									<div className="mb-6">
										{!isAuthenticated ? (
											<div className="space-y-4">
												<div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/40 shadow-lg shadow-green-500/5 text-center backdrop-blur-sm">
													<p className="font-bold text-green-400 text-xl">For CIMAGE Students</p>
													<p className="text-4xl font-bold text-white mt-1">Course Fee: ₹0</p>
													<p className="text-sm text-green-300/90 mt-1">(No Registration fee, Tuition fee, or Certificate fee)</p>
													<p className="text-lg font-bold text-white mt-3">Refundable Deposit: ₹{workshop.discounted_price}</p>
												</div>
												<div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/40 shadow-lg shadow-cyan-500/5 text-center backdrop-blur-sm">
													<p className="font-bold text-cyan-400 text-xl">For Other Students</p>
													<p className="text-4xl font-bold text-white mt-1">₹{workshop.original_price || workshop.discounted_price}</p>
													<span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 text-xs font-bold rounded-full mt-2 border border-green-500/30">
														BESTSELLER
													</span>
												</div>
												<div className="p-3 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60 text-center backdrop-blur-sm">
													<p className="font-bold text-white text-sm">Are you a CIMAGE student?</p>
													<p className="text-slate-300/90 text-xs mt-1">Log in to access special pricing</p>
												</div>
											</div>
										) : isCimageUser ? (
											<div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/40 shadow-lg shadow-green-500/5 text-center backdrop-blur-sm relative">
												{/* Refundable Badge - Mobile */}
												<div className="absolute -top-14 -right-8 sm:-top-20 sm:-right-16 z-30">
													<Image
														src="/refundable.png"
														alt="100% Refundable Offer"
														width={100}
														height={100}
														className="animate-pulse rounded-full shadow-2xl sm:w-32 sm:h-32"
														priority
													/>
												</div>
												<p className="font-bold text-green-400 text-xl">Exclusively for CIMAGE Students</p>
												<p className="text-5xl font-bold text-white mt-2">₹{workshop.discounted_price}</p>
												<p className="text-sm text-slate-400/90 mt-2 font-semibold">Fully refundable upon 100% attendance</p>
											</div>
										) : (
											<div className="p-4 rounded-lg bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm">
												<div className="flex items-center justify-between">
													<p className="text-5xl font-bold text-white">₹{workshop.original_price || workshop.discounted_price}</p>
													<span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
														BESTSELLER
													</span>
												</div>
											</div>
										)}
										<div className={`mb-4 ${isCimageUser ? "mt-6" : "mt-4"}`}>
											{isAuthenticated && workshop.is_enrolled ? (
												<div className="w-full h-14 px-6 font-semibold rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 text-green-400 shadow-lg shadow-green-500/10">
													<CheckCircle className="w-5 h-5 mr-2" />
													Already Enrolled
												</div>
											) : (
												<button
													onClick={handleAddToCart}
													disabled={mobileCartAdding}
													className={`w-full h-14 px-6 font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
														inCart
															? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/20"
															: "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/20"
													}`}
												>
													{mobileCartAdding ? (
														<div className="flex items-center justify-center">
															<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
															{inCart ? "Removing..." : "Adding..."}
														</div>
													) : inCart ? (
														"Remove from Cart"
													) : (
														"Add to Cart"
													)}
												</button>
											)}
										</div>
										<p className="text-center text-sm text-slate-400/80 font-semibold">100% Secure Payment</p>
									</div>
									<div className="border-t border-slate-800/60 pt-4 mt-6 bg-gradient-to-b from-slate-900/30 to-slate-900/60 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2 rounded-b-xl">
										<h3 className="text-lg font-semibold text-white mb-4 flex items-center">This Course Includes:</h3>
										<div className="space-y-3 text-sm">
											<ul className="space-y-3">
												<li className="flex items-center text-slate-300 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors duration-200">
													<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3">
														<BookOpen className="w-4 h-4 text-cyan-400" />
													</div>
													<span className="font-medium">Hands-on Projects</span>
												</li>
												<li className="flex items-center text-slate-300 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors duration-200">
													<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3">
														<Users className="w-4 h-4 text-cyan-400" />
													</div>
													<span className="font-medium">1-on-1 Mentorship</span>
												</li>
												<li className="flex items-center text-slate-300 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors duration-200">
													<div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center mr-3">
														<Award className="w-4 h-4 text-cyan-400" />
													</div>
													<span className="font-medium">Certificate of Completion</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-8 sm:space-y-12 lg:space-y-16">
							{workshop.objectives && (
								<section>
									<div className="p-8 border border-slate-800 rounded-lg bg-slate-900">
										<h2 className="text-2xl font-bold mb-4 flex items-center">What You&#39;ll Learn</h2>
										<ul className="grid md:grid-cols-2 gap-x-6 gap-y-3">
											{workshop.objectives.split("\n").map((outcome, i) => (
												<li key={i} className="flex items-start">
													<CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
													<span className="text-slate-400 text-xs sm:text-sm leading-relaxed">{outcome}</span>
												</li>
											))}
										</ul>
									</div>
								</section>
							)}
							{workshop.curriculum && workshop.curriculum.length > 0 && (
								<section>
									<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
										<BookOpen className="inline w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-cyan-400" />
										Workshop Curriculum
									</h2>
									<div className="space-y-2 sm:space-y-3">
										{workshop.curriculum.map((item) => (
											<AccordionItem key={item.id} item={item} isOpen={openWeek === item.id} onClick={() => setOpenWeek(openWeek === item.id ? null : item.id)} />
										))}
									</div>
								</section>
							)}
							{workshop.prerequisites && (
								<section>
									<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
										<Zap className="inline w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-cyan-400" />
										Prerequisites
									</h2>
									<ul className="p-4 sm:p-6 border border-slate-800 rounded-lg bg-slate-900 space-y-2 sm:space-y-3">
										{processMultilineText(workshop.prerequisites).map((prerequisite, index) => (
											<li key={index} className="flex items-start">
												<span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full mr-2 sm:mr-3 mt-2 sm:mt-2.5 flex-shrink-0" />
												<span className="text-sm sm:text-base">{prerequisite}</span>
											</li>
										))}
									</ul>
								</section>
							)}
							<section>
								<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
									<Briefcase className="inline w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-cyan-400" />
									About Your Instructor
								</h2>
								<div className="p-4 sm:p-6 lg:p-8 border border-slate-800 rounded-lg bg-slate-900 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
									<Avatar src={workshop.instructor.avatar_url} alt={workshop.instructor.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0" />
									<div className="min-w-0 flex-1">
										<h3 className="text-lg sm:text-xl font-bold text-white">{workshop.instructor.name}</h3>
										<p className="text-cyan-400 font-medium text-sm">Lead Instructor</p>
										<p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">{workshop.instructor.bio}</p>
									</div>
								</div>
							</section>
							{workshop.ratings && workshop.ratings.length > 0 && (
								<section>
									<h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
										<Star className="inline w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-cyan-400" />
										Student Reviews
									</h2>
									<div className="space-y-3 sm:space-y-4">
										{workshop.ratings.slice(0, 3).map((rating) => (
											<div key={rating.id} className="p-3 sm:p-4 border border-slate-800 rounded-lg bg-slate-900">
												<div className="flex items-center mb-2 sm:mb-3">
													<Avatar src={rating.user_avatar} alt={rating.user_username} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0" />
													<div className="flex items-center flex-wrap gap-1 sm:gap-2 min-w-0 flex-1">
														<div className="flex items-center">
															{[...Array(5)].map((_, i) => (
																<Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < rating.rating ? "text-yellow-400 fill-current" : "text-slate-600"}`} />
															))}
														</div>
														<span className="text-xs sm:text-sm text-slate-400 truncate">by {rating.user_username}</span>
														{rating.is_verified && (
															<span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-500/20 text-green-400 text-xs rounded flex-shrink-0">Verified</span>
														)}
													</div>
												</div>
												<p className="text-slate-300 text-sm sm:text-base leading-relaxed">{rating.review}</p>
											</div>
										))}
									</div>
								</section>
							)}
							<RelatedCourses courses={relatedCourses} />
						</div>
					</main>
					<div className="hidden lg:block lg:col-span-1">
						<CourseSidebar workshop={workshop} thumbnailError={thumbnailError} setThumbnailError={setThumbnailError} onVideoPlay={() => setVideoModalOpen(true)} />
					</div>
				</div>
			</div>
		</div>
	);
}
