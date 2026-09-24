"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Packages", path: "/packages" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  return (
    <nav className={`sticky top-6 z-50 w-full max-w-6xl mx-auto px-4 transition-all duration-300 ${scrolled ? 'py-0' : 'py-2'}`}>
      <div className="clay-panel flex justify-between items-center h-20 px-8 !py-0 !rounded-full">
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.jpg" 
              alt="TATTVA Logo" 
              width={100} 
              height={35} 
              className="object-contain mix-blend-multiply"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className="text-foreground/80 hover:text-tattva-primary transition-colors text-sm font-bold tracking-wide"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/book"
            className="clay-btn-primary px-6 py-2.5 text-xs font-bold tracking-wide uppercase ml-4"
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="clay-btn p-3 text-tattva-primary focus:outline-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute w-[calc(100%-2rem)] left-4 top-24"
          >
            <div className="clay-panel px-4 py-6 space-y-4 flex flex-col !rounded-3xl">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-bold text-foreground text-center hover:text-tattva-primary tracking-wide clay-btn !w-full"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/book"
                  onClick={() => setIsOpen(false)}
                  className="clay-btn-primary block w-full text-center px-4 py-4 text-sm font-bold tracking-wide uppercase"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
