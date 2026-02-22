"use client";

import React, { useState } from "react";

interface Step {
    title: string;
    description: string;
}

interface StepperProps {
    steps: Step[];
    activeStep?: number;
    onStepChange?: (n: number) => void;
}

export default function Stepper({ steps, activeStep, onStepChange }: StepperProps) {
    const [localActive, setLocalActive] = useState(activeStep ?? 0);

    React.useEffect(() => {
        if (typeof activeStep === "number") setLocalActive(activeStep);
    }, [activeStep]);

    return (
        <div className="w-full py-8">

            <div className="relative flex justify-between items-center mb-12 px-4 md:px-10">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-100 -translate-y-1/2 -z-10" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-purple-600 -translate-y-1/2 -z-10 transition-all duration-500 ease-out"
                    style={{ width: `${steps.length > 1 ? (localActive / (steps.length - 1)) * 100 : 0}%` }}
                />

                {steps.map((step, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setLocalActive(index);
                            onStepChange?.(index);
                        }}
                        className="flex flex-col items-center group focus:outline-none"
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ring-4 ${index <= localActive
                                ? "bg-purple-600 border-purple-600 text-white ring-purple-100"
                                : "bg-white border-purple-100 text-purple-300 ring-transparent hover:border-purple-300"
                                }`}
                        >
                            {index + 1}
                        </div>
                        <span
                            className={`mt-3 text-xs md:text-sm font-semibold transition-colors duration-300 ${index <= localActive ? "text-purple-600" : "text-slate-400 group-hover:text-purple-400"
                                }`}
                        >
                            {step.title.split(") ")[1] || step.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* active Step Content */}
            <div className="relative overflow-hidden min-h-[210px]">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`transition-all duration-500 ease-in-out transform absolute top-0 left-0 w-full ${index === localActive
                            ? "opacity-100 translate-x-0 pointer-events-auto"
                            : "opacity-0 translate-x-8 pointer-events-none"
                            }`}
                    >
                        <div className="rounded-3xl border border-purple-200 bg-white p-8 md:p-12 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl font-black text-purple-100/50">0{index + 1}</span>
                                <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
                            </div>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Steps summary (all steps) */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl border border-purple-100 bg-white shadow-sm">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${idx <= localActive ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                            {idx + 1}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">{step.title.split(") ")[1] || step.title}</h4>
                            <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
