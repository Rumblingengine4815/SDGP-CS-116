import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-indigo-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Pathfinder+ logo"
                width={36}
                height={36}
                
              />
              <span className="text-lg font-semibold text-slate-900">
                Pathfinder+
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-600 max-w-xs">
              AI-powered career guidance platform helping you navigate your
              future with confidence and clarity.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#features" className="hover:text-slate-900">Features</a></li>
              <li><a href="#" className="hover:text-slate-900">Career Paths</a></li>
              <li><a href="#" className="hover:text-slate-900">AI Chatbot</a></li>
              <li><a href="#" className="hover:text-slate-900">Mentorship</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-slate-900">About</a></li>
              <li><a href="#" className="hover:text-slate-900">Careers</a></li>
              <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              <li><a href="#" className="hover:text-slate-900">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4">
              Get the App
            </h4>
            <div className="flex flex-col gap-3">
              <Image
                src="/appstore.svg"
                alt="Download on the App Store"
                width={160}
                height={40}
                className="h-32 w-50"
                priority
              />
              <Image
                src="/playstore.svg"
                alt="Get it on Google Play"
                width={160}
                height={40}
                className="h-32 w-50"
                                priority
              />
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 border-t border-slate-200" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>
            © {new Date().getFullYear()} Pathfinder+. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
