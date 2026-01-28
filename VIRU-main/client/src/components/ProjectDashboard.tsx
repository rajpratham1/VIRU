import { useState, useEffect } from 'react';
import { FolderPlus, Folder, TerminalSquare, Cpu, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Project {
    id: string;
    name: string;
    updatedAt: string;
}

interface DashboardProps {
    token: string;
    onSelectProject: (project: Project) => void;
    onLogout: () => void;
}

export const ProjectDashboard = ({ token, onSelectProject, onLogout }: DashboardProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, [token]);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                onLogout();
                return;
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        setIsCreating(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newProjectName })
            });

            if (res.status === 401 || res.status === 403) {
                onLogout();
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                console.error("Failed to create project:", data);
                return;
            }

            setProjects([data, ...projects]);
            setNewProjectName('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e4e4e7] font-mono flex items-center justify-center p-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>

            <div className="max-w-5xl w-full space-y-12 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#27272a]/50 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-[#58a6ff]/10 rounded-2xl border border-[#58a6ff]/20 shadow-[0_0_20px_rgba(88,166,255,0.15)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#58a6ff]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <Cpu size={40} className="text-[#58a6ff] relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tighter mb-1 text-white">
                                VIRU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-purple-500">NEXUS</span>
                            </h1>
                            <p className="text-[#a1a1aa] text-sm tracking-wide bg-[#27272a]/30 px-3 py-1 rounded-full inline-block border border-[#27272a]">
                                NEURAL INTERFACE // V2.0
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-6 py-3 hover:bg-red-500/10 text-[#71717a] hover:text-red-400 rounded-xl transition-all text-xs font-bold uppercase tracking-wider border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={16} />
                        Disconnect
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Project Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#18181b]/40 backdrop-blur-md border border-[#27272a] rounded-2xl p-6 h-full flex flex-col justify-center gap-6 group hover:border-[#58a6ff]/30 transition-colors">
                            <div className="flex items-center gap-3 text-lg font-bold text-white">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><FolderPlus size={24} /></div>
                                New Operation
                            </div>
                            <p className="text-sm text-[#71717a] leading-relaxed">
                                Initialize a fresh logical workspace for the neural core.
                            </p>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="Operation Name..."
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-4 text-sm focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none transition-all placeholder-zinc-500 text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={isCreating || !newProjectName}
                                    className="w-full bg-gradient-to-r from-[#58a6ff] to-blue-600 hover:from-[#4c95ef] hover:to-blue-500 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
                                >
                                    {isCreating ? 'INITIALIZING...' : 'LAUNCH PROTOCOL'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Project List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-sm font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2 mb-4">
                            <TerminalSquare size={16} /> Active Protocols
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => onSelectProject(project)}
                                    className="group relative flex flex-col gap-4 p-6 bg-[#18181b]/40 border border-[#27272a] hover:border-[#58a6ff]/50 hover:bg-[#18181b]/80 rounded-2xl text-left transition-all overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TerminalSquare size={20} className="text-[#58a6ff]" />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#27272a] rounded-xl text-[#71717a] group-hover:bg-[#58a6ff] group-hover:text-white transition-all duration-300">
                                            <Folder size={20} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-lg text-white group-hover:text-[#58a6ff] transition-colors">{project.name}</span>
                                            <div className="text-[10px] text-[#52525b] mt-1 font-mono uppercase tracking-widest">
                                                ID: {project.id.substring(0, 8)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#27272a] flex items-center justify-between text-xs text-[#71717a]">
                                        <span>Last Sync:</span>
                                        <span className="font-mono text-[#e4e4e7]">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </button>
                            ))}

                            {projects.length === 0 && !isLoading && (
                                <div className="col-span-2 py-16 flex flex-col items-center justify-center text-[#52525b] border-2 border-dashed border-[#27272a] rounded-2xl bg-[#18181b]/20">
                                    <Folder size={48} className="opacity-20 mb-4" />
                                    <p>No active protocols found.</p>
                                    <p className="text-xs mt-2">Initialize a new operation to begin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
