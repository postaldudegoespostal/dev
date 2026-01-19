import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create network nodes
    const nodeCount = 50;
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    // Animation loop
    let animationId: number;
    let pulseOffset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pulseOffset += 0.01;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;

          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            const pulse = Math.sin(pulseOffset + distance * 0.01) * 0.5 + 0.5;
            
            // Create gradient for pulsing red glow
            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
            gradient.addColorStop(0, `rgba(100, 116, 139, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(220, 38, 38, ${opacity * pulse * 0.3})`);
            gradient.addColorStop(1, `rgba(100, 116, 139, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        const nodePulse = Math.sin(pulseOffset * 2 + i * 0.5) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(220, 38, 38, ${0.2 * nodePulse})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw node glow
        ctx.fillStyle = `rgba(220, 38, 38, ${0.05 * nodePulse})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw circuit board traces (horizontal and vertical lines)
      ctx.strokeStyle = "rgba(71, 85, 105, 0.08)";
      ctx.lineWidth = 1;
      
      const gridSpacing = 80;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        const pulse = Math.sin(pulseOffset + x * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(71, 85, 105, ${0.05 + pulse * 0.03})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        const pulse = Math.sin(pulseOffset + y * 0.01) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(71, 85, 105, ${0.05 + pulse * 0.03})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
