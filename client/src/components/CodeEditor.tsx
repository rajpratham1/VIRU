import { useState, useEffect } from 'react';
import { Save, X, FileCode } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface CodeEditorProps {
    path: string;
    onClose: () => void;
}

export const CodeEditor = ({ path, onClose }: CodeEditorProps) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/files/content?path=${encodeURIComponent(path)}`)
            .then(res => res.json())
            .then(data => {
                setContent(data.content || '');
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [path]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/api/files/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path, content })
            });
            setDirty(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center text-[#71717a] animate-pulse">Loading {path}...</div>;

    return (
        <div className="h-full flex flex-col bg-[#0c0c0e] border-l border-[#27272a]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-[#27272a] bg-[#18181b]/50">
                <div className="flex items-center gap-2 text-sm text-[#e4e4e7]">
                    <FileCode size={16} className="text-[#58a6ff]" />
                    <span className="font-mono">{path}</span>
                    {dirty && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={!dirty || saving}
                        className={`p-1.5 rounded hover:bg-[#27272a] transition-colors ${dirty ? 'text-green-500' : 'text-[#71717a]'}`}
                        title="Save File"
                    >
                        <Save size={18} className={saving ? 'animate-bounce' : ''} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded hover:bg-red-500/20 text-[#71717a] hover:text-red-400 transition-colors"
                        title="Close Editor"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setDirty(true);
                    }}
                    className="w-full h-full bg-[#0c0c0e] text-[#e4e4e7] p-4 font-mono text-sm resize-none outline-none leading-relaxed"
                    spellCheck={false}
                />
            </div>
        </div>
    );
};
