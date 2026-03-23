"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardBody,
    Avatar,
    Button,
    Input,
    ScrollShadow,
    Divider,
    Tabs,
    Tab,
    Chip,
    CardFooter,
} from "@nextui-org/react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@heroui/navbar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8000";
const WS_BASE_URL = "ws://127.0.0.1:8000";

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { "Content-Type": "application/json", "X-User-Id": "1" },
            ...options,
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.warn(`Fetch warning for ${endpoint}:`, error);
        return null;
    }
};

export default function MentorDashboardPage() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [activeMentor, setActiveMentor] = useState<any | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Authentication State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorLine, setErrorLine] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Dashboard State
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [activeStudents, setActiveStudents] = useState<any[]>([]);
    const [activeChatUser, setActiveChatUser] = useState<string | null>(null);

    // Chat State
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchAPI("/mentors");
            if (data) setMentors(data.filter((m: any) => m.is_real));
        };
        loadData();
    }, []);

    const loadDashboardData = async (mentorId: string) => {
        const pRequests = await fetchAPI(`/mentor/requests/${mentorId}`);
        if (pRequests) setPendingRequests(pRequests);

        const aStudents = await fetchAPI(`/mentor/students/${mentorId}`);
        if (aStudents) setActiveStudents(aStudents);
    };

    useEffect(() => {
        if (activeMentor) {
            loadDashboardData(activeMentor.id);
            // Polling for demo purposes
            const interval = setInterval(
                () => loadDashboardData(activeMentor.id),
                3000,
            );
            return () => clearInterval(interval);
        }
    }, [activeMentor]);

    useEffect(() => {
        if (chatHistory && chatHistory.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [chatHistory]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setErrorLine("");
        try {
            const res = await fetch(`${API_BASE_URL}/mentor/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                // Parse the exact FastAPI HTTPException message
                throw new Error(data.detail || "Invalid credentials");
            }
            setActiveMentor(data.mentor);
            setActiveChatUser(null);
        } catch (error) {
            const err = error as any;
            setErrorLine(err.message || "Login failed. Please check your email and password.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleApprove = async (requestId: number) => {
        try {
            await fetchAPI(`/mentorship/requests/${requestId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "approved" }),
            });
            loadDashboardData(activeMentor.id);
        } catch (error) {
            console.error("Failed to approve request:", error);
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await fetchAPI(`/mentorship/requests/${requestId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "rejected" }),
            });
            loadDashboardData(activeMentor.id);
        } catch (error) {
            console.error("Failed to reject request:", error);
        }
    };

    const openChatWithStudent = async (
        studentId: string,
        studentName: string,
    ) => {
        setActiveChatUser(studentName);
        setChatHistory([]);

        try {
            const history = await fetchAPI(`/chat/history/${activeMentor.id}`);
            // For this demo, we assume history is shared/filtered properly in a real app.
            if (history) setChatHistory(history);
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }

        if (wsRef.current) wsRef.current.close();

        try {
            const ws = new WebSocket(
                `${WS_BASE_URL}/ws/chat/${activeMentor.id}/mentor`,
            );

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    setChatHistory((prev) => [...prev, msg]);
                } catch (e) {
                    console.error("WebSocket message parse error:", e);
                }
            };

            ws.onerror = (error) => console.error("WebSocket Error:", error);
            ws.onclose = () => console.log("WebSocket Disconnected");
            wsRef.current = ws;
        } catch (error) {
            console.error("Failed to initialize WebSocket:", error);
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !wsRef.current) return;
        try {
            wsRef.current.send(JSON.stringify({ content: messageInput }));
            setMessageInput("");
        } catch (error) {
            console.error("Failed to transmit WebSocket message:", error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !wsRef.current) return;

        if (file.size > 8 * 1024 * 1024) {
            alert("File is too large. Maximum size is 8MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();

            wsRef.current.send(
                JSON.stringify({
                    content: `Sent an attachment: ${file.name}`,
                    attachment_url: data.url,
                })
            );
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (!activeMentor) {
        return (
            <div className="min-h-screen bg-pf-purple-50 flex flex-col items-center relative overflow-x-hidden">
                {/* Universal Consistent Navbar using HeroUI */}
                <Navbar maxWidth="xl" isBordered className="bg-content1/80 backdrop-blur-xl border-b border-divider z-50 w-full" onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden"
                        />
                        <NavbarBrand as={Link} href="/" className="gap-2 group cursor-pointer max-w-[200px]">
                            <Image
                                src="/logonb.png"
                                alt="PathFinder+ Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                PathFinder+
                            </span>
                        </NavbarBrand>
                    </NavbarContent>

                    <NavbarContent className="hidden sm:flex" justify="center" />

                    <NavbarContent justify="end">
                        <NavbarItem className="hidden sm:flex">
                            <span className="text-sm font-bold text-default-400 text-default-500">
                                Mentor Portal
                            </span>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarMenu>
                        {[
                            { href: "/", label: "Home" },
                            { href: "/dashboard", label: "Dashboard" },
                            { href: "/resumes", label: "Resumes" },
                            { href: "/mentors", label: "Mentors" },
                        ].map((item, index) => (
                            <NavbarMenuItem key={`${item.label}-${index}`}>
                                <Link
                                    className="w-full text-foreground hover:text-indigo-500 font-medium py-2 block"
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>

                <div className="flex min-h-[90vh] items-center justify-center px-6 py-12 lg:px-8 w-full z-10 max-w-6xl mx-auto gap-12">
                    {/* Illustration Side */}
                    <div className="hidden lg:flex w-1/2 justify-center items-center">
                        <Image src="/illustrations/review.png" alt="Mentor Setup" width={500} height={500} className="object-contain drop-shadow-[0_15px_35px_rgba(91,33,182,0.15)] opacity-95" priority />
                    </div>

                    {/* Auth Side */}
                    <div className="w-full max-w-md bg-content1 p-10 rounded-[2rem] shadow-2xl shadow-pf-purple-500/5 border border-divider">
                        <div className="mb-8 flex flex-col items-center">
                            <div className="h-16 w-16 bg-pf-purple-50 rounded-2xl flex items-center justify-center shadow-sm border border-pf-purple-100 mb-6">
                                <Image
                                    src="/logonb.png"
                                    alt="PathFinder+ Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain drop-shadow-sm"
                                />
                            </div>
                            <h2 className="text-center text-2xl font-black tracking-tight text-black dark:text-white font-sora">
                                Sign in to your portal
                            </h2>
                            <p className="mt-2 text-center text-sm font-medium text-default-600 dark:text-default-500">
                                Manage your mentoring sessions and student applications.
                            </p>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-medium text-black dark:text-white"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onValueChange={setEmail}
                                            variant="bordered"
                                            size="lg"
                                            placeholder="Enter your registered email"
                                            classNames={{
                                                inputWrapper: "!bg-white border-divider hover:border-pf-purple-400 focus-within:border-pf-purple-500 transition-colors shadow-sm",
                                                input: "!text-gray-900 font-medium placeholder:!text-default-400",
                                                label: "!text-gray-900",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm/6 font-medium text-black dark:text-white"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="current-password"
                                            value={password}
                                            onValueChange={setPassword}
                                            variant="bordered"
                                            size="lg"
                                            placeholder="••••••••"
                                            classNames={{
                                                inputWrapper: "!bg-white border-divider hover:border-pf-purple-400 focus-within:border-pf-purple-500 transition-colors shadow-sm",
                                                input: "!text-gray-900 font-medium tracking-widest placeholder:!text-default-400",
                                                label: "!text-gray-900",
                                            }}
                                        />
                                    </div>
                                </div>

                                {errorLine && (
                                    <div className="p-4 bg-danger-50 text-danger-600 rounded-xl text-sm font-semibold border border-danger-200 shadow-sm flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span className="leading-snug text-left">{errorLine}</span>
                                    </div>
                                )}

                                <div>
                                    <Button
                                        type="submit"
                                        isLoading={isLoggingIn}
                                        size="lg"
                                        style={{ background: "linear-gradient(to right, #4338ca, #7e22ce)", color: "#ffffff" }}
                                        className="w-full !text-white font-bold shadow-lg transition-all font-sans"
                                        radius="full"
                                    >
                                        Sign in securely
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pf-purple-50 flex justify-center items-center font-sans md:p-6 p-0 w-full relative overflow-y-auto overflow-x-hidden">
            {/* App Window Container */}
            <div className="w-full max-w-7xl mx-auto h-[90vh] flex bg-background rounded-none md:rounded-[2rem] shadow-2xl overflow-hidden border border-divider relative z-10">
                {/* Sidebar Navigation */}
                <div className="w-[320px] bg-content1 border-b border-divider border-r flex flex-col z-10 shadow-sm relative shrink-0">
                    <div className="p-6 border-b border-divider flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={`https://i.pravatar.cc/150?u=${activeMentor.id}`}
                                name={activeMentor.display_name}
                                className="border-2 border-white shadow-sm ring-2 ring-indigo-500 ring-offset-1"
                            />
                            <div>
                                <h3 className="font-bold text-foreground leading-tight truncate w-[160px]">
                                    {activeMentor.display_name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <span className="text-[11px] text-green-600 font-bold tracking-wide uppercase">
                                        Dashboard Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 bg-content2/50">
                            <Tabs
                                aria-label="Dashboard views"
                                fullWidth
                                size="sm"
                                radius="lg"
                                classNames={{
                                    tabList: " bg-content3/80 p-1",
                                    cursor: " bg-content1 shadow-sm rounded-md",
                                    tab: "font-bold text-default-400 text-default-500 text-default-400 text-default-400 text-default-500 h-8",
                                }}
                            >
                                <Tab
                                    key="requests"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span>Requests</span>
                                            {pendingRequests.length > 0 && (
                                                <Chip
                                                    size="sm"
                                                    color="danger"
                                                    variant="solid"
                                                    className="h-5 min-w-5 px-1"
                                                >
                                                    {pendingRequests.length}
                                                </Chip>
                                            )}
                                        </div>
                                    }
                                >
                                    <ScrollShadow className="h-[calc(100vh-220px)] hide-scrollbar pt-2">
                                        {pendingRequests.length === 0 ? (
                                            <div className="text-center p-6 text-default-500 text-sm font-medium mt-10">
                                                No pending applications.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {pendingRequests.map((req) => (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            key={req.request_id}
                                                        >
                                                            <Card className="shadow-sm border border-divider bg-content1 hover:shadow-md transition-shadow">
                                                                <CardBody className="p-4 bg-content2/50">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <Avatar
                                                                            src="/user.png"
                                                                            name={req.student_name}
                                                                            size="sm"
                                                                            className="bg-content2 text-indigo-600 font-bold border border-divider shadow-sm shrink-0"
                                                                        />
                                                                        <div>
                                                                            <p className="font-bold text-sm text-foreground">
                                                                                {req.student_name}
                                                                            </p>
                                                                            <p className="text-[11px] font-medium text-default-500">
                                                                                Applied{" "}
                                                                                {new Date(
                                                                                    req.created_at,
                                                                                ).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </CardBody>
                                                                <Divider className="opacity-50" />
                                                                <CardFooter className="px-4 py-3 bg-content1 flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        className="flex-1 bg-indigo-600 text-white font-bold shadow-sm hover:bg-indigo-700"
                                                                        onPress={() =>
                                                                            handleApprove(req.request_id)
                                                                        }
                                                                    >
                                                                        Accept
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="flat"
                                                                        color="danger"
                                                                        className="font-bold border-1 border-rose-200"
                                                                        onPress={() => handleReject(req.request_id)}
                                                                    >
                                                                        Decline
                                                                    </Button>
                                                                </CardFooter>
                                                            </Card>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </ScrollShadow>
                                </Tab>
                                <Tab key="students" title="My Students">
                                    <ScrollShadow className="h-[calc(100vh-220px)] hide-scrollbar pt-2">
                                        {activeStudents.length === 0 ? (
                                            <div className="text-center p-6 text-default-500 text-sm font-medium mt-10">
                                                No active students yet.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {activeStudents.map((student, index) => (
                                                    <div
                                                        key={`${student.user_id}-${index}`}
                                                        onClick={() =>
                                                            openChatWithStudent(
                                                                student.user_id,
                                                                student.student_name,
                                                            )
                                                        }
                                                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${activeChatUser === student.student_name
                                                            ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                                            : " bg-content1 border-divider hover:border-indigo-100 hover: bg-content2"
                                                            }`}
                                                    >
                                                        <Avatar
                                                            src="/user.png"
                                                            name={student.student_name}
                                                            size="sm"
                                                            className={`${activeChatUser === student.student_name ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-content1 shadow-sm" : "border border-divider"} transition-all shrink-0 bg-white`}
                                                        />
                                                        <div className="flex-1 overflow-hidden">
                                                            <p
                                                                className={`font-bold text-sm truncate ${activeChatUser === student.student_name ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"}`}
                                                            >
                                                                {student.student_name}
                                                            </p>
                                                            <p className="text-[11px] !text-gray-900 font-semibold opacity-80 truncate">
                                                                Tap to open chat room
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollShadow>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>

                    <div className="p-4 border-t border-divider bg-content1">
                        <Button
                            color="danger"
                            variant="light"
                            className="w-full font-bold text-default-400 text-default-500 hover:text-rose-600"
                            onPress={() => {
                                if (wsRef.current) wsRef.current.close();
                                setActiveMentor(null);
                                setActiveChatUser(null);
                            }}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-pf-purple-50 relative z-10 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)]">
                    {!activeChatUser ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full bg-content1/40 backdrop-blur-sm">
                            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <svg
                                    className="w-12 h-12 text-indigo-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                                Your Communication Hub
                            </h2>
                            <p className="text-default-400 text-default-500 mt-2 max-w-sm">
                                Select an active student from your sidebar to start mentoring in
                                real-time.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="h-[73px] bg-content1/90 backdrop-blur-md border-b border-divider px-8 flex items-center justify-between shadow-sm shrink-0">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        src="/user.png"
                                        name={activeChatUser}
                                        size="sm"
                                        className="bg-white border border-divider shadow-sm shrink-0"
                                    />
                                    <div>
                                        <h2 className="text-base font-bold text-foreground leading-tight">
                                            {activeChatUser}
                                        </h2>
                                        <p className="text-[11px] text-green-600 font-semibold tracking-wide flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>{" "}
                                            Online
                                        </p>
                                    </div>
                                </div>
                                <Button size="sm" variant="flat" color="danger" className="font-bold shadow-sm" onPress={async () => {
                                    try {
                                        await fetch(`${API_BASE_URL}/chat/history/${activeMentor?.id}`, { method: 'DELETE' });
                                        setChatHistory([]);
                                    } catch (err) {
                                        console.error("Failed to wipe messages:", err);
                                    }
                                }}>
                                    Reset Messages
                                </Button>
                            </div>

                            {/* Chat History */}
                            <ScrollShadow className="flex-1 p-8 flex flex-col gap-5 overflow-y-auto bg-content1/40">
                                {chatHistory.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-default-400 text-default-500">
                                        <p className="font-medium text-sm">
                                            You are now connected with {activeChatUser}.
                                        </p>
                                        <p className="text-xs mt-1">
                                            Send a message to introduce yourself!
                                        </p>
                                    </div>
                                ) : (
                                    chatHistory.map((msg, i) => {
                                        const isMe = msg.sender === "mentor";
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={msg.id || i}
                                                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                                {!isMe && (
                                                    <Avatar
                                                        src="/user.png"
                                                        name={activeChatUser}
                                                        size="sm"
                                                        className="mr-3 shrink-0 bg-white shadow-sm border border-divider"
                                                    />
                                                )}
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : " bg-white border border-pf-purple-100 !text-gray-900 rounded-bl-none shadow-[0_4px_14px_rgb(0,0,0,0.05)]"}`}
                                                >
                                                    <p className="text-[15px] leading-relaxed font-medium">
                                                        {msg.message || msg.text}
                                                    </p>

                                                    {msg.attachment_url && (
                                                        <a
                                                            href={msg.attachment_url.startsWith('http') ? msg.attachment_url : `${API_BASE_URL}${msg.attachment_url}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`mt-3 p-3 rounded-xl border flex items-center gap-3 w-fit transition-colors ${isMe ? " bg-content1/20 border-white/30 hover:bg-content1/30 text-white" : " bg-content2 border-divider hover:bg-content3 text-foreground"}`}
                                                        >
                                                            <div
                                                                className={`${isMe ? "bg-indigo-400 shadow-inner" : "bg-rose-500 shadow-sm"} text-white p-2 rounded-xl shrink-0`}
                                                            >
                                                                <svg
                                                                    className="w-5 h-5"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2.5}
                                                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div
                                                                className={`text-sm font-bold tracking-wide break-all line-clamp-2 ${isMe ? "text-white" : " !text-gray-900"}`}
                                                            >
                                                                {msg.attachment_url.split('/').pop()}
                                                            </div>
                                                        </a>
                                                    )}
                                                    <div
                                                        className={`text-[10px] mt-2 font-bold tracking-wide uppercase opacity-70 ${isMe ? "text-indigo-200 text-right" : " text-default-400 text-default-500 text-default-400 text-left"}`}
                                                    >
                                                        {msg.timestamp
                                                            ? new Date(msg.timestamp + "Z").toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                timeZone: "Asia/Colombo"
                                                            })
                                                            : "Just now"}
                                                    </div>
                                                </div>
                                                {isMe && (
                                                    <Avatar
                                                        src={`https://i.pravatar.cc/150?u=${activeMentor?.id}`}
                                                        name={activeMentor?.display_name}
                                                        size="sm"
                                                        className="ml-3 shrink-0 font-bold"
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </ScrollShadow>

                            {/* Chat Input */}
                            <div className="p-5 bg-content1 border-t border-divider shrink-0">
                                <form
                                    className="w-full flex items-end gap-3 max-w-5xl mx-auto"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        sendMessage();
                                    }}
                                >
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                        color="default"
                                        onPress={() => fileInputRef.current?.click()}
                                        isLoading={isUploading}
                                        title="Send File"
                                        className="bg-content3 h-12 w-12 rounded-xl shrink-0 hover:bg-content4"
                                    >
                                        <svg
                                            className="w-5 h-5 text-default-400 text-default-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            />
                                        </svg>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Input
                                        fullWidth
                                        size="lg"
                                        placeholder={`Message ${activeChatUser}...`}
                                        value={messageInput}
                                        onValueChange={setMessageInput}
                                        classNames={{
                                            inputWrapper: "bg-white border-transparent shadow-sm focus-within:!bg-white focus-within:ring-2 focus-within:ring-indigo-500 rounded-xl h-12",
                                            input: "!text-gray-900 font-medium placeholder:!text-gray-500",
                                        }}
                                    />
                                    <Button
                                        color="primary"
                                        variant="shadow"
                                        className="px-8 h-12 rounded-xl font-bold bg-indigo-600 shadow-indigo-600/30 tracking-wide"
                                        type="submit"
                                        isDisabled={!messageInput.trim()}
                                    >
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
