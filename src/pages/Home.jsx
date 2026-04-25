import {
    SignInButton,
    SignUpButton,
    UserButton,
    SignedIn,
    SignedOut,
    useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// Greeting component
function Greeting() {
    const { user } = useUser();
    const displayName = user?.firstName || user?.username || "To-Do";

    return (
        <h2 className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Welcome, {displayName} !!
        </h2>
    );
}

export default function Home() {
    return (
        <div className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center p-6 overflow-hidden selection:bg-blue-500/20">

            {/* Background Glows - Subtler for white theme */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 blur-[120px] rounded-full pointer-events-none" />

            {/* Navbar */}
            <header className="w-full max-w-5xl flex justify-between items-center py-6 px-6 md:px-0 z-20">

                <SignedIn>
                    <Greeting />
                </SignedIn>

                <SignedOut>
                    <div className="text-2xl font-black tracking-tighter cursor-default group">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                            <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                        </span>
                        <span className="text-blue-500 animate-pulse">!</span>
                    </div>
                </SignedOut>

                <nav className="flex items-center gap-8">
                    <Link
                        to="/about"
                        className="relative md:flex items-center gap-8 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors py-2 group"
                    >
                        ABOUT
                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>

                    <Link
                        to="/contact"
                        className="relative md:flex items-center gap-8 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors py-2 group"
                    >
                        CONTACT
                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>

                    <SignedIn>
                        <div className="pl-4 border-l border-gray-200">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </nav>
            </header>

            {/* Main */}
            <main className="flex-1 flex flex-col justify-center items-center w-full max-w-sm z-10">
                <div className="bg-white backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200/50 w-full">

                    {/* Logo */}
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 transition-all duration-500 hover:scale-105 hover:border-blue-200 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] cursor-default">
                        <span className="text-2xl font-bold text-blue-600 transition-colors duration-300">T</span>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                            <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                        </h1>
                        <p className="text-gray-500 text-md mt-2">
                            Manage tasks effortlessly...
                        </p>
                    </div>

                    {/* Logged OUT */}
                    <SignedOut>
                        <div className="space-y-3">
                            <SignInButton mode="modal">
                                <button className="w-full py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton mode="modal">
                                <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                                    Create Account
                                </button>
                            </SignUpButton>
                        </div>
                    </SignedOut>

                    {/* Logged IN */}
                    <SignedIn>
                        <div className="text-center">
                            <p className="text-gray-500 text-sm mb-6">
                                You are all set to manage your tasks.
                            </p>

                            <Link
                                to="/todos"
                                className="block w-full py-3 rounded-xl font-bold tracking-wide text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 
               transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 text-center"
                            >
                                Add Some Tasks...
                            </Link>
                        </div>
                    </SignedIn>
                </div>

                <p className="text-gray-400 text-xs mt-8">
                    Powered by Clerk &bull; Tailwind CSS
                </p>
            </main>
        </div>
    );
}