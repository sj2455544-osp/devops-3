"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BookOpen, Loader2, Search, Eye, ExternalLink } from "lucide-react";
import { useWorkshopStore } from "@/stores/workshopStore";
import Link from "next/link";

const MyCourses = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");

	const { enrolledWorkshops, enrolledWorkshopsLoading, enrolledWorkshopsError, enrolledWorkshopsPagination, fetchEnrolledWorkshops } = useWorkshopStore();

	useEffect(() => {
		fetchEnrolledWorkshops(currentPage);
	}, [fetchEnrolledWorkshops, currentPage]);

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);

	const handleRetryFetch = useCallback(() => {
		fetchEnrolledWorkshops();
	}, [fetchEnrolledWorkshops]);

	const handleClearSearch = useCallback(() => {
		setSearchTerm("");
	}, []);

	const handlePreviousPage = useCallback(() => {
		setCurrentPage((prev) => Math.max(1, prev - 1));
	}, []);

	const handleNextPage = useCallback(() => {
		setCurrentPage((prev) => prev + 1);
	}, []);

	const getLevelColor = useCallback((level: string) => {
		switch (level) {
			case "Beginner":
				return "bg-green-600 text-white border-green-600";
			case "Intermediate":
				return "bg-yellow-600 text-white border-yellow-600";
			case "Advanced":
				return "bg-red-600 text-white border-red-600";
			default:
				return "bg-slate-600 text-white border-slate-600";
		}
	}, []);

	const filteredCourses = useMemo(() => {
		return enrolledWorkshops.filter((course) => {
			const matchesSearch =
				course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				course.description.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		});
	}, [enrolledWorkshops, searchTerm]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Loading State */}
			{enrolledWorkshopsLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
					<span className="ml-2 text-slate-400">Loading your courses...</span>
				</div>
			)}

			{/* Error State */}
			{enrolledWorkshopsError && (
				<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
					<p className="text-red-400">{enrolledWorkshopsError}</p>
					<button onClick={handleRetryFetch} className="mt-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors">
						Try Again
					</button>
				</div>
			)}

			{/* Only show content if not loading and no error */}
			{!enrolledWorkshopsLoading && !enrolledWorkshopsError && (
				<>
					{/* Header */}
					<div className="mb-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
							<div>
								<h1 className="text-3xl font-bold text-white mb-2">
									My <span className="text-cyan-400">Courses</span>
								</h1>
								<p className="text-slate-400 text-lg">Continue your learning journey</p>
							</div>
							<div className="flex items-center space-x-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-cyan-400">{enrolledWorkshopsPagination?.count || 0}</div>
									<div className="text-sm text-slate-400">Courses Enrolled</div>
								</div>
								<div className="w-px h-12 bg-slate-700"></div>
								<div className="text-center">
									<div className="text-2xl font-bold text-emerald-400">{filteredCourses.length}</div>
									<div className="text-sm text-slate-400">Showing</div>
								</div>
							</div>
						</div>
					</div>

					{/* Search and Filters */}
					<div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-2xl shadow-cyan-500/10 mb-8">
						<div className="flex flex-col lg:flex-row gap-6">
							<div className="flex-1">
								<label className="block text-sm font-medium text-slate-300 mb-3">Search Courses</label>
								<div className="relative">
									<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
									<input
										type="text"
										placeholder="Search by course name, instructor, or description..."
										value={searchTerm}
										onChange={handleSearchChange}
										className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
									/>
								</div>
							</div>
						</div>

						{/* Active Filters */}
						{searchTerm && (
							<div className="flex items-center space-x-4 mt-6 pt-4 border-t border-slate-800">
								<span className="text-sm text-slate-400">Active filters:</span>
								<div className="flex flex-wrap gap-2">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
										<Search size={14} className="mr-2" />
										{searchTerm}
										<button onClick={handleClearSearch} className="ml-2 hover:text-cyan-300">
											×
										</button>
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Course Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCourses.map((course) => (
							<div
								key={course.id}
								className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-cyan-500/10 group"
							>
								{/* Course Thumbnail */}
								<div className="relative">
									<img
										src={course.thumbnail || "/placeholder-course.jpg"}
										alt={course.title || "Course"}
										className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute top-3 right-3">
										<span className={`px-2 py-1 text-xs font-medium rounded border ${getLevelColor(course.level || "Beginner")}`}>{course.level || "Beginner"}</span>
									</div>
									{/* Enrolled Badge */}
									<div className="absolute top-3 left-3">
										<span className="px-2 py-1 text-xs font-medium rounded bg-green-600 text-white border border-green-600">Enrolled</span>
									</div>
								</div>

								{/* Course Content */}
								<div className="p-6">
									<h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">{course.title || "Untitled Course"}</h3>
									<p className="text-slate-400 text-sm mb-3 line-clamp-2">{course.description || "No description available"}</p>

									<div className="flex items-center text-sm text-slate-400 mb-4">
										<BookOpen size={16} className="mr-1" />
										<span>{course.duration || "N/A"}</span>
									</div>

									<div className="flex items-center justify-between mb-4">
										<span className="text-slate-400 text-sm">by {course.instructor.name || "Unknown Instructor"}</span>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										<Link
											href={`/workshops/${course.slug}`}
											className="inline-flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-colors duration-200 group/view"
										>
											<Eye size={14} className="mr-1" />
											View
											<ExternalLink size={12} className="ml-1 opacity-0 group-hover/view:opacity-100 transition-opacity" />
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination */}
					{enrolledWorkshopsPagination && enrolledWorkshopsPagination.count > 0 && (
						<div className="flex items-center justify-between pt-8">
							<div className="text-sm text-slate-400">
								Showing {filteredCourses.length} of {enrolledWorkshopsPagination.count} courses
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={handlePreviousPage}
									disabled={!enrolledWorkshopsPagination.previous || enrolledWorkshopsLoading}
									className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
								>
									Previous
								</button>
								<span className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Page {currentPage}</span>
								<button
									onClick={handleNextPage}
									disabled={!enrolledWorkshopsPagination.next || enrolledWorkshopsLoading}
									className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
								>
									Next
								</button>
							</div>
						</div>
					)}

					{/* Empty State */}
					{filteredCourses.length === 0 && (
						<div className="text-center py-12">
							<BookOpen size={64} className="text-slate-600 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
							<p className="text-slate-400">Try adjusting your search criteria</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default MyCourses;
