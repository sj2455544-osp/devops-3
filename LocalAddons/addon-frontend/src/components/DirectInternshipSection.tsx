"use client";

import React, { useState, useCallback } from "react";
import { CircleDollarSign, Globe, Briefcase, Users, ArrowRight } from "lucide-react";
import ApplyModal from "./modals/ApplyModal"; // Make sure this path is correct for your project

// The benefits list remains the same
const benefits = [
	{
		icon: <CircleDollarSign className="h-6 w-6 text-cyan-400" />,
		text: "Gain hands-on experience while getting paid.",
	},
	{
		icon: <Globe className="h-6 w-6 text-cyan-400" />,
		text: "Work with global clients in USA & Canada.",
	},
	{
		icon: <Briefcase className="h-6 w-6 text-cyan-400" />,
		text: "Build a strong portfolio that shines.",
	},
	{
		icon: <Users className="h-6 w-6 text-cyan-400" />,
		text: "Be part of CIMAGE AI, solving real business challenges.",
	},
];

export default function DirectInternshipSection() {
	// State to control the modal's visibility
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	// Function to handle the form data when submitted from the modal
	const handleFormSubmit = (formData: FormData) => {
		console.log("Application Data:", Object.fromEntries(formData.entries()));

		// Here you would typically send the data to your API endpoint
		// For example: await fetch('/api/apply', { method: 'POST', body: formData });

		alert(`Thank you, ${formData.get("name")}! Your application has been received.`);
		setIsModalOpen(false); // Close the modal on successful submission
	};

	return (
		<>
			<section id="direct-internship" className="relative bg-slate-950 py-24 sm:py-32">
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-slate-900/50"></div>
					<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-purple-600/20 blur-[100px]"></div>
				</div>
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2 lg:items-center">
						{/* Text Content */}
						<div className="text-left">
							<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">CIMAGE AI Paid Internships – Step into Real Projects</h2>
							<p className="mt-4 text-lg leading-8 text-slate-300">
								Already skilled? Why just learn when you can earn and work on live client projects? If you’re confident in your abilities, jump straight into our paid internship
								program.
							</p>
							<dl className="mt-10 space-y-6">
								{benefits.map((benefit, index) => (
									<div key={index} className="relative flex items-center gap-x-3">
										<dt className="flex-none rounded-lg bg-slate-800 p-2">{benefit.icon}</dt>
										<dd className="text-base leading-7 text-slate-300">{benefit.text}</dd>
									</div>
								))}
							</dl>
							<div className="mt-12">
								<button
									onClick={handleOpenModal} // This now opens the modal
									className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
								>
									Apply Now & Turn Your Skills into Global Impact
									<ArrowRight className="ml-2 h-5 w-5" />
								</button>
							</div>
						</div>

						{/* Visual Graphic */}
						<div className="relative flex items-center justify-center h-80 lg:h-96">
							<div className="absolute w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
							<div className="relative w-full max-w-sm h-64 sm:h-80 lg:h-full rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
								<img src="/cimage_ai.jpg" alt="CIMAGE AI" className="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* The Modal component is rendered here */}
			<ApplyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Internship Application" onSubmit={handleFormSubmit} />
		</>
	);
}
