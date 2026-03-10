'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
    sender: 'user' | 'mentor';
    text: string;
    type?: 'text' | 'file';
    fileName?: string;
}

interface Mentor {
    id: string;
    name: string;
    title: string;
    company: string;
    expertise: string[];
    matching_score: number;
    avatar: string;
    bio: string;
    matched_skills: string[];
}

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState<Mentor | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [demoView, setDemoView] = useState<'student' | 'mentor'>('student');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch real mentors from FastAPI
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8001/api/v1/mentors/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        skills: ["Python", "Machine Learning", "FastAPI"],
                        target_role: "Backend Engineer",
                        domain: "Software Engineering"
                    })
                });
                const data = await response.json();
                setMentors(data);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    // Update messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            const fetchHistory = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:8001/api/v1/chat/history/${activeChat.id}`);
                    const history = await response.json();
                    setMessages(history);
                } catch (error) {
                    console.error("Failed to fetch history:", error);
                }
            };
            fetchHistory();
        }
    }, [activeChat]);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isSending]);

    const handleSendMessage = async (textOverride?: string) => {
        const textMsg = textOverride || inputValue;
        if (!textMsg.trim() || !activeChat) return;

        if (!textOverride) setInputValue('');
        setIsSending(true);

        try {
            // 1. Send Student message
            await fetch('http://127.0.0.1:8001/api/v1/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "demo_user",
                    mentor_id: activeChat.id,
                    message: textMsg
                })
            });

            // 2. Refresh UI instantly (Student Side)
            const historyResponse = await fetch(`http://127.0.0.1:8001/api/v1/chat/history/${activeChat.id}`);
            const history = await historyResponse.json();
            setMessages(history);

            // 3. Demo Polish: Trigger notification toast
            setToastMsg(`New message from ${activeChat.name}`);
            setTimeout(() => setShowToast(true), 1500);
            setTimeout(() => setShowToast(false), 4500);

        } catch (error) {
            console.error("Send failed:", error);
        } finally {
            setIsSending(false);
        }
    };

    const sendMockFile = () => {
        if (!activeChat) return;
        const fileMsg: Message = { sender: 'user', text: 'Sent a file: Student_Resume_V2.pdf', type: 'file', fileName: 'Student_Resume_V2.pdf' };
        setMessages(prev => [...prev, fileMsg]);
        handleSendMessage("I've attached my resume for your review.");
    };

    return (
        <div className="min-h-screen bg-gray-50/30">
            {/* Toast Notification Simulation */}
            {showToast && (
                <div className="fixed top-24 right-6 z-[100] bg-white border border-purple-100 shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-slide-in ring-4 ring-purple-600/5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-100 flex-shrink-0">
                        <img src="/logonb.png" className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Notification</p>
                        <p className="text-sm font-semibold text-gray-900">{toastMsg}</p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logonb.png" alt="PathFinder+ Logo" width={32} height={32} />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                        PathFinder+
                    </span>
                </Link>
                <div className="flex gap-8 text-sm font-medium text-gray-500">
                    <Link href="/skill-assessment" className="hover:text-purple-600 transition-colors">Assessment</Link>
                    <Link href="/resumes" className="hover:text-purple-600 transition-colors">Resumes</Link>
                    <Link href="/mentors" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">Mentors</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center animate-fade-in text-gray-900">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-bold mb-6 ring-1 ring-purple-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    MVP Demo: {mentors.length} Mentors Online
                </div>
                <h1 className="text-5xl font-black tracking-tight mb-4">
                    Connect with <span className="text-purple-600">Experts</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Directly message top industry leaders from WSO2, LSEG, and Dialog.
                </p>
            </section>

            {loading && (
                <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Scanning Mentor Database...</p>
                </div>
            )}

            {/* Mentor Grid */}
            {!loading && (
                <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="group relative bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 ease-out hover:-translate-y-2"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg transition-transform group-hover:scale-110 duration-500">
                                    <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold ring-1 ring-purple-100">
                                    {mentor.matching_score}% Match
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{mentor.name}</h3>
                            <p className="text-sm font-semibold text-purple-600 mb-4">{mentor.title} @ <span className="text-gray-900">{mentor.company}</span></p>

                            <p className="text-sm text-gray-400 mb-6 line-clamp-2 italic italic">
                                "{mentor.bio}"
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8 min-h-[48px]">
                                {mentor.expertise.slice(0, 3).map((skill) => (
                                    <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-500 text-[9px] font-bold tracking-wider rounded-lg border border-gray-100 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => setActiveChat(mentor)}
                                className="w-full py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-purple-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Start Professional Chat
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    ))}
                </main>
            )}

            {/* DUAL-VIEW CHAT MODAL (The Demo Magic) */}
            {activeChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in-backdrop">
                    <div className="w-full max-w-4xl h-[85vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-row animate-scale-up">

                        {/* Sidebar / Info */}
                        <div className="w-80 border-r border-gray-100 bg-gray-50/50 p-8 flex flex-col gap-8 hidden md:flex">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden ring-4 ring-white shadow-xl mb-4">
                                    <img src={activeChat.avatar} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-gray-900">{activeChat.name}</h4>
                                <p className="text-xs text-purple-600 font-bold mb-2 uppercase">{activeChat.title}</p>
                                <div className="flex items-center justify-center gap-1 text-[10px] text-green-500 font-bold">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                                    Active Now
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Demo Controls</p>
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                    <p className="text-[10px] text-gray-500 leading-tight">Switch view to see what the mentor receives:</p>
                                    <div className="flex p-1 bg-gray-100 rounded-xl">
                                        <button
                                            onClick={() => setDemoView('student')}
                                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${demoView === 'student' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                                        >Student View</button>
                                        <button
                                            onClick={() => setDemoView('mentor')}
                                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${demoView === 'mentor' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                                        >Mentor View</button>
                                    </div>
                                </div>
                                <button
                                    onClick={sendMockFile}
                                    className="w-full py-3 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Simulate Sending Resume
                                </button>
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col bg-white">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-left">
                                        <h2 className="font-black text-lg text-gray-900">
                                            {demoView === 'student' ? `Chat with ${activeChat.name.split(' ')[0]}` : `Inquiry from Demo Student`}
                                        </h2>
                                        <p className="text-xs text-gray-400">{demoView === 'student' ? 'Secure, encrypted career discussion' : 'V3 Matching Score: 98%'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Messages Panel */}
                            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto bg-gray-50/50 flex flex-col gap-6">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.sender === (demoView === 'student' ? 'user' : 'mentor') ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${msg.sender === (demoView === 'student' ? 'user' : 'mentor')
                                                ? 'bg-gray-900 text-white rounded-tr-none'
                                                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                            }`}>
                                            {msg.type === 'file' && (
                                                <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/20">
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>
                                                    </div>
                                                    <span className="font-bold underline decoration-dotted underline-offset-4">{msg.fileName}</span>
                                                </div>
                                            )}
                                            {msg.text}
                                        </div>
                                        <span className="mt-2 text-[8px] text-gray-400 font-bold uppercase tracking-widest">{msg.sender} • Just now</span>
                                    </div>
                                ))}
                                {isSending && (
                                    <div className="flex gap-2 p-4 bg-white/50 rounded-2xl w-fit animate-pulse">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={demoView === 'student' ? "Ask the mentor about your career path..." : "Type your reply as the mentor..."}
                                    className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-purple-600 transition-all outline-none"
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputValue.trim()}
                                    className="px-8 bg-gray-900 text-white rounded-2xl font-bold hover:bg-purple-600 disabled:bg-gray-200 transition-all shadow-lg"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-backdrop { animation: fadeInBackdrop 0.4s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInBackdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
        </div>
    );
}
