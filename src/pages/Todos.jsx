import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../supabase";

import { Trash2, CheckCircle2, Circle, CheckSquare, Pencil } from "lucide-react";
import { X } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";





export default function Todos() {
    const { user } = useUser();

    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [editId, setEditId] = useState(null);

    // ✅ FETCH TODOS FROM SUPABASE
    useEffect(() => {
        if (user) fetchTodos();
    }, [user]);

    const fetchTodos = async () => {
        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });

        if (!error) setTodos(data);
    };

    // ✅ ADD TODO
    const addTodo = async () => {

        if (!input.trim()) return;

        if (editId) {
            // delete old todo
            await supabase.from("todos").delete().eq("id", editId);
            setEditId(null);
        }

        const { error } = await supabase.from("todos").insert([
            {
                text: input,
                done: false,
                user_id: user.id,
            },
        ]);

        if (!error) {
            setInput("");
            fetchTodos();
        }
    };

    // ✅ EDIT START
    const startEdit = (todo) => {
        setInput(todo.text);
        setEditId(todo.id);
    };

    // ✅ TOGGLE DONE
    const toggleTodo = async (id, current) => {
        await supabase
            .from("todos")
            .update({ done: !current })
            .eq("id", id);

        fetchTodos();
    };

    // ✅ DELETE TODO
    const deleteTodo = async (id) => {
        await supabase.from("todos").delete().eq("id", id);
        fetchTodos();
    };

    //OpenRouter Chat State
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi 👋 Ask me anything!" }
    ]);

    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatLoading]);




    // ✅ SEND MESSAGE TO OPENROUTER
    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        const newMessages = [
            ...messages,
            { role: "user", content: chatInput }
        ];

        setMessages(newMessages);
        setChatInput("");
        setChatLoading(true);

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Todo App"
                },

                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: newMessages
                })
            });

            const data = await res.json();
            console.log("API RESPONSE:", data);


            const reply = data.choices?.[0]?.message?.content || "No response";

            setMessages([
                ...newMessages,
                { role: "assistant", content: reply }
            ]);

        } catch (err) {
            console.log(err);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-white text-gray-900 flex flex-col">

                {/* Navbar */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
                    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold tracking-tight text-gray-900">
                                <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-500">
                                {["Home", "About", "Contact"].map((item) => (
                                    <Link
                                        key={item}
                                        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                        className="relative group py-2 transition-colors hover:text-gray-900"
                                    >
                                        <span className="tracking-widest">{item.toUpperCase()}</span>
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                ))}
                            </nav>
                            <div className="pl-6 border-l border-gray-200">
                                <UserButton afterSignOutUrl="/" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="max-w-3xl mx-auto w-full px-6 py-12">

                    {/* Input */}
                    <div className="flex gap-3 mb-8 max-w-xl mx-auto">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addTodo()}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Add your task here..."
                        />

                        <button
                            onClick={addTodo}
                            className="px-5 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-md text-sm"
                        >
                            {editId ? "Save" : "Add"}
                        </button>
                    </div>

                    {/* List */}
                    <div className="max-w-xl mx-auto">

                        {todos.length > 0 && (
                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <h2 className="px-4 bg-white text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">
                                        Your <span className="text-blue-600">&lt;</span> <span className="text-black">To-Do's!! </span><span className="text-blue-600">/&gt;</span>
                                    </h2>
                                </div>
                            </div>
                        )}

                        {todos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-19 text-center animate-in fade-in zoom-in duration-500">
                                {/* Icon Container with a subtle glow */}
                                <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                    <CheckSquare size={40} className="text-blue-500" />
                                </div>

                                {/* Main Content */}
                                <h3 className="text-xl font-bold text-white mb-2">Your list is clear</h3>
                                <p className="text-gray-500 max-w-sm mb-8">
                                    You've completed all your tasks or haven't added any yet.
                                    Start your productivity journey by adding a task above.
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                    {["Buy Groceries", "Finish Project", "Call Mom"].map((suggestion) => (
                                        <span
                                            key={suggestion}
                                            className="px-3 py-1 bg-white/[0.03] border border-blue-500/30 rounded-full text-xs text-gray-400 cursor-default transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:border-blue-500/50"
                                        >
                                            {suggestion}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todos.map((t) => (
                                    <div
                                        key={t.id}
                                        className="group flex justify-between items-center bg-white border border-gray-200 px-6 py-3 rounded-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => toggleTodo(t.id, t.done)}>
                                                {t.done ? (
                                                    <CheckCircle2 className="text-green-500" />
                                                ) : (
                                                    <Circle size={20} className="text-gray-400" />
                                                )}
                                            </button>

                                            <span className={t.done ? "line-through text-gray-400" : ""}>
                                                {t.text}
                                            </span>
                                        </div>

                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => startEdit(t)}
                                                className="text-gray-400 hover:text-blue-400"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => deleteTodo(t.id)}
                                                className="text-gray-400 hover:text-red-400"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center animate-in fade-in duration-1000">
                                    <p className="text-sm text-gray-400 italic">
                                        "Success is the sum of small efforts, repeated day in and day out."
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                                        <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                                        <span>
                                            {todos.filter(t => t.done).length} / {todos.length} tasks completed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* CHAT PANEL */}
                    {/* FLOATING CHAT BUTTON */}
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-5 right-5 w-14 h-14 rounded-full 
    bg-blue-600 text-white shadow-lg 
    flex items-center justify-center
    hover:bg-blue-700 hover:scale-110 active:scale-95
    transition-all duration-200"
                    >
                        <MessageCircle size={24} />
                    </button>



                    {/* BACKDROP */}
                    {isChatOpen && (
                        <div
                            onClick={() => setIsChatOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                    )}


                    {/* SIDE PANEL (ALWAYS RENDERED FOR ANIMATION) */}
                    <div
                        className={`fixed top-0 right-0 h-full 
    ${isFullScreen ? "w-full" : "w-[350px]"} 
    bg-white/80 backdrop-blur-md shadow-lg z-50 flex flex-col 
    transform transition-all duration-300 ease-in-out 
    ${isChatOpen ? "translate-x-0" : "translate-x-full"}`}
                    >


                        {/* HEADER */}
                        <div className="flex justify-between items-center px-4 py-3 border-b bg-white/60 backdrop-blur-md">
                            <h2 className="font-semibold text-gray-800">AI Assistant</h2>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="p-1 rounded-md hover:bg-gray-200 transition"
                                >
                                    {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>

                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="p-1 rounded-md hover:bg-gray-200 transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>


                        {/* CHAT AREA */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

                            <div className="max-w-2xl mx-auto w-full">

                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap
    ${msg.role === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-200 text-gray-900"
                                                }`}
                                        >
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ children }) => (
                                                        <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
                                                    ),
                                                    h2: ({ children }) => (
                                                        <h2 className="text-lg font-semibold mt-3 mb-2">{children}</h2>
                                                    ),
                                                    p: ({ children }) => (
                                                        <p className="mb-2 leading-relaxed">{children}</p>
                                                    ),
                                                    ul: ({ children }) => (
                                                        <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
                                                    ),
                                                    ol: ({ children }) => (
                                                        <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
                                                    ),
                                                    li: ({ children }) => <li>{children}</li>,
                                                    code({ inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={oneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="rounded-lg text-sm"
                                                            >
                                                                {String(children).replace(/\n$/, "")}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>

                                        </div>
                                    </div>
                                ))}

                                {chatLoading && (
                                    <div className="flex justify-start animate-in fade-in zoom-in duration-300">
                                        <div className="bg-white/[0.03] border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-2xl backdrop-blur-sm">
                                            {/* Dot 1 */}
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s]" />
                                            {/* Dot 2 */}
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                                            {/* Dot 3 */}
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />



                            </div>
                        </div>


                        {/* INPUT */}
                        <div className="border-t bg-white/70 backdrop-blur-md p-3">
                            <div className="max-w-2xl mx-auto flex gap-2">

                                <input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Message AI Assistant..."
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={!chatInput.trim()}
                                    className={`h-10 w-10 flex items-center justify-center rounded-full transition
    ${chatInput.trim()
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    <Send size={18} />
                                </button>



                            </div>
                        </div>

                    </div>





                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 mt-auto bg-white">
                    <div className="max-w-5xl mx-auto px-2 py-1 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <div className="text-gray-800 font-bold tracking-widest text-xs uppercase">
                            <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                        </div>
                        <p className="text-gray-500">
                            © {new Date().getFullYear()} To-Do. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );

}
