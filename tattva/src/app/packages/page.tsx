"use client";

import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Design-Only",
    tagline: "For clients managing execution independently.",
    timeline: "2–4 weeks",
    price: "₹40–₹100",
    unit: "per sq. ft.",
    features: [
      "Initial consultation",
      "Space planning",
      "Concept development",
      "2D layout drawings",
      "3D visualizations",
      "Material and finish recommendations",
      "Lighting and furniture suggestions",
      "Design documentation"
    ]
  },
  {
    name: "Design + Execution",
    tagline: "Design services with execution coordination.",
    timeline: "6–10 weeks",
    price: "Design Fee + 8–12%",
    unit: "of project cost",
    features: [
      "Everything in Design-Only",
      "Contractor coordination",
      "Vendor coordination",
      "Execution supervision",
      "Material procurement support",
      "Quality checks",
      "Progress updates",
      "Basic project coordination"
    ],
    highlight: true
  },
  {
    name: "Turnkey",
    tagline: "Complete end-to-end project management.",
    timeline: "8–16 weeks",
    price: "Custom Quote",
    unit: "10–15% mgmt margin",
    features: [
      "Initial consultation and site assessment",
      "Complete interior design & 3D visualizations",
      "Material and finish selection",
      "Vendor and contractor management",
      "Procurement coordination",
      "Civil, electrical, and furnishing coordination",
      "Quality control & timeline management",
      "Final handover"
    ]
  }
];

export default function Packages() {
  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif text-tattva-dark mb-8">Packages & Pricing</h1>
        <p className="text-lg text-foreground/70 leading-relaxed font-light">
          Transparent, flexible engagement models designed to suit your project requirements and management preferences.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {packages.map((pkg, i) => (
            <motion.div 
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative flex flex-col p-10 ${
                pkg.highlight 
                  ? 'clay-card-dark scale-105 z-10' 
                  : 'clay-card'
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tattva-accent text-white px-6 py-2 rounded-full shadow-lg text-xs font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8 mt-2">
                <h3 className={`text-3xl font-serif mb-3 ${pkg.highlight ? 'text-white' : 'text-tattva-dark'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm ${pkg.highlight ? 'text-white/80' : 'text-foreground/70'}`}>
                  {pkg.tagline}
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-opacity-20 border-current">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-3xl font-bold ${pkg.highlight ? 'text-white' : 'text-tattva-primary'}`}>
                    {pkg.price}
                  </span>
                </div>
                <span className={`text-sm font-bold tracking-wider uppercase ${pkg.highlight ? 'text-tattva-accent' : 'text-tattva-accent'}`}>
                  {pkg.unit}
                </span>
                
                <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                  <span className="opacity-70">Estimated Timeline:</span> {pkg.timeline}
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-sm font-bold tracking-widest uppercase mb-6 opacity-80">What&apos;s Included</p>
                <ul className="space-y-4">
                  {pkg.features.map(feature => (
                    <li key={feature} className="flex items-start gap-4 text-sm">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${pkg.highlight ? 'text-tattva-accent' : 'text-tattva-primary'}`} />
                      <span className="leading-snug opacity-90 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12">
                <Link 
                  href="/book" 
                  className={`block text-center w-full py-4 text-sm font-bold tracking-wider uppercase inline-block ${
                    pkg.highlight 
                      ? 'clay-btn text-tattva-dark' 
                      : 'clay-btn-primary'
                  }`}
                >
                  Request Quote
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 clay-card p-8 flex items-start gap-5">
          <Info className="text-tattva-primary shrink-0 mt-1 w-6 h-6" />
          <div className="text-sm text-foreground/80 leading-relaxed">
            <p className="font-bold text-tattva-dark mb-2 text-base">Pricing Disclaimer</p>
            <p>The prices displayed above are preliminary planning estimates. Final pricing depends on project size, complexity, location, material selection, and specific client requirements. Please contact us for a detailed and customized quote.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
