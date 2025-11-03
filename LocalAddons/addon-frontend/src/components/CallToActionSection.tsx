import React from 'react';
import {MailboxIcon, PhoneIcon} from "lucide-react";

export default function CallToActionSection() {
    return (
        <section className="py-20 relative overflow-hidden bg-slate-950">
            {/* Background Radial Gradient */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 animate-pulse-slow-reverse filter blur-[100px]" />
                <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 animate-pulse-fast-reverse delay-500 filter blur-[120px]" />
                <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 animate-pulse-slow filter blur-[110px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="relative p-8 md:p-12 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                            Ready to Transform Your Career?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have successfully transitioned from classroom to industry with CIMAGE Add-On Courses.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                        {/* Primary CTA */}
                        <a
                            href="#"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform-gpu hover:scale-105 shadow-lg
                             bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        >
                            Start Your Journey
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                        {/* New Call Option */}
                        <a
                            href="tel:+919835024444"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform-gpu hover:scale-105 shadow-lg
                             bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                        >
                            <PhoneIcon className="mr-2" />
                            Call Us
                        </a>
                        {/* New Email Option */}
                        <a
                            href="mailto:info@cimage.in"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform-gpu hover:scale-105 shadow-lg
                             bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
                        >
                            <MailboxIcon className="mr-2" />
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}