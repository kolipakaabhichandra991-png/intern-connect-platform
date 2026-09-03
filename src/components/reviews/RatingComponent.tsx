"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RatingProps {
  internId: string;
  reviewType: "COLLEAGUE_REVIEW" | "BELVO_REVIEW" | "CEO_REVIEW" | "WORK_REPORT_EVALUATION";
}

export default function RatingComponent({ internId, reviewType }: RatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    if (selectedStar === 0) return alert("Please select a rating.");
    
    // Normally we'd POST to /api/reviews here
    // await fetch("/api/reviews", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ internId, type: reviewType, rating: selectedStar, comments: data.comments }),
    // });
    reset();
    setSelectedStar(0);
    alert("Review submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <h3 className="font-semibold text-gray-800 text-sm tracking-wide uppercase">Leave a {reviewType.replace("_", " ")}</h3>
      
      {/* 5-Star Interactive Selector */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-3xl focus:outline-none transition-colors"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setSelectedStar(star)}
          >
            <span className={star <= (hoveredStar || selectedStar) ? "text-yellow-400" : "text-gray-200"}>
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea 
        {...register("comments")} 
        placeholder="Add your comments or feedback..."
        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
        rows={3}
      />
      <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all">
        Submit Review
      </button>
    </form>
  );
}
