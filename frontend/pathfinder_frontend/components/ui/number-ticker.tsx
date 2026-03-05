"use client";
import { useEffect, useRef, useState } from "react";

interface NumberTickerProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    decimalPlaces?: number;
}

export function NumberTicker({
    value,
    className = "",
    prefix = "",
    suffix = "",
    decimalPlaces = 0,
}: NumberTickerProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setCount(value); clearInterval(timer); }
            else setCount(current);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [started, value]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toFixed(decimalPlaces)}{suffix}
        </span>
    );
}
