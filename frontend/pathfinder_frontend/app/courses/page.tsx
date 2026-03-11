import Image from "next/image";

export default function Courses() {

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-10">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-semibold text-gray-800">
          Suggested Courses
        </h1>

        <Image
          src="/images/filter.png"
          alt="filter"
          width={30}
          height={30}
        />

      </div>

      <div className="flex gap-10">

        {/* COURSES GRID */}
        <div className="flex-1 grid grid-cols-3 gap-6">

          {/* COURSE CARD */}
          <div className="bg-white p-5 rounded-lg shadow-sm border">

            <h2 className="font-semibold text-gray-800">
              UI/UX Design for Beginners
            </h2>

            <div className="flex gap-3 mt-2 text-sm text-gray-500">

              <span className="bg-green-100 text-green-600 px-2 rounded">
                8H
              </span>

              <span>Cost: Free</span>

            </div>

            <div className="flex items-center gap-3 mt-5">

              <Image
                src="/images/google.png"
                alt="provider"
                width={30}
                height={30}
              />

              <p className="text-gray-700 text-sm">
                Google Inc.
              </p>

            </div>

          </div>

        </div>

        {/* FILTER PANEL */}
        <div className="w-56 bg-blue-100 p-5 rounded">

          <h3 className="font-semibold mb-3">
            Filter
          </h3>

          <div className="space-y-3 text-sm">

            <label className="flex gap-2">
              <input type="checkbox" />
              Most Relevant
            </label>

            <label className="flex gap-2">
              <input type="checkbox" />
              Alphabetical Order
            </label>

            <label className="flex gap-2">
              <input type="checkbox" />
              Price Low to High
            </label>

          </div>

        </div>

      </div>

    </div>
  );
}