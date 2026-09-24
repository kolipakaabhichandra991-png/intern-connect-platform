"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  {
    id: 1,
    name: "Aura Corporate HQ",
    category: "Corporate Office",
    location: "Bandra Kurla Complex, Mumbai",
    year: "2023",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Luxe Retail Flagship",
    category: "Retail & Showroom",
    location: "Palladium, Lower Parel",
    year: "2023",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "The Artisan Café",
    category: "Restaurants & Café",
    location: "Kala Ghoda, Colaba",
    year: "2022",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Zenith Wellness Clinic",
    category: "Healthcare Space",
    location: "Andheri West, Mumbai",
    year: "2024",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
  }
];

function ProjectCard({ project, index }: { project: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yImage = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yText = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={ref}
      style={{ opacity }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center mb-40`}
    >
      <div className="w-full md:w-3/5 clay-frame p-3 relative h-[50vh] md:h-[70vh]">
        <div className="clay-frame-inner w-full h-full relative overflow-hidden">
          <motion.div style={{ y: yImage }} className="absolute inset-0 h-[130%]">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-tattva-dark/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      </div>

      <motion.div 
        style={{ y: yText }}
        className="w-full md:w-2/5 flex flex-col justify-center clay-card p-10 md:p-12 z-10 -mt-20 md:mt-0 relative"
      >
        <span className="text-tattva-accent text-sm font-bold tracking-widest uppercase mb-4 block">
          {project.category}
        </span>
        <h3 className="text-4xl md:text-5xl font-serif text-tattva-dark mb-6 leading-tight">
          {project.name}
        </h3>
        
        <div className="space-y-3 text-foreground/70 mb-10 font-medium pl-2">
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Year:</strong> {project.year}</p>
        </div>

        <Link 
          href={`/portfolio/${project.id}`}
          className="clay-btn-primary px-8 py-4 text-sm font-bold tracking-wide uppercase text-center"
        >
          View Case Study
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <div className="pt-24 min-h-screen bg-background overflow-hidden">
      <section className="py-24 md:py-32 text-center max-w-4xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-tattva-dark mb-8"
        >
          Selected Works
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg text-foreground/70 leading-relaxed font-light"
        >
          Explore our portfolio of purpose-driven commercial interiors. From concept to execution, we bring visions to life with uncompromising quality.
        </motion.p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </section>
      
      <section className="py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 clay-card-dark p-16 md:p-24"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Inspired to start your project?</h2>
          <p className="text-white/80 mb-12 text-lg font-light">Let our team craft a space that reflects your brand and purpose.</p>
          <Link href="/book" className="clay-btn bg-white text-tattva-dark px-12 py-5 text-sm font-bold tracking-wider uppercase inline-block">
            Discuss Your Project
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
