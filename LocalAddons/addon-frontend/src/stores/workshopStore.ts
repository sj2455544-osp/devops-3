import { create } from "zustand";
import { WORKSHOP_ENDPOINTS, TECHNOLOGIES_ENDPOINTS } from "../config/api";
import { useAuthStore } from "./authStore";

// Import the same interfaces from courseStore since backend treats workshops as courses
export interface CurriculumItem {
	id: number;
	title: string;
	description: string;
	highlights: string;
	duration: number;
	date: string;
	course: number;
}

export interface Rating {
	id: number;
	user_avatar: string | null;
	user_name: string | null;
	user_username: string;
	rating: number;
	review: string;
	is_verified: boolean;
}

export interface CourseOverview {
	id: number;
	curriculum: CurriculumItem[];
	icon: string | null;
	ratings: Rating[];
	title: string;
	description: string;
	slug: string;
	discounted_price: number;
	original_price: number | null;
	language: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	thumbnail: string;
	video: string | null; // Allow video to be null
	duration: string;
	prerequisites: string;
	objectives: string;
	student_count: number;
	avg_rating: number;
	review_count: number;
	published: boolean;
	open_for_enrollment: boolean;
	created_at: string;
	updated_at: string;
	instructor: Instructor;
	technologies: Technology[];
	is_enrolled?: boolean;
}

export interface Instructor {
	id: number;
	name: string;
	bio: string;
	avatar_url: string;
	created_at: string;
	updated_at: string;
	social_links: null | object;
}

export interface Lesson {
	id: number;
	title: string;
	description: string;
	duration: string;
	order: number;
	video_url?: string;
	is_completed?: boolean;
}

export interface Technology {
	id: number;
	icon: string | null;
	sector: string;
	slug: string;
	name: string;
	image: string | null;
	description: string;
}

// Alias Workshop to CourseOverview for frontend compatibility
export type Workshop = CourseOverview;
export type WorkshopDetail = CourseOverview;

// Helper function to check if workshop has a valid video
export const hasValidVideo = (workshop: Workshop | CourseOverview): boolean => {
	return !!(workshop.video && workshop.video.trim() !== "");
};

export interface PaginatedWorkshopsResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Workshop[];
}

interface WorkshopState {
	// Available workshops
	workshops: Workshop[];
	workshopsLoading: boolean;
	workshopsError: string | null;
	workshopsPagination: {
		count: number;
		next: string | null;
		previous: string | null;
	} | null;

	// Enrolled workshops
	enrolledWorkshops: Workshop[];
	enrolledWorkshopsLoading: boolean;
	enrolledWorkshopsError: string | null;
	enrolledWorkshopsPagination: {
		count: number;
		next: string | null;
		previous: string | null;
	} | null;

	// Single workshop
	currentWorkshop: Workshop | null;
	currentWorkshopLoading: boolean;
	currentWorkshopError: string | null;

	// Technologies
	technologies: Technology[];
	technologiesLoading: boolean;
	technologiesError: string | null;

	// Actions
	fetchWorkshops: (technology?: string, page?: number) => Promise<void>;
	fetchTechnologies: () => Promise<void>;
	fetchEnrolledWorkshops: (page?: number) => Promise<void>;
	fetchWorkshopBySlug: (slug: string) => Promise<void>;
	enrollInWorkshop: (workshopId: number) => Promise<void>;
	unenrollFromWorkshop: (workshopId: number) => Promise<void>;
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
	workshops: [],
	workshopsLoading: false,
	workshopsError: null,
	workshopsPagination: null,

	enrolledWorkshops: [],
	enrolledWorkshopsLoading: false,
	enrolledWorkshopsError: null,
	enrolledWorkshopsPagination: null,

	currentWorkshop: null,
	currentWorkshopLoading: false,
	currentWorkshopError: null,

	technologies: [],
	technologiesLoading: false,
	technologiesError: null,

	fetchWorkshops: async (technology?: string, page?: number) => {
		set({ workshopsLoading: true, workshopsError: null });
		try {
			const { token } = useAuthStore.getState();

			let url = WORKSHOP_ENDPOINTS.AVAILABLE;
			const params = new URLSearchParams();

			if (technology) {
				params.append("technology", technology);
			}
			if (page && page > 1) {
				params.append("page", page.toString());
			}

			if (params.toString()) {
				url += `?${params.toString()}`;
			}

			// Only add Authorization header if token exists
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}

			console.log("Fetching workshops from:", url, "with headers:", headers);

			const response = await fetch(url, { headers });

			console.log("Workshop API response:", {
				status: response.status,
				statusText: response.statusText,
				ok: response.ok,
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Authentication required. Please log in.");
				}
				if (response.status === 403) {
					throw new Error("Access denied. You may not have permission to view workshops.");
				}
				if (response.status === 404) {
					throw new Error("Workshops not found.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to fetch workshops: ${response.status}`);
			}

			const data: PaginatedWorkshopsResponse = await response.json();
			console.log("Workshop API data received:", {
				count: data.count,
				resultsLength: data.results.length,
				firstWorkshop: data.results[0]?.title || "No workshops",
			});

			set({
				workshops: data.results,
				workshopsPagination: {
					count: data.count,
					next: data.next,
					previous: data.previous,
				},
				workshopsLoading: false,
				workshopsError: null,
			});
		} catch (error) {
			console.error("Workshop fetch error:", error);
			set({
				workshops: [],
				workshopsPagination: null,
				workshopsError: error instanceof Error ? error.message : "An error occurred while fetching workshops",
				workshopsLoading: false,
			});
		}
	},

	fetchTechnologies: async () => {
		set({ technologiesLoading: true, technologiesError: null });
		try {
			const response = await fetch(TECHNOLOGIES_ENDPOINTS.LIST);

			if (!response.ok) {
				throw new Error("Failed to fetch technologies");
			}

			const data: Technology[] = await response.json();
			set({ technologies: data, technologiesLoading: false });
		} catch (error) {
			set({
				technologies: [],
				technologiesError: error instanceof Error ? error.message : "An error occurred",
				technologiesLoading: false,
			});
		}
	},

	fetchWorkshopBySlug: async (slug: string) => {
		set({ currentWorkshopLoading: true, currentWorkshopError: null });
		try {
			const { token } = useAuthStore.getState();

			// Only add Authorization header if token exists
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}

			const response = await fetch(WORKSHOP_ENDPOINTS.DETAIL(slug), { headers });

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error(`Workshop "${slug}" not found`);
				}
				if (response.status === 401) {
					throw new Error("Authentication required. Please log in.");
				}
				if (response.status === 403) {
					throw new Error("Access denied. You may need to log in.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to fetch workshop details: ${response.status}`);
			}

			const data: Workshop = await response.json();
			set({ currentWorkshop: data, currentWorkshopLoading: false, currentWorkshopError: null });
		} catch (error) {
			set({
				currentWorkshop: null,
				currentWorkshopError: error instanceof Error ? error.message : "An error occurred while fetching workshop details",
				currentWorkshopLoading: false,
			});
		}
	},

	fetchEnrolledWorkshops: async (page?: number) => {
		set({ enrolledWorkshopsLoading: true, enrolledWorkshopsError: null });
		try {
			const { token } = useAuthStore.getState();
			let url = `${WORKSHOP_ENDPOINTS.AVAILABLE}enrolled/`;
			const params = new URLSearchParams();

			if (page && page > 1) {
				params.append("page", page.toString());
			}

			if (params.toString()) {
				url += `?${params.toString()}`;
			}

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Authentication required. Please log in.");
				}
				if (response.status === 403) {
					throw new Error("Access denied. You may not have permission to view enrolled workshops.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to fetch enrolled workshops: ${response.status}`);
			}

			const data: PaginatedWorkshopsResponse = await response.json();
			set({
				enrolledWorkshops: data.results,
				enrolledWorkshopsPagination: {
					count: data.count,
					next: data.next,
					previous: data.previous,
				},
				enrolledWorkshopsLoading: false,
				enrolledWorkshopsError: null,
			});
		} catch (error) {
			set({
				enrolledWorkshops: [],
				enrolledWorkshopsPagination: null,
				enrolledWorkshopsError: error instanceof Error ? error.message : "An error occurred while fetching enrolled workshops",
				enrolledWorkshopsLoading: false,
			});
		}
	},

	enrollInWorkshop: async (workshopId: number) => {
		try {
			const { token } = useAuthStore.getState();
			const response = await fetch(WORKSHOP_ENDPOINTS.ENROLL(workshopId), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Authentication required. Please log in.");
				}
				if (response.status === 403) {
					throw new Error("Access denied. You may not have permission to enroll.");
				}
				if (response.status === 404) {
					throw new Error("Workshop not found.");
				}
				if (response.status === 409) {
					throw new Error("You are already enrolled in this workshop.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to enroll in workshop: ${response.status}`);
			}

			// Refresh enrolled workshops after enrollment
			await get().fetchEnrolledWorkshops();
		} catch (error) {
			throw error;
		}
	},

	unenrollFromWorkshop: async (workshopId: number) => {
		try {
			const { token } = useAuthStore.getState();
			const response = await fetch(WORKSHOP_ENDPOINTS.UNENROLL(workshopId), {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Authentication required. Please log in.");
				}
				if (response.status === 403) {
					throw new Error("Access denied. You may not have permission to unenroll.");
				}
				if (response.status === 404) {
					throw new Error("Workshop not found or you are not enrolled.");
				}
				if (response.status >= 500) {
					throw new Error("Server error. Please try again later.");
				}
				throw new Error(`Failed to unenroll from workshop: ${response.status}`);
			}

			// Refresh enrolled workshops after unenrollment
			await get().fetchEnrolledWorkshops();
		} catch (error) {
			throw error;
		}
	},
}));
