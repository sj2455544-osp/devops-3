import { MessageCircle, Users, Share2, Heart, Calendar, Bell } from "lucide-react";

export interface CommunityFeature {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	gradient: string;
}

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	isActive: boolean;
}

export const communityFeatures: CommunityFeature[] = [
	{
		id: "discussion-forums",
		title: "Discussion Forums",
		description: "Engage in meaningful discussions with instructors and fellow students about course topics.",
		icon: MessageCircle,
		gradient: "from-cyan-500/10 to-cyan-500/20",
	},
	{
		id: "study-groups",
		title: "Study Groups",
		description: "Join or create study groups to collaborate on projects and share learning resources.",
		icon: Users,
		gradient: "from-emerald-500/10 to-emerald-500/20",
	},
	{
		id: "project-showcase",
		title: "Project Showcase",
		description: "Share your projects, get feedback, and inspire others with your creations.",
		icon: Share2,
		gradient: "from-purple-500/10 to-purple-500/20",
	},
	{
		id: "mentorship",
		title: "Mentorship",
		description: "Connect with mentors and help others on their learning journey.",
		icon: Heart,
		gradient: "from-yellow-500/10 to-yellow-500/20",
	},
	{
		id: "events-meetups",
		title: "Events & Meetups",
		description: "Join virtual meetups, webinars, and networking events with the community.",
		icon: Calendar,
		gradient: "from-red-500/10 to-red-500/20",
	},
	{
		id: "notifications",
		title: "Notifications",
		description: "Stay updated with community activities and important announcements.",
		icon: Bell,
		gradient: "from-blue-500/10 to-blue-500/20",
	},
];

export const timelineItems: TimelineItem[] = [
	{
		id: "discussion-forums",
		title: "Discussion Forums",
		description: "Q4 2025 - Interactive forums for course discussions",
		isActive: true,
	},
	{
		id: "study-groups",
		title: "Study Groups",
		description: "Q1 2026 - Collaborative learning spaces",
		isActive: false,
	},
	{
		id: "mentorship-program",
		title: "Mentorship Program",
		description: "Q2 2026 - Connect with industry experts",
		isActive: false,
	},
];
