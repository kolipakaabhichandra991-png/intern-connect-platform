"use client";
import React, { useEffect, useRef } from 'react';

export default function InteractivePixelGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Pixel size
    const size = 20;
    
    // Store active pixels with their life (fade out)
    const activePixels = new Map<string, number>();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      // Find which grid cell we are in
      const gridX = Math.floor(e.clientX / size) * size;
      const gridY = Math.floor(e.clientY / size) * size;
      const key = `${gridX},${gridY}`;
      
      // Reset life to 1.0 on hover
      activePixels.set(key, 1.0);
      
      // Also randomly light up neighbors for a wider brush effect
      const neighbors = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      neighbors.forEach(([dx, dy]) => {
        if (Math.random() > 0.5) {
          const nx = gridX + dx * size;
          const ny = gridY + dy * size;
          activePixels.set(`${nx},${ny}`, Math.random() * 0.8);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw faint background grid (optional, maybe too noisy, let's just draw active pixels)
      
      activePixels.forEach((life, key) => {
        const [x, y] = key.split(',').map(Number);
        
        // Solid black pixels for retro contrast
        ctx.fillStyle = `rgba(0, 0, 0, ${life * 0.8})`;
        ctx.fillRect(x, y, size - 1, size - 1);
        
        // Decay
        const newLife = life - 0.05; // Fade out faster
        if (newLife <= 0) {
          activePixels.delete(key);
        } else {
          activePixels.set(key, newLife);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}
