import { useState, useEffect } from 'react';
import { Folder, FileCode, ChevronDown, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface FileEntry {
    name: string;
    type: 'directory' | 'file';
    path: string;
}

interface FileExplorerProps {
    onFileSelect?: (path: string) => void;
}

export const FileExplorer = ({ onFileSelect }: FileExplorerProps) => {
    const [path, setPath] = useState('.');
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadFiles = async (dirPath: string) => {
        setLoading(true);
        setError('');
        try {

            const res = await fetch(`${API_BASE_URL}/api/files?path=${encodeURIComponent(dirPath)}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setFiles(data.files);
            setPath(dirPath);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFiles('.');
    }, []);

    const handleNavigate = (entry: FileEntry) => {
        if (entry.type === 'directory') {
            loadFiles(entry.path);
        } else {
            onFileSelect?.(entry.path);
        }
    };

    const handleUp = () => {
        if (path === '.') return;
        // Simple parent resolution for now
        const parts = path.split('\\'); // Windows path separator
        parts.pop();
        const parent = parts.join('\\') || '.';
        loadFiles(parent);
    };

    return (
        <div className="h-full flex flex-col bg-[#0c0c0e]/50 backdrop-blur-md border border-[#27272a] rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-[#27272a] bg-[#18181b]/50">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Folder size={16} className="text-[#58a6ff]" />
                    <span className="text-xs text-[#a1a1aa] font-mono truncate">{path}</span>
                </div>
                <button onClick={() => loadFiles(path)} className="text-[#71717a] hover:text-[#e4e4e7]">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2">
                {path !== '.' && (
                    <div
                        onClick={handleUp}
                        className="flex items-center gap-2 p-2 rounded hover:bg-[#27272a] cursor-pointer text-[#a1a1aa] mb-1"
                    >
                        <ChevronDown size={16} className="opacity-0" />
                        <span className="text-sm font-bold">..</span>
                    </div>
                )}

                {error && <div className="text-red-400 text-xs p-2">{error}</div>}

                {files.sort((a, b) => (a.type === b.type ? 0 : a.type === 'directory' ? -1 : 1)).map((file) => (
                    <div
                        key={file.name}
                        onClick={() => handleNavigate(file)}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${file.type === 'directory'
                            ? 'text-[#e4e4e7] hover:bg-[#27272a]'
                            : 'text-[#a1a1aa] hover:bg-[#27272a]/50'
                            }`}
                    >
                        {file.type === 'directory' ? (
                            <Folder size={16} className="text-[#58a6ff]" />
                        ) : (
                            <FileCode size={16} />
                        )}
                        <span className="text-sm truncate">{file.name}</span>
                    </div>
                ))}

                {files.length === 0 && !loading && !error && (
                    <div className="text-center text-[#52525b] text-xs py-10 italic">
                        Empty Directory
                    </div>
                )}
            </div>
        </div>
    );
};
