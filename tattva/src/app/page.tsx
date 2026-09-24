"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box, Target, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-12 mt-4 md:mt-8">
      
      {/* Top Hero Container (Like the reference image's big top block) */}
      <section className="clay-panel w-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mb-8 relative">
        <div className="w-full md:w-1/2 flex flex-col items-start z-10 mb-12 md:mb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold mb-6 tracking-tight text-tattva-dark">
              Where Purpose <br/>
              Meets <span className="text-tattva-primary">Design</span>
            </h1>
            <p className="text-lg text-foreground/70 mb-8 max-w-lg font-medium">
              Turning visionary commercial concepts into exceptional, functional spaces.
            </p>
            <Link href="/book" className="clay-btn-primary px-8 py-4 text-sm font-bold uppercase tracking-widest gap-2">
              Book a Call <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* 3D-ish Extruded Image mimicking the 3D element from reference */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-[90%] max-w-md aspect-square clay-icon-block p-4"
          >
            <div className="w-full h-full relative rounded-[1rem] overflow-hidden shadow-inner bg-white">
              <Image
                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
                alt="Commercial Interior 3D concept"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3-Column Features (Like the reference image's bottom 3 blocks) */}
      <section>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { 
              title: "Tailored Creativity", 
              desc: "At TATTVA, we specialize in turning visionary interior ideas into stunning physical realities.", 
              icon: <Box size={24} className="text-green-700" />,
              color: "bg-green-100"
            },
            { 
              title: "Future-Forward Space", 
              desc: "Optimizing commercial zones for productivity, brand identity, and modern ergonomic standards.", 
              icon: <Target size={24} className="text-blue-700" />,
              color: "bg-blue-100"
            },
            { 
              title: "Comprehensive Support", 
              desc: "Turnkey execution, from initial blueprints to the final coat of paint and soft furnishings.", 
              icon: <Briefcase size={24} className="text-purple-700" />,
              color: "bg-purple-100"
            }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeInUp} className="clay-panel p-8">
              <div className={`w-14 h-14 rounded-full ${feature.color} flex items-center justify-center mb-6 clay-icon-block !border-2`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-tattva-dark mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-foreground/70 leading-relaxed text-sm font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
    </div>
  );
}
