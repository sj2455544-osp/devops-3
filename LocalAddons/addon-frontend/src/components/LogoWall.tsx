'use client'
import React from 'react';
import { VscAzure } from "react-icons/vsc";

import {
    FaReact, FaAngular, FaVuejs, FaNodeJs, FaJava, FaDocker, FaJenkins, FaAws, FaPython
} from 'react-icons/fa';
import {
    SiNextdotjs, SiDjango, SiSpringboot, SiGraphql, SiMysql, SiPostgresql,
    SiMongodb, SiKotlin, SiFlutter, SiTerraform, SiKubernetes, SiGithubactions,
    SiTensorflow, SiPytorch, SiLangchain, SiApachespark, SiGooglecloud,
    SiFigma, SiEthereum
} from 'react-icons/si';
import { TbBrandReactNative } from "react-icons/tb";

// A curated and deduplicated list of technologies for the logo wall
const technologies = [
    { name: 'React', icon: <FaReact /> },
    { name: 'Angular', icon: <FaAngular /> },
    { name: 'Vue.js', icon: <FaVuejs /> },
    { name: 'Next.js', icon: <SiNextdotjs /> },
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Python', icon: <FaPython /> },
    { name: 'Django', icon: <SiDjango /> },
    { name: 'Java', icon: <FaJava /> },
    { name: 'Spring Boot', icon: <SiSpringboot /> },
    { name: 'GraphQL', icon: <SiGraphql /> },
    { name: 'MySQL', icon: <SiMysql /> },
    { name: 'PostgreSQL', icon: <SiPostgresql /> },
    { name: 'MongoDB', icon: <SiMongodb /> },
    { name: 'Flutter', icon: <SiFlutter /> },
    { name: 'React Native', icon: <TbBrandReactNative /> },
    { name: 'Kotlin', icon: <SiKotlin /> },
    { name: 'Docker', icon: <FaDocker /> },
    { name: 'Kubernetes', icon: <SiKubernetes /> },
    { name: 'Jenkins', icon: <FaJenkins /> },
    { name: 'Terraform', icon: <SiTerraform /> },
    { name: 'GitHub Actions', icon: <SiGithubactions /> },
    { name: 'AWS', icon: <FaAws /> },
    { name: 'Google Cloud', icon: <SiGooglecloud /> },
    { name: 'Azure', icon: <VscAzure /> },
    { name: 'TensorFlow', icon: <SiTensorflow /> },
    { name: 'PyTorch', icon: <SiPytorch /> },
    { name: 'LangChain', icon: <SiLangchain /> },
    { name: 'Apache Spark', icon: <SiApachespark /> },
    { name: 'Figma', icon: <SiFigma /> },
    { name: 'Ethereum', icon: <SiEthereum /> },
];

const TechnologyLogo = ({ icon, name }: { icon: React.ReactNode, name: string }) => (
    <div className="flex-shrink-0 mx-6 md:mx-8 flex items-center justify-center h-24">
        <div
            className="text-5xl md:text-6xl text-slate-500 transition-all duration-300 hover:text-cyan-400 transform hover:scale-110"
            title={name}
        >
            {icon}
        </div>
    </div>
);

export default function TechnologyWall() {
    // Duplicate the array for a seamless loop
    const extendedTechRow1 = [...technologies.slice(0, 15), ...technologies.slice(0, 15)];
    const extendedTechRow2 = [...technologies.slice(15), ...technologies.slice(15)];

    return (
        <section id="technologies" className="relative py-24 bg-slate-950 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                            Technologies We Cover
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Our curriculum is built on the most in-demand technologies used by leading companies worldwide.
                    </p>
                </div>
            </div>

            <div className="relative w-full overflow-hidden group">
                <div className="absolute z-10 top-0 left-0 w-1/6 h-full bg-gradient-to-r from-slate-950 to-transparent pointer-events-none"></div>
                <div className="absolute z-10 top-0 right-0 w-1/6 h-full bg-gradient-to-l from-slate-950 to-transparent pointer-events-none"></div>

                {/* Row 1: Scrolls left */}
                <div className="flex group-hover:[animation-play-state:paused] animate-infinite-scroll">
                    {extendedTechRow1.map((tech, index) => (
                        <TechnologyLogo key={`r1-${index}`} icon={tech.icon} name={tech.name} />
                    ))}
                </div>

                {/* Row 2: Scrolls right */}
                <div className="flex mt-8 group-hover:[animation-play-state:paused] animate-infinite-scroll-reverse">
                    {extendedTechRow2.map((tech, index) => (
                        <TechnologyLogo key={`r2-${index}`} icon={tech.icon} name={tech.name} />
                    ))}
                </div>
            </div>
        </section>
    );
}