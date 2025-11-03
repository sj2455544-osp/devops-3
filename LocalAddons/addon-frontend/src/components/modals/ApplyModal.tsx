"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { X, UploadCloud } from "lucide-react";

// Define the props the component will accept
interface ApplyModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	onSubmit: (data: FormData) => void;
}

export default function ApplyModal({ isOpen, onClose, title, onSubmit }: ApplyModalProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [cvFile, setCvFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Effect to handle the "Escape" key press
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleEsc);
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	// Reset form when modal is closed
	useEffect(() => {
		if (!isOpen) {
			setName("");
			setEmail("");
			setPhone("");
			setCvFile(null);
			setIsSubmitting(false);
		}
	}, [isOpen]);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setCvFile(e.target.files[0]);
		}
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("phone", phone);
		if (cvFile) {
			formData.append("cv", cvFile);
		}

		// Pass the FormData object to the parent component's onSubmit function
		onSubmit(formData);

		// You might want to close the modal upon submission, or show a success message.
		// For this example, we'll let the parent component handle closing.
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" aria-labelledby="dialog-title" role="dialog" aria-modal="true">
			{/* Overlay */}
			<div className="absolute inset-0" onClick={onClose}></div>

			{/* Mobile-friendly scrollable container */}
			<div className="w-full h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto flex items-center justify-center p-4">
				{/* Modal Panel */}
				<div className="relative w-full max-w-md p-6 my-4 sm:my-8 bg-slate-900 rounded-lg shadow-xl border border-slate-700 animate-fade-in-up">
					{/* Header */}
					<div className="flex items-center justify-between pb-4 border-b border-slate-700">
						<h2 id="dialog-title" className="text-xl font-semibold text-white">
							{title}
						</h2>
						<button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close dialog">
							<X size={24} />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="mt-6 space-y-6">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-slate-300">
								Full Name
							</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
								placeholder="John Doe"
							/>
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-slate-300">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
								placeholder="you@example.com"
							/>
						</div>
						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-slate-300">
								Phone Number
							</label>
							<input
								type="tel"
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
								className="mt-1 block w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
								placeholder="+91 12345 67890"
							/>
						</div>

						{/* Styled File Input */}
						<div>
							<label className="block text-sm font-medium text-slate-300">Upload CV</label>
							<label
								htmlFor="cv-upload"
								className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md cursor-pointer hover:border-cyan-500 transition-colors"
							>
								<div className="space-y-1 text-center">
									<UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
									<div className="flex text-sm text-slate-400">
										<span className="relative font-medium text-cyan-400 hover:text-cyan-300">Click to upload</span>
										<input id="cv-upload" name="cv-upload" type="file" required className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
									</div>
									{cvFile ? <p className="text-xs text-green-400 pt-2">{cvFile.name}</p> : <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 5MB</p>}
								</div>
							</label>
						</div>

						{/* Footer */}
						<div className="pt-2">
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Submitting..." : "Submit Application"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
