"use client";

import React from "react";
import { TrendingUp, Sparkles, Users } from "lucide-react";
import { communityFeatures, timelineItems } from "@/data/community";

const Community = () => {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* Header */}
					<div className="mb-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
							<div>
								<h1 className="text-3xl font-bold text-white mb-2">
									<span className="text-cyan-400">Community</span>
								</h1>
								<p className="text-slate-400 text-lg">Connect with fellow learners and grow together</p>
							</div>
							<div className="flex items-center space-x-4">
								<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25">
									<Sparkles size={20} />
									<span>Coming Soon</span>
									<Sparkles size={20} />
								</div>
							</div>
						</div>
					</div>

					{/* Hero Section */}
					<div className="text-center mb-12">
						<div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
							<Users size={40} className="text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">Join Our Learning Community</h2>
						<p className="text-slate-400 max-w-2xl mx-auto">Connect with fellow learners, share your progress, and grow together in our vibrant learning community.</p>
					</div>

					{/* Features Preview */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{communityFeatures.map((feature) => {
							const IconComponent = feature.icon;
							return (
								<div key={feature.id} className="bg-slate-900 rounded-lg p-6 border border-slate-800 text-center group hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-cyan-500/10">
									<div className={`w-12 h-12 ${feature.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-colors`}>
										<IconComponent className="text-current h-6 w-6" />
									</div>
									<h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
									<p className="text-slate-400 text-sm">{feature.description}</p>
								</div>
							);
						})}
					</div>

					{/* Newsletter Signup */}
					<div className="bg-slate-900 rounded-lg p-8 border border-slate-800 shadow-2xl shadow-cyan-500/10 text-center">
						<TrendingUp className="text-cyan-400 h-12 w-12 mx-auto mb-4" />
						<h3 className="text-2xl font-bold text-white mb-4">Be the First to Know</h3>
						<p className="text-slate-400 mb-6 max-w-md mx-auto">
							Get notified when our community features launch. Join our waitlist to be among the first to experience the future of learning communities.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
								disabled
							/>
							<button
								className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled
							>
								Join Waitlist
							</button>
						</div>
						<p className="text-slate-500 text-sm mt-4">We&apos;ll send you updates about community features and early access opportunities.</p>
					</div>

					{/* Timeline/Coming Soon Info */}
					<div className="bg-slate-900 rounded-lg p-6 border border-slate-800 shadow-2xl shadow-cyan-500/10">
						<h3 className="text-xl font-semibold text-white mb-4">What&apos;s Coming</h3>
						<div className="space-y-4">
							{timelineItems.map((item) => (
								<div key={item.id} className="flex items-start space-x-4">
									<div className={`w-8 h-8 ${item.isActive ? "bg-cyan-500/10" : "bg-slate-600"} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
										<div className={`w-3 h-3 ${item.isActive ? "bg-cyan-400" : "bg-slate-400"} rounded-full`}></div>
									</div>
									<div>
										<h4 className={`font-medium ${item.isActive ? "text-white" : "text-slate-400"}`}>{item.title}</h4>
										<p className={`text-sm ${item.isActive ? "text-slate-400" : "text-slate-500"}`}>{item.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
	);
};

export default Community;
