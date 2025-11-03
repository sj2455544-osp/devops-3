"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { Search, Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
	const handleGoBack = useCallback(() => {
		window.history.back();
	}, []);
	return (
		<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Main Content */}
				<div className="text-center">
					{/* 404 Illustration */}
					<div className="relative mb-8">
						<div className="inline-flex items-center justify-center w-32 h-32 bg-slate-900 rounded-full border border-slate-800 shadow-2xl shadow-cyan-500/10">
							<span className="text-6xl font-bold text-slate-600">404</span>
						</div>
					</div>

					{/* Error Message */}
					<div className="mb-8">
						<h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
							Page <span className="text-cyan-400">Not Found</span>
						</h1>
						<div className="max-w-md mx-auto">
							<p className="text-slate-400 text-lg mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
							<p className="text-slate-500 text-sm">It may have been moved, deleted, or you entered the wrong URL.</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Link
							href="/"
							className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/25"
						>
							<Home className="w-5 h-5 mr-2" />
							Back to Home
						</Link>

						<Link
							href="/dashboard"
							className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
						>
							<BookOpen className="w-5 h-5 mr-2" />
							Go to Dashboard
						</Link>
					</div>

					{/* Go Back Link */}
					<div className="mb-8">
						<button onClick={handleGoBack} className="inline-flex items-center text-slate-400 hover:text-cyan-400 transition-colors text-sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Go back to previous page
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
