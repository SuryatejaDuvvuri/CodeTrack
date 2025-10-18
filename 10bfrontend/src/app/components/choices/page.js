"use client";
export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
function Easy() {
  const search = useSearchParams();
  const topic = search.get("topic");
  const netid = typeof window !== "undefined" ? localStorage.getItem('netid') : null;
  return (
      <div className="min-h-screen w-full font-sans flex flex-col bg-gradient-to-r from-gray-700 via-gray-900 to-gray-800">
        <nav className="bg-black w-full rounded-lg shadow-lg mb-8">
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="flex space-x-4">
              <a href="/" className="text-blue-300 hover:text-white text-lg font-semibold transition-all transform hover:scale-110">Home</a>
              <a
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/';
                }}
                className="text-blue-300 hover:text-white text-lg font-semibold transition-all cursor-pointer transform hover:scale-110"
              >
                Logout
              </a>
            </div>
          </div>
        </nav>
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
          <h2 className="text-3xl font-bold text-blue-300 mb-8 tracking-tight text-center">Choose Your Difficulty</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center items-stretch">
            <Link
              className="flex-1 flex flex-col items-center justify-center bg-emerald-500 rounded-2xl shadow-lg p-10 hover:scale-105 transition-all border-2 border-emerald-700 hover:border-emerald-400 min-w-[220px]"
              href={`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Easy`}
            >
              <span className="mb-2 text-2xl font-bold tracking-tight text-white text-center">Easy</span>
              <span className="font-normal text-base text-emerald-100 text-center">Start off with ease!</span>
            </Link>
            <Link
              className="flex-1 flex flex-col items-center justify-center bg-amber-500 rounded-2xl shadow-lg p-10 hover:scale-105 transition-all border-2 border-amber-700 hover:border-amber-400 min-w-[220px] max-w-xs"
              href={`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Medium`}
            >
              <span className="mb-2 text-2xl font-bold tracking-tight text-white text-center">Medium</span>
              <span className="font-normal text-base text-amber-100 text-center">You think that's easy? Try this!</span>
            </Link>
            <Link
              className="flex-1 flex flex-col items-center justify-center bg-orange-500 rounded-2xl shadow-lg p-10 hover:scale-105 transition-all border-2 border-orange-700 hover:border-orange-400 min-w-[220px] max-w-xs"
              href={`/components/problems?topic=${encodeURIComponent(topic)}&difficulty=Hard`}
            >
              <span className="mb-2 text-2xl font-bold tracking-tight text-white text-center">Hard</span>
              <span className="font-normal text-base text-orange-100 text-center">Still think this is easy? Try me!</span>
            </Link>
          </div>
        </main>
        <footer className="w-full mt-12 mb-4 px-4 rounded-lg shadow-lg bg-gray-900 border-t border-gray-800">
          <div className="flex justify-center space-x-6 py-4">
            <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Home</a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-blue-300 hover:text-white cursor-pointer font-semibold transition-all transform hover:scale-110">Contact</a>
          </div>
          <div className="text-center text-gray-500 text-xs pb-2">&copy; 2025 CodeTrack</div>
        </footer>
      </div>
  );
}

export default function Choices()
{
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>}>
      <Choices/>
    </Suspense>
  );
}
