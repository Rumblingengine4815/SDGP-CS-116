"use client";

const steps = [
  {
    title: "1) ESCO(European Skills, Competences, Qualifications and Occupations) Profiling Organization",
    description:
      "ESCO is a European framework that standardizes skills and qualifications across industries. We use ESCO data to ensure our recommendations are aligned with recognized industry standards.",
  },
  {
    title: "2) Local Job Data(XpressJobs,TopJobs,IkmanJobs and paylab for salary data)",
    description:
      "We collect and analyze job data from local job platforms like XpressJobs, TopJobs, and IkmanJobs, as well as salary data from Paylab to provide accurate insights into local job market trends.",
  },
  {
    title: "3) Course Data(Class Central and some local course providers)",
    description:
      "We gather course information from platforms like Class Central and local course providers to recommend relevant courses tailored to your career goals.",
  },
  {
    title: "4) Academic Course Data(PickaCourse)",
    description:
      "We also collect academic course data from PickaCourse to provide insights into university-level learning opportunities that align with your career goals.",
  },

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">