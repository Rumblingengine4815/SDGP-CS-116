"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Input,
  ScrollShadow,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Divider,
} from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = "http://127.0.0.1:8001";
const WS_BASE_URL = "ws://127.0.0.1:8001";

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

const femaleNames = [
  "kumari",
  "priya",
  "nimesha",
  "sachini",
  "thilini",
  "sanduni",
  "kavindi",
  "amaya",
  "dinithi",
  "oshadi",
  "shirley",
  "sarah",
  "jane",
  "mary",
  "emily",
  "jessica",
  "samantha",
  "ashley",
  "brittany",
  "amanda",
  "melissa",
  "nicole",
  "elizabeth",
  "lauren",
  "megan",
  "rachel",
  "hannah",
  "stephanie",
  "emma",
  "olivia",
  "ava",
  "sophia",
  "isabella",
  "mia",
  "charlotte",
  "amelia",
  "harper",
  "evelyn",
  "abigail",
  "ruwani",
  "hiruni",
  "tharuki",
  "vindya",
  "niroshi",
  "nilmini",
  "kalpani",
  "gayani",
  "chamari",
  "ishani",
];

const getAvatarUrl = (mentor: any) => {
  const firstName = mentor.display_name.split(" ")[0].toLowerCase();
  const isFemale = femaleNames.includes(firstName);
  const genderPath = isFemale ? "women" : "men";

  // Hash string to number across 0 to 99 safely for consistent picture
  let hash = 0;
  for (let i = 0; i < mentor.id.length; i++) {
    hash = mentor.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idNum = Math.abs(hash) % 99;

  return `https://randomuser.me/api/portraits/${genderPath}/${idNum}.jpg`;
};

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [appliedMentors, setAppliedMentors] = useState<Record<string, { status: string }>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Chat State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeMentor, setActiveMentor] = useState<any | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAPI("/mentors");
      if (data) setMentors(data);
      const reqs = await fetchAPI("/mentorship/my-requests");
      if (reqs) setAppliedMentors(reqs);
    };
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const openAppChat = async (mentor: any) => {
    setActiveMentor(mentor);
    setChatHistory([]);
    onOpen();

    const history = await fetchAPI(`/chat/history/${mentor.id}`);
    if (history) setChatHistory(history);

    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat/${mentor.id}/user`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setChatHistory((prev) => [...prev, msg]);
    };

    ws.onclose = () => console.log("WebSocket Disconnected");
    wsRef.current = ws;
  };

  const closeChat = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setActiveMentor(null);
    onClose();
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ content: messageInput }));
    setMessageInput("");
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

  const categories = [
    "All",
    "Software Engineering",
    "Data Science",
    "Project Management",
    "Design",
    "Engineering",
    "Business",
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesSearch = m.display_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (activeCategory !== "All") {
      const expertises = Object.keys(m.expertise || {})
        .join(" ")
        .toLowerCase();
      const sectorMatches =
        m.sector === activeCategory ||
        (m.sector || "").toLowerCase() === activeCategory.toLowerCase();

      let expertiseMatches = false;
      const cat = activeCategory.toLowerCase();
      if (cat === "software engineering")
        expertiseMatches =
          expertises.includes("software") ||
          expertises.includes("engineer") ||
          expertises.includes("development") ||
          expertises.includes("react");
      else if (cat === "data science")
        expertiseMatches =
          expertises.includes("data") ||
          expertises.includes("machine learning") ||
          expertises.includes("ai") ||
          expertises.includes("python");
      else if (cat === "design")
        expertiseMatches =
          expertises.includes("design") ||
          expertises.includes("ui") ||
          expertises.includes("ux");
      else if (cat === "project management")
        expertiseMatches =
          expertises.includes("project") ||
          expertises.includes("agile") ||
          expertises.includes("manager");
      else if (cat === "engineering")
        expertiseMatches =
          expertises.includes("autocad") ||
          expertises.includes("revit") ||
          expertises.includes("solidworks");
      else if (cat === "business")
        expertiseMatches =
          expertises.includes("business") ||
          expertises.includes("strategy") ||
          expertises.includes("marketing");

      matchesCategory = sectorMatches || expertiseMatches;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen text-foreground font-sans flex flex-col items-center relative overflow-hidden bg-transparent">
      {/* Universal Consistent Navbar using HeroUI */}
      <Navbar maxWidth="xl" isBordered className="bg-content1/80 backdrop-blur-xl z-50 w-full" onMenuOpenChange={setIsMenuOpen}>
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

        <NavbarContent className="hidden sm:flex gap-10" justify="center">
          <NavbarItem>
            <Link
              href="/"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/skill-assessment"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Assessment
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/resumes"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Resumes
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              href="/mentors"
              className="text-sm font-bold text-indigo-600 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-indigo-600 after:rounded-full"
            >
              Mentors
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Button
              variant="flat"
              color="secondary"
              radius="full"
              className="font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 shadow-sm"
              as={Link}
              href="/mentor-dashboard"
            >
              Mentor Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {[
            { href: "/", label: "Home" },
            { href: "/skill-assessment", label: "Assessment" },
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
          <NavbarMenuItem>
            <Button
              variant="flat"
              color="secondary"
              radius="full"
              className="font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm w-full mt-4"
              as={Link}
              href="/mentor-dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              Mentor Sign In
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      {/* Vibrant 21st UI Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="flex-1 space-y-8 text-center lg:text-left z-10 w-full mb-10 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-content1/60 backdrop-blur-md border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wider uppercase shadow-sm">
              ✨ Elite Mentorship Network
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Accelerate your career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500">
              Expert Guidance.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-default-400 text-default-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            We've handpicked industry leaders from top local companies.
            Apply for 1-on-1 coaching, resume reviews, and insider career
            secrets. Also to offer you the best.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <div className="flex -space-x-3">
              <Avatar
                name="K"
                size="md"
                className="border-2 border-white bg-indigo-500 font-bold text-white shadow-sm"
              />
              <Avatar
                name="S"
                size="md"
                className="border-2 border-white bg-green-500 font-bold text-white shadow-sm"
              />
              <Avatar
                name="A"
                size="md"
                className="border-2 border-white bg-rose-500 font-bold text-white shadow-sm"
              />
              <div className="w-10 h-10 rounded-full bg-content3 border-2 border-white flex items-center justify-center text-xs font-bold text-default-600 shadow-sm">
                +30
              </div>
            </div>
            <p className="text-sm font-medium text-default-400 text-default-500">
              Local Mentors
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none ml-auto mr-auto lg:mr-0 flex justify-center lg:justify-end"
        >
          <div className="relative rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 p-2 shadow-2xl shadow-indigo-500/10 border border-white rotate-2 hover:rotate-0 transition-transform duration-500 w-full max-w-md">
            <div className="absolute inset-0 bg-content1/40 backdrop-blur-xl rounded-[2rem] -z-10" />
            <Image
              src="/mentor_illustration.png"
              alt="Mentorship Illustration"
              width={600}
              height={500}
              className="w-full h-auto object-cover rounded-[1.5rem]"
              priority
            />

            {/* Floating Tag */}
            <div
              className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-4 shadow-2xl border border-divider flex items-center gap-4 animate-bounce z-20"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                <svg
                  className="w-7 h-7 drop-shadow-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="pr-4">
                <p className="text-[15px] font-extrabold text-foreground drop-shadow-sm">
                  Application Approved
                </p>
                <p className="text-[12px] font-bold text-indigo-500 mt-0.5">
                  Match Successful
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Mentor Directory Section */}
      <section className="w-full bg-content1 border-t border-divider relative z-20 flex-1">
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Explore the Directory
            </h2>
            <p className="text-default-400 text-default-500 mt-2 font-medium">
              Find your perfect match. You can apply to a maximum of 2 mentors.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
              Applications Used: {Object.keys(appliedMentors).length} / 2
            </div>
          </div>

          {/* Vibrant Filters */}
          <div className="flex flex-col xl:flex-row justify-between items-center gap-6 bg-content2 p-3 rounded-2xl border border-divider shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="w-full overflow-x-auto hide-scrollbar">
              <Tabs
                aria-label="Mentor Categories"
                variant="light"
                classNames={{
                  cursor: "w-full bg-white dark:bg-content1 shadow-sm rounded-xl",
                  tab: "font-semibold tracking-wide h-14 px-8",
                  tabList: "gap-2",
                  tabContent: "text-slate-600 dark:text-slate-400 group-data-[selected=true]:text-indigo-700 dark:group-data-[selected=true]:text-indigo-300 font-bold",
                }}
                selectedKey={activeCategory}
                onSelectionChange={(k: React.Key) =>
                  setActiveCategory(k as string)
                }
              >
                {categories.map((cat) => (
                  <Tab key={cat} title={cat} />
                ))}
              </Tabs>
            </div>

            <div className="px-2 w-full xl:w-auto xl:min-w-[320px]">
              <Input
                isClearable
                variant="bordered"
                className="w-full"
                size="lg"
                radius="lg"
                placeholder="Search mentors by name..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={
                  <svg
                    className="w-5 h-5 text-default-400 text-default-500 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 5 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                classNames={{
                  inputWrapper: "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-indigo-500 transition-colors shadow-sm h-14",
                  input: "text-base font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400"
                }}
              />
            </div>
          </div>

          {/* Glassmorphic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredMentors.map((mentor, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 shadow-lg rounded-2xl bg-content1 border border-divider flex flex-col h-full hover:shadow-xl transition-shadow">
                    <CardHeader className="flex gap-4 items-center">
                      <Avatar
                        src={`https://i.pravatar.cc/150?u=${mentor.id}`}
                        name={mentor.display_name}
                        size="md"
                        className="border-2 border-indigo-100 shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-lg text-foreground leading-tight">
                          {mentor.display_name}
                        </p>
                        <p className="text-sm text-indigo-600 font-medium">
                          {mentor.sector || "Tech Professional"}
                        </p>
                      </div>
                    </CardHeader>

                    <CardBody className="py-2 flex-grow">
                      <p className="text-sm text-default-600 line-clamp-3 mb-4">
                        {mentor.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Chip size="sm" color="primary" variant="flat">
                          Available
                        </Chip>
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-content3 text-default-600"
                        >
                          English
                        </Chip>
                      </div>
                    </CardBody>

                    <CardFooter className="flex gap-2">
                      {appliedMentors[mentor.id] ? (
                        <>
                          <Button
                            color="primary"
                            isDisabled={appliedMentors[mentor.id].status !== "approved"}
                            className="flex-1 font-bold shadow-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                            radius="lg"
                            onPress={() => openAppChat(mentor)}
                          >
                            {appliedMentors[mentor.id].status === "approved" ? "Chat Room" : "Pending..."}
                          </Button>
                          <Button
                            color="danger"
                            variant="flat"
                            className="font-bold border-1 border-rose-200"
                            radius="lg"
                            onPress={() => {
                              const updated = { ...appliedMentors };
                              delete updated[mentor.id];
                              setAppliedMentors(updated);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          color="primary"
                          variant="shadow"
                          className="w-full font-bold shadow-md bg-indigo-600/90 text-white hover:bg-indigo-700"
                          radius="lg"
                          onPress={async () => {
                            if (Object.keys(appliedMentors).length >= 2) {
                              alert(
                                "You have reached the maximum limit of 2 mentor applications.",
                              );
                              return;
                            }
                            setAppliedMentors((prev) => ({ ...prev, [mentor.id]: { status: "pending" } }));
                            await fetchAPI("/mentorship/apply", {
                              method: "POST",
                              body: JSON.stringify({ mentor_id: mentor.id }),
                            });
                          }}
                        >
                          Apply Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMentors.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-default-400 text-default-500">
                <svg
                  className="w-16 h-16 mb-4 text-slate-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <p className="font-medium text-lg text-default-400 text-default-500">
                  No mentors found for this selection.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Chat Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeChat}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
        classNames={{
          base: " bg-content1/90 backdrop-blur-2xl border border-white/40 shadow-2xl",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={activeMentor?.display_name}
                    className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold"
                  />
                  <div>
                    <h3 className="font-extrabold text-foreground tracking-tight">
                      {activeMentor?.display_name}
                    </h3>
                    <p className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{" "}
                      Application Open
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="p-0 bg-content2/50">
                <ScrollShadow className="p-6 h-[450px] flex flex-col gap-4">
                  {chatHistory.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-default-400 text-default-500 space-y-3">
                      <div className="w-16 h-16 bg-content1 shadow-sm rounded-full flex items-center justify-center border border-divider">
                        <svg
                          className="w-8 h-8 text-indigo-400"
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
                      <p className="font-medium text-default-400 text-default-500 text-center max-w-[250px]">
                        Your application to{" "}
                        {activeMentor?.display_name.split(" ")[0]} is open. Send
                        a message to begin!
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg: any, i: number) => {
                      const isMe = msg.sender === "user";
                      return (
                        <div
                          key={i}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <Avatar
                              src={`https://i.pravatar.cc/150?u=${activeMentor?.id}`}
                              name={activeMentor?.display_name}
                              size="sm"
                              className="mr-3 shrink-0"
                            />
                          )}
                          <div
                            className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : " bg-content1 border text-foreground rounded-bl-none border-divider"}`}
                          >
                            <p className="text-[14px] leading-relaxed">
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
                                  className={`text-sm font-bold tracking-wide break-all line-clamp-2 ${isMe ? "text-white" : " text-foreground"}`}
                                >
                                  {msg.attachment_url.split('/').pop()}
                                </div>
                              </a>
                            )}
                            <div
                              className={`text-[10px] mt-2 font-bold tracking-wide uppercase opacity-70 ${isMe ? "text-indigo-200 text-right" : " text-default-400 text-left"}`}
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
                              name="You"
                              size="sm"
                              className="ml-3 shrink-0 bg-indigo-200 text-indigo-700 font-bold"
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </ScrollShadow>
              </ModalBody>

              <ModalFooter className="p-3 bg-content1 border-t border-divider">
                <form
                  className="w-full flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                    className="text-default-400 text-default-500 hover:text-indigo-600 shrink-0"
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
                        strokeWidth={2}
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
                    size="md"
                    placeholder="Type a message..."
                    value={messageInput}
                    onValueChange={setMessageInput}
                    classNames={{
                      inputWrapper:
                        " bg-content3/50 border-none shadow-none focus-within:! bg-content3 transition-colors",
                      input: "text-[14px]",
                    }}
                  />
                  <Button
                    isIconOnly
                    color="primary"
                    type="submit"
                    className="bg-indigo-600 shadow-md rounded-xl shrink-0"
                    isDisabled={!messageInput.trim()}
                  >
                    <svg
                      className="w-4 h-4 translate-x-[1px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </Button>
                </form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
