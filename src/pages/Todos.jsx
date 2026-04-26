import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../supabase";

import { Trash2, CheckCircle2, Circle, CheckSquare, Pencil } from "lucide-react";
import { X } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Maximize2, Minimize2 } from "lucide-react";
import { History } from "lucide-react";
import { Send } from "lucide-react";
import { Calendar, Clock } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


export default function Todos() {
    const { user } = useUser();

    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [editId, setEditId] = useState(null);

    // FETCH TODOS FROM SUPABASE
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

    // ADD TODO
    const addTodo = async () => {
        if (!input.trim()) return;

        // Edit mode
        if (editId) {
            const prevTodos = todos;

            //1. Update UI instantly
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === editId
                        ? { ...todo, text: input }
                        : todo
                )
            );

            setEditId(null);
            setInput("");

            //2. Update DB in background
            const { error } = await supabase
                .from("todos")
                .update({ text: input })
                .eq("id", editId);

            //rollback if error
            if (error) {
                setTodos(prevTodos);
            }

            return;
        }

        // ADD MODE
        const tempTodo = {
            id: Date.now(), // temporary id
            text: input,
            done: false,
            user_id: user.id,
        };

        //instant UI update
        setTodos((prev) => [...prev, tempTodo]);
        setInput("");

        const { data, error } = await supabase
            .from("todos")
            .insert([
                {
                    text: input,
                    done: false,
                    user_id: user.id,
                },
            ])
            .select();

        if (!error && data) {
            // replace temp todo with real one
            setTodos((prev) =>
                prev.map((t) => (t.id === tempTodo.id ? data[0] : t))
            );
        }
    };


    // EDIT START
    const startEdit = (todo) => {
        setInput(todo.text);
        setEditId(todo.id);
    };

    // TOGGLE DONE
    const toggleTodo = async (id) => {
        //1. update UI instantly
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            )
        );

        //2. update DB in background
        const { error } = await supabase
            .from("todos")
            .update({ done: true }) // you can toggle properly if needed
            .eq("id", id);

        if (error) {
            //rollback if error
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, done: !todo.done } : todo
                )
            );
        }
    };


    // DELETE TODO
    const deleteTodo = async (id) => {
        const prevTodos = todos;

        //1. remove instantly
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        //2. delete in DB
        const { error } = await supabase
            .from("todos")
            .delete()
            .eq("id", id);

        if (error) {
            //rollback
            setTodos(prevTodos);
        }
    };


    // OpenRouter Chat State
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const chatEndRef = useRef(null);

    const checkRateLimit = async () => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // start of today (midnight)

        const { data, error } = await supabase
            .from("rate_limit")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", todayStart.toISOString());

        if (error) return false;

        return data.length < 5; //5 messages per day
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, chatLoading]);

    const extractTodo = (text) => {
        const cleaned = text
            .replace(/^add (as )?todo[:\s]*/i, "")
            .trim();

        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    };

    // SEND MESSAGE TO OPENROUTER
    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        //check rate limit
        const allowed = await checkRateLimit();

        if (!allowed) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "⚠️ Daily limit reached. You can only send 5 messages per day.",
                },
            ]);
            return;
        }

        //prepare UI message
        const newMessages = [
            ...messages,
            { role: "user", content: chatInput },
        ];

        setMessages(newMessages);
        setChatInput("");
        setChatLoading(true);

        //save user message in DB
        await supabase.from("messages").insert([
            {
                user_id: user.id,
                role: "user",
                content: chatInput,
            },
        ]);

        //log for rate limiting
        await supabase.from("rate_limit").insert([
            {
                user_id: user.id,
            },
        ]);

        //HANDLE TODO COMMAND 
        const isTodoCommand = /^add (as )?todo[:\s]/i.test(chatInput);
        const isDeleteCompletedCommand =
            /delete|remove|clear/i.test(chatInput) &&
            /completed|done/i.test(chatInput);

        if (isTodoCommand) {
            const todoText = extractTodo(chatInput);

            if (todoText) {
                const { data, error } = await supabase
                    .from("todos")
                    .insert([
                        {
                            text: todoText,
                            done: false,
                            user_id: user.id,
                            created_at: new Date().toISOString(),
                        },
                    ])
                    .select();

                if (!error && data) {
                    setTodos((prev) => [...prev, ...data]);
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: error
                            ? "❌ Failed to add todo. Try again."
                            : `✅ Added to your tasks: "${todoText}"`
                    }
                ]);

            }

            setChatLoading(false);
            return;
        }
        if (isDeleteCompletedCommand) {
            const { error } = await supabase
                .from("todos")
                .delete()
                .eq("user_id", user.id)
                .eq("done", true);

            if (!error) {
                setTodos((prev) => prev.filter((todo) => !todo.done));
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error
                        ? "❌ Failed to delete completed todos"
                        : "🗑️ Deleted all completed todos"
                }
            ]);

            setChatLoading(false);
            return;
        }


        //ONLY CALL AI IF NOT TODO
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

            const reply = data.choices?.[0]?.message?.content || "No response";

            await supabase.from("messages").insert([
                {
                    user_id: user.id,
                    role: "assistant",
                    content: reply,
                },
            ]);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: reply }
            ]);

        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "❌ Error fetching response"
                }
            ]);
        }

        setChatLoading(false);
    };

    const [showHistory, setShowHistory] = useState(false);
    const [historyMessages, setHistoryMessages] = useState([]);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });

        if (!error) {
            setHistoryMessages(data);
        }
    };

    const openHistory = async () => {
        await fetchHistory();
        setShowHistory(true);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const [showAiPopup, setShowAiPopup] = useState(false);
    useEffect(() => {
        setShowAiPopup(true);

        const timer = setTimeout(() => {
            setShowAiPopup(false);
        }, 4000); // auto close after 4s

        return () => clearTimeout(timer);
    }, []);

    const [showWelcome, setShowWelcome] = useState(true);
    useEffect(() => {
        if (messages.length === 0) {
            setShowWelcome(true);
        } else {
            setShowWelcome(false);
        }
    }, [messages]);


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
                            <nav className="flex items-center gap-4 md:gap-8 text-xs font-medium text-gray-500
">
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
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Add your task here..."
                        />

                        <button
                            onClick={addTodo}
                            className="px-5 py-1 bg-blue-500 hover:bg-blue-700 text-white rounded-full text-sm"
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
                                    <span className="block mt-2 text-gray-400">
                                        following are some suggestions to get you going!
                                    </span>
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 px-4">
                                    {["Buy Groceries", "Finish Project", "Call Mom"].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInput(suggestion)}
                                            className="px-4 py-1.5 rounded-full text-xs font-medium 
             bg-gray-800 border border-gray-700 text-gray-200 
             hover:bg-blue-600 hover:border-blue-500 hover:text-white 
             transition-all duration-200"

                                        >
                                            {suggestion}
                                        </button>
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

                                            <div className="flex flex-col">

                                                {/* Todo text */}
                                                <span className={t.done ? "line-through text-gray-400" : ""}>
                                                    {t.text}
                                                </span>

                                                {/* Date + Time */}
                                                <div className="text-[10px] text-gray-400 mt-1 flex gap-3 items-center">

                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {t.created_at && formatDate(t.created_at)}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {t.created_at && formatTime(t.created_at)}
                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex gap-3 transition">
                                            <button
                                                onClick={() => startEdit(t)}
                                                className="text-black"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => deleteTodo(t.id)}
                                                className="text-red-500"
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
                    {showAiPopup && (
                        <div className="fixed bottom-20 right-5 bg-white shadow-lg border px-4 py-2 rounded-lg text-sm animate-bounce z-50">
                            👋 Try asking the AI assistant!
                        </div>
                    )}

                    {/* SIDE PANEL */}
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
                        <button
                            onClick={openHistory}
                            className="fixed bottom-20 right-5 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition"
                        >
                            <History size={20} />
                        </button>

                        {/* CHAT AREA */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

                            <div className="max-w-2xl mx-auto w-full">
                                {showWelcome && (
                                    <div className="p-4 space-y-3">

                                        <h2 className="text-sm font-semibold text-gray-600">
                                            👋 Welcome! Try these:
                                        </h2>

                                        {/* Card 1 - Add a todo */}
                                        <button
                                            onClick={() => {
                                                setChatInput("Add todo Buy groceries");
                                                setShowWelcome(false);
                                            }}
                                            className="w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                                        >
                                            ➕ Add a todo
                                            <p className="text-xs text-gray-500">Try: "Add todo Buy groceries"</p>
                                        </button>

                                        {/* Card 2 - Delete completed todos */}
                                        <button
                                            onClick={() => {
                                                setChatInput("Delete completed todos");
                                                setShowWelcome(false);
                                            }}
                                            className="w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
                                        >
                                            🗑️ Delete completed todos
                                            <p className="text-xs text-gray-500">
                                                Clean up all finished tasks instantly
                                            </p>
                                        </button>

                                        {/* Card 3 - Rate limit */}
                                        <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            ⚡ Rate limit
                                            <p className="text-xs text-gray-500">
                                                You can send 5 messages per day
                                            </p>
                                        </div>

                                    </div>
                                )}

                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}
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
                    <div
                        className={`fixed top-0 right-0 h-full w-[350px]
  bg-white/80 backdrop-blur-md shadow-lg z-50 flex flex-col
  transform transition-transform duration-300 ease-in-out
  ${showHistory ? "translate-x-0" : "translate-x-full"}`}
                    >

                        {/* Header */}
                        <div className="flex justify-between items-center p-3 border-b">
                            <h2 className="font-semibold">Chat History</h2>
                            <button onClick={() => setShowHistory(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col gap-3">

                                {historyMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] whitespace-pre-wrap ${msg.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-900"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </main >

                {/* Footer */}
                < footer className="border-t border-gray-200 mt-auto bg-white" >
                    <div className="max-w-5xl mx-auto px-2 py-1 flex flex-col items-center gap-2 text-sm text-gray-400">
                        <div className="text-gray-800 font-bold tracking-widest text-xs uppercase">
                            <span className="text-blue-600">&lt;</span> To-Do <span className="text-blue-600">/&gt;</span>
                        </div>
                        <p className="text-gray-500">
                            © {new Date().getFullYear()} To-Do. All rights reserved.
                        </p>
                    </div>
                </footer >
            </div >
        </>
    );

}
