"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody, Button, Chip, Progress } from "@heroui/react";
import { Upload, Target, TrendingUp, Sparkles, BookOpen, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [name, setName] = useState("User");
  const [greeting, setGreeting] = useState("Hello");

  const [marketTrends, setMarketTrends] = useState<any[]>([
    { title: "Data Analytics", jobs_active: 120 },
    { title: "UI/UX Design", jobs_active: 95 }
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if(storedName){
      setName(storedName);
    }
    
    // Try to load personalized market trends dynamically from recently completed Quiz
    try {
      const resultData = localStorage.getItem("resultData");
      if (resultData) {
        const parsed = JSON.parse(resultData);
        if (parsed?.bundle?.market_demand?.segments && parsed.bundle.market_demand.segments.length > 0) {
          setMarketTrends(parsed.bundle.market_demand.segments.slice(0, 2));
        }
      }
    } catch(e) {}
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen relative py-20 px-4 sm:px-8 lg:px-16 pattern-bg">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3 text-secondary-500 font-semibold mb-2">
            <Sparkles size={20} className="text-secondary-500" />
            <span className="uppercase tracking-widest text-sm">Your Progress So Far</span>
          </div>
          <h1 className="text-5xl font-black font-sora bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            {greeting}, <span className="text-secondary-500">{name}</span>!
          </h1>
          <p className="text-xl text-foreground/60 font-medium">What are we focusing on today?</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Quick Action: Upload CV */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-divider bg-content1/60 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-secondary-500/50 transition-all cursor-pointer group">
              <CardBody className="p-8 flex flex-col justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-secondary-500/10 text-secondary-500 group-hover:scale-110 group-hover:bg-secondary-500 transition-all duration-300">
                    <Upload size={32} />
                  </div>
                  <Chip color="success" variant="flat" size="sm" className="font-bold">Fast-Track</Chip>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-sora mb-2">Upload Resume</h3>
                  <p className="text-foreground/70">Let our AI instantly extract your skills, map your experience, and match you with live market opportunities in seconds.</p>
                </div>
                <Button 
                  as={Link} 
                  href="/upload-cv" 
                  color="secondary" 
                  variant="flat"
                  size="lg"
                  className="w-full font-bold justify-between transition-all"
                  endContent={<ArrowRight size={18} />}
                >
                  Start CV Parse
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Quick Action: Take Quiz */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-divider bg-content1/60 backdrop-blur-xl shadow-xl hover:shadow-2xl px-1 hover:border-primary-500/50 transition-all cursor-pointer group">
              <CardBody className="p-8 flex flex-col justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-primary-500/10 text-primary-500 group-hover:scale-110 group-hover:bg-primary-500 transition-all duration-300">
                    <Target size={32} />
                  </div>
                  <Chip color="primary" variant="flat" size="sm" className="font-bold">Deep Analysis</Chip>
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-sora mb-2">Take Skill Assessment</h3>
                  <p className="text-foreground/70">Answer a comprehensive quiz to let the PyTorch ML engine extract your exact skill vector and behavioral profile.</p>
                </div>
                <Button 
                  as={Link} 
                  href="/skill-assessment" 
                  color="primary" 
                  variant="flat"
                  size="lg"
                  className="w-full font-bold justify-between transition-all"
                  endContent={<ArrowRight size={18} />}
                >
                  Start Quiz
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>

        {/* Current Trends & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-2 border border-divider bg-content2/30 backdrop-blur-md shadow-lg">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={24} className="text-warning-500" />
                <h3 className="text-xl font-bold font-sora">Market Trends</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {marketTrends.map((trend, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-background shadow-sm border border-divider">
                    <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-2">Demand Surge</p>
                    <p className="text-2xl font-black text-foreground truncate" title={trend.title}>{trend.title}</p>
                    <p className="text-success-500 font-bold mt-2 flex items-center gap-1"><TrendingUp size={16}/> {trend.jobs_active || "70+"} active jobs</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="border border-divider bg-content2/30 backdrop-blur-md shadow-lg">
            <CardBody className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={24} className="text-secondary-500" />
                <h3 className="text-xl font-bold font-sora">Your Activity</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Profile Completion</span>
                    <span className="text-secondary-500">25%</span>
                  </div>
                  <Progress value={25} color="secondary" size="sm" classNames={{ indicator: "bg-gradient-to-r from-secondary-400 to-primary-500" }} />
                </div>
                <p className="text-sm text-foreground/70">
                  You haven't completed an assessment yet. Take the Quiz or Upload your CV to unlock your personalized career roadmap!
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

      </div>
    </main>
  );
}