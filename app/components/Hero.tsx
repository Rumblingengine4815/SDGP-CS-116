import Image from "next/image";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative bg-linear-to-b from-indigo-50 via-white to-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

                {/* LEFT CONTENT */}
                <div>
                    <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
                        AI-Powered Career Guidance
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        Navigate Your Career <br /> with AI Precision
                    </h1>

                    <p className="mt-6 text-lg text-slate-600 max-w-xl">
                        Pathfinder+ uses powerful AI to guide you to the perfect career
                        tailored to your skills, interests, and real-time job market trends.
                    </p>

                    /* {/* App Store Buttons */}
                    <div className="mt-1 flex flex-wrap items-center gap-4">
                        <a
                            href="#"
                            className="transition-transform hover:scale-105"
                            aria-label="Download on the App Store"
                        >
                            <Image
                                src="/appstore.svg"
                                alt="Download on the App Store"
                                width={180}
                                height={54}
                                className="h-32 w-auto"
                                priority
                            />

                        </a>

                        <a
                            href="#"
                            className="transition-transform hover:scale-105"
                            aria-label="Download on the App Store"
                        >
                            <Image
                                src="/playstore.svg"
                                alt="Download on the App Store"
                                width={180}
                                height={54}
                                className="h-32 w-auto"
                                priority
                            />

                        </a>

                    </div> */
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative flex justify-center md:justify-end">
                    <Image
                        src="/hero-illustration.png"
                        alt="AI career guidance illustration"
                        width={700}
                        height={700}
                        priority
                        className="w-full max-w-xl md:max-w-2xl h-auto"
                    />
                </div>


            </div>
        </section>
    );
}
