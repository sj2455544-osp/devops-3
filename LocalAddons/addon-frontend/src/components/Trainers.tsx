import React from 'react';
import Image from 'next/image';

const trainersData = [
    {
        id: '01',
        company: 'Google',
        title: 'Learn from Google Engineers',
        description: 'Master algorithms, system design, and scalable architecture from professionals who built Google Search, Gmail, and YouTube.',
        logo: '/logos/google.png'
    },
    {
        id: '02',
        company: 'Microsoft',
        title: 'Azure & Cloud Expertise',
        description: 'Get hands-on training in cloud computing, AI services, and enterprise solutions from Microsoft Azure architects.',
        logo: '/logos/azure.png'
    },
    {
        id: '03',
        company: 'Amazon',
        title: 'AWS & Leadership Principles',
        description: 'Learn scalable systems, microservices, and Amazon\'s leadership principles from senior AWS engineers.',
        logo: '/logos/aws.png'
    },
    {
        id: '04',
        company: 'Meta',
        title: 'Social Scale & Innovation',
        description: 'Build applications that serve billions of users. Learn React, GraphQL, and distributed systems at Meta scale.',
        logo: '/logos/kuber.png'
    },
    {
        id: '05',
        company: 'Apple',
        title: 'iOS & Hardware Integration',
        description: 'Dive deep into iOS development and Swift, learning to build seamless applications for Apple’s ecosystem.',
        logo: '/logos/apple.png'
    },
    {
        id: '06',
        company: 'Netflix',
        title: 'Streaming & Distributed Systems',
        description: 'Understand how to design highly available and resilient systems that power global content delivery.',
        logo: '/logos/netflix.png'
    },
];

export default function TrainersSection() {
    return (
        <section className="relative py-24 bg-slate-950 overflow-hidden">
            {/* Background Radial Gradient */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full bg-blue-500/10 animate-pulse-slow-reverse filter blur-[100px]" />
                <div className="absolute w-80 h-80 rounded-full bg-cyan-500/10 animate-pulse-fast-reverse delay-500 filter blur-[120px]" />
                <div className="absolute w-72 h-72 rounded-full bg-purple-500/10 animate-pulse-slow filter blur-[110px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                            Trainers from Top Tech Companies
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        This is not just training—it&#39;s your career pathway from beginner to industry professional.
                    </p>
                </div>

                {/* Main Content Grid with Standie */}
                <div className="grid md:grid-cols-3 gap-12 items-center">
                    {/* Left Column: Trainer Steps */}
                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-8">
                            {trainersData.map((trainer) => (
                                <div key={trainer.id} className="group relative">
                                    {/* Background Highlight */}
                                    <div className={`absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <div className="relative z-10 flex items-start space-x-6">
                                        {/* Company Logo - Now a simple container */}
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 transform group-hover:scale-110`}>
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src={trainer.logo}
                                                    alt={`${trainer.company} logo`}
                                                    layout="fill"
                                                    objectFit="contain"
                                                    className="transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                        {/* Content */}
                                        <div className="flex-grow">
                                            <h3 className="text-2xl font-bold text-white mb-2">{trainer.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{trainer.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Standie Image */}
                    <div className="relative w-full h-96 md:h-[600px] flex items-center justify-center">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/model.png"
                                alt="Our expert trainer"
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}