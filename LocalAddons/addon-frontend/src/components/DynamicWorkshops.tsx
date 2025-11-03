"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useExploreStore, getCourseDescription } from "@/stores/exploreStore";
import { getTechnologyIcon, getWorkshopIcon, getTechnologyReactIcon, getWorkshopReactIcon } from "@/utils/iconMapping";
import LazyIcon from "@/components/shared/LazyIcon";
import CartIcon from "@/components/cart/CartIcon";

export default function DynamicWorkshops() {
	const [activeTab, setActiveTab] = useState<string>("");
	const [activeSector, setActiveSector] = useState<string>("");

	const { exploreData, exploreLoading, exploreError, filteredCourses, selectedTechnology, selectedSector, fetchExploreData, setSelectedTechnology, setSelectedSector } = useExploreStore();

	// Load explore data on component mount
	useEffect(() => {
		fetchExploreData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Handle technology change
	const handleTechnologyChange = useCallback(
		(technologySlug: string) => {
			setActiveTab(technologySlug);
			setSelectedTechnology(technologySlug);
			// Reset sector when technology changes
			if (technologySlug !== selectedTechnology) {
				setActiveSector("");
				setSelectedSector("");
			}
		},
		[setSelectedTechnology, selectedTechnology, setSelectedSector]
	);

	// Handle sector change
	const handleSectorChange = useCallback(
		(sector: string) => {
			setActiveSector(sector);
			setSelectedSector(sector);
		},
		[setSelectedSector]
	);

	// Handle showing all workshops
	const handleShowAll = useCallback(() => {
		setActiveTab("");
		setActiveSector("");
		setSelectedTechnology("");
		setSelectedSector("");
	}, [setSelectedTechnology, setSelectedSector]);

	// Get unique sectors for the selected technology
	const getAvailableSectors = useCallback(() => {
		if (!exploreData || exploreData.length === 0) return [];

		let technologies = exploreData;

		// If a technology is selected, filter sectors for that technology
		if (selectedTechnology) {
			technologies = technologies.filter((tech) => tech.slug === selectedTechnology);
		}

		// Get unique sectors
		const sectors = [...new Set(technologies.map((tech) => tech.sector))];
		return sectors.filter((sector) => sector && sector.trim() !== "");
	}, [exploreData, selectedTechnology]);

	// Create technology click handler
	const createTechnologyHandler = useCallback(
		(techSlug: string) => {
			return () => handleTechnologyChange(techSlug);
		},
		[handleTechnologyChange]
	);

	// Create sector click handler
	const createSectorHandler = useCallback(
		(sector: string) => {
			return () => handleSectorChange(sector);
		},
		[handleSectorChange]
	);

	// Handler for refresh button
	const handleRefresh = useCallback(() => {
		fetchExploreData();
	}, [fetchExploreData]);

	const availableSectors = getAvailableSectors();

	return (
		<section id="courses" className="relative py-24 bg-slate-950 overflow-hidden">
			<div
				className="absolute inset-0 z-0 opacity-10"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
				}}
			></div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
						<span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">Explore Our Workshops</span>
					</h2>
					<p className="text-xl text-gray-400 max-w-3xl mx-auto">Select a specialization to find hands-on workshops designed to elevate your skills.</p>

					{/* Visual Tab Strip for Show */}
					<div className="mt-8 flex justify-center">
						<div className="flex items-center space-x-2 p-1.5 bg-slate-800 rounded-lg">
							<button className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md transition">IT Workshops</button>
							<button disabled className="flex items-center px-5 py-2 text-sm font-semibold text-slate-500 bg-transparent rounded-md cursor-not-allowed">
								Management Workshops
								<span className="ml-2 px-2 py-0.5 text-xs font-bold text-slate-800 bg-amber-400 rounded-full">Soon</span>
							</button>
						</div>
					</div>
				</div>

				{/* Technology Filter */}
				<div className="flex justify-center mt-8 mb-8">
					<div className="flex flex-wrap justify-center gap-2 md:gap-3 p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg max-w-4xl">
						<button
							onClick={handleShowAll}
							className={`flex-shrink-0 flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold rounded-md transition-colors duration-300 ease-in-out
								${!selectedTechnology ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
						>
							All Technologies
						</button>

						{exploreLoading ? (
							<div className="flex items-center px-4 py-2 text-slate-400">
								<Loader2 className="w-4 h-4 animate-spin mr-2" />
								Loading technologies...
							</div>
						) : exploreError ? (
							<div className="text-red-400 px-4 py-2">Error loading technologies</div>
						) : (
							exploreData?.map((tech) => (
								<button
									key={tech.id}
									onClick={createTechnologyHandler(tech.slug)}
									className={`flex-shrink-0 flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold rounded-md transition-colors duration-300 ease-in-out
										${selectedTechnology === tech.slug ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
								>
									<div className="mr-2 text-cyan-400">
										<LazyIcon
											iconUrl={tech.icon || getTechnologyReactIcon(tech.slug, tech.name)}
											fallback={getTechnologyIcon(tech.slug, tech.name)}
											size="sm"
											alt={`${tech.name} icon`}
										/>
									</div>
									{tech.name}
								</button>
							))
						)}
					</div>
				</div>

				{/* Sector Filter - Show only when a technology is selected and has multiple sectors */}
				{selectedTechnology && availableSectors.length > 1 && (
					<div className="flex justify-center mb-8">
						<div className="flex flex-wrap justify-center gap-2 md:gap-3 p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg max-w-3xl">
							<button
								onClick={() => handleSectorChange("")}
								className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors duration-300 ease-in-out
									${!selectedSector ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"}`}
							>
								All Sectors
							</button>
							{availableSectors.map((sector) => (
								<button
									key={sector}
									onClick={createSectorHandler(sector)}
									className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-md transition-colors duration-300 ease-in-out
										${selectedSector === sector ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"}`}
								>
									{sector}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Workshops Grid */}
				{exploreLoading ? (
					<div className="flex justify-center items-center py-16">
						<div className="flex items-center space-x-2 text-cyan-400">
							<Loader2 className="h-8 w-8 animate-spin" />
							<span>Loading workshops...</span>
						</div>
					</div>
				) : exploreError ? (
					<div className="text-center py-16">
						<div className="text-red-400 text-lg font-semibold mb-2">Error Loading Workshops</div>
						<p className="text-slate-400">{exploreError}</p>
						<button onClick={handleRefresh} className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
							Retry
						</button>
					</div>
				) : filteredCourses.length === 0 ? (
					<div className="text-center py-16">
						<div className="text-slate-400 text-lg font-semibold mb-2">No Workshops Found</div>
						<p className="text-slate-500">{selectedTechnology || selectedSector ? `No workshops available for the selected filters.` : "No workshops available at the moment."}</p>
					</div>
				) : (
					<div key={`${activeTab}-${activeSector}`} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
						{filteredCourses.map((course) => (
							<div key={course.id} className="group block h-full relative">
								<Link href={`/workshops/${course.slug}`} className="block h-full">
									<div className="relative h-full rounded-xl p-6 transition-all duration-300 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 shadow-lg transform hover:-translate-y-1 bg-slate-900/50">
										<div className="relative z-10 text-white flex flex-col h-full">
											<div className="text-4xl mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
												<LazyIcon
													iconUrl={course.icon || getWorkshopReactIcon(course.title, course.technologies?.[0]?.slug)}
													fallback={getWorkshopIcon(course.title, course.technologies?.[0]?.slug)}
													size="lg"
													alt={`${course.title} icon`}
													className="text-cyan-400"
												/>
											</div>
											<h3 className="text-lg font-bold mb-2 text-slate-100">{course.title}</h3>
											<p className="text-slate-400 text-sm leading-relaxed flex-grow">{getCourseDescription(course)}</p>
											{/* Technology badges */}
											{course.technologies && course.technologies.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-800">
													{course.technologies.slice(0, 2).map((tech) => (
														<span key={tech.id} className="px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded-full">
															{tech.name}
														</span>
													))}
													{course.technologies.length > 2 && (
														<span className="px-2 py-1 text-xs bg-slate-700 text-slate-400 rounded-full">+{course.technologies.length - 2}</span>
													)}
												</div>
											)}
										</div>
									</div>
								</Link>

								{/* Cart Icon - positioned absolutely in top right */}
								<div className="absolute top-4 right-4 z-20">
									<CartIcon courseId={course.id} courseName={course.title} size="md" isEnrolled={course.is_enrolled} />
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
