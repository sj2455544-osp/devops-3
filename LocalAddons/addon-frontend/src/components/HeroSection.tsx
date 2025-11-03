"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookIcon, GlobeIcon, GroupIcon, LucideAirplay } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import AuthModal from "@/components/modals/AuthModal";

export default function HeroSection() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isLoaded, setIsLoaded] = useState(false);
	const [activeStep, setActiveStep] = useState<number | null>(null);
	const [rocketPosition, setRocketPosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLElement>(null);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	const { isAuthenticated } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		setIsLoaded(true);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = containerRef.current?.getBoundingClientRect();
			if (rect) {
				setMousePosition({
					x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
					y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
				});
			}
		};

		const animateRocket = () => {
			const time = Date.now() * 0.001;
			setRocketPosition({
				x: Math.sin(time) * 30,
				y: Math.cos(time * 0.8) * 20,
			});
			requestAnimationFrame(animateRocket);
		};

		window.addEventListener("mousemove", handleMouseMove);
		animateRocket();

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// Simplified and stylized company logos with slightly larger icons
	const companies = [
		{ name: "Google", logo: <img src="/logos/google.png" alt="Google" className="w-6 h-6 rounded-full object-contain" /> },
		{ name: "Microsoft", logo: <img src="/logos/azure.png" alt="Microsoft Azure" className="w-6 h-6 rounded-full object-contain" /> },
		{ name: "Amazon", logo: <img src="/logos/aws.png" alt="AWS" className="w-6 h-6 rounded-full object-contain" /> },
		{ name: "Meta", logo: <div className="text-emerald-400 font-bold text-base w-6 h-6 flex items-center justify-center rounded-full bg-white/10">M</div> },
		{ name: "Apple", logo: <img src="/logos/apple.png" alt="Apple" className="w-6 h-6 rounded-full object-contain" /> },
		{ name: "Netflix", logo: <img src="/logos/netflix.png" alt="Netflix" className="w-6 h-6 rounded-full object-contain" /> },
		{ name: "Kubernetes", logo: <img src="/logos/kuber.png" alt="Kubernetes" className="w-6 h-6 rounded-full object-contain" /> },
	];


    const handleJourneyClick = () => {
        const section = document.getElementById("courses");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            console.warn("Courses section not found!");
        }
    };

	// CIMAGE pathway steps
	const pathwaySteps = [
		{
			number: "01",
			title: "Learn from Industry Experts",
			description: "Get trained by professionals who are already working in your dream companies.",
			bgColor: "from-orange-500 to-amber-500",
			icon: <BookIcon />,
			position: { x: 15, y: 70 },
		},
		{
			number: "02",
			title: "Paid Internship with Global Clients",
			description: "Experience a paid internship with CIMAGE AI, working on live projects for clients in USA & Canada.",
			bgColor: "from-emerald-600 to-amber-500",
			icon: <GlobeIcon />,
			position: { x: 30, y: 50 },
		},
		{
			number: "03",
			title: "Project Exposure & Mentorship",
			description: "Collaborate with diverse teams, and strengthen your portfolio. Receive 1-to-1 mentorship from global industry leaders.",
			bgColor: "from-purple-600 to-rose-500",
			icon: <GroupIcon />,
			position: { x: 65, y: 65 },
		},
		{
			number: "04",
			title: "Showcase Talent at IIT & NIT Hackathons",
			description: "Participate in prestigious hackathons and showcase your skills on national platforms.",
			bgColor: "from-pink-500 to-rose-500",
			icon: <LucideAirplay />,
			position: { x: 80, y: 35 },
		},
	];

	return (
		<>
			<section ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black pt-20">
				{/* Simple Background Elements */}
				<div className="absolute inset-0">
					{/* Floating particles - Made more visible */}
					{[...Array(15)].map((_, i) => (
						<div
							key={i}
							className="absolute rounded-full opacity-40" // Increased opacity
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								width: `${Math.random() * 10 + 5}px`, // Increased size
								height: `${Math.random() * 10 + 5}px`, // Increased size
								backgroundColor: i % 4 === 0 ? "#f97316" : i % 4 === 1 ? "#3b82f6" : i % 4 === 2 ? "#8b5cf6" : "#ec4899",
								transform: `translate(${mousePosition.x * (3 + i)}px, ${mousePosition.y * (3 + i)}px)`,
								filter: "blur(1px)", // Added blur for a softer glow
							}}
						/>
					))}

					{/* Glowing orbs */}
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full filter blur-3xl" />
					<div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full filter blur-3xl" />
				</div>

				{/* Main Content */}
				<div className="relative z-10 w-full px-6 py-20 flex items-center justify-center min-h-screen">
					<div className="max-w-7xl mx-auto w-full">
						{/* Content Section */}
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div>
								{/* Main Headline */}
								<div className={`mb-8 transform transition-all duration-1000 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"}`}>
									<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-4">
										<span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-200">CIMAGE</span>
										<span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-200 mt-2">Add-On Courses</span>
									</h1>
								</div>

								{/* Subtitle */}
								<div className={`mb-6 transform transition-all duration-1200 delay-200 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}>
									<p className="text-xl md:text-2xl text-amber-300 font-semibold mb-4">From classroom to career – your pathway to success.</p>
									<p className="text-lg text-slate-300 leading-relaxed max-w-lg mb-6">
										This is not just an add-on course – it&apos;s your career pathway from classroom to industry.
									</p>
								</div>

								{/* Company Logos Section */}
								<div className={`mb-8 transform transition-all duration-1400 delay-600 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
									<p className="text-sm text-cyan-200 mb-4 font-medium">Recruiters from industry leaders:</p>
									<div className="flex flex-wrap gap-2 items-center">
										{companies.map((company, index) => (
											<div
												key={index}
												className="opacity-80 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center w-8 h-8"
												style={{
													transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
												}}
											>
												{company.logo}
											</div>
										))}
									</div>
								</div>

								{/* CTA Section */}
								<div className={`mb-12 transform transition-all duration-1400 delay-400 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}>
									<div className="flex flex-col sm:flex-row gap-6 items-start">
										<button
											onClick={handleJourneyClick}
											className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300 flex items-center overflow-hidden"
										>
											<span className="relative z-10">{"Start your Journey Now"}</span>
											<svg
												className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
											<div className="absolute inset-0 bg-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</button>
									</div>
								</div>
							</div>

							{/* Right Visual Section - 3D Pathway */}
							<div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
								{/* Pathway Line - Made more visible */}
								<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
									<defs>
										<linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
											<stop offset="0%" stopColor="#f59e0b" />
											<stop offset="25%" stopColor="#10b981" />
											<stop offset="50%" stopColor="#7c3aed" />
											<stop offset="75%" stopColor="#fb7185" />
											<stop offset="100%" stopColor="#f59e0b" />
										</linearGradient>
									</defs>
									<path
										d="M 15 70 Q 30 60 30 50 Q 30 40 65 65 Q 75 70 80 35"
										stroke="url(#pathGradient)"
										strokeWidth="1.5" // Increased stroke width
										fill="none"
										className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" // Added subtle glow
									/>
								</svg>

								{/* Pathway Steps */}
								{pathwaySteps.map((step, index) => (
									<div
										key={index}
										className={`absolute transform transition-all duration-700 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 "}`}
										style={{
											left: `${step.position.x}%`,
											top: `${step.position.y}%`,
											transform: `translate(-50%, -50%) translate(${mousePosition.x * (2 + index)}px, ${mousePosition.y * (1 + index * 0.5)}px)`,
											transitionDelay: `${index * 150}ms`,
										}}
										onMouseEnter={() => setActiveStep(index)}
										onMouseLeave={() => setActiveStep(null)}
									>
										{/* Step Number Circle */}
										<div className="relative group cursor-pointer z-10">
											<div
												className={`w-16 h-16 bg-gradient-to-br ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm`}
											>
												<div className="transform group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
											</div>

											{/* Hover Card */}
											<div
												className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 ${
													activeStep === index ? "opacity-100" : "group-hover:opacity-100"
												} transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-[9999] w-72`}
											>
												<div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-slate-700/50">
													<div className="flex items-start mb-3">
														<div className={`mr-3 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${step.bgColor} text-white`}>{step.number}</div>
														<h3 className="font-bold text-lg text-white mt-1">{step.title}</h3>
													</div>
													<p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
												</div>
											</div>
										</div>
									</div>
								))}

								{/* Flying Rocket - Simple and Clean */}
								<div
									className={`absolute top-10 right-10 transform transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"}`}
									style={{
										transform: `translate(${rocketPosition.x}px, ${rocketPosition.y}px) rotate(${rocketPosition.x * 0.05}deg)`,
									}}
								>
									<div className="relative w-16 h-20">
										<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-white to-slate-200 rounded-t-lg shadow-lg" />
										<div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-white to-slate-300 rounded" />
										{/* Rocket Fins */}
										<div className="absolute top-10 left-2 w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b transform -rotate-12" />
										<div className="absolute top-10 right-2 w-2 h-6 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b transform rotate-12" />
										{/* Rocket Window */}
										<div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-800 rounded-full" />
										{/* Simple Rocket Flame - Made more visible */}
										<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-6">
											<div
												className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-amber-400 to-yellow-300 rounded-b-full opacity-90"
												style={{ filter: "drop-shadow(0 0 5px #fbbf24)" }} // Added glow
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
		</>
	);
}
