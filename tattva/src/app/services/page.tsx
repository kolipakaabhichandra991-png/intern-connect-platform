"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    title: "Commercial Interior Design",
    desc: "Complete planning and design for business spaces. We blend aesthetics with your brand identity to create impactful environments.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop"
  },
  {
    title: "Space Planning",
    desc: "Efficient layouts focused on functionality, movement, and productivity. Every square foot is optimized for its maximum potential.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop"
  },
  {
    title: "3D Visualization",
    desc: "Photorealistic 3D concepts and visual previews that let you experience your space before execution begins.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Material & Finish Selection",
    desc: "Expert curation of flooring, furniture, lighting, textures, and finishes that align with the design vision and budget.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop"
  },
  {
    title: "Project Execution",
    desc: "Meticulous coordination and supervision of implementation activities, ensuring the design translates perfectly to reality.",
    image: "https://images.unsplash.com/photo-1541888086925-0c13d3c734b7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Turnkey Interior Solutions",
    desc: "End-to-end project management. From initial concept to final handover, we handle every detail so you don't have to.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Services() {
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-12 mt-4 md:mt-8">
      <section className="clay-panel text-center max-w-5xl mx-auto px-8 py-16 mb-12 w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-tattva-dark mb-6 tracking-tight">Our Services</h1>
        <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
          We offer a comprehensive suite of interior design and execution services tailored for commercial clients.
        </p>
      </section>

      <section className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.2 }}
              className="clay-card p-8 group flex flex-col"
            >
              <div className="clay-frame h-64 md:h-80 mb-8 w-full p-2">
                <div className="clay-frame-inner w-full h-full relative">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-serif text-tattva-dark mb-4 px-2">{service.title}</h3>
              <p className="text-foreground/70 leading-relaxed px-2 flex-grow">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="clay-card p-16">
            <h2 className="text-3xl md:text-5xl font-serif text-tattva-dark mb-8">Ready to transform your space?</h2>
            <Link href="/packages" className="clay-btn-primary px-10 py-4 text-sm font-bold tracking-wide uppercase inline-block">
              View Pricing Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
