"use client";

import React, { useEffect } from "react";
import { X, AlertCircle, Clock, Mail, Bell } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";

interface EnrollmentClosedModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function EnrollmentClosedModal({ isOpen, onClose }: EnrollmentClosedModalProps) {
	const { enrollmentClosedModal } = useModalStore();

	// Get course information from modal store
	const courseName = enrollmentClosedModal.data?.courseName;

	// Effect to handle the "Escape" key press
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleEsc);

		// Cleanup the event listener on component unmount
		return () => {
			window.removeEventListener("keydown", handleEsc);
		};
	}, [onClose]);

	// Prevent scrolling on the body when the modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	const handleNotifyMe = () => {
		// You could implement a notification signup here
		// For now, we'll just close the modal and show a success message
		onClose();
		alert("We will notify you when enrollment reopens for this course!");
	};

	const handleContactSupport = () => {
		// Open contact support (could be email, phone, or another modal)
		window.location.href = "mailto:support@cimage.in?subject=Enrollment Inquiry for " + (courseName || "Course");
	};

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" aria-labelledby="dialog-title" role="dialog" aria-modal="true">
			{/* Overlay */}
			<div className="absolute inset-0" onClick={onClose}></div>

			{/* Mobile-friendly scrollable container */}
			<div className="w-full h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto flex items-start sm:items-center justify-center p-4">
				{/* Modal Panel */}
				<div className="relative w-full max-w-md p-6 sm:p-8 my-4 sm:my-8 bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700 animate-fade-in-up">
					{/* Close Button */}
					<button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close dialog">
						<X size={24} />
					</button>

					{/* Header */}
					<div className="text-center mb-6">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/20">
							<AlertCircle size={32} className="text-slate-300" />
						</div>
						<h2 id="dialog-title" className="text-2xl font-bold text-white mb-2">
							Enrollment Closed
						</h2>
						<p className="text-slate-400 text-sm">
							{courseName ? (
								<>
									Sorry, enrollment for <span className="text-cyan-400 font-semibold">{courseName}</span> is currently closed.
								</>
							) : (
								"Sorry, enrollment for this course is currently closed."
							)}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<button onClick={onClose} className="w-full px-6 py-3 text-slate-400 hover:text-white transition-colors">
							Close
						</button>
					</div>

					<p className="text-xs text-slate-500 text-center mt-4">Keep an eye on our website or follow us on social media for announcements about new course sessions.</p>
				</div>
			</div>
		</div>
	);
}
