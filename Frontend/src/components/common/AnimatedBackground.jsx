import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Animated Background Component
 * Creates a dynamic, sector-themed animated background using Canvas
 */
export function AnimatedBackground({ children, className = '' }) {
  const canvasRef = useRef(null);
  const { sectorTheme, currentSector } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let connections = [];

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Get colors based on sector
    const getColors = () => {
      const colors = sectorTheme?.bgGradient || {
        primary: 'rgba(59, 130, 246, 0.12)',
        secondary: 'rgba(167, 139, 250, 0.10)',
        tertiary: 'rgba(96, 165, 250, 0.08)',
      };
      return colors;
    };

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.colors = getColors();
        this.colorIndex = Math.floor(Math.random() * 3);
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const colorKeys = ['primary', 'secondary', 'tertiary'];
        ctx.fillStyle = this.colors[colorKeys[this.colorIndex]].replace('0.1', String(this.alpha));
        ctx.fill();
      }
    }

    // Floating blob class
    class Blob {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.001 + Math.random() * 0.002;
        this.range = 50 + Math.random() * 100;
        this.baseX = x;
        this.baseY = y;
      }

      update() {
        this.angle += this.speed;
        this.x = this.baseX + Math.cos(this.angle) * this.range;
        this.y = this.baseY + Math.sin(this.angle * 0.7) * this.range * 0.5;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Initialize blobs
    const colors = getColors();
    const blobs = [
      new Blob(canvas.width * 0.2, canvas.height * 0.3, 200, colors.primary),
      new Blob(canvas.width * 0.8, canvas.height * 0.2, 250, colors.secondary),
      new Blob(canvas.width * 0.5, canvas.height * 0.7, 180, colors.tertiary),
      new Blob(canvas.width * 0.9, canvas.height * 0.8, 220, colors.primary),
    ];

    initParticles();

    // Draw connections between nearby particles
    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw blobs
      blobs.forEach(blob => {
        blob.update();
        blob.draw();
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [sectorTheme, currentSector]);

  return (
    <div className={`relative min-h-screen ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"
      />
      {children}
    </div>
  );
}

/**
 * Simple Gradient Background
 * A simpler alternative for pages that don't need particle animation
 */
export function GradientBackground({ children, className = '' }) {
  const { sectorTheme } = useAuth();

  return (
    <div className={`relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 ${className}`}>
      {/* Gradient overlays */}
      <div 
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, ${sectorTheme?.bgGradient?.primary || 'rgba(59, 130, 246, 0.12)'} 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 70%, ${sectorTheme?.bgGradient?.secondary || 'rgba(167, 139, 250, 0.10)'} 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 50%, ${sectorTheme?.bgGradient?.tertiary || 'rgba(96, 165, 250, 0.08)'} 0%, transparent 70%)`
        }}
      />
      {children}
    </div>
  );
}

export default AnimatedBackground;
