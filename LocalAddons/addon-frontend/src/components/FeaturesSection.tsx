'use client'
import React from 'react';
import { BookIcon, GlobeIcon, GroupIcon, LucideAirplay, ChevronsRight } from "lucide-react";

// Data structure updated for the new minimalist design
const roadmapSteps = [
    {
        id: '01',
        title: 'Learn from Industry Experts',
        description: 'Get trained by professionals who are already working in your dream companies. Gain practical knowledge and industry-specific insights.',
        icon: <BookIcon className="w-8 h-8" />,
        bgColor: 'from-blue-500 to-purple-600',
        accentColor: 'border-blue-500', // For the accent border
        shadowColor: 'shadow-blue-500/50'
    },
    {
        id: '02',
        title: 'Paid Internship with Global Clients',
        description: 'Experience a paid internship with CIMAGE AI, working on live projects for clients in USA & Canada. Build hands-on skills while earning and contributing to real business.',
        icon: <GlobeIcon className="w-8 h-8" />,
        bgColor: 'from-emerald-500 to-cyan-500',
        accentColor: 'border-emerald-500',
        shadowColor: 'shadow-emerald-500/50'
    },
    {
        id: '03',
        title: 'Project Exposure & Mentorship',
        description: 'Collaborate with diverse teams and strengthen your portfolio. Receive 1-to-1 mentorship from global industry leaders to sharpen your professional edge.',
        icon: <GroupIcon className="w-8 h-8" />,
        bgColor: 'from-rose-500 to-pink-500',
        accentColor: 'border-rose-500',
        shadowColor: 'shadow-rose-500/50'
    },
    {
        id: '04',
        title: 'Showcase Talent at IIT & NIT Hackathons',
        description: 'Participate in prestigious hackathons and showcase your skills on national platforms. This is your opportunity to gain recognition and network with the best.',
        icon: <LucideAirplay className="w-8 h-8" />,
        bgColor: 'from-orange-500 to-amber-500',
        accentColor: 'border-orange-500',
        shadowColor: 'shadow-orange-500/50'
    }
];

// Re-usable component for the timeline nodes (unchanged)
const TimelineNode = ({ step, index }: { step: typeof roadmapSteps[0], index: number }) => (
    <div
        className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center text-white
                    bg-gradient-to-br ${step.bgColor} ring-4 ring-slate-950
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${step.shadowColor}
                    ${index % 2 === 0 ? 'left-full -translate-x-1/2' : 'right-full translate-x-1/2'}`}
    >
        {step.icon}
    </div>
);

export default function RoadmapSection() {
    return (
        <section id="roadmap" className="relative py-24 bg-slate-950 overflow-hidden">
            {/* Background Radial Gradient */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 animate-pulse-slow-reverse filter blur-[100px]" />
                <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 animate-pulse-fast-reverse delay-500 filter blur-[120px]" />
                <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 animate-pulse-slow filter blur-[110px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                            Your Roadmap to Success
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                        Experience a comprehensive learning journey designed to transform you into an industry-ready professional.
                    </p>
                </div>

                {/* Desktop Roadmap Container */}
                <div className="relative hidden md:block">
                    {/* The Z-shaped path */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[40%] -translate-x-1/2" aria-hidden="true">
                        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-[repeating-linear-gradient(to_right,theme(colors.cyan.500)_0,theme(colors.cyan.500)_4px,transparent_4px,transparent_10px)]" />
                        <div className="absolute top-1/4 left-1/2 w-0.5 h-1/4 bg-[repeating-linear-gradient(to_bottom,theme(colors.cyan.500)_0,theme(colors.emerald.500)_4px,transparent_4px,transparent_10px)]" />
                        <div className="absolute top-2/4 right-0 w-full h-0.5 bg-[repeating-linear-gradient(to_left,theme(colors.emerald.500)_0,theme(colors.emerald.500)_4px,transparent_4px,transparent_10px)]" />
                        <div className="absolute top-2/4 left-1/2 w-0.5 h-1/4 bg-[repeating-linear-gradient(to_bottom,theme(colors.emerald.500)_0,theme(colors.rose.500)_4px,transparent_4px,transparent_10px)]" />
                        <div className="absolute top-3/4 left-0 w-full h-0.5 bg-[repeating-linear-gradient(to_right,theme(colors.rose.500)_0,theme(colors.rose.500)_4px,transparent_4px,transparent_10px)]" />

                        {/* Animated Chevrons */}
                        <ChevronsRight className="absolute top-1/4 left-1/4 -translate-y-1/2 text-cyan-500 w-8 h-8 opacity-80 animate-pulse" style={{filter: 'drop-shadow(0 0 5px currentColor)'}}/>
                        <ChevronsRight className="absolute top-2/4 right-1/4 -translate-y-1/2 text-emerald-500 w-8 h-8 opacity-80 animate-pulse transform -scale-x-100" style={{filter: 'drop-shadow(0 0 5px currentColor)'}}/>
                        <ChevronsRight className="absolute top-3/4 left-1/4 -translate-y-1/2 text-rose-500 w-8 h-8 opacity-80 animate-pulse" style={{filter: 'drop-shadow(0 0 5px currentColor)'}}/>
                    </div>

                    {/* Roadmap Steps */}
                    <div className="relative grid grid-cols-2 gap-x-32">
                        {roadmapSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className="relative group col-span-1"
                                style={{
                                    gridRowStart: index + 1,
                                    gridColumnStart: index % 2 === 0 ? 1 : 2,
                                    marginTop: index === 0 ? 0 : '8rem',
                                }}
                            >
                                {/* NEW: Simple, Sleek, and Professional Card Design */}
                                <div className={`relative p-8 rounded-lg shadow-md bg-slate-900 
                                    transition-all duration-300 ease-in-out group-hover:bg-slate-800 group-hover:-translate-y-2 group-hover:shadow-xl
                                    ${index % 2 === 0 ? 'text-right border-r-4' : 'text-left border-l-4'} ${step.accentColor}`}>
                                    <h3 className="text-2xl font-bold text-slate-100">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed mt-2">
                                        {step.description}
                                    </p>
                                </div>
                                <TimelineNode step={step} index={index} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Roadmap Container */}
                <div className="relative md:hidden">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[repeating-linear-gradient(to_bottom,theme(colors.cyan.500)_0,theme(colors.cyan.500)_4px,transparent_4px,transparent_10px)]" />
                    <div className="flex flex-col gap-12">
                        {roadmapSteps.map((step) => (
                            <div key={step.id} className="relative group pl-20">
                                <div className={`absolute top-1/2 -translate-y-1/2 left-8 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white
                                    bg-gradient-to-br ${step.bgColor} ring-4 ring-slate-950 transition-all duration-300
                                    group-hover:scale-110 group-hover:shadow-lg ${step.shadowColor}`}>
                                    {step.icon}
                                </div>
                                {/* Applying the new card design to mobile */}
                                <div className={`relative p-6 rounded-lg shadow-md bg-slate-900 border-l-4 ${step.accentColor}
                                    transition-all duration-300 group-hover:bg-slate-800`}>
                                    <h3 className="text-xl font-bold text-slate-100">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed mt-2">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}