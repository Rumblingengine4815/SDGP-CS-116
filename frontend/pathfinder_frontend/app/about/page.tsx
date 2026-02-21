"use client";

import TeamCard from "../components/team/TeamCard";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Lorion Ravindradasan",
      role: "Project Leader / ML Dev",
      image: "/team/lorion.jpg",
      linkedin: "https://www.linkedin.com/in/lorion-ravindradasan/",
      github: "https://github.com/Rumblingengine4815",
    },
    {
      name: "Senuth Kodithuwakku",
      role: "Full Stack Developer",
      image: "https://ui-avatars.com/api/?name=Senuth+Kodithuwakku&size=256&background=7c3aed&color=fff",
      linkedin: "https://www.linkedin.com/in/senuth-kodithuwakku/",
      github: "https://github.com/SenuX69",
    },
    {
      name: "Nithila Mandiw",
      role: "Backend and Growth Lead",
      image: "https://ui-avatars.com/api/?name=Nithila+Mandiw&size=256&background=7c3aed&color=fff",
      linkedin: "https://www.linkedin.com/in/nithila-mandiw/",
      github: "https://github.com/nithilamandiw",
    },
    {
      name: "Thathsara Samarakoon",
      role: "Bot Developer",
      image: "https://ui-avatars.com/api/?name=Thathsara+Samarakoon&size=256&background=7c3aed&color=fff",
      linkedin: "https://www.linkedin.com/in/thathsara-samarakoon/",
      github: "https://github.com/thathsara336",
    },
    {
      name: "Dineth Weerasekara",
      role: "Product Developer",
      image: "https://ui-avatars.com/api/?name=Dineth+Weerasekara&size=256&background=7c3aed&color=fff",
      linkedin: "https://www.linkedin.com/in/dineth-weerasekara/",
      github: "https://github.com/DinethWr",
    },
    {
      name: "Anton Jude",
      role: "UI/UX Developer",
      image: "/team/jude.jpeg",
      linkedin: "https://www.linkedin.com/in/anton-jude-702810253/",
      github: "https://github.com/judethayaan",
    },
  ];

  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">
            Meet the Team
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The people building PathFinder+ — combining AI,ML and grit with design to revolutionize career guidance for everyone.
          </p>
        </div>


        <div className="grid max-w-6xl grid-cols-1 px-10 mx-auto mt-12 text-center sm:px-0 sm:grid-cols-2 md:mt-20 gap-x-8 md:grid-cols-3 gap-y-16 lg:gap-x-16 xl:gap-x-20">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>


        <div className="mt-12 sm:mt-16">
          <svg className="w-auto h-4 mx-auto text-purple-100" viewBox="0 0 172 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                y1="-0.5"
                x2="18.0278"
                y2="-0.5"
                transform={`matrix(-0.5547 0.83205 0.83205 0.5547 ${11 + (i * 7)} 1)`}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}