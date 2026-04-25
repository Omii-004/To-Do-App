import { Link } from "react-router-dom";

export default function Contact() {
    return (
        // Changed bg to white, text to gray-900
        <div className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 md:p-12 overflow-hidden selection:bg-blue-500/20">
            {/* Background Glows - Adjusted for light theme */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full pointer-events-none" />

            <main className="w-full max-w-2xl mt-16 z-10">
                {/* Main Container - Changed to solid white with subtle border */}
                <div className="bg-gray-50/50 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-10 shadow-xl shadow-gray-200/50">

                    <h1 className="relative inline-block text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] group cursor-default">
                        Contact Me!
                        <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 scale-x-0 transition-transform duration-500 ease-out origin-left group-hover:scale-x-100" />
                    </h1>

                    <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                        Have a question, feedback, or want to collaborate? Feel free to reach out via email
                        or check out my repositories on GitHub.
                    </p>

                    {/* Contact Card */}
                    <div className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-500 hover:border-gray-300 hover:shadow-lg flex flex-col items-center text-center gap-6">

                        {/* Email */}
                        <a
                            href="mailto:omkartamalwad04@gmail.com"
                            className="inline-flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium font-mono tracking-tight"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            omkartamalwad04@gmail.com
                        </a>

                        {/* GitHub */}
                        <a
                            href="https://github.com/omii-004"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium font-mono tracking-tight"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.26 1.23-.26 1.86v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            github.com/omii-004
                        </a>
                    </div>

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
            </main>
        </div>
    );
}