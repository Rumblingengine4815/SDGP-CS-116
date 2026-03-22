"use client";

import { useEffect, useState } from "react";
import { Link, Button, Card, CardBody, Progress, Chip, Divider } from "@heroui/react";
import {
  Trophy, Target, Zap, Clock, TrendingUp, BookOpen, Briefcase,
  Map, Lightbulb, User, ArrowRight, Activity, DollarSign,
  Users, BarChart, ShieldQuestion
} from "lucide-react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function ResultsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("resultData");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pattern-bg">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-foreground/60 font-medium">Extracting AI Insights...</p>
      </div>
    );
  }

  // Defensive mappings to handle different ML bundle structures gracefully
  const bundle = data.bundle || {};
  const isError = bundle.error;

  const snap = bundle.career_snapshot || bundle.summary || {};
  const targetRole = snap.target_role || data.career || "Professional";
  const readiness = snap.score || snap.readiness_score || 0;
  const stage = snap.stage || "Development Phase";
  const timeWeeks = snap.estimated_transition_weeks || snap.transition_time || 0;
  const industry = snap.preferred_industry || "General";

  const path_rec = bundle.career_path_recommendation || bundle.career_path || {};
  const careerPath = Array.isArray(path_rec) ? path_rec : (path_rec.vertical || []);
  const altPath = Array.isArray(path_rec) ? [] : (path_rec.horizontal || []);

  const intelligence = bundle.skill_intelligence || {};
  const currentSkills = intelligence.current_skills || data.skills || [];
  const missingSkills = (intelligence.strengthen || intelligence.skills_to_strengthen || []).slice(0, 5);

  const jobs = bundle.job_opportunities || bundle.real_job_opportunities || bundle.target_roles || bundle.top_job_matches || bundle.job_recommendations || [];
  const fallbackJobs = data.jobs || [];

  // Safely map unstructured Resume courses into the Fast-Track and Academic columns if the standardized properties are missing
  const rawRecs = bundle.recommendations || [];
  const courses = bundle.recommended_education || rawRecs.filter((c: any) => c.source_file === 'academic' || c.course_name?.toLowerCase().includes('degree') || c.course_name?.toLowerCase().includes('diploma'));
  const shortCourses = bundle.skill_gap_courses || rawRecs.filter((c: any) => c.source_file !== 'academic' && !c.course_name?.toLowerCase().includes('degree') && !c.course_name?.toLowerCase().includes('diploma'));
  const fallbackCourses = data.courses || [];

  const salary = bundle.salary_intelligence || bundle.salary_insights || null;
  const market = bundle.market_demand || null;

  const plan = bundle.action_roadmap || bundle.action_plan || {};
  const actionPlan = plan.steps ? plan.steps : (Array.isArray(plan) ? plan : []);

  const mentors = bundle.mentor_recommendations || bundle.mentors || [];
  const explainability = bundle.ai_explainability || bundle.explainability_panel || bundle.explainability || [];
  const geminiDescription = data.description || "";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const downloadReport = () => {
    const lines: string[] = [];
    const hr = "=".repeat(60);
    const divider = "-".repeat(60);

    lines.push("PATHFINDER+ CAREER ASSESSMENT REPORT");
    lines.push(hr);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    lines.push("CAREER SNAPSHOT");
    lines.push(divider);
    lines.push(`Target Role     : ${targetRole}`);
    lines.push(`Target Industry : ${industry}`);
    lines.push(`Readiness Score : ${readiness} / 100  (${stage})`);
    lines.push(`ETA to Transition: ~${timeWeeks} weeks`);
    lines.push("");

    if (salary) {
      lines.push("SALARY INTELLIGENCE");
      lines.push(divider);
      lines.push(`Average : LKR ${(salary.average_lkr || salary.avg || 0).toLocaleString()}`);
      lines.push(`Range   : LKR ${(salary.min_lkr || salary.min || 0).toLocaleString()} – ${(salary.max_lkr || salary.max || 0).toLocaleString()}`);
      lines.push("");
    }

    if (currentSkills.length) {
      lines.push("YOUR CURRENT SKILLS");
      lines.push(divider);
      currentSkills.forEach((s: string) => lines.push(`  ✔ ${s}`));
      lines.push("");
    }

    if (missingSkills.length) {
      lines.push("SKILL GAPS TO ADDRESS");
      lines.push(divider);
      missingSkills.forEach((s: string) => lines.push(`  ✘ ${s}`));
      lines.push("");
    }

    if (careerPath.length) {
      lines.push("CAREER PATH (VERTICAL)");
      lines.push(divider);
      careerPath.forEach((step: any, i: number) => {
        const label = typeof step === "string" ? step : (step.title || step.role || JSON.stringify(step));
        lines.push(`  ${i + 1}. ${label}`);
      });
      lines.push("");
    }

    if (altPath.length) {
      lines.push("ALTERNATIVE PATHS (HORIZONTAL)");
      lines.push(divider);
      altPath.forEach((step: any) => {
        const label = typeof step === "string" ? step : (step.title || step.role || JSON.stringify(step));
        lines.push(`  • ${label}`);
      });
      lines.push("");
    }

    if (actionPlan.length) {
      lines.push("ACTION ROADMAP");
      lines.push(divider);
      actionPlan.forEach((step: any) => {
        const title = step.phase || step.title || "";
        const desc = step.action || step.description || "";
        if (title) lines.push(`  [${title}]`);
        if (desc) lines.push(`    ${desc}`);
      });
      lines.push("");
    }

    if (courses.length) {
      lines.push("RECOMMENDED EDUCATION PATHS");
      lines.push(divider);
      courses.forEach((c: any) => {
        lines.push(`  • ${c.course_name || c.name || c.course_title}`);
        lines.push(`    Provider: ${c.provider || "–"}`);
        if (c.apply_url || c.apply_link) lines.push(`    URL: ${c.apply_url || c.apply_link}`);
      });
      lines.push("");
    }

    if (shortCourses.length) {
      lines.push("FAST-TRACK SKILL GAP COURSES");
      lines.push(divider);
      shortCourses.forEach((c: any) => {
        lines.push(`  • ${c.course_name || c.name}`);
        if (c.url || c.apply_url) lines.push(`    URL: ${c.url || c.apply_url}`);
      });
      lines.push("");
    }

    lines.push(hr);
    lines.push("Powered by PathFinder+ | AI Career Intelligence Platform");
    lines.push("Share this report with your mentor to accelerate your growth journey.");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PathFinder_Report_${targetRole.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground py-20 px-4 sm:px-8 lg:px-16 pattern-bg">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 font-semibold mb-4 text-sm tracking-widest uppercase shadow-sm">
            <Trophy size={16} /> Persona Alignment Complete
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl min-h-[4rem] text-balance capitalize font-black font-sora text-primary-500 pb-2">
            {targetRole}
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Synthesizing your exact technical array and behavioral NLP vectors reveals this track strongly matches your latent potential.
          </p>
        </motion.div>

        {/* Download Report Button */}
        <div className="flex justify-center">
          <Button
            onPress={downloadReport}
            className="font-bold px-8 py-3 text-white shadow-lg"
            style={{ background: "linear-gradient(to right, #4338ca, #7e22ce)" }}
            startContent={<Download size={18} />}
            radius="full"
            size="lg"
          >
            Download Career Report
          </Button>
        </div>

        {isError && (
          <div className="bg-danger-50 text-danger-600 p-6 rounded-2xl border border-danger-200">
            <strong>System Notification:</strong> The advanced ML engine encountered a disruption, but heuristic fallbacks have been provided. {isError}
          </div>
        )}

        {geminiDescription && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-md">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-xl text-primary-600 dark:text-primary-300">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-sora text-primary-700 dark:text-primary-300 mb-2">Senior Career Advisor Insight</h3>
                    <div className="text-foreground/80 leading-relaxed text-sm space-y-4 font-medium">
                      {geminiDescription.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph.trim()}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COL: Readiness & Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <Card className="border border-divider bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl h-full">
              <CardBody className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold font-sora flex items-center gap-2"><Activity className="text-primary-500" /> Readiness Profile</h3>
                  <Chip color={readiness > 60 ? "success" : "warning"} variant="flat" className="font-bold">{stage}</Chip>
                </div>

                <div className="space-y-8">
                  <div className="text-center py-6">
                    <div className="text-6xl font-black text-foreground mb-2">{readiness.toFixed(1)}<span className="text-2xl text-foreground/40">/100</span></div>
                    <p className="text-sm font-semibold text-foreground/50 uppercase tracking-widest">Alignment Score</p>
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-content2/50 border border-divider">
                      <Clock className="text-secondary-500 mb-2" size={20} />
                      <p className="text-xs text-foreground/60 uppercase">ETA to Transition</p>
                      <p className="text-lg font-bold">~{timeWeeks} Weeks</p>
                    </div>
                    <div className="p-4 rounded-xl bg-content2/50 border border-divider">
                      <TrendingUp className="text-success-500 mb-2" size={20} />
                      <p className="text-xs text-foreground/60 uppercase">Target Industry</p>
                      <p className="text-lg font-bold truncate">{industry}</p>
                    </div>
                  </div>

                  {salary && (
                    <div className="p-4 rounded-xl bg-success-50/50 dark:bg-success-900/10 border border-success-200/30">
                      <div className="flex items-center gap-2 mb-2 text-success-600">
                        <DollarSign size={18} />
                        <span className="font-bold font-sora text-sm">Salary Forecast ({salary.sector})</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Average:</span>
                        <span className="font-bold text-foreground">{salary.avg?.toLocaleString() || "N/A"} LKR</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* MIDDLE COL: Career Path & Skills */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">

              {/* Pathfinder */}
              <Card className="border border-divider bg-content1/80 backdrop-blur-xl shadow-xl">
                <CardBody className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold font-sora flex items-center gap-2">
                      <Map className="text-secondary-500" /> AI Recommended Path
                    </h3>
                    <Button
                      size="sm"
                      color="secondary"
                      variant="shadow"
                      as={Link}
                      href="/skill-assessment/career-paths"
                      className="font-bold shrink-0"
                    >
                      Visual Trajectory
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {careerPath.length > 0 ? careerPath.map((node: any, i: number) => (
                      <div key={i} className="flex flex-col">
                        <div className="p-4 rounded-2xl border-2 border-primary-500/20 bg-primary-50/50 dark:bg-primary-900/10 hover:border-primary-500 transition-colors">
                          <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-1">{node.type || "Vertical"}</p>
                          <p className="font-bold text-lg">{node.role || node.title}</p>
                        </div>
                        {i < careerPath.length - 1 && (
                          <div className="flex justify-center py-2 text-divider"><ArrowRight size={20} className="transform rotate-90" /></div>
                        )}
                      </div>
                    )) : (
                      <p className="text-foreground/60 italic">Trajectory calculating... proceed with active recommendations below.</p>
                    )}

                    {altPath.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-divider">
                        <p className="text-sm font-semibold text-foreground/60 uppercase mb-3">Alternative Pathways (Horizontal Pivot)</p>
                        <div className="flex flex-wrap gap-2">
                          {altPath.map((node: any, i: number) => (
                            <Chip key={i} variant="flat" color="secondary" className="font-medium cursor-pointer hover:scale-105 transition-transform">
                              {node.role || node.title}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Skills Intelligence */}
              <Card className="border border-divider bg-content1/80 backdrop-blur-xl shadow-xl">
                <CardBody className="p-8">
                  <h3 className="text-xl font-bold font-sora mb-6 flex items-center gap-2"><Zap className="text-warning-500" /> Skill Intelligence</h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground/60 uppercase mb-3">Verified Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {currentSkills.length > 0 ? currentSkills.map((s: string, i: number) => (
                          <Chip key={i} variant="flat" color="success" size="sm">{s}</Chip>
                        )) : <span className="text-sm text-foreground/50">None detected</span>}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground/60 uppercase mb-3 text-warning-600">Priority Targets</p>
                      <ul className="space-y-2">
                        {missingSkills.length > 0 ? missingSkills.map((s: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300 px-3 py-2 rounded-lg font-medium border border-warning-200 dark:border-warning-900/50">
                            <Zap size={14} className="flex-shrink-0" /> {s}
                          </li>
                        )) : <span className="text-sm text-foreground/50">Profile optimal</span>}
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

            </div>
          </motion.div>
        </motion.div>

        {/* BOTTOM GRIDS: Action Plan & Education & Jobs */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Action Plan */}
          {actionPlan.length > 0 && (
            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="border border-divider bg-gradient-to-r from-content1 to-content2/50 shadow-xl">
                <CardBody className="p-8">
                  <h3 className="text-xl font-bold font-sora mb-6 flex items-center gap-2"><Target className="text-primary-500" /> Career Action Roadmap</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {actionPlan.slice(0, 4).map((step: any, i: number) => (
                      <div key={i} className="p-5 bg-background rounded-2xl border-l-4 border-l-primary-500 shadow-sm">
                        <p className="text-sm font-bold text-primary-500 mb-1">{step.period || step.month}</p>
                        <p className="font-bold mb-2">{step.focus || step.advice}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Education */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="border border-divider bg-content1/80 shadow-xl h-full">
              <CardBody className="p-8">
                <h3 className="text-xl font-bold font-sora mb-6 flex items-center gap-2"><BookOpen className="text-secondary-500" /> Recommended Education Paths</h3>
                <div className="space-y-4">
                  {courses.length > 0 ? courses.map((c: any, i: number) => (
                    <div key={i} className="p-4 bg-content2/30 rounded-2xl border border-divider hover:border-secondary-500/50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold text-lg">{c.course_name || c.name || c.course_title}</p>
                          {c.labels && c.labels.map((lbl: string, idx: number) => (
                            <Chip key={idx} size="sm" color="warning" variant="flat" className="font-bold text-xs">{lbl}</Chip>
                          ))}
                        </div>
                        <p className="text-sm text-foreground/60">{c.provider || "Premium Institution"}</p>
                        <div className="text-xs text-secondary-600 mt-2 flex flex-col gap-1">
                          {(Array.isArray(c.why_recommended) ? c.why_recommended : [c.why_recommended || c.why]).slice(0, 2).map((w: string, idx: number) => (
                            w && <span key={idx} className="flex items-center gap-1"><Lightbulb size={12} /> {w}</span>
                          ))}
                        </div>
                        {c.description && (
                          <p className="text-xs text-foreground/80 mt-2 italic border-l-2 border-divider pl-2 line-clamp-3">{c.description}</p>
                        )}
                      </div>
                      {(c.url || c.apply_url || c.apply_link) && (c.url || c.apply_url || c.apply_link) !== "#" && (
                        <Button color="secondary" variant="flat" size="md" className="px-8 font-bold" as="a" href={c.url || c.apply_url || c.apply_link} target="_blank">View Details</Button>
                      )}
                    </div>
                  )) : fallbackCourses.map((c: string, i: number) => (
                    <div key={i} className="p-4 bg-content2/30 rounded-2xl border border-divider"><p className="font-semibold">{c}</p></div>
                  ))}

                  {shortCourses.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-divider space-y-4">
                      <h4 className="font-bold text-foreground/80 uppercase tracking-wider text-sm mb-4">Fast-Track Skill Gap Courses</h4>
                      {shortCourses.map((sc: any, i: number) => (
                        <div key={`sc-${i}`} className="p-4 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl border border-primary-200/50 hover:border-primary-500/50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-md text-primary-700 dark:text-primary-300">{sc.course_name || sc.name}</p>
                              {sc.labels && sc.labels.map((lbl: string, idx: number) => (
                                <Chip key={`scl-${idx}`} size="sm" color="primary" variant="flat" className="font-bold text-[10px]">{lbl}</Chip>
                              ))}
                            </div>
                            <p className="text-xs text-foreground/60">{sc.provider || "Class Central"}</p>
                          </div>
                          {(sc.url || sc.apply_url) && (sc.url || sc.apply_url) !== "#" && (
                            <Button color="primary" variant="flat" size="md" className="px-8 font-bold" as="a" href={sc.url || sc.apply_url} target="_blank">Enroll</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Market & Jobs */}
          <motion.div variants={itemVariants}>
            <Card className="border border-divider bg-content1/80 shadow-xl h-full">
              <CardBody className="p-8">
                <h3 className="text-xl font-bold font-sora mb-6 flex items-center gap-2"><Briefcase className="text-primary-500" /> Live Opportunities</h3>
                <div className="space-y-4">
                  {jobs.length > 0 ? jobs.slice(0, 5).map((j: any, i: number) => (
                    <div key={i} className="pb-4 border-b border-divider last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-lg hover:text-primary-500 cursor-pointer transition-colors pt-1">
                          <a href={j.apply_url || j.apply_link || j.link || "#"} target="_blank" rel="noreferrer">{j.job_title || j.title}</a>
                        </p>
                        {j.relevance_score && (
                          <Chip size="sm" color="success" variant="flat" className="font-bold">Match: {Math.round(j.relevance_score * 100)}%</Chip>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-foreground/60 mt-1 uppercase mb-2">{j.company} • {j.location || "Sri Lanka"}</p>

                      {j.description && (
                        <p className="text-xs text-foreground/80 mt-2 mb-2 line-clamp-3">{j.description}</p>
                      )}

                      {j.skills_match && j.skills_match.length > 0 && (
                        <div className="text-xs text-success-600 dark:text-success-400 mb-1">
                          <strong>Skills Match:</strong> {j.skills_match.join(", ")}
                        </div>
                      )}
                      {j.missing_skills && j.missing_skills.length > 0 && (
                        <div className="text-xs text-danger-500 mb-1">
                          <strong>Missing:</strong> {j.missing_skills.join(", ")}
                        </div>
                      )}
                    </div>
                  )) : fallbackJobs.map((j: string, i: number) => (
                    <div key={i} className="p-3 bg-content2/30 rounded-xl border border-divider text-sm font-medium">{j}</div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

        </motion.div>

        {/* Recommended Mentors block natively deleted as per user request */}

        {/* AI Explainability */}
        {explainability && explainability.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="border border-success-500/30 bg-success-50/50 dark:bg-success-900/10 shadow-lg">
              <CardBody className="p-8">
                <h3 className="text-xl font-bold font-sora mb-4 flex items-center gap-2 text-success-600"><ShieldQuestion size={24} /> AI Explainability & Confidence</h3>
                <ul className="space-y-3">
                  {explainability.map((exp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80 font-medium">
                      <span className="text-success-500 font-bold mt-0.5">•</span>
                      {exp.replace('• ', '')}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </motion.div>
        )}

        <div className="flex justify-center pt-8">
          <Button color="secondary" size="lg" className="font-bold shadow-xl shadow-secondary-500/20 px-10" as={Link} href="/dashboard">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}