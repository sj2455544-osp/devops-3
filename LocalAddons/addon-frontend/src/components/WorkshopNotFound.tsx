"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, BookOpen, Users, Award, Home, RefreshCw, Clock, Star } from "lucide-react";
import { useWorkshopStore, Workshop } from "@/stores/workshopStore";

interface WorkshopNotFoundProps {
	slug?: string;
	onRetry?: () => void;
}

const WorkshopNotFound: React.FC<WorkshopNotFoundProps> = ({ slug, onRetry }) => {
	const { workshops, fetchWorkshops } = useWorkshopStore();
	const [popularWorkshops, setPopularWorkshops] = useState<Workshop[]>([]);

	// Debug logging
	useEffect(() => {
		console.log("WorkshopNotFound component rendered with:", { slug, hasRetryFunction: !!onRetry });
	}, [slug, onRetry]);

	const handleRetry = () => {
		console.log("Retry button clicked");
		if (onRetry) {
			onRetry();
		}
	};

	const handleGoBack = () => {
		console.log("Go back button clicked");
		if (typeof window !== "undefined") {
			window.history.back();
		}
	};

	useEffect(() => {
		if (workshops.length === 0) {
			try {
				fetchWorkshops();
			} catch (error) {
				console.error("Failed to fetch workshops:", error);
			}
		}
	}, [workshops.length, fetchWorkshops]);

	useEffect(() => {
		// Get top 3 workshops sorted by rating and student count
		const popular = workshops
			.filter((workshop) => workshop.avg_rating > 0)
			.sort((a, b) => {
				const scoreA = a.avg_rating * 0.7 + (a.student_count || 0) * 0.3;
				const scoreB = b.avg_rating * 0.7 + (b.student_count || 0) * 0.3;
				return scoreB - scoreA;
			})
			.slice(0, 3);
		setPopularWorkshops(popular);
	}, [workshops]);

	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Main Content */}
				<div className="text-center">
					{/* 404 Illustration */}
					<div className="relative mb-8">
						<div className="inline-flex items-center justify-center w-32 h-32 bg-slate-900 rounded-full border border-slate-800 shadow-2xl shadow-cyan-500/10">
							<Search className="w-16 h-16 text-slate-600" />
						</div>
						{/* Floating elements around the search icon */}
						<div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
							<BookOpen className="w-4 h-4 text-cyan-400" />
						</div>
						<div className="absolute -bottom-2 -left-2 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
							<Users className="w-4 h-4 text-red-400" />
						</div>
						<div className="absolute top-1/2 -left-8 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
							<Award className="w-3 h-3 text-yellow-400" />
						</div>
					</div>

					{/* Error Message */}
					<div className="mb-8">
						<h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
							Workshop <span className="text-cyan-400">Not Found</span>
						</h1>
						<div className="max-w-md mx-auto">
							<p className="text-slate-400 text-lg mb-4">We couldn&apos;t find the workshop you&apos;re looking for.</p>
							{slug && (
								<div className="bg-slate-900 border border-slate-800 rounded-lg p-3 mb-4">
									<p className="text-sm text-slate-500">
										Searched for: <span className="text-cyan-400 font-mono">&quot;{slug}&quot;</span>
									</p>
								</div>
							)}
							<p className="text-slate-500 text-sm">This workshop may have been removed, renamed, or is temporarily unavailable.</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Link
							href="/#courses"
							className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25"
						>
							<Home className="w-5 h-5 mr-2" />
							Browse All Workshops
						</Link>

						<Link
							href="/dashboard"
							className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
						>
							<BookOpen className="w-5 h-5 mr-2" />
							Dashboard
						</Link>

						{onRetry && (
							<button
								onClick={handleRetry}
								className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
							>
								<RefreshCw className="w-5 h-5 mr-2" />
								Try Again
							</button>
						)}
					</div>

					{/* Go Back Link */}
					<div className="mb-8">
						<button onClick={handleGoBack} className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors text-sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go back to previous page
						</button>
					</div>
				</div>

				{/* Help Section */}
				<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/5">
					<h2 className="text-xl font-semibold text-white mb-4 text-center">Need Help Finding a Workshop?</h2>
					<div className="grid sm:grid-cols-3 gap-6 text-center">
						<div className="group">
							<div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500/30 transition-colors">
								<Search className="w-6 h-6 text-cyan-400" />
							</div>
							<h3 className="font-semibold text-white mb-2">Search</h3>
							<p className="text-slate-400 text-sm">Use our search feature to find workshops by topic or instructor</p>
						</div>

						<div className="group">
							<div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/30 transition-colors">
								<BookOpen className="w-6 h-6 text-emerald-400" />
							</div>
							<h3 className="font-semibold text-white mb-2">Browse Categories</h3>
							<p className="text-slate-400 text-sm">Explore workshops organized by technology and skill level</p>
						</div>

						<div className="group">
							<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/30 transition-colors">
								<Users className="w-6 h-6 text-purple-400" />
							</div>
							<h3 className="font-semibold text-white mb-2">Get Support</h3>
							<p className="text-slate-400 text-sm">Contact our support team if you need assistance finding content</p>
						</div>
					</div>
				</div>

				{/* Popular Workshops Section */}
				{popularWorkshops.length > 0 && (
					<div className="mt-12">
						<h2 className="text-2xl font-bold text-white text-center mb-8">
							Popular <span className="text-cyan-400">Workshops</span>
						</h2>
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{popularWorkshops.map((workshop) => (
								<Link
									key={workshop.id}
									href={`/workshops/${workshop.slug}`}
									className="block bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 group"
								>
									<div className="flex items-center justify-between mb-3">
										<span className="px-2 py-1 rounded text-xs font-medium bg-cyan-600 text-white border border-cyan-600">{workshop.level}</span>
										<div className="flex items-center text-xs text-slate-400">
											<Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
											{workshop.avg_rating}
										</div>
									</div>
									<h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">{workshop.title}</h3>
									<p className="text-slate-400 text-sm mb-3">by {workshop.instructor.name}</p>
									<div className="flex items-center justify-between text-xs text-slate-500">
										<div className="flex items-center">
											<Clock className="w-3 h-3 mr-1" />
											{workshop.duration}
										</div>
										<div className="flex items-center">
											<Users className="w-3 h-3 mr-1" />
											{workshop.student_count || 0} students
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WorkshopNotFound;
