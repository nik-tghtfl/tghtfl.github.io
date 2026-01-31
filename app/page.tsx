import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to Quippi
        </h1>
        <h2 className="text-2xl text-gray-700">
          Your voice matters. Share your feedback anonymously.
        </h2>
        <div className="space-y-4 text-lg text-gray-600 max-w-2xl mx-auto">
          <p>
            Quippi is a platform designed to help employees share their thoughts,
            concerns, and suggestions in a safe, anonymous environment.
          </p>
          <p>
            Your feedback is automatically categorized and aggregated, providing
            valuable insights to help improve workplace culture and processes.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/feedback/"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Submit Feedback
          </Link>
        </div>
        <div className="pt-12 mt-12 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Open feedback programs will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
