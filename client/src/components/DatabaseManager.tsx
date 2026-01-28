import { useState, useEffect } from 'react';
import { Database, FolderGit2, Users, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const DatabaseManager = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(`${API_BASE_URL}/api/db/stats`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-[#71717a] animate-pulse">Accessing Neural Memory...</div>;

    return (
        <div className="h-full bg-[#0c0c0e] text-[#e4e4e7] p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 border-b border-[#27272a] pb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Database size={32} className="text-[#58a6ff]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-[#e4e4e7]">System Knowledge Base</h1>
                        <p className="text-[#a1a1aa]">Neural memory fragments, user records, and active project graphs.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Projects Card */}
                    <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl hover:bg-[#27272a]/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-green-500/10 rounded-lg text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                                <FolderGit2 size={24} />
                            </div>
                            <span className="text-xs font-bold text-[#71717a] bg-[#27272a] px-2 py-1 rounded">ACTIVE</span>
                        </div>
                        <div className="text-4xl font-bold text-[#e4e4e7] mb-1">{stats?.stats?.projects || 0}</div>
                        <div className="text-sm text-[#a1a1aa]">Tracked Projects</div>
                    </div>

                    {/* Users Card */}
                    <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl hover:bg-[#27272a]/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-500 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-bold text-[#71717a] bg-[#27272a] px-2 py-1 rounded">DEVS</span>
                        </div>
                        <div className="text-4xl font-bold text-[#e4e4e7] mb-1">{stats?.stats?.users || 0}</div>
                        <div className="text-sm text-[#a1a1aa]">Authorized Operators</div>
                    </div>

                    {/* Memory Card */}
                    <div className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl hover:bg-[#27272a]/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500 border border-orange-500/20 group-hover:scale-110 transition-transform">
                                <MessageSquare size={24} />
                            </div>
                            <span className="text-xs font-bold text-[#71717a] bg-[#27272a] px-2 py-1 rounded">VECTOR</span>
                        </div>
                        <div className="text-4xl font-bold text-[#e4e4e7] mb-1">{stats?.stats?.messages || 0}</div>
                        <div className="text-sm text-[#a1a1aa]">Memory Fragments</div>
                    </div>
                </div>

                {/* Recent Projects Table */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                        <FolderGit2 size={14} /> Recent Project Index
                    </h3>
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#27272a] bg-[#27272a]/30 text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
                            <div className="col-span-4">Project Name</div>
                            <div className="col-span-6">System Path</div>
                            <div className="col-span-2 text-right">Status</div>
                        </div>

                        {stats?.recentProjects?.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center gap-3 text-[#52525b]">
                                <FolderGit2 size={32} className="opacity-20" />
                                <span className="text-sm italic">No projects found in Neural Memory.</span>
                            </div>
                        ) : (
                            stats?.recentProjects?.map((p: any) => (
                                <div key={p.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[#27272a] last:border-0 items-center hover:bg-[#27272a]/30 transition-colors group">
                                    <div className="col-span-4 font-bold text-[#e4e4e7] flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        {p.name}
                                    </div>
                                    <div className="col-span-6 text-xs text-[#71717a] font-mono truncate group-hover:text-[#a1a1aa] transition-colors bg-[#09090b] px-2 py-1 rounded border border-transparent group-hover:border-[#3f3f46]">
                                        {p.path}
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 font-bold">
                                            INDEXED
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
