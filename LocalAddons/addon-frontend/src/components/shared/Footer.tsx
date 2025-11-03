import React from "react";
import Link from "next/link";
import { Facebook, FacebookIcon, LetterTextIcon, LocateIcon, MessageCircle, PhoneIcon, YoutubeIcon } from "lucide-react";

// Define the type for the link data objects
interface FooterLinkItem {
	name: string;
	url: string;
}

// Define the type for the props of the FooterLink component
interface FooterLinkProps {
	url: string;
	name: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ url, name }) => (
	<li>
		<a href={url} className="text-gray-400 hover:text-blue-400 transition-colors py-1 block text-sm">
			{name}
		</a>
	</li>
);

const Footer: React.FC = () => {
	const academicPrograms: FooterLinkItem[] = [
		{ name: "BCA (AKU & PPU)", url: "https://cimage.in/courses/best-bca-college-in-patna-1" },
		{ name: "BBA (AKU)", url: "https://cimage.in/courses/best-bba-college-in-patna-2" },
		{ name: "BBM (PPU)", url: "https://cimage.in/courses/best-bbm-college-in-patna-4" },
		{ name: "B.Com (AKU)", url: "https://cimage.in/courses/best-bcom-college-in-patna-5" },
		{ name: "B.Sc IT (PPU)", url: "https://cimage.in/courses/best-bsc-it-college-in-patna-3" },
	];

	const legalLinks: FooterLinkItem[] = [
		{ name: "Privacy Policy", url: "/privacy-policy" },
		{ name: "Terms & Conditions", url: "/tnc" },
		{ name: "Refund policy", url: "/refund-policy" },
		{ name: "Admin login", url: "/admin-login" },
	];

	return (
		<footer className="bg-slate-900 text-gray-300 border-t border-slate-700">
			{/* Main Footer Content */}
			<div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* About Section with Logo */}
					<section className="space-y-6 md:col-span-2 lg:col-span-1">
						<div className="space-y-4">
							<Link href="/public" aria-label="CIMAGE Home">
								<img src="/cimage.webp" alt="CIMAGE Institutional Logo" className="h-16 w-auto filter brightness-150" />
							</Link>
							<p className="text-gray-400 leading-relaxed text-sm">
								Recognized as the premier institution for BCA and BBA in Patna, CIMAGE delivers exceptional placements and quality education in IT & Management. Affiliated with AKU &
								PPU. Awarded Best B-School of East India by ASSOCHAM and exclusive IIT Bombay remote center in Bihar.
							</p>
						</div>
					</section>

					{/* Institutional Resources */}
					<section className="space-y-6">
						<h2 className="text-lg font-semibold text-white">Our Institutions</h2>
						<ul className="space-y-3">
							<FooterLink url="https://cimagecollege.com/" name="CIMAGE Professional College" />
							<FooterLink url="https://catalystcollege.in/" name="Catalyst College" />
							<FooterLink url="https://cimagelawcollege.com/" name="CIMAGE Law College" />
						</ul>
					</section>

					{/* Admissions */}
					<section className="space-y-6">
						<h2 className="text-lg font-semibold text-white">Admissions</h2>
						<ul className="space-y-3">
							<FooterLink url="https://cimage.in/admissions" name="Admission Process" />
							<FooterLink url="https://cimage.in/cimage-affiliation" name="Affiliation Details" />
							<FooterLink url="https://cimage.in/cimage-fee-structure" name="Fee Structure" />
							<FooterLink url="https://cimage.in/student-credit-card" name="Student Credit Card" />
						</ul>
					</section>

					{/* Contact Info & Social Icons */}
					<section className="space-y-6">
						<h2 className="text-lg font-semibold text-white">Contact Us</h2>
						<address className="not-italic space-y-4 text-gray-400 text-sm">
							<div className="flex items-start gap-3">
								<PhoneIcon className="text-blue-500 mt-0.5 flex-shrink-0" />
								<a href="tel:+919835024444" className="hover:text-blue-400 transition-colors">
									+91-9835024444
								</a>
							</div>
							<div className="flex items-start gap-3">
								<LetterTextIcon className="text-blue-500 mt-0.5 flex-shrink-0" />
								<a href="mailto:info@cimage.in" className="hover:text-blue-400 transition-colors">
									info@cimage.in
								</a>
							</div>
							<div className="flex items-start gap-3">
								<LocateIcon className="text-blue-500 mt-0.5 flex-shrink-0" />
								<span>S.K. Puri Park, Boring Road, Patna</span>
							</div>
						</address>

						{/* Social Icons */}
						<div className="flex items-center gap-3 pt-2">
							<a
								href="https://facebook.com/cimage"
								aria-label="Facebook"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105"
							>
								<FacebookIcon className="w-4 h-4" />
							</a>
							<a
								href="https://youtube.com/@cimagepatna"
								aria-label="YouTube"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105"
							>
								<YoutubeIcon className="w-4 h-4" />
							</a>
							<a
								href="https://wa.me/919835024444"
								aria-label="WhatsApp"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105"
							>
								<MessageCircle className="w-4 h-4" />
							</a>
							<a
								href="https://twitter.com/cimagepatna"
								aria-label="LinkedIN"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-sky-500 hover:bg-sky-600 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105"
							>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9 9 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 2s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5.5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
								</svg>
							</a>
							<a
								href="https://instagram.com/cimagepatna"
								aria-label="Instagram"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-105"
							>
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm9.25 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
								</svg>
							</a>
						</div>
					</section>
				</div>
			</div>

			{/* Academic Programs Bar */}
			<div className="bg-slate-800 border-y border-slate-700 py-6">
				<div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-6">
						<h3 className="text-sm font-semibold text-gray-300 whitespace-nowrap">Academic Programs:</h3>
						<div className="flex flex-wrap justify-center lg:justify-end gap-x-8 gap-y-3">
							{academicPrograms.map((program, index) => (
								<a key={index} href={program.url} className="text-gray-400 hover:text-blue-400 text-sm whitespace-nowrap transition-colors font-medium">
									{program.name}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Footer Bottom Panel */}
			<div className="bg-slate-950 py-6">
				<div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row justify-between items-center gap-6">
						<div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
							{legalLinks.map((link, index) => (
								<a key={index} href={link.url} className="hover:text-blue-400 transition-colors">
									{link.name}
								</a>
							))}
						</div>
						<p className="text-xs text-gray-500 text-center lg:text-right">© 2025 VIJAYAM Educational Trust. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
