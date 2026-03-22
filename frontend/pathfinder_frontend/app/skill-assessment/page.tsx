"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input, Select, SelectItem, Progress, Textarea, ScrollShadow } from "@heroui/react";
import { Briefcase, ChevronRight, UserCircle, GraduationCap, Target, Send, CheckCircle2, BrainCircuit } from "lucide-react";

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headersInit: HeadersInit = {};
      const token = localStorage.getItem("token");
      if (token) {
        headersInit["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${apiUrl}/api/resume/upload`, {
        method: "POST",
        headers: headersInit,
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.bundle) {
        localStorage.setItem("resultData", JSON.stringify(data));
        window.location.href = '/results';
      } else {
        alert(data.error || "Failed to process resume.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error trying to upload resume.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const [form, setForm] = useState({
    // Step 1
    role: "", name: "", email: "", education: "", experience_years: "", upskilling_budget: "", weekly_availability: "",
    // Step 2
    domain: "", target_role: "", responsibility_level: "", skills: [] as string[],
    // Step 3 (The Legacy 12-Question Behavioral Assessment)
    q1_problem: "",
    q2_adapt: "",
    q3_team: "",
    q4_stress: "",
    q5_learn: "",
    q6_lead: "",
    q7_comm: "",
    q8_risk: "",
    q9_feedback: "",
    q10_plan: "",
    q11_conflict: "",
    q12_motivate: "",
  });

  const roles = ["Student / School Leaver", "University Student", "Working Professional", "Career Switcher"];
  const educationLevels = ["O/L or School Level", "A/L", "Diploma", "Bachelor's Degree", "Master's / PhD"];
  const experienceYears = ["0 (None)", "1-2 years", "3-5 years", "6-10 years", "10+ years"];
  const budgets = ["< 50k", "50k-200k", "200k-500k", "500k+"];
  const availability = ["5-10 hours", "10-20 hours", "20+ hours"];
  const responsibilityLevels = ["Followed instructions", "Completed independent tasks", "Planned tasks", "Supervised others", "Managed outcomes / budgets"];
  const domains = ["Information Technology", "Business & Finance", "Engineering", "Design & Arts", "Marketing", "Healthcare", "Science"];

  const domainSkills: Record<string, string[]> = {
    "Information Technology": [
      "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "React", "Next.js", "Node.js", "Express.js",
      "SQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "Machine Learning", "Deep Learning", "NLP",
      "TensorFlow", "PyTorch", "Scikit-learn", "Cloud/AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
      "CI/CD", "DevOps", "Git", "Linux", "Cybersecurity", "Network Security", "REST APIs", "GraphQL",
      "Microservices", "System Design", "Agile/Scrum", "UI/UX Design", "Figma", "Data Structures & Algorithms",
      "Computer Networking", "Software Testing", "Android Development", "iOS Development", "Flutter",
    ],
    "Business & Finance": [
      "Accounting", "Financial Analysis", "Financial Modelling", "Budgeting", "Forecasting", "Project Management",
      "Business Strategy", "Data Analysis", "Risk Management", "Sales", "CRM", "Excel", "PowerBI", "Tableau",
      "Business Intelligence", "Operations Management", "Supply Chain", "Procurement", "Negotiation",
      "Corporate Finance", "Investment Analysis", "Taxation", "Auditing", "Business Law", "SAP ERP",
      "Lean Management", "Change Management", "Stakeholder Management", "Presentation Skills", "Market Research",
    ],
    "Engineering": [
      "CAD/AutoCAD", "SolidWorks", "CATIA", "Revit", "Thermodynamics", "Structural Analysis", "Fluid Mechanics",
      "Electronics", "Circuit Design", "PCB Design", "MATLAB", "Simulink", "Robotics", "IoT", "Embedded Systems",
      "PLC Programming", "3D Printing", "FEA Analysis", "Project Management", "Safety Engineering",
      "Environmental Engineering", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
      "Control Systems", "HVAC", "Quality Control (QC)", "Non-Destructive Testing (NDT)", "SketchUp",
    ],
    "Design & Arts": [
      "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Graphic Design", "Adobe Photoshop", "Adobe Illustrator",
      "Adobe InDesign", "Video Editing", "Adobe Premiere Pro", "After Effects", "Animation", "Motion Graphics",
      "Typography", "3D Modeling", "Blender", "SketchUp", "Brand Identity", "Logo Design", "Visual Communication",
      "Illustration", "Storyboarding", "Color Theory", "Photography", "Lightroom", "Web Design", "Prototyping",
      "Interaction Design", "Accessibility Design", "Design Systems",
    ],
    "Marketing": [
      "SEO", "SEM / Google Ads", "Content Marketing", "Social Media Marketing", "Copywriting", "Email Marketing",
      "Google Analytics", "Meta Ads", "Brand Strategy", "CRM", "HubSpot", "Mailchimp", "Affiliate Marketing",
      "Influencer Marketing", "Video Marketing", "YouTube SEO", "Market Research", "Consumer Psychology",
      "A/B Testing", "Conversion Rate Optimisation", "Storytelling", "Public Relations", "Event Marketing",
      "Product Marketing", "Growth Hacking", "Community Management", "TikTok Marketing", "Data-Driven Marketing",
    ],
    "Healthcare": [
      "Patient Care", "Clinical Research", "Public Health", "Medical Coding", "First Aid & CPR", "Pharmacology",
      "Healthcare Administration", "Electronic Health Records (EHR)", "Anatomy & Physiology", "Nursing",
      "Lab Techniques", "Medical Imaging", "Telemedicine", "Health Informatics", "Epidemiology",
      "Clinical Data Management", "Mental Health Counseling", "Nutrition & Dietetics", "Occupational Therapy",
      "Physiotherapy", "Medical Terminology", "Infection Control", "Biomedical Equipment", "Healthcare Quality",
      "Patient Safety", "Medical Ethics", "Community Health", "Palliative Care", "Pediatrics",
    ],
    "Science": [
      "Physics", "Biology", "Chemistry", "Biochemistry", "Microbiology", "Environmental Science",
      "Lab Techniques", "Research Methodology", "Data Mining", "Statistics", "R Programming", "SPSS",
      "Scientific Writing", "Literature Review", "Genetics", "Molecular Biology", "Cell Culture",
      "Spectroscopy", "Chromatography", "Geology", "Astronomy", "Materials Science", "Nanotechnology",
      "Bioinformatics", "Epidemiology", "Computational Biology", "Scientific Modelling", "PCR Techniques",
      "Electron Microscopy", "Grant Writing",
    ],
  };


  // The 12 Legacy Behavioral Questions
  const behavioralQuestions = [
    { id: "q1_problem", label: "Q1. Problem Solving Approach", options: ["Search for similar issues and fix quickly", "Analyze the root cause deeply before acting", "Collaborate with peers to brainstorm", "Escalate immediately to seniors"] },
    { id: "q2_adapt", label: "Q2. Change Adaptability", options: ["Follow the new directives strictly", "Pivot quickly while documenting the change", "Assess the impact on goals and align team", "Resist changes that disrupt workflow"] },
    { id: "q3_team", label: "Q3. Preferred Work Environment", options: ["Solo, heads-down technical work", "Pairing closely with another expert", "Cross-functional collaborative teams", "Leading and delegating to a squad"] },
    { id: "q4_stress", label: "Q4. Handling Tight Deadlines", options: ["Work overtime to ensure perfection", "Prioritize MVP features and cut scope", "Communicate delays immediately", "Delegate rapidly to meet the target"] },
    { id: "q5_learn", label: "Q5. Learning New Skills", options: ["Self-taught through documentation", "Structured video courses/bootcamps", "Hands-on immediate trial and error", "Mentorship from a senior"] },
    { id: "q6_lead", label: "Q6. Leadership Style", options: ["Lead by example (doing the work)", "Directive (telling others what to do)", "Servant-leader (removing blockers)", "Not interested in leadership yet"] },
    { id: "q7_comm", label: "Q7. Communication Preference", options: ["Detailed asynchronous documentation", "Quick chat messages", "Live video meetings", "Formal structured presentations"] },
    { id: "q8_risk", label: "Q8. Risk Tolerance", options: ["Avoid risks, follow proven paths", "Take calculated, data-backed risks", "Embrace high-impact risky experiments", "Only take risks if approved by management"] },
    { id: "q9_feedback", label: "Q9. Feedback Reception", options: ["Prefer immediate, direct criticism", "Prefer soft, constructive feedback", "Prefer formal bi-weekly reviews", "Defensive unless data proves I'm wrong"] },
    { id: "q10_plan", label: "Q10. Project Planning", options: ["Agile/Iterative sprints", "Detailed Waterfall planning upfront", "No strict plan, just code/build", "Following whatever the PM decides"] },
    { id: "q11_conflict", label: "Q11. Conflict Resolution", options: ["Address it directly with the person", "Mediate through a third party / HR", "Avoid conflict, focus on work", "Compromise to keep the peace"] },
    { id: "q12_motivate", label: "Q12. Core Motivation", options: ["Technical mastery & deep expertise", "Building products that impact users", "Financial growth and title promotion", "Work-life balance and stability"] },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "domain") {
      setForm({ ...form, domain: value, skills: [] }); 
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = { ...form };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headersInit: HeadersInit = { "Content-Type": "application/json" };
      const token = localStorage.getItem("token");
      if (token) {
        headersInit["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${apiUrl}/api/skill-assessment`, {
        method: "POST",
        headers: headersInit,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      localStorage.setItem("resultData", JSON.stringify(data));
      window.location.href = '/results';
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = form.name && form.email && form.education && form.role && form.experience_years && form.weekly_availability;
  const isStep2Valid = form.domain && form.target_role && form.responsibility_level && form.skills.length > 0;
  
  // Step 3 is valid if all 12 questions are answered
  const isStep3Valid = behavioralQuestions.every(q => form[q.id as keyof typeof form] !== "");

  const inputBgClass = "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-sm text-slate-900 dark:text-slate-100";
  const labelClass = "text-slate-900 dark:text-slate-200 font-semibold mb-1";
  
  const CardSelect = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (v: string) => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => (
        <div 
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex items-center min-h-[72px] h-full w-full p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
            selected === opt 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 shadow-md shadow-indigo-500/20 scale-[1.02]' 
              : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between w-full h-full">
            <span className={`font-semibold text-sm ${selected === opt ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-100'}`}>
              {opt}
            </span>
            {selected === opt && <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2" />}
          </div>
        </div>
      ))}
    </div>
  );

  if (!mounted) {
    return (
      <main className="min-h-screen relative flex items-center justify-center py-20 px-4 bg-slate-50 dark:bg-zinc-950 pattern-bg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-purple-200 dark:bg-purple-900 mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center py-20 px-4 bg-slate-50 dark:bg-zinc-950 pattern-bg">
      <div className="fixed top-0 left-0 w-full z-50">
        <Progress value={step * 33.33} size="sm" color="secondary" classNames={{ indicator: "bg-gradient-to-r from-purple-500 to-indigo-500" }} />
      </div>

      <AnimatePresence>
        {(isUploadingResume || isSubmitting) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-3xl font-black text-white font-sora text-center px-4">
              {isUploadingResume ? "Parsing Curriculum Vitae..." : "Synthesizing Core Data..."}
            </h2>
            <p className="text-indigo-300 mt-2 font-medium text-center px-4">
              {isUploadingResume 
                ? "Extracting your technical array into SBERT tensors" 
                : "Calculating precise market trajectory using behavioral NLP vectors"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-5xl p-6 sm:p-10 md:p-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl border border-divider shadow-2xl rounded-[2.5rem]"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-10">
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-800 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                  Establish Your Baseline
                </h1>
                <p className="text-default-600 dark:text-default-500 font-medium text-lg">Let's map out your current academic and professional standing.</p>

                <div className="mt-8 mb-10 p-6 sm:p-8 rounded-[2rem] bg-indigo-50/50 dark:bg-zinc-800/50 border border-indigo-100 dark:border-indigo-500/20 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-5 transition-all hover:bg-indigo-50/80 dark:hover:bg-zinc-800">
                  <div className="bg-white dark:bg-zinc-900 p-4 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400 border border-divider">
                    <Briefcase size={32} />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Fast Track: Upload CV/Resume</h3>
                    <p className="text-default-600 dark:text-default-500 text-sm max-w-md mx-auto">Skip the manual input. Let our PyTorch AI analyze your resume to instantly build your professional roadmap.</p>
                  </div>
                  <Button
                    size="lg"
                    color="secondary"
                    isLoading={isUploadingResume}
                    className="font-bold shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8"
                    onPress={() => document.getElementById("resume-upload")?.click()}
                  >
                    {isUploadingResume ? "Analyzing Tensor Vectors..." : "Upload PDF Resume"}
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </div>

                <div className="flex items-center justify-center gap-4 text-slate-400 font-medium pb-8">
                  <div className="h-px bg-divider w-16 sm:w-32"></div>
                  <span className="text-sm tracking-widest text-slate-500">OR MANUAL INPUT</span>
                  <div className="h-px bg-divider w-16 sm:w-32"></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><UserCircle size={20} className="text-indigo-500"/> Personal Details</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Full Name</label>
                    <Input placeholder="Enter your full name" name="name" variant="faded" color="primary" value={form.name} onChange={handleTextChange} classNames={{inputWrapper: inputBgClass}} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Email Address</label>
                    <Input type="email" placeholder="Enter your email" name="email" variant="faded" color="primary" value={form.email} onChange={handleTextChange} classNames={{inputWrapper: inputBgClass}} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Highest Education Level</label>
                    <Select placeholder="Select education level" variant="faded" color="primary" selectedKeys={form.education ? [form.education] : []} onChange={(e) => handleSelectChange("education", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }} startContent={<GraduationCap className="text-default-400" size={18} />}>
                      {educationLevels.map(lvl => <SelectItem key={lvl} textValue={lvl}>{lvl}</SelectItem>)}
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><Briefcase size={20} className="text-indigo-500"/> Current Career Stage</h3>
                    <CardSelect options={roles} selected={form.role} onChange={(v) => handleSelectChange("role", v)} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Years of Experience</label>
                      <Select placeholder="Select years" size="sm" variant="faded" color="primary" selectedKeys={form.experience_years ? [form.experience_years] : []} onChange={(e) => handleSelectChange("experience_years", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }}>
                        {experienceYears.map(yr => <SelectItem key={yr} textValue={yr}>{yr}</SelectItem>)}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className={labelClass}>Weekly Availability</label>
                      <Select placeholder="Select hours" size="sm" variant="faded" color="primary" selectedKeys={form.weekly_availability ? [form.weekly_availability] : []} onChange={(e) => handleSelectChange("weekly_availability", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }}>
                        {availability.map(a => <SelectItem key={a} textValue={a}>{a}</SelectItem>)}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
                      <label className={labelClass}>Upskilling Budget</label>
                      <Select placeholder="Select budget" size="sm" variant="faded" color="primary" selectedKeys={form.upskilling_budget ? [form.upskilling_budget] : []} onChange={(e) => handleSelectChange("upskilling_budget", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }}>
                        {budgets.map(b => <SelectItem key={b} textValue={b}>{b}</SelectItem>)}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-divider/50">
                <Button color="secondary" size="lg" endContent={<ChevronRight size={18} />} isDisabled={!isStep1Valid} className="font-bold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8" onPress={() => setStep(2)}>
                  Next: Technical Mapping
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-10">
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-800 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                  Technical Mapping
                </h2>
                <p className="text-default-600 dark:text-default-500 font-medium">Define your target industry and exact skill footprint.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-10">
                <div className="md:col-span-5 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-divider pb-2">Industry Targeting</h3>
                  
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Target Industry Domain</label>
                    <Select placeholder="Select domain" size="lg" variant="faded" color="primary" selectedKeys={form.domain ? [form.domain] : []} onChange={(e) => handleSelectChange("domain", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }}>
                      {domains.map(dom => <SelectItem key={dom} textValue={dom}>{dom}</SelectItem>)}
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Specific Target Role</label>
                    <Input placeholder="e.g. Data Scientist" size="lg" name="target_role" variant="faded" color="primary" value={form.target_role} onChange={handleTextChange} classNames={{inputWrapper: inputBgClass}} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Highest Responsibility Managed</label>
                    <Select placeholder="Select responsibility" size="lg" variant="faded" color="primary" selectedKeys={form.responsibility_level ? [form.responsibility_level] : []} onChange={(e) => handleSelectChange("responsibility_level", e.target.value)} classNames={{trigger: inputBgClass, value: "text-slate-900 dark:text-slate-100"}} popoverProps={{ classNames: { content: "bg-white dark:bg-zinc-900" } }}>
                      {responsibilityLevels.map(lvl => <SelectItem key={lvl} textValue={lvl}>{lvl}</SelectItem>)}
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-7 bg-default-50/50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-[2rem] border border-divider">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-indigo-500"/> Core Competencies
                  </h3>
                  
                  {!form.domain ? (
                    <div className="h-40 flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-divider rounded-2xl bg-white dark:bg-zinc-900">
                      <p className="font-medium">Select a Target Domain to view skills.</p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                      <p className="text-sm font-medium text-default-600">Tap to toggle your strongest skills.</p>
                      <div className="flex flex-wrap gap-2.5">
                        {domainSkills[form.domain].map((skill) => {
                          const isSelected = form.skills.includes(skill);
                          return (
                            <Button key={skill} size="md" radius="full" variant={isSelected ? "solid" : "flat"} 
                              className={`transition-all font-semibold ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-100'}`}
                              startContent={isSelected ? <CheckCircle2 size={16} /> : null} 
                              onPress={() => toggleSkill(skill)}>
                              {skill}
                            </Button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-divider/50">
                <Button variant="light" size="lg" onPress={() => setStep(1)} className="font-semibold text-default-600 px-6">Back</Button>
                <Button color="secondary" size="lg" endContent={<ChevronRight size={18} />} isDisabled={!isStep2Valid} className="font-bold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8" onPress={() => setStep(3)}>
                  Next: Behavioral NLP
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 - Legacy 12-Question NLP Assessment */}
          {step === 3 && (
            <div className="space-y-10">
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-800 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-3">
                  <BrainCircuit size={40} className="text-indigo-600" /> Deep Behavioral Mapping
                </h2>
                <p className="text-default-600 dark:text-default-500 font-medium max-w-2xl mx-auto">
                  Complete the 12-question psychological NLP evaluation. Your answers build a contextual tensor which we feed directly to our PyTorch engine to score your latent competencies.
                </p>
              </div>

              <ScrollShadow className="h-[55vh] pr-4 space-y-10 pb-10">
                {behavioralQuestions.map((q, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={q.id} className="bg-default-50/50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-divider"
                  >
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{q.label}</h3>
                    <CardSelect 
                      options={q.options} 
                      selected={form[q.id as keyof typeof form] as string} 
                      onChange={(v) => handleSelectChange(q.id, v)} 
                    />
                  </motion.div>
                ))}
              </ScrollShadow>

              <div className="flex justify-between items-center pt-6 border-t border-divider/50">
                <Button variant="light" size="lg" onPress={() => setStep(2)} className="font-semibold text-default-600 px-6">Back</Button>
                <Button size="lg" endContent={<Send size={18} />} isDisabled={!isStep3Valid || isSubmitting} isLoading={isSubmitting} className="font-bold shadow-xl shadow-purple-500/30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10" onPress={handleSubmit}>
                  {isSubmitting ? "Generating AI Insights..." : "Evaluate Profile"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}