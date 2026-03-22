"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Input, Textarea, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function StandaloneResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+94 77 123 4567",
    linkedin: "linkedin.com/in/johndoe",
    summary: "A passionate Software Engineering undergraduate looking to leverage modern web technologies to build impactful applications.",
    skills: "JavaScript, React, Next.js, Python, FastAPI, TailwindCSS",
    experience: "Software Engineer Intern @ TechCorp (Jun 2025 - Present)\nBuilt scalable APIs and modernized the React frontend.",
    education: "BSc Computer Science @ Local University (2023 - 2027)\nGPA: 3.8",
  });

  const [customSections, setCustomSections] = useState([
    { id: "1", title: "Projects", content: "PathFinder+ AI Platform\nDeveloped backend PyTorch models for CV analytics." },
    { id: "2", title: "Certifications", content: "AWS Certified Developer – Associate\nGoogle Data Analytics Professional Certificate" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (index: number, field: "title" | "content", value: string) => {
    const newSections = [...customSections];
    newSections[index][field] = value;
    setCustomSections(newSections);
  };

  const addCustomSection = () => {
    setCustomSections([...customSections, { id: Date.now().toString(), title: "Languages", content: "English (Fluent), Spanish (Basic)" }]);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full">
      <div className="w-full print:hidden mb-8">
        <Navbar />
      </div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold mb-2">Standalone Resume Builder</h1>
            <p className="text-default-500">Fully compatible with Light & Dark Themes. Add unlimited custom sections dynamically!</p>
          </div>
          <Button color="primary" variant="shadow" onPress={handlePrint} size="lg" className="w-full md:w-auto">
            Download PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:w-full">
          {/* LEFT: EDIT FORM */}
          <Card className="print:hidden h-[800px] overflow-y-auto w-full shadow-lg border border-default-200 bg-content1">
            <CardBody className="flex flex-col gap-6 p-8">
              <div>
                <h2 className="text-xl font-bold mb-4">1. Personal Information</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-default-600">Full Name</label>
                    <Input name="name" value={resumeData.name} onChange={handleChange} variant="faded" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-default-600">Email Address</label>
                      <Input name="email" value={resumeData.email} onChange={handleChange} variant="faded" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-default-600">Phone Number</label>
                      <Input name="phone" value={resumeData.phone} onChange={handleChange} variant="faded" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-default-600">LinkedIn / GitHub URL</label>
                    <Input name="linkedin" value={resumeData.linkedin} onChange={handleChange} variant="faded" />
                  </div>
                </div>
              </div>

              <Divider className="my-2 bg-default-200" />
              
              <div>
                <h2 className="text-xl font-bold mb-4">2. Professional Summary</h2>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-default-600">Summary Outline</label>
                  <Textarea name="summary" value={resumeData.summary} onChange={handleChange} variant="faded" minRows={3} />
                </div>
              </div>

              <Divider className="my-2 bg-default-200" />

              <div>
                <h2 className="text-xl font-bold mb-4">3. Technical Skills</h2>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-default-600">Core Skills (comma separated)</label>
                  <Textarea name="skills" value={resumeData.skills} onChange={handleChange} variant="faded" minRows={2} />
                </div>
              </div>

              <Divider className="my-2 bg-default-200" />

              <div>
                <h2 className="text-xl font-bold mb-4">4. Experience & Education</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-default-600">Experience History</label>
                    <Textarea name="experience" value={resumeData.experience} onChange={handleChange} variant="faded" minRows={4} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-default-600">Academic Education</label>
                    <Textarea name="education" value={resumeData.education} onChange={handleChange} variant="faded" minRows={3} />
                  </div>
                </div>
              </div>

              <Divider className="my-2 bg-default-200" />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">5. Custom Sections</h2>
                  <Button size="sm" color="secondary" variant="flat" onPress={addCustomSection} startContent={<Plus size={16} />}>
                    Add New Category
                  </Button>
                </div>
                
                <div className="flex flex-col gap-6">
                  {customSections.map((section, index) => (
                    <div key={section.id} className="flex flex-col gap-4 p-5 border border-default-200 rounded-xl relative bg-default-50/50">
                      <Button isIconOnly size="sm" color="danger" variant="light" className="absolute top-2 right-2 z-10" onPress={() => removeCustomSection(index)}>
                         <Trash2 size={18} />
                      </Button>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-default-600">Section Title (e.g., Projects)</label>
                        <Input value={section.title} onChange={(e) => handleCustomChange(index, "title", e.target.value)} variant="faded" className="w-[85%]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-default-600">Content</label>
                        <Textarea value={section.content} onChange={(e) => handleCustomChange(index, "content", e.target.value)} variant="faded" minRows={3} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* RIGHT: A4 PDF PREVIEW */}
          <div id="printable-resume" className="bg-white text-black rounded-lg shadow-2xl p-10 w-full max-w-[210mm] h-[297mm] mx-auto overflow-hidden print:p-10 print:shadow-none print:m-0 break-inside-avoid">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-serif font-bold uppercase tracking-wider">{resumeData.name || "Your Name"}</h1>
              <p className="text-sm mt-2 text-gray-600">
                {resumeData.email} • {resumeData.phone} • {resumeData.linkedin}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-3">Professional Summary</h2>
              <p className="text-md leading-relaxed">{resumeData.summary}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-3">Core Skills</h2>
              <p className="text-md leading-relaxed font-semibold">{resumeData.skills}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-3">Professional Experience</h2>
              <div className="whitespace-pre-wrap text-md leading-relaxed">
                {resumeData.experience}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-3">Education</h2>
              <div className="whitespace-pre-wrap text-md leading-relaxed">
                {resumeData.education}
              </div>
            </div>

            {/* Render dynamically added custom sections onto the PDF! */}
            {customSections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-3">{section.title || "Custom Section"}</h2>
                <div className="whitespace-pre-wrap text-md leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white; margin: 0; padding: 0; }
            /* Setting margin: 0 on @page forces the browser to literally delete the URL, Date, and Page Number headers */
            @page { size: A4; margin: 0; }
            body * { visibility: hidden; }
            #printable-resume, #printable-resume * { visibility: visible; }
            /* Re-applying the margin internally as padding so the white borders still exist perfectly without triggering browser headers */
            #printable-resume { position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 15mm; box-sizing: border-box; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}} />
      </motion.div>
    </div>
  );
}
