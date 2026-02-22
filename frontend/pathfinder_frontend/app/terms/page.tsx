export const metadata = {
  title: "Terms & Conditions - PathFinder+",
  description: "Terms and conditions for using PathFinder+.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900">Terms &amp; Conditions</h1>
      <p className="mt-4 text-slate-600">Last updated: February 21, 2026</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold  text-slate-900">Acceptance of Terms</h2>
        <p className="text-slate-600">By using PathFinder+ you agree to these terms. If you do not agree, do not use the service.</p>
      </section>

      <section className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold  text-slate-900">Service Description</h3>
        <p className="text-slate-600">PathFinder+ provides AI-driven career recommendations, course matching, and related tools. These are AI suggested recommendations so please use them as a guide and not as absolute truth.</p>
      </section>

      <section className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold  text-slate-900">User Responsibilities</h3>
        <p className="text-slate-600">You are responsible for the information you provide. Do not submit false or infringing content. Follow applicable laws when using the service.</p>
      </section>

      <section className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold  text-slate-900">Limitation of Liability</h3>
        <p className="text-slate-600">To the extent permitted by law, PathFinder+ is not liable for indirect, incidental, or consequential damages arising from use of the service.</p>
      </section>

      <section className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold  text-slate-900">Governing Law</h3>
        <p className="text-slate-600">These terms are governed by the laws of Sri Lanka. Disputes will be handled in the appropriate courts.</p>
      </section>

      
    </div>
    </div>
  );
}
