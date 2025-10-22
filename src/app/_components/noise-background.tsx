"use client";

import { useEffect, useRef } from "react";

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let imageData: ImageData;

    const resizeCanvas = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      const pixelRatio = devicePixelRatio || 1;

      canvas.width = innerWidth * pixelRatio;
      canvas.height = innerHeight * pixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      ctx.scale(pixelRatio, pixelRatio);
      imageData = ctx.createImageData(canvas.width, canvas.height);
    };

    const generateNoise = () => {
      const { data } = imageData;

      for (let i = 0; i < data.length; i += 4) {
        // Generate random grayscale value (20% lighter - range 51-255 instead of 0-255)
        const noise = 51 + Math.random() * 204;

        data[i] = noise; // Red
        data[i + 1] = noise; // Green
        data[i + 2] = noise; // Blue
        data[i + 3] = 255; // Alpha (fully opaque)
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      generateNoise();
      // Throttle to ~30 FPS to reduce CPU usage
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 17);
    };

    // Initialize
    resizeCanvas();
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="noise"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.7]"
      style={{
        mixBlendMode: "multiply",
      }}
    />
  );
}
