export default function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            What Pathfinder+ Offers
          </h2>
          <p className="mt-4 text-slate-600">
            Our AI-powered platform helps you make confident career decisions
            with clarity and precision.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="
            bg-white rounded-2xl p-8 border border-slate-200
            shadow-sm transform transition-all duration-300
            hover:-translate-y-2 hover:shadow-xl hover:rotate-[0.5deg]
            animate-fade-up
          ">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
              <span className="text-indigo-600 text-xl">🧭</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Career Recommendations
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              Get personalized career suggestions based on your skills,
              interests, and long-term goals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="
  bg-white rounded-2xl p-8 border border-slate-200
  shadow-sm transform transition-all duration-300
  hover:-translate-y-2 hover:shadow-xl hover:-rotate-[0.5deg]
  animate-fade-up animate-delay-2
">

            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
              <span className="text-indigo-600 text-xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Skills Assessment
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              Analyze your strengths and weaknesses to discover the roles that
              best fit your profile.
            </p>
          </div>

          {/* Card 3 */}
          <div className="
  bg-white rounded-2xl p-8 border border-slate-200
  shadow-sm transform transition-all duration-300
  hover:-translate-y-2 hover:shadow-xl hover:rotate-[0.5deg]
  animate-fade-up animate-delay-3
">

            <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
              <span className="text-indigo-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Job Market Trends
            </h3>
            <p className="mt-3 text-slate-600 text-sm">
              Stay informed with real-time insights on job demand, salaries,
              and emerging career paths.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
