"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip, Progress, Tabs, Tab } from "@heroui/react";
import { UploadCloud, FileText, CheckCircle, XCircle, ChevronRight, Zap, Download, User, Brain } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8000";

// Skill Pill
function Pill({ label, type }: { label: string, type: "matched" | "missing" | "neutral" }) {
  const colors = {
    matched: { bg: "#ecfdf5", text: "#065f46", border: "#6ee7b7" },
    missing: { bg: "#fff1f2", text: "#9f1239", border: "#fda4af" },
    neutral: { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" },
  };
  const c = colors[type] || colors.neutral;
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}`, margin: "3px" }}>
      {label}
    </span>
  );
}

// Experience Card
function ExpCard({ entry, index }: { entry: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ borderLeft: "4px solid #06b6d4" }}
      className="bg-content1 border border-divider rounded-xl p-5 mb-4 hover:border-l-primary-600 transition-colors shadow-sm"
    >
      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
        <div>
          {entry.role && <p className="font-bold text-foreground text-md">{entry.role}</p>}
          {entry.company && <p className="text-foreground/60 text-sm font-medium">{entry.company}</p>}
        </div>
        {entry.duration && (
          <span style={{ fontSize: "0.75rem", color: "#06b6d4", background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: 999, padding: "2px 10px", whiteSpace: "nowrap" }}>
            {entry.duration}
          </span>
        )}
      </div>
      {entry.description && (
        <p className="text-sm text-foreground/70 leading-relaxed mt-2">{entry.description}</p>
      )}
    </motion.div>
  );
}

// Education Card
function EduCard({ entry, index }: { entry: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ borderLeft: "4px solid #8b5cf6" }}
      className="bg-content1 border border-divider rounded-xl p-5 mb-4 hover:border-l-secondary-600 transition-colors shadow-sm"
    >
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          {entry.degree && <p className="font-bold text-foreground text-md">{entry.degree}</p>}
          {entry.institution && <p className="text-foreground/60 text-sm font-medium">{entry.institution}</p>}
        </div>
        {entry.duration && (
          <span style={{ fontSize: "0.75rem", color: "#7c3aed", background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: 999, padding: "2px 10px", whiteSpace: "nowrap" }}>
            {entry.duration}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Section Block
function Section({ title, children, color = "primary" }: { title: string, children: React.ReactNode, color?: "primary" | "secondary" | "success" | "warning" | "danger" }) {
  let bgClass = "bg-primary";
  if (color === "secondary") bgClass = "bg-secondary";
  if (color === "success") bgClass = "bg-success";
  if (color === "warning") bgClass = "bg-warning";
  if (color === "danger") bgClass = "bg-danger";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-1.5 h-6 ${bgClass} rounded-full`} />
        <h3 className="font-bold text-lg text-foreground m-0">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function ResumeScannerStructure() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const runScan = async (mode: string) => {
    if (!file) return;
    if (mode === "local") setLoadingLocal(true);
    if (mode === "gemini") setLoadingGemini(true);
    setResult(null);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mode", mode);
      
      const token = localStorage.getItem("token");
      const headersInit: HeadersInit = {};
      if (token) headersInit["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/resume-scan`, { 
          method: "POST", 
          headers: headersInit,
          body: fd 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Scan failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      if (mode === "local") setLoadingLocal(false);
      if (mode === "gemini") setLoadingGemini(false);
    }
  };

  const p = result?.parsed ?? {};
  const a = result?.analysis ?? null;
  const personalInfo = p.personal_info ?? {};
  const matchedSkills = Array.isArray(a?.matched_skills) ? a.matched_skills : [];
  const missingSkills = Array.isArray(a?.missing_skills) ? a.missing_skills : [];
  const suggestionList = Array.isArray(a?.suggestions) ? a.suggestions : [];

  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;
  const totalSkills = matchedCount + missingCount;
  const atsScore = totalSkills > 0 ? Math.round((matchedCount / totalSkills) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in text-foreground">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black font-sora tracking-tight mb-2">Resume Analyzer <Zap className="inline text-primary-500 mb-1" /></h1>
        <p className="text-foreground/60 font-medium">Drop your CV directly here to parse technical gaps and calculate ATS readiness instantly.</p>
      </div>

      {/* UPLOAD ZONE */}
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${dragging ? "border-primary-500 bg-primary-50/20 shadow-lg scale-[1.02]" : "border-divider bg-content2/20 hover:bg-content2/50"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={(e) => setFile(e.target?.files?.[0] || null)} />
        
        {file ? (
           <div className="text-center">
             <FileText size={48} className="mx-auto text-primary-500 mb-4" />
             <h3 className="font-bold text-lg">{file.name}</h3>
             <p className="text-sm text-foreground/50 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready to Scan</p>
           </div>
        ) : (
           <div className="text-center">
             <UploadCloud size={48} className="mx-auto text-foreground/40 mb-4" />
             <h3 className="font-bold text-lg mb-1">Drag & drop your resume here</h3>
             <p className="text-sm text-foreground/50">Supports PDF and DOCX formats</p>
           </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Button 
          color="secondary" 
          size="lg" 
          className="font-bold px-8 shadow-md" 
          isLoading={loadingLocal} 
          isDisabled={!file || loadingLocal || loadingGemini} 
          onPress={() => runScan("local")}
        >
          {loadingLocal ? "Running Local Engine..." : "Analyze CV Locally (Standard)"}
        </Button>
        <Button 
          color="primary" 
          size="lg" 
          className="font-bold px-8 shadow-md shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white" 
          isLoading={loadingGemini} 
          isDisabled={!file || loadingLocal || loadingGemini} 
          onPress={() => runScan("gemini")}
          startContent={!loadingGemini && <Zap size={20} />}
        >
          {loadingGemini ? "Waiting for Gemini..." : "Deep ATS Scanner (Cloud AI)"}
        </Button>
        {file && !loadingLocal && !loadingGemini && (
          <Button variant="flat" color="danger" onPress={() => { setFile(null); setResult(null); setError(""); }}>
            Clear
          </Button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-4 bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-900 rounded-xl text-danger-600 font-medium text-sm flex items-center gap-2">
          <XCircle size={18} /> {error}
        </div>
      )}

      {/* RESULTS PORTAL */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Metadata & Overall Score */}
          <div className="flex flex-col gap-6">
            
            {/* ATS Score Card */}
            <Card className="border border-divider bg-content1 shadow-md">
              <CardBody className="p-8 text-center flex flex-col items-center justify-center">
                <p className="uppercase text-xs font-bold text-foreground/50 tracking-widest mb-4">ATS Alignment Score</p>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-divider stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className={`${atsScore >= 70 ? 'text-success-500' : atsScore >= 40 ? 'text-warning-500' : 'text-danger-500'} stroke-current`} strokeWidth="3" strokeDasharray={`${atsScore}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{atsScore}</span>
                    <span className="text-[10px] text-foreground/50 font-bold uppercase">/ 100</span>
                  </div>
                </div>
                <div className="flex w-full justify-between text-sm px-4">
                  <div className="flex flex-col"><span className="font-bold text-success-500">{matchedCount}</span><span className="text-foreground/50 text-xs">Matched</span></div>
                  <div className="flex flex-col"><span className="font-bold text-danger-500">{missingCount}</span><span className="text-foreground/50 text-xs">Missing</span></div>
                </div>
              </CardBody>
            </Card>

            {/* Contact Info Card */}
            <Card className="border border-divider bg-content1 shadow-md">
              <CardBody className="p-6">
                <p className="uppercase text-xs font-bold text-foreground/50 tracking-widest mb-4">Extracted Contact</p>
                <div className="space-y-4">
                  {personalInfo.name && (
                     <div className="flex items-center gap-3"><div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600"><User size={16}/></div> <span className="font-bold text-sm">{personalInfo.name}</span></div>
                  )}
                  {personalInfo.email && (
                     <div className="flex items-center gap-3"><div className="p-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg text-secondary-600"><FileText size={16}/></div> <span className="font-medium text-sm text-foreground/80">{personalInfo.email}</span></div>
                  )}
                  {personalInfo.phone && (
                     <div className="flex items-center gap-3"><div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg text-success-600"><Zap size={16}/></div> <span className="font-medium text-sm text-foreground/80">{personalInfo.phone}</span></div>
                  )}
                  {personalInfo.links?.map((l: string, i: number) => (
                    <div className="flex items-center gap-3" key={i}>
                       <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg text-warning-600"><ChevronRight size={16}/></div> 
                       <a className="text-sm font-bold text-primary hover:underline truncate" href={l.startsWith("http") ? l : `https://${l}`} target="_blank" rel="noreferrer">{l}</a>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

          </div>

          {/* RIGHT: Tabbed Data */}
          <div className="lg:col-span-2">
            <Card className="border border-divider bg-content1 shadow-xl h-full">
               <CardBody className="p-6">
                 <Tabs color="primary" variant="underlined" classNames={{ tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider", tab: "max-w-fit px-0 h-12" }}>
                    
                    {/* PARSED RESUME TAB */}
                    <Tab key="parsed" title={
                      <div className="flex items-center space-x-2"><FileText size={16}/><span>Structural Parse</span></div>
                    }>
                      <div className="mt-6">
                        {p.summary && (
                          <Section title="Professional Summary" color="primary">
                            <p className="text-sm text-foreground/70 leading-relaxed bg-content2/30 p-4 rounded-xl border border-divider">{p.summary}</p>
                          </Section>
                        )}
                        {p.skills?.length > 0 && (
                          <Section title="Extracted Core Skills" color="secondary">
                            <div className="flex flex-wrap gap-2">
                              {p.skills.map((s: string) => <Chip key={s} variant="flat" className="font-medium">{s}</Chip>)}
                            </div>
                          </Section>
                        )}
                        {p.experience?.length > 0 && (
                          <Section title="Work Experience" color="primary">
                            {p.experience.map((e: any, i: number) => <ExpCard key={i} entry={e} index={i} />)}
                          </Section>
                        )}
                        {p.education?.length > 0 && (
                          <Section title="Academic Background" color="secondary">
                            {p.education.map((e: any, i: number) => <EduCard key={i} entry={e} index={i} />)}
                          </Section>
                        )}
                      </div>
                    </Tab>
                    
                    {/* ANALYSIS TAB */}
                    <Tab key="analysis" title={
                      <div className="flex items-center space-x-2"><Zap size={16}/><span>AI Skill Assessment</span></div>
                    }>
                      <div className="mt-6">
                        {!a ? (
                          <p className="text-foreground/50 text-sm italic">Processing analysis parameters...</p>
                        ) : (
                          <>
                            <Section title="Matched Competencies" color="success">
                               {matchedSkills.length ? (
                                  <div className="flex flex-wrap gap-1">
                                    {matchedSkills.map((s: string) => <Pill key={s} label={s} type="matched" />)}
                                  </div>
                               ) : (<p className="text-foreground/50 text-sm">No matched skills aligned.</p>)}
                            </Section>

                            <Section title="Critical Skill Gaps" color="danger">
                               {missingSkills.length ? (
                                  <div className="flex flex-wrap gap-1">
                                    {missingSkills.map((s: string) => <Pill key={s} label={s} type="missing" />)}
                                  </div>
                               ) : (<p className="text-success-600 font-bold text-sm">✓ All required skills detected securely!</p>)}
                            </Section>

                            {suggestionList.length > 0 && (
                               <Section title="AI Rewriting Suggestions" color="warning">
                                 <div className="bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-900/50 rounded-xl p-5 space-y-3">
                                   {suggestionList.map((s: string, i: number) => (
                                     <div key={i} className="flex items-start gap-3">
                                       <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning-500 shrink-0"/>
                                       <p className="text-sm font-medium text-warning-800 dark:text-warning-300">{s}</p>
                                     </div>
                                   ))}
                                 </div>
                               </Section>
                            )}
                          </>
                        )}
                      </div>
                    </Tab>

                    {/* RAW TEXT TAB */}
                    <Tab key="preview" title={
                      <div className="flex items-center space-x-2"><span className="font-mono text-sm leading-none">&lt;/&gt;</span><span>Raw Matrix</span></div>
                    }>
                      <div className="mt-6 bg-content2/50 border border-divider rounded-xl p-6 h-[500px] overflow-y-auto">
                         <pre className="text-xs font-mono text-foreground/60 whitespace-pre-wrap">{result.preview}</pre>
                      </div>
                    </Tab>

                 </Tabs>
               </CardBody>
            </Card>
          </div>

        </motion.div>
      )}
    </div>
  );
}
