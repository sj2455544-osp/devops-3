"use client";

import React, { useEffect } from "react";
import { X, Video } from "lucide-react";

interface VideoModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoUrl: string | null;
	title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
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

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" aria-labelledby="video-dialog-title" role="dialog" aria-modal="true">
			{/* Overlay */}
			<div className="absolute inset-0" onClick={onClose}></div>

			{/* Mobile-friendly scrollable container */}
			<div className="w-full h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto flex items-center justify-center p-2 sm:p-4">
				{/* Modal Panel */}
				<div className="relative w-full max-w-4xl my-2 sm:my-4 bg-slate-900 rounded-lg sm:rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700 animate-fade-in-up overflow-hidden">
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors bg-black/50 sm:bg-transparent"
						aria-label="Close video"
					>
						<X size={20} className="sm:w-6 sm:h-6" />
					</button>

					{/* Video Player */}
					<div className="aspect-video w-full">
						{videoUrl && videoUrl.trim() !== "" ? (
							<iframe
								src={videoUrl}
								title={title}
								className="w-full h-full rounded-lg sm:rounded-none"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						) : (
							<div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-lg sm:rounded-none">
								<div className="text-center text-slate-400">
									<Video className="w-16 h-16 mx-auto mb-4" />
									<p className="text-lg font-medium mb-2">Video not available</p>
									<p className="text-sm opacity-75">This content doesn&apos;t have a video yet</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
