"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

type Item = {
  name: string;
  role: string;
  location?: string;
  text: string;
  img?: string;
};

export default function TestimonialCarousel({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map((it, i) => (
              <div key={i} className="min-w-full px-4">
                <div className="p-8 bg-white rounded-2xl border border-purple-50 shadow-sm text-center">
                  <Image
                    src={it.img ?? `/team/p${(i % 3) + 1}.jpg`}
                    alt={it.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 mb-6 object-cover object-center rounded-full inline-block border-2 border-purple-100 mx-auto"
                  />
                  <p className="leading-relaxed text-slate-600">{it.text}</p>
                  <span className="inline-block h-1 w-10 rounded bg-purple-600 mt-6 mb-4 mx-auto" />
                  <h3 className="text-slate-900 font-medium tracking-wider text-sm">{it.name}</h3>
                  <p className="text-slate-500">{it.role}{it.location ? ` — ${it.location}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === index ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-y-0 left-2 flex items-center md:left-4">
          <button
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="p-2 rounded-full bg-white border shadow-sm hover:bg-purple-50"
            aria-label="Previous testimonial"
          >
            ‹
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center md:right-4">
          <button
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="p-2 rounded-full bg-white border shadow-sm hover:bg-purple-50"
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
