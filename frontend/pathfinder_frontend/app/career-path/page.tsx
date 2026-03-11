"use client";

export default function CareerPath() {
  return (
    <div className="min-h-screen bg-gray-50 px-16 py-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-10">
        Skill Assessment
      </h1>

      <div className="flex gap-16">

        {/* LEFT SIDE FORM */}
        <div className="flex-1 space-y-6">

          {/* CURRENT ROLE */}
          <div>
            <label className="text-sm text-gray-600">
              Current Role*
            </label>

            <input
              type="text"
              placeholder="Enter role"
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>


          {/* QUALIFICATION */}
          <div>
            <label className="text-sm text-gray-600">
              Highest Qualification Obtained
            </label>

            <input
              type="text"
              placeholder="Enter Qualification"
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>


          {/* TYPE OF FIELD */}
          <div>
            <label className="text-sm text-gray-600">
              Type of Field (If Working)
            </label>

            <input
              type="text"
              placeholder="Enter Field"
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>


          {/* REASON */}
          <div>
            <label className="text-sm text-gray-600">
              Reason for switching fields
            </label>

            <input
              type="text"
              placeholder="Enter Reason"
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>


          {/* FIELD INTERESTED */}
          <div>
            <label className="text-sm text-gray-600">
              Enter Field Interested In
            </label>

            <input
              type="text"
              placeholder="Enter Field"
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>


          {/* LANGUAGE */}
          <div className="space-y-3">

            <p className="text-sm text-gray-600">
              Preferred Language of Choice
            </p>

            <label className="flex gap-2">
              <input type="radio" name="lang" />
              English
            </label>

            <label className="flex gap-2">
              <input type="radio" name="lang" />
              Sinhala
            </label>

            <label className="flex gap-2">
              <input type="radio" name="lang" />
              Tamil
            </label>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex-1 space-y-8">

          {/* JOB STATUS */}
          <div>

            <label className="text-sm text-gray-600">
              Job Status
            </label>

            <select className="w-full border rounded-lg p-3 mt-1">

              <option>Select Answer</option>
              <option>Employed</option>
              <option>Unemployed</option>
              <option>Committed to Studies</option>

            </select>

          </div>


          {/* PAY FOR COURSES */}
          <div>

            <label className="text-sm text-gray-600">
              Are you willing to pay for courses?
            </label>

            <select className="w-full border rounded-lg p-3 mt-1">

              <option>Select Answer</option>
              <option>Yes</option>
              <option>No</option>
              <option>Free or Low cost Courses would be appropriate</option>

            </select>

          </div>

        </div>

      </div>

    </div>
  );
}