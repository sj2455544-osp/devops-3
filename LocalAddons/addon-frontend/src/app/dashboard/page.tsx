"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { useWorkshopStore } from "@/stores/workshopStore";
import { BookOpen, Loader2, Search, ShoppingCart, ArrowRight } from "lucide-react";
import { getWorkshopIcon } from "@/utils/iconMapping";

// --- Helper Types (Assuming these exist in your project) ---
type User = { name?: string | null; username: string; created_at: string };
type Workshop = { id: number; title: string; thumbnail?: string; icon?: string | null; instructor: { name: string }; technologies?: { slug: string }[] };

// --- Reusable UI Components (Defined in the same file) ---

// Course List Item Component
const CourseListItem = ({ course }: { course: Workshop }) => (
	<div className="bg-slate-900/70 rounded-lg border border-slate-800 p-4 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 flex items-start space-x-4">
		{course.thumbnail ? (
			<Image src={course.thumbnail} alt={course.title} width={48} height={48} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
		) : (
			<div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
				<div className="scale-75">{getWorkshopIcon(course.title, course.technologies?.[0]?.slug)}</div>
			</div>
		)}
		<div className="flex-1 min-w-0">
			<h3 className="text-base font-medium text-white truncate">{course.title || "Untitled Course"}</h3>
			<p className="text-sm text-slate-400 truncate">by {course.instructor.name || "Unknown Instructor"}</p>
		</div>
	</div>
);

// Quick Access Card Component
const QuickAccessCard = ({ card }: { card: { title: string; description: string; icon: React.ElementType; href: string; color: string } }) => (
	<Link
		href={card.href}
		className="group bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-cyan-500/10 flex flex-col"
	>
		<div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
			<card.icon size={28} className="text-white" />
		</div>
		<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">{card.title}</h3>
		<p className="text-slate-400 text-sm leading-relaxed flex-grow">{card.description}</p>
		<div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
			<span>Explore</span>
			<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
		</div>
	</Link>
);

// --- Main Dashboard Sections (Defined as components for clarity) ---

// Header Section
const DashboardHeader = ({ user }: { user: User }) => (
	<div className="flex items-center justify-between">
		<div>
			<h1 className="text-4xl font-bold text-white mb-3">
				Welcome back, <span className="text-cyan-400">{user.name || user.username}</span>
			</h1>
			<p className="text-lg text-slate-400">Let&apos;s continue your learning journey.</p>
		</div>
		<div className="hidden md:block text-right">
			<p className="text-sm text-slate-500">Member since</p>
			<p className="text-white font-medium">{new Date(user.created_at).toLocaleString("en-US", { month: "long", year: "numeric" })}</p>
		</div>
	</div>
);

// Quick Access Section
const QuickAccessSection = () => {
	const cards = useMemo(
		() => [
			{ title: "Browse Workshops", description: "Explore and enroll in new courses.", icon: Search, href: "/#courses", color: "from-purple-500 to-indigo-500" },
			{ title: "My Courses", description: "Access your enrolled courses and progress.", icon: BookOpen, href: "/dashboard/enrolled-courses", color: "from-emerald-500 to-teal-500" },
			{ title: "View Cart", description: "Review items and proceed to checkout.", icon: ShoppingCart, href: "/dashboard/cart", color: "from-cyan-500 to-blue-600" },
		],
		[]
	);

	return (
		<div>
			<h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{cards.map((card) => (
					<QuickAccessCard key={card.title} card={card} />
				))}
			</div>
		</div>
	);
};

// Enrolled Courses Section
const EnrolledCoursesSection = () => {
	const { enrolledWorkshops, enrolledWorkshopsLoading, enrolledWorkshopsPagination, fetchEnrolledWorkshops } = useWorkshopStore();
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		fetchEnrolledWorkshops(currentPage);
	}, [fetchEnrolledWorkshops, currentPage]);

	const handlePreviousPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
	const handleNextPage = useCallback(() => setCurrentPage((p) => p + 1), []);

	const renderContent = () => {
		if (enrolledWorkshopsLoading) {
			return (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
					<span className="ml-3 text-slate-400">Loading your courses...</span>
				</div>
			);
		}
		if (enrolledWorkshops.length === 0) {
			return (
				<div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
					<BookOpen size={48} className="text-slate-600 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-white mb-2">No Courses Enrolled Yet</h3>
					<p className="text-slate-400 mb-4">Explore our workshops to start learning.</p>
					<Link href="/#courses" className="text-cyan-400 font-semibold hover:underline">
						Browse Workshops
					</Link>
				</div>
			);
		}
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{enrolledWorkshops.slice(0, 6).map((course) => (
					<CourseListItem key={course.id} course={course} />
				))}
			</div>
		);
	};

	return (
		<div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-white">Continue Learning</h2>
				{enrolledWorkshopsPagination && enrolledWorkshopsPagination.count > 0 && (
					<Link href="/dashboard/enrolled-courses" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
						View All
					</Link>
				)}
			</div>
			{renderContent()}
			{enrolledWorkshopsPagination && enrolledWorkshopsPagination.count > 6 && (
				<div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
					<p className="text-sm text-slate-400">
						Page {currentPage} of {Math.ceil(enrolledWorkshopsPagination.count / 6)}
					</p>
					<div className="flex items-center space-x-2">
						<button
							onClick={handlePreviousPage}
							disabled={!enrolledWorkshopsPagination.previous}
							className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
						>
							Previous
						</button>
						<button
							onClick={handleNextPage}
							disabled={!enrolledWorkshopsPagination.next}
							className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
						>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

// --- The Main Page Component ---

const DashboardPage = () => {
	const { user } = useAuthStore();

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<DashboardHeader user={user} />
			<div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content (Left Column) */}
				<main className="lg:col-span-2 space-y-10">
					<QuickAccessSection />
					<EnrolledCoursesSection />
				</main>
			</div>
		</div>
	);
};

export default DashboardPage;
