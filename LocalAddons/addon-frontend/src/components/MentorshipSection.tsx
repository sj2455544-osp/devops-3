'use client'
import React from 'react';
import { Briefcase, Users, TrendingUp, ArrowRight, Lightbulb } from 'lucide-react';

const features = [
    {
        icon: <Briefcase size={32} className="text-cyan-400" />,
        title: "Global Project Experience",
        description: "Work side by side with diverse global teams on impactful, real-world projects. Enhance your portfolio with experiences that truly stand out."
    },
    {
        icon: <Users size={32} className="text-cyan-400" />,
        title: "Personalized 1-to-1 Mentorship",
        description: "Get personalized guidance from industry leaders worldwide to accelerate your growth and sharpen your professional edge."
    },
    {
        icon: <TrendingUp size={32} className="text-cyan-400" />,
        title: "A Thriving Network",
        description: "Step into our community of innovators, creators, and future leaders—where skills meet opportunities and careers take flight."
    },
];

export default function MentorshipSection() {
    return (
        <section id="mentorship" className="relative bg-slate-950 py-12 sm:py-12">
            <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"></div>
            <div className="absolute inset-0 -z-20 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent"></div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Project Exposure & Mentorship
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-slate-400">
                        Real Projects. Real Mentors. Real Growth.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col rounded-2xl bg-slate-900/50 p-8 ring-1 ring-slate-800 transition-all duration-300 hover:ring-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold leading-7 text-white">{feature.title}</h3>
                            <p className="mt-2 flex-auto text-base leading-7 text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <a
                        href="#"
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                    >
                        Join the CIMAGE AI Community Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </div>
            </div>
        </section>
    );
}