"use client";
import { useState, useCallback } from "react";
import { Users, ArrowRight, Award, X, Building2 } from "lucide-react";

interface Video {
	id: number;
	title: string;
	description: string;
	videoId: string;
	thumbnail: string;
	duration: string;
	views: string;
	uploadDate: string;
	category: string;
}

const WhyChooseUs = () => {
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	const openVideoModal = useCallback((video: Video) => {
		setSelectedVideo(video);
		setIsVideoModalOpen(true);
	}, []);

	const closeVideoModal = useCallback(() => {
		setIsVideoModalOpen(false);
		setSelectedVideo(null);
	}, []);

	const createVideoHandler = useCallback(
		(video: Video) => {
			return () => openVideoModal(video);
		},
		[openVideoModal]
	);

	const videos = [
		{
			id: 1,
			title: "Campus Tour - State-of-the-Art Infrastructure",
			description: "Take a virtual tour of our modern campus featuring cutting-edge laboratories, smart classrooms, and world-class facilities that create the perfect learning environment.",
			videoId: "rO7Vi_94g0Q",
			thumbnail: "/cimage_ai.jpg",
			duration: "3:45",
			views: "25K views",
			uploadDate: "2 weeks ago",
			category: "Campus Life",
		},
		{
			id: 2,
			title: "Student Success Stories - From Classroom to Career",
			description: "Hear inspiring stories from our alumni who have successfully transitioned from students to industry professionals, sharing their journey and achievements.",
			videoId: "YxFssndJ8V0",
			thumbnail: "https://cimage.in/wp-content/uploads/2025/07/IMG_20250705_195605_037.webp",
			duration: "5:20",
			views: "42K views",
			uploadDate: "1 month ago",
			category: "Success Stories",
		},
		{
			id: 3,
			title: "Expert Sessions - Career Guidance & Industry Insights",
			description: "Behind the scenes of our career counseling and interactive expert talks providing students with practical exposure.",
			videoId: "jycwymXiNNQ",
			thumbnail: "https://img.youtube.com/vi/jycwymXiNNQ/hqdefault.jpg",
			duration: "4:15",
			views: "18K views",
			uploadDate: "3 weeks ago",
			category: "Masterclass",
		},
		{
			id: 4,
			title: "Placement Drive Highlights - Top Companies Visit",
			description: "Experience the excitement of our placement drives where top companies recruit our talented students, showcasing our excellent industry connections.",
			videoId: "Dm-93-aTfCU", // Replace with actual YouTube video ID
			thumbnail: "https://img.youtube.com/vi/Dm-93-aTfCU/hqdefault.jpg",
			duration: "6:33",
			views: "35K views",
			uploadDate: "1 week ago",
			category: "Placements",
		},
		{
			id: 5,
			title: "Research & Innovation Lab - Student Projects",
			description: "Discover innovative projects developed by our students in our research labs, demonstrating the practical application of theoretical knowledge.",
			videoId: "WpifBOVUu84", // Replace with actual YouTube video ID
			thumbnail: "https://img.youtube.com/vi/WpifBOVUu84/hqdefault.jpg",
			duration: "7:18",
			views: "12K views",
			uploadDate: "2 months ago",
			category: "Innovation",
		},
		{
			id: 6,
			title: "Faculty Excellence - Meet Our Professors",
			description: "Get to know our distinguished faculty members who bring years of industry experience and academic excellence to guide your learning journey.",
			videoId: "vfejl7hPB5o", // Replace with actual YouTube video ID
			thumbnail: "https://img.youtube.com/vi/vfejl7hPB5o/hqdefault.jpg",
			duration: "9:27",
			views: "28K views",
			uploadDate: "1 month ago",
			category: "Faculty",
		},
		{
			id: 7,
			title: "Cultural Heritage – Kathakali Performance",
			description:
				"Highlighting our commitment to cultural enrichment, students experience traditional art forms like Kathakali that foster appreciation for India’s rich heritage and diversity.",
			videoId: "iTuZCpmGbOs",
			thumbnail: "https://img.youtube.com/vi/iTuZCpmGbOs/hqdefault.jpg",
			duration: "4:56",
			views: "15K views",
			uploadDate: "3 weeks ago",
			category: "Campus Highlights",
		},
		{
			id: 8,
			title: "Startup Incubation - Entrepreneurship Support",
			description: "Explore our startup incubation center where student entrepreneurs receive mentorship, funding support, and resources to launch their ventures.",
			videoId: "ERs-M_5rY64", // Replace with actual YouTube video ID
			thumbnail: "https://img.youtube.com/vi/ERs-M_5rY64/hqdefault.jpg",
			duration: "11:03",
			views: "22K views",
			uploadDate: "2 weeks ago",
			category: "Entrepreneurship",
		},
	];

	const features = [
		{
			id: 1,
			title: "State-of-the-Art Campus",
			description: "Modern facilities designed for comprehensive career development with smart classrooms and labs.",
			image: "/cimage_ai.jpg",
			icon: Building2,
			stats: "50+ Labs",
			color: "from-blue-500 to-cyan-600",
		},
		{
			id: 2,
			title: "Expert Faculty",
			description: "Industry professionals and PhD holders with years of experience guiding students towards success.",
			image: "/imag_fac.jpg",
			icon: Users,
			stats: "200+ Experts",
			color: "from-emerald-500 to-teal-600",
		},
		{
			id: 3,
			title: "NAAC Accredited",
			description: "Recognized by NAAC for academic excellence, quality standards, and industry-driven learning.",
			image: "/image_naac.webp",
			icon: Award,
			stats: "15+ Awards",
			color: "from-purple-500 to-indigo-600",
		},
	];

	return (
		<section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 px-4 relative overflow-hidden">
			{/* Background decorative elements */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
				<div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
			</div>

			<div className="max-w-7xl mx-auto relative z-10">
				{/* Header Section */}
				<div className="text-center mb-20">
					<h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
						Your Gateway to
						<span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"> Success</span>
					</h2>

					<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Discover what makes CIMAGE the preferred choice for ambitious students seeking excellence in education and career growth.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{features.map((feature) => {
						const IconComponent = feature.icon;
						return (
							<div
								key={feature.id}
								className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 cursor-pointer"
								onMouseEnter={() => setHoveredCard(feature.id)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								{/* Image Container */}
								<div className="relative h-48 overflow-hidden">
									<img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

									{/* Icon overlay */}
									<div className="absolute top-4 right-4">
										<div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}>
											<IconComponent className="w-6 h-6 text-white" />
										</div>
									</div>

									{/* Stats badge */}
									<div className="absolute bottom-4 left-4">
										<div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-gray-700/50">
											<span className="text-white font-semibold text-sm">{feature.stats}</span>
										</div>
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									<h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">{feature.title}</h3>
									<p className="text-gray-300 text-sm leading-relaxed mb-4">{feature.description}</p>

									{/* Learn More Button */}
									<div className="flex items-center text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors duration-300">
										Learn More
										<ArrowRight className={`w-4 h-4 ml-2 transition-transform duration-300 ${hoveredCard === feature.id ? "translate-x-1" : ""}`} />
									</div>
								</div>

								{/* Hover gradient overlay */}
								<div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
							</div>
						);
					})}
				</div>

				{/* Video Gallery Section */}
				<div className="mb-20">
					<div className="text-center mb-12">
						<h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Experience CIMAGE in
							<span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent"> Action</span>
						</h3>
						<p className="text-gray-300 max-w-2xl mx-auto">Watch our campus life, success stories, and industry insights through our video gallery</p>
					</div>

					{/* Video Tiles Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{videos.map((video, index) => (
							<div
								key={video.id}
								className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
									selectedVideo?.id === video.id ? "border-red-500/70 shadow-lg shadow-red-500/20" : "border-gray-700/50 hover:border-red-500/50"
								}`}
								onClick={createVideoHandler(video)}
							>
								{/* Thumbnail */}
								<div className="relative h-32 overflow-hidden">
									<img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
									<div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

									{/* Play Button */}
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-all duration-300 group-hover:scale-110">
											<div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
										</div>
									</div>

									{/* Duration */}
									<div className="absolute bottom-2 right-2">
										<span className="px-2 py-1 bg-black/70 text-white text-xs rounded">{video.duration}</span>
									</div>
								</div>

								{/* Video Info */}
								<div className="p-4">
									<h4 className="text-white font-semibold text-sm mb-1 group-hover:text-red-300 transition-colors duration-300 line-clamp-2">{video.title}</h4>
									<p className="text-gray-400 text-xs">
										{video.views} • {video.uploadDate}
									</p>
								</div>

								{/* Selection indicator */}
								{selectedVideo?.id === video.id && isVideoModalOpen && (
									<div className="absolute top-2 right-2">
										<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Video Modal Popup */}
				{isVideoModalOpen && selectedVideo && (
					<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
						<div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
							{/* Close Button */}
							<button
								onClick={closeVideoModal}
								className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all duration-300 group"
							>
								<X className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
							</button>

							{/* Video Player */}
							<div className="relative aspect-video bg-black">
								<iframe
									src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
									title={selectedVideo.title}
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
									className="w-full h-full"
								></iframe>
							</div>

							{/* Video Details */}
							<div className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center mb-3">
											<div className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm mr-3">{selectedVideo.category}</div>
											<div className="text-gray-400 text-sm">
												{selectedVideo.views} • {selectedVideo.uploadDate} • {selectedVideo.duration}
											</div>
										</div>
										<h3 className="text-xl font-bold text-white mb-3">{selectedVideo.title}</h3>
										<p className="text-gray-300 text-sm leading-relaxed">{selectedVideo.description}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Call to Action */}
				<div className="text-center">
					<div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer group shadow-2xl hover:shadow-blue-500/25">
						Join CIMAGE Today
						<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
					</div>
					<p className="text-gray-400 mt-4 text-sm">Ready to transform your career? Get started with our comprehensive courses.</p>
				</div>
			</div>
		</section>
	);
};

export default WhyChooseUs;
