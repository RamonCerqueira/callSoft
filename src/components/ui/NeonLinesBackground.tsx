"use client";

import { useEffect, useRef } from "react";

export const NeonLinesBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        // Configuration
        const particleCount = 40;
        const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899"];

        class Particle {
            x: number;
            y: number;
            length: number;
            angle: number;
            speed: number;
            color: string;
            width: number;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.length = Math.random() * 100 + 50; // Random length between 50 and 150
                this.angle = Math.random() * Math.PI * 2; // Random angle
                this.speed = Math.random() * 0.5 + 0.2; // Slow movement
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.width = Math.random() * 2 + 0.5;
            }

            update(w: number, h: number) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                // Wrap around screen
                if (this.x < -this.length) this.x = w + this.length;
                if (this.x > w + this.length) this.x = -this.length;
                if (this.y < -this.length) this.y = h + this.length;
                if (this.y > h + this.length) this.y = -this.length;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                
                // Draw line
                const endX = this.x + Math.cos(this.angle) * this.length;
                const endY = this.y + Math.sin(this.angle) * this.length;
                
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(endX, endY);
                
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.width;
                ctx.lineCap = "round";
                
                // Add glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                
                ctx.stroke();
                
                // Reset shadow for performance if needed, but here we want everything to glow
                ctx.shadowBlur = 0;
            }
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Re-initialize particles on resize
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update(canvas.width, canvas.height);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
        />
    );
};
