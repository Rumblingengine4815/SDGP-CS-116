


const steps = [
  {
    title: "1) User Profile Input",
    description:
      "The user provides education level, interests, preferred industries, and other profile details.",
  },
  {
    title: "2) Data Matching",
    description:
      "PathFinder+ compares profile data against occupation, skills, and course datasets.",
  },
  {
    title: "3) Ranking & Scoring",
    description:
      "The recommendation engine ranks pathways by relevance, employability signals, and learning fit.",
  },
  {
    title: "4) Guidance Output",
    description:
      "Users receive role suggestions and learning directions that align with their goals.",
  },
];

export default function HowThisWorksPage() {
  return (
    <div className="space-y-6">
      <section className="animate-fade-up rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-bold">How This Works</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          A quick overview of the recommendation flow used by PathFinder+.
        </p>
      </section>

      <section className="grid gap-4">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={`reveal rounded-xl border border-border bg-card p-5 reveal-active ${index === 1 ? "animate-delay-1" : index === 2 ? "animate-delay-2" : index === 3 ? "animate-delay-3" : ""
              }`}
          >
            <h2 className="text-lg font-semibold text-primary">{step.title}</h2>
            <p className="mt-2 text-sm text-muted">{step.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}