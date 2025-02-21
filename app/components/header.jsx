'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';  

const NAVBAR_ITEMS = [
  {label: "FAQs", href: "#faqs"},
  { label: "How it works", href: "#howitworks" },
  { label: "About us", href: "#aboutus" },
];


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const [isLandingPage, setIsLandingPage] = useState(false);

  useEffect(() => {
    if (router.asPath === '/' || router.asPath === '/page') {
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
  }, [router.asPath]);
 
  return (
    <header className={` top-0 left-0 w-full z-20 ${isLandingPage ? 'absolute bg-transparent backdrop-blur-sm' : 'relative bg-[#591B0C] border-b'}`}>
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between p-4 sm:px-6 lg:px-16">
        <Link href="/" className="font-bold text-xl sm:text-2xl text-white hover:scale-105 transition-transform">
          <h1 className="text-2xl sm:text-3xl text-white">AdvocateInfo</h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <div className="hidden lg:flex text-base sm:text-lg gap-4 sm:gap-8">
            {NAVBAR_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white font-semibold relative group whitespace-nowrap"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/register"
              className="hidden lg:block px-4 sm:px-6 py-2 bg-white text-base sm:text-lg text-primary font-semibold  hover:bg-gray-100 whitespace-nowrap"
            >
              Create Profile
            </Link>
            <Link
              href="/login"
              className="hidden lg:block px-4 sm:px-6 py-2 bg-transparent border-2 border-white text-base sm:text-lg text-white font-semibold  shadow-md hover:bg-white/20 hover:text-primary whitespace-nowrap"
            >
              Log in
            </Link>
          </div>
          
          <button
            className="lg:hidden text-white hover:opacity-80 transition-opacity p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

     
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 lg:hidden backdrop-blur-md z-50" onClick={() => setIsMenuOpen(false)}>
          <div
            className="absolute top-16 left-4 right-4 sm:left-8 sm:right-8 bg-slate-100 p-6 sm:p-8 rounded-lg shadow-2xl flex flex-col gap-4 sm:gap-6 animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            {NAVBAR_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-primary text-lg sm:text-xl font-semibold hover:text-gray-600 transition-all duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="block text-center border-2 border-primary text-primary py-2 sm:py-3  text-base sm:text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Profile
            </Link>
            <Link
              href="/login"
              className="block text-center border-2 border-primary text-primary py-2 sm:py-3  text-base sm:text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
