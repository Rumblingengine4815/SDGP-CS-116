"use client";

import { useState } from "react";

export default function QuizPage() {

  const [interest, setInterest] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e:any) => {
    e.preventDefault();

    const data = {
      interest,
      skillLevel,
      budget,
      goal
    };

    console.log("Quiz Data:", data);

    // 🚀 later send to backend
    alert("Quiz submitted!");
  };

  return (

    <div className="min-h-screen bg-white text-black p-10">

      <h1 className="text-3xl font-bold mb-8">
        Career Quiz 🧠
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">

        {/* INTEREST */}
        <div>
          <label className="block mb-2">What are you interested in?</label>
          <select
            value={interest}
            onChange={(e)=>setInterest(e.target.value)}
            className="w-full p-3 bg-gray-200 rounded-lg"
          >
            <option value="">Select</option>
            <option value="tech">Technology</option>
            <option value="business">Business</option>
            <option value="design">Design</option>
          </select>
        </div>

        {/* SKILL LEVEL */}
        <div>
          <label className="block mb-2">Your current skill level?</label>
          <select
            value={skillLevel}
            onChange={(e)=>setSkillLevel(e.target.value)}
            className="w-full p-3 bg-gray-200 rounded-lg"
          >
            <option value="">Select</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* BUDGET */}
        <div>
          <label className="block mb-2">Budget for learning?</label>
          <select
            value={budget}
            onChange={(e)=>setBudget(e.target.value)}
            className="w-full p-3 bg-gray-200 rounded-lg"
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* GOAL */}
        <div>
          <label className="block mb-2">Your goal?</label>
          <input
            type="text"
            value={goal}
            onChange={(e)=>setGoal(e.target.value)}
            placeholder="e.g. Get a job, switch career"
            className="w-full p-3 bg-gray-200 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Submit Quiz
        </button>

      </form>

    </div>
  );
}