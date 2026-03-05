"use client";
import { useEffect, useRef, useState } from "react";

interface TypingAnimationProps {
    texts: string[];
    className?: string;
    typingSpeed?: number;
    pauseDuration?: number;
}

export function TypingAnimation({
    texts,
    className = "",
    typingSpeed = 50,
    pauseDuration = 2000,
}: TypingAnimationProps) {
    const [displayed, setDisplayed] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = texts[textIndex];
        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting && charIndex < current.length) {
            timeout = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
        } else if (!isDeleting && charIndex === current.length) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        } else if (isDeleting && charIndex > 0) {
            timeout = setTimeout(() => setCharIndex((c) => c - 1), typingSpeed / 2);
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setTextIndex((i) => (i + 1) % texts.length);
        }

        setDisplayed(current.slice(0, charIndex));
        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts, typingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {displayed}
            <span className="animate-pulse">|</span>
        </span>
    );
}
