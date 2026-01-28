import { useRef, useEffect, useState } from 'react';
import { Network } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Node {
    id: string;
    source: string;
    preview: string;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
}

export const NeuralLink = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`${API_BASE_URL}/api/rag/graph`)
            .then(res => res.json())
            .then(data => {
                // Initialize random positions
                const initNodes = data.map((n: any) => ({
                    ...n,
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                }));
                setNodes(initNodes);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (loading || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Subtle Grid
            ctx.strokeStyle = '#27272a'; // Zinc-800
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
            for (let y = 0; y < canvas.height; y += 50) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
            ctx.stroke();

            // Update & Draw Nodes
            nodes.forEach((node, i) => {
                if (node.x !== undefined && node.y !== undefined && node.vx !== undefined && node.vy !== undefined) {
                    // Drift
                    node.x += node.vx;
                    node.y += node.vy;

                    // Mouse Interaction (Repel/Attract)
                    const dxm = mouseX - node.x!;
                    const dym = mouseY - node.y!;
                    const distm = Math.sqrt(dxm * dxm + dym * dym);
                    if (distm < 200) {
                        // Gentle repulsion
                        node.x! -= dxm * 0.02;
                        node.y! -= dym * 0.02;
                    }

                    // Bounce
                    if (node.x! < 0 || node.x! > canvas.width) node.vx! *= -1;
                    if (node.y! < 0 || node.y! > canvas.height) node.vy! *= -1;

                    // Draw Connections
                    nodes.forEach((otherNode, j) => {
                        if (i === j) return;
                        if (otherNode.x !== undefined && otherNode.y !== undefined) {
                            const dx = node.x! - otherNode.x;
                            const dy = node.y! - otherNode.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            if (dist < 150) {
                                ctx.beginPath();
                                ctx.moveTo(node.x!, node.y!);
                                ctx.lineTo(otherNode.x, otherNode.y);
                                ctx.strokeStyle = `rgba(88, 166, 255, ${0.4 * (1 - dist / 150)})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                    });

                    // Draw Mouse Connection (Interactive)
                    if (distm < 200) {
                        ctx.beginPath();
                        ctx.moveTo(node.x!, node.y!);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 * (1 - distm / 200)})`; // Purple
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    // Pulse Effect
                    const time = Date.now() * 0.002;
                    const pulse = Math.sin(time + i) * 2 + 4;

                    // Draw Node (Star/Globe)
                    ctx.beginPath();
                    ctx.arc(node.x!, node.y!, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#09090b'; // Fill black to cover lines
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(node.x!, node.y!, 3, 0, Math.PI * 2);
                    ctx.fillStyle = distm < 200 ? '#a855f7' : '#58a6ff'; // Purple if interacted
                    ctx.fill();

                    // Glow
                    ctx.beginPath();
                    ctx.arc(node.x!, node.y!, pulse + 4, 0, Math.PI * 2);
                    ctx.fillStyle = distm < 200 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(88, 166, 255, 0.1)';
                    ctx.fill();

                    // Label
                    if (distm < 100) {
                        ctx.fillStyle = '#e4e4e7';
                        ctx.font = 'bold 12px monospace';
                        ctx.fillText(node.source, node.x! + 12, node.y! + 4);
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [nodes, loading]);

    return (
        <div className="h-full w-full bg-[#09090b] relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <h2 className="text-xl font-bold flex items-center gap-2 text-[#58a6ff]">
                    <Network size={24} />
                    NEURAL TOPOLOGY
                </h2>
                <p className="text-xs text-[#71717a] font-mono">
                    Active Nodes: {nodes.length} // Memory Fragments
                </p>
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-[#58a6ff] animate-pulse">
                    Scanning Neural Pathways...
                </div>
            )}

            <div className="flex-1 w-full h-full">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
        </div>
    );
};
