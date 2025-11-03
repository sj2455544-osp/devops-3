import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CallToActionSection from "@/components/CallToActionSection";
import TrainersSection from "@/components/Trainers";
import TechnologyWall from "@/components/LogoWall";
import DirectInternshipSection from "@/components/DirectInternshipSection";
import MentorshipSection from "@/components/MentorshipSection";
import DynamicWorkshops from "@/components/DynamicWorkshops";

export default function Home() {
	return (
		<div className="min-h-screen bg-black">
			{/* ===== HERO SECTION ===== */}
			<section id="home">
				<HeroSection />
			</section>

			<section id="features">
				<FeaturesSection />
			</section>

			<section id="trainers">
				<TrainersSection />
			</section>
			<DynamicWorkshops />
			<TechnologyWall />
			<DirectInternshipSection />
			<MentorshipSection />
			<section id="contact">
				<CallToActionSection />
			</section>
		</div>
	);
}
