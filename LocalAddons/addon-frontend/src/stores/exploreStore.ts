import { create } from "zustand";
import { WORKSHOP_ENDPOINTS } from "@/config/api";
import { Technology } from "./workshopStore";

// Updated course type based on new API response
export interface ExploreCourse {
	id: number;
	slug: string;
	title: string;
	thumbnail: string;
	discounted_price: number;
	icon: string | null;
	level: string;
	student_count: number;
	avg_rating: number;
	review_count: number;
	open_for_enrollment: boolean;
	duration: string;
	original_price: number | null;
	description?: string | null;
	short_description?: string | null;
	full_description?: string | null;
	technologies?: Technology[];
	is_enrolled?: boolean;
}

// Updated category type based on new API response
export interface ExploreCategory {
	id: number;
	name: string;
	slug: string;
	sector: string;
	description: string;
	icon: string | null;
	courses: ExploreCourse[];
}

// Utility function to get the best available description
export const getCourseDescription = (course: ExploreCourse): string => {
	// Priority order: full_description -> description -> short_description -> fallback
	const descriptions = [course.full_description, course.description, course.short_description].filter((desc) => desc && desc.trim() !== "");

	if (descriptions.length > 0) {
		const selectedDesc = descriptions[0] as string;
		// Truncate if too long for card display
		return selectedDesc.length > 150 ? selectedDesc.substring(0, 150) + "..." : selectedDesc;
	}

	// Fallback based on title and technologies
	const techNames = course.technologies
		?.slice(0, 2)
		.map((tech) => tech.name)
		.join(" and ");
	if (techNames) {
		return `Learn the fundamentals and advanced concepts of ${techNames}. Build practical projects and gain hands-on experience.`;
	}

	return "Learn the fundamentals and advanced concepts of this technology. Build practical projects and gain hands-on experience.";
};

interface ExploreState {
	// Explore data
	exploreData: ExploreCategory[];
	exploreLoading: boolean;
	exploreError: string | null;

	// Filters
	selectedTechnology: string;
	selectedSector: string;

	// Filtered data
	filteredCourses: ExploreCourse[];

	// Derived data
	availableTechnologies: ExploreCategory[];
	availableSectors: string[];

	// Actions
	fetchExploreData: () => Promise<void>;
	setSelectedTechnology: (technology: string) => void;
	setSelectedSector: (sector: string) => void;
	filterCourses: () => void;
}

export const useExploreStore = create<ExploreState>((set, get) => ({
	exploreData: [],
	exploreLoading: false,
	exploreError: null,

	selectedTechnology: "",
	selectedSector: "",

	filteredCourses: [],
	availableTechnologies: [],
	availableSectors: ["IT", "Management"],

	fetchExploreData: async () => {
		set({ exploreLoading: true, exploreError: null });
		try {
			console.log("Fetching explore data from:", WORKSHOP_ENDPOINTS.EXPLORE);

			const response = await fetch(WORKSHOP_ENDPOINTS.EXPLORE, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("Explore API response:", {
				status: response.status,
				statusText: response.statusText,
				ok: response.ok,
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("Explore data not found.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to fetch explore data: ${response.status}`);
			}

			const data: ExploreCategory[] = await response.json();
			console.log("Explore API data received:", {
				categoriesCount: data?.length || 0,
				totalCourses: data?.reduce((total, category) => total + (category.courses?.length || 0), 0) || 0,
			});

			// Extract all courses from all categories (distinct)
			const allCoursesMap = new Map<number, ExploreCourse>();
			const sectorsSet = new Set<string>();

			data.forEach((category) => {
				// Add sector to sectors set
				if (category.sector && category.sector.trim() !== "") {
					sectorsSet.add(category.sector);
				}

				// Add all courses from this category (using Map to ensure uniqueness by ID)
				if (category.courses && category.courses.length > 0) {
					category.courses.forEach((course) => {
						allCoursesMap.set(course.id, course);
					});
				}
			});

			const allCourses: ExploreCourse[] = Array.from(allCoursesMap.values());

			set({
				exploreData: data,
				filteredCourses: allCourses,
				availableTechnologies: data, // Use categories as technologies
				exploreLoading: false,
				exploreError: null,
			});

			// Apply current filters if any
			get().filterCourses();
		} catch (error) {
			console.error("Explore fetch error:", error);
			set({
				exploreData: [],
				filteredCourses: [],
				availableTechnologies: [],
				availableSectors: [],
				exploreError: error instanceof Error ? error.message : "An error occurred while fetching explore data",
				exploreLoading: false,
			});
		}
	},

	setSelectedTechnology: (technology: string) => {
		set({ selectedTechnology: technology });
		get().filterCourses();
	},

	setSelectedSector: (sector: string) => {
		set({ selectedSector: sector });
		get().filterCourses();
	},

	filterCourses: () => {
		const { exploreData, selectedTechnology, selectedSector } = get();

		if (!exploreData || exploreData.length === 0) {
			set({ filteredCourses: [] });
			return;
		}

		let filteredCategories = exploreData;

		// Filter by category/technology
		if (selectedTechnology) {
			filteredCategories = filteredCategories.filter((category) => category.slug === selectedTechnology);
		}

		// Filter by sector
		if (selectedSector) {
			filteredCategories = filteredCategories.filter((category) => selectedSector.toLowerCase().includes(category.sector.toLowerCase()));
		}

		// Extract all courses from filtered categories (distinct)
		const filteredCoursesMap = new Map<number, ExploreCourse>();
		filteredCategories.forEach((category) => {
			if (category.courses && category.courses.length > 0) {
				category.courses.forEach((course) => {
					filteredCoursesMap.set(course.id, course);
				});
			}
		});

		const filteredCourses: ExploreCourse[] = Array.from(filteredCoursesMap.values());
		set({ filteredCourses });
	},
}));
