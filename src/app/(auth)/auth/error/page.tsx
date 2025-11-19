"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Auth Error</h1>

        <p className="mb-8 text-gray-600">
          We encountered an issue while processing your request. Please try again or contact the application owner if
          the problem persists.
        </p>

        <Link
          href="/"
          className="mb-6 inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Return to Application
        </Link>

        {error && (
          <div className="mt-6 rounded-md bg-gray-100 p-3">
            <p className="text-sm text-gray-600">
              Error Code: <span className="font-mono text-red-600">{error}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
