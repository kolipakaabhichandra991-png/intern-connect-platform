"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-tattva-dark mb-6 drop-shadow-sm">Book a Consultation</h1>
          <p className="text-lg text-foreground/70 font-light max-w-2xl mx-auto">
            Take the first step towards a purpose-driven commercial space. Tell us about your project, and our design experts will be in touch.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="clay-card p-16 text-center"
          >
            <div className="text-7xl mb-8">✨</div>
            <h3 className="text-4xl font-serif text-tattva-dark mb-6">Thank you for reaching out!</h3>
            <p className="text-foreground/70 text-lg">
              Your inquiry has been received. Our team at TATTVA will contact you shortly to discuss your project.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="clay-card p-8 md:p-14"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Full Name *</label>
                  <input required type="text" className="w-full clay-input px-6 py-4" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Company Name *</label>
                  <input required type="text" className="w-full clay-input px-6 py-4" placeholder="Your Business" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Email Address *</label>
                  <input required type="email" className="w-full clay-input px-6 py-4" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Phone Number *</label>
                  <input required type="tel" className="w-full clay-input px-6 py-4" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Project Type *</label>
                  <select required defaultValue="" className="w-full clay-input px-6 py-4 appearance-none">
                    <option value="" disabled>Select category...</option>
                    <option>Corporate Office</option>
                    <option>Retail & Showroom</option>
                    <option>Restaurant / Café</option>
                    <option>Healthcare / Clinic</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Project Location</label>
                  <input type="text" className="w-full clay-input px-6 py-4" placeholder="e.g., Bandra, Mumbai" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Approximate Area (sq. ft.)</label>
                  <input type="number" className="w-full clay-input px-6 py-4" placeholder="e.g., 2000" />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Budget Range</label>
                  <select defaultValue="" className="w-full clay-input px-6 py-4 appearance-none">
                    <option value="" disabled>Select budget...</option>
                    <option>Under ₹10 Lakhs</option>
                    <option>₹10 - ₹25 Lakhs</option>
                    <option>₹25 - ₹50 Lakhs</option>
                    <option>₹50 Lakhs+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold tracking-wide text-tattva-dark mb-3 px-2">Project Description</label>
                <textarea rows={5} className="w-full clay-input px-6 py-4 resize-none" placeholder="Tell us briefly about your vision..."></textarea>
              </div>

              <div className="pt-8">
                <button type="submit" className="w-full clay-btn-primary py-5 text-lg font-bold tracking-widest uppercase cursor-pointer">
                  Submit Enquiry
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
