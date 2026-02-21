export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Welcome to <span className="text-purple-600">PathFinder+</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
            AI-powered career guidance platform helping you navigate your future with confidence and clarity.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="/about"
              className="rounded-lg bg-purple-600 px-8 py-3 text-white font-medium transition hover:bg-purple-700"
            >
              Get Started
            </a>
            <a
              href="/how-it-works"
              className="rounded-lg border border-purple-200 bg-white px-8 py-3 text-purple-600 font-medium transition hover:border-purple-400"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border border-purple-200 bg-blue p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Data-Driven Insights</h3>
            <p className="mt-2 text-sm text-slate-600">
              Recommendations grounded in curated market and skills datasets.
            </p>
          </article>
          <article className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Personalized Guidance</h3>
            <p className="mt-2 text-sm text-slate-600">
              Career paths tailored to your profile, interests, and goals.
            </p>
          </article>
          <article className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Resume Analysis and Creation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Analyze and create your resume based on your career goals.
            </p>
          </article>
          <article className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Chatbot for help</h3>
            <p className="mt-2 text-sm text-slate-600">
              Helps with your queries.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
