import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Brain, Upload, FileText, CheckCircle, AlertCircle, Database, RefreshCw } from 'lucide-react';

export const Gym = () => {
    const [stats, setStats] = useState({ documents: 0, chunks: 0 });
    const [fileName, setFileName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rag/stats`);
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleTrain = async () => {
        if (!fileName || !content) {
            setMessage({ type: 'error', text: 'Please provide a filename and content.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/rag/ingest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: fileName, content })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Successfully learned ${data.stats.chunks} new concepts!` });
                setFileName('');
                setContent('');
                fetchStats();
            } else {
                setMessage({ type: 'error', text: data.error || 'Training failed.' });
            }
        } catch (e: any) {
            setMessage({ type: 'error', text: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-[#0c0c0e] text-[#e4e4e7] p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 border-b border-[#27272a] pb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                        <Brain size={32} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-mono">The Gym</h1>
                        <p className="text-[#a1a1aa]">Train your AI on custom knowledge, docs, and code snippets.</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] flex items-center space-x-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Database size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-[#71717a] uppercase font-bold">Documents</p>
                            <p className="text-xl font-mono">{stats.documents}</p>
                        </div>
                    </div>
                    <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] flex items-center space-x-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Brain size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-[#71717a] uppercase font-bold">Memory Chunks</p>
                            <p className="text-xl font-mono">{stats.chunks}</p>
                        </div>
                    </div>
                </div>

                {/* Upload Form */}
                <div className="bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden">
                    <div className="p-4 border-b border-[#27272a] bg-[#27272a]/30 font-mono text-sm font-bold flex items-center space-x-2">
                        <Upload size={16} />
                        <span>INGEST KNOWLEDGE</span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Source Name / Filename
                            </label>
                            <input
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="e.g., project_docs.md or react_patterns.ts"
                                className="w-full bg-[#09090b] text-[#e4e4e7] border border-[#27272a] rounded-lg px-4 py-3 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none placeholder-[#52525b] transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                                <Database size={14} /> Content / Knowledge
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your documentation, code snippets, or knowledge base content here..."
                                className="w-full h-64 bg-[#09090b] text-[#e4e4e7] border border-[#27272a] rounded-lg p-4 font-mono text-sm leading-relaxed focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none placeholder-[#52525b] resize-none transition-all"
                                spellCheck={false}
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${message.type === 'success'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <button
                            onClick={handleTrain}
                            disabled={loading}
                            className={`w-full py-4 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-3
                                ${loading
                                    ? 'bg-[#27272a] text-[#71717a] cursor-not-allowed border border-[#3f3f46]'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 border border-purple-500/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    <span>TRAINING NEURAL NETWORK...</span>
                                </>
                            ) : (
                                <>
                                    <Brain size={18} />
                                    <span>TRAIN MODEL</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
