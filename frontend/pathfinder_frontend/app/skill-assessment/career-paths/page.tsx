"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Chip, Select, SelectItem } from "@heroui/react";
import { CheckCircle2, ArrowRightCircle, Target, Map } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CareerPathVisualizer() {
  const [careerPaths, setCareerPaths] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>("Software Engineer");
  
  // Fetch from the live backend Python API -> MongoDB
  useEffect(() => {
    fetch("http://localhost:8000/api/career-paths")
      .then(res => res.json())
      .then(data => {
        setCareerPaths(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch MongoDB dynamic paths", err);
        setIsLoading(false);
      });
  }, []);

  const allDomains = Object.keys(careerPaths);
  
  // Try to auto-select based on assessment results if available
  useEffect(() => {
    if (allDomains.length === 0) return;
    try {
      const stored = localStorage.getItem("resultData");
      if (stored) {
        const data = JSON.parse(stored);
        const target = data?.bundle?.career_snapshot?.target_role || data?.career;
        // Basic matching logic: see if a domain roughly matches their target role
        if (target) {
            const match = allDomains.find(d => target.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(target.toLowerCase()));
            if (match) setSelectedDomain(match);
        }
      }
    } catch(e) {}
  }, [allDomains]);

  const pathNodes = careerPaths[selectedDomain] || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center w-full">
         <div className="w-full absolute top-0 z-50"><Navbar /></div>
         <div className="text-xl font-sora font-bold animate-pulse text-primary-500 flex items-center gap-3">
            <span className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
            Mapping Live Trajectories...
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full">
      <div className="w-full relative z-50">
         <Navbar />
      </div>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl px-6 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 font-semibold mb-2 text-sm tracking-widest uppercase shadow-sm">
            <Map size={16} /> Interactive Trajectory Explorer
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-sora tracking-tight">Career Path Visualiser</h1>
          <p className="text-default-500 text-lg">Explore verified industry progressions, salary bands, and precise competency requirements for the Sri Lankan and global markets.</p>
          
          <div className="flex justify-center mt-8">
            <Select 
              label="Select Career Track"
              labelPlacement="outside"
              placeholder="Choose a trajectory..."
              variant="bordered"
              color="primary"
              className="max-w-xs font-semibold"
              selectedKeys={new Set([selectedDomain])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) setSelectedDomain(selected);
              }}
            >
              {allDomains.map((domain) => (
                <SelectItem key={domain} textValue={domain}>
                  {domain}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* The Timeline Visualization Container */}
        <div className="relative border-l-4 border-divider ml-4 md:ml-12 pl-8 space-y-12">
          {pathNodes.map((node: any, index: number) => {
            
            // Dynamic Icons based on status
            const Icon = node.status === "completed" ? CheckCircle2 : node.status === "current" ? Target : ArrowRightCircle;
            const iconColor = node.status === "completed" ? "text-success-500" : node.status === "current" ? "text-primary-500" : "text-default-400";
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[46px] md:-left-[48px] top-4 bg-content1 p-1 rounded-full border-4 border-background shadow-sm z-10">
                  <Icon className={iconColor} size={24} />
                </div>

                {/* Node Card */}
                <Card className={`bg-content1 transition-all ${node.status === "current" ? "border-2 border-primary-500 shadow-xl shadow-primary-500/10 scale-[1.02]" : "border border-divider shadow-md hover:border-default-400"}`}>
                  <CardBody className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold font-sora text-foreground mb-1">{node.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-foreground/60">
                          <span className="bg-default-100 dark:bg-zinc-800 px-3 py-1 rounded-md">{node.years}</span>
                          <span className="bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 px-3 py-1 rounded-md">Expected: {node.salary}</span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      {node.status === "completed" && <Chip color="success" variant="flat" className="font-bold border border-success-200">Mastered Stage</Chip>}
                      {node.status === "current" && <Chip color="primary" variant="shadow" className="font-bold animate-pulse">Next Promotion Target</Chip>}
                      {node.status === "future" && <Chip color="default" variant="flat" className="font-bold border border-divider">Future Milestone</Chip>}
                    </div>

                    <p className="text-xs text-foreground/50 uppercase tracking-widest font-bold mb-3">Required Competencies</p>
                    <div className="flex flex-wrap gap-2">
                      {node.skills.map((skill: string, sIdx: number) => (
                        <Chip key={sIdx} size="sm" variant={node.status === "completed" ? "faded" : "flat"} className={node.status === "completed" ? "bg-default-100 text-default-600 font-medium" : "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-semibold"}>
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  );
}
