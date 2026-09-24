import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="clay-card p-12 md:p-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="inline-block mb-8">
                <Image 
                  src="/logo.jpg" 
                  alt="TATTVA Logo" 
                  width={140} 
                  height={50} 
                  className="object-contain mix-blend-multiply"
                />
              </Link>
              <p className="text-foreground/70 text-sm leading-relaxed font-serif">
                Designing Spaces with Purpose. Premium commercial interior design tailored for modern businesses in Mumbai.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#" className="clay-btn p-3 text-tattva-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="clay-btn p-3 text-tattva-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-6 text-tattva-dark">Quick Links</h4>
              <ul className="space-y-4 text-sm text-foreground/80 font-medium">
                <li><Link href="/" className="hover:text-tattva-primary transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-tattva-primary transition-colors">Services</Link></li>
                <li><Link href="/packages" className="hover:text-tattva-primary transition-colors">Packages & Pricing</Link></li>
                <li><Link href="/portfolio" className="hover:text-tattva-primary transition-colors">Portfolio</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-6 text-tattva-dark">Services</h4>
              <ul className="space-y-4 text-sm text-foreground/80 font-medium">
                <li>Commercial Interior Design</li>
                <li>Space Planning</li>
                <li>3D Visualization</li>
                <li>Turnkey Execution</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif mb-6 text-tattva-dark">Contact Us</h4>
              <ul className="space-y-5 text-sm text-foreground/80 font-medium">
                <li className="flex items-start gap-4">
                  <span className="clay-btn p-2 text-tattva-primary shrink-0"><MapPin size={16} /></span>
                  <span className="mt-1">Mumbai, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="clay-btn p-2 text-tattva-primary shrink-0"><Phone size={16} /></span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="clay-btn p-2 text-tattva-primary shrink-0"><Mail size={16} /></span>
                  <span>hello@tattva.design</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
        
        <div className="text-center text-sm font-bold tracking-widest uppercase text-foreground/40 mt-12">
          <p>&copy; {new Date().getFullYear()} TATTVA Interior Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
