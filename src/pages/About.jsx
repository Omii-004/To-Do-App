import { Link } from "react-router-dom";

export default function About() {
    return (
        // Changed bg to white, text to gray-900
        <div className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 md:p-12 overflow-hidden selection:bg-blue-500/20">
            {/* Background Glows - Swapped to light blue/indigo tints */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full pointer-events-none" />

            {/* Main Container */}
            <main className="w-full max-w-4xl mt-10 z-10">
                <div className="bg-gray-50/50 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-8 md:p-12 shadow-xl shadow-gray-200/50">

                    <h1 className="relative inline-block text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] group cursor-default">
                        About <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                        {/* The Gradient Underline - stays consistent with the new gradient */}
                        <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 scale-x-0 transition-transform duration-500 ease-out origin-left group-hover:scale-x-100" />
                    </h1>

                    <p className="text-gray-600 text-lg leading-relaxed mb-10">
                        <span className="text-blue-600">&lt;</span> <span className="text-blue-600 italic">To-Do </span><span className="text-blue-600">/&gt;</span> is an intelligent task management platform designed for the modern user.
                        Our mission is to bridge the gap between complex task orchestration and intuitive,
                        lightning-fast design. Built by an AI/ML student, <span className="text-blue-600">&lt;</span> <span className="text-blue-600 italic">To-Do </span><span className="text-blue-600">/&gt;</span> provides a clean,
                        distraction-free environment to track your goals and optimize your workflow.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Tech Stack Card */}
                        <div className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:border-gray-300 hover:shadow-lg">
                            <h3 className="font-bold text-lg mb-4 text-blue-600 transition-colors group-hover:text-blue-500">
                                The Tech Stack
                            </h3>
                            <ul className="text-gray-600 space-y-3 group-hover:text-gray-700 transition-colors">
                                <li>• React + Vite</li>
                                <li>• Tailwind CSS</li>
                                <li>• Clerk Authentication</li>
                            </ul>
                        </div>

                        {/* Mission Card */}
                        <div className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:border-gray-300 hover:shadow-lg">
                            <h3 className="font-bold text-lg mb-4 text-indigo-600 transition-colors group-hover:text-indigo-500">
                                My Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                                To create efficient, scalable systems that enhance human productivity through elegant, modern UI/UX design.
                            </p>
                        </div>
                    </div>

                    {/* Developer Profile Section */}
                    <div className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:border-gray-300 hover:shadow-lg flex flex-col md:flex-row items-center gap-6">

                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0 transition-transform duration-500 group-hover:scale-105">
                            OT
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Omkar Tamalwad</h3>
                            <p className="text-blue-600 text-sm font-medium mb-3 transition-colors duration-300 group-hover:text-blue-500">
                                AI & ML Student • AI Enthusiast
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4 transition-colors duration-300 group-hover:text-gray-700">
                                I am an AI & ML student on a mission to bridge the gap between intelligent systems and the modern web.
                                <span className="text-blue-600">&lt;</span> <span className="text-blue-600 italic">To-Do </span><span className="text-blue-600">/&gt;</span>
                                is my initiative to build scalable, high-performance tools using modern stacks like React, and Clerk.
                            </p>

                            <a
                                href="mailto:omkartamalwad04@gmail.com"
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                omkartamalwad04@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center border-t border-gray-200 pt-10 mt-10">
                        <Link
                            to="/"
                            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 text-sm font-medium"
                        >
                            <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Home
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p className="text-center text-gray-400 text-xs mt-8 font-bold">
                        Built with passion &bull; 2026
                    </p>
                    <p className="text-center text-gray-400 text-xs py-1">
                        © {new Date().getFullYear()} To-Do. All rights reserved.
                    </p>
                </div>
            </main >
        </div >
    );
}