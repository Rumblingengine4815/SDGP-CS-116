"use client";

import Image from "next/image";
import { Linkedin, Github } from "lucide-react";

interface Member {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
}

export default function TeamCard({ member }: { member: Member }) {
  return (
    <div className="group rounded-2xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100/50">

      <figure className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-purple-50 p-6">
        <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white shadow-md">
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            src={member.image}
            alt={member.name}
            fill
          />
        </div>
      </figure>


      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            {member.role}
          </p>
        </div>


        <div className="flex items-center justify-center gap-4">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group/icon flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
          >
            <Linkedin size={20} />
            <span className="sr-only">LinkedIn profile for {member.name}</span>
          </a>
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group/icon flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-700 transition-all hover:bg-gray-900 hover:text-white"
          >
            <Github size={20} />
            <span className="sr-only">GitHub profile for {member.name}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
