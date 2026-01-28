import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { FileExplorer } from './FileExplorer';
import { PanelLeftClose, PanelLeftOpen, Globe, RefreshCw } from 'lucide-react';



interface WorkspaceProps {
    project: any;
}

export const Workspace = ({ project }: WorkspaceProps) => {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mirrorOpen, setMirrorOpen] = useState(false);
    const previewUrl = `http://localhost:3000`; // Dyanmic later
    const [refreshKey, setRefreshKey] = useState(0);

    const toggleMirror = () => setMirrorOpen(!mirrorOpen);
    const refreshPreview = () => setRefreshKey(k => k + 1);

    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar (Explorer) */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-[#27272a] bg-[#0c0c0e]/50 flex flex-col overflow-hidden`}
            >
                <div className="flex-none p-2 flex justify-between items-center text-xs font-bold text-[#71717a] border-b border-[#27272a]">
                    <span>EXPLORER</span>
                    <button onClick={() => setSidebarOpen(false)} className="hover:text-[#e4e4e7]">
                        <PanelLeftClose size={14} />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <FileExplorer onFileSelect={setActiveFile} />
                </div>
            </div>

            {/* Main Area (Editor + Preview) */}
            <div className="flex-1 h-full flex flex-col bg-[#1e1e1e] relative">
                {/* Workspace Toolbar */}
                <div className="h-10 bg-[#1e1e1e] border-b border-[#27272a] flex items-center justify-end px-4 gap-2">
                    <button
                        onClick={toggleMirror}
                        className={`p-1.5 rounded transition-colors ${mirrorOpen ? 'bg-[#58a6ff]/20 text-[#58a6ff]' : 'text-[#71717a] hover:text-[#e4e4e7]'}`}
                        title="Toggle Mirror (Live Preview)"
                    >
                        <Globe size={16} />
                    </button>
                    {mirrorOpen && (
                        <button
                            onClick={refreshPreview}
                            className="p-1.5 rounded text-[#71717a] hover:text-[#e4e4e7] transition-colors"
                            title="Refresh Preview"
                        >
                            <RefreshCw size={16} />
                        </button>
                    )}
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane */}
                    <div className={`flex-1 flex flex-col transition-all duration-300 ${mirrorOpen ? 'w-1/2' : 'w-full'} border-r border-[#27272a]`}>
                        {/* Simplified Tab Bar logic or Empty State */}
                        {!activeFile ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-[#71717a] space-y-4">
                                {!sidebarOpen && (
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="absolute top-12 left-4 p-2 bg-[#27272a] rounded-lg hover:text-white"
                                    >
                                        <PanelLeftOpen size={20} />
                                    </button>
                                )}
                                <div className="w-16 h-16 rounded-xl bg-[#27272a] flex items-center justify-center">
                                    <PanelLeftOpen size={32} className="opacity-50" />
                                </div>
                                <p>Select a file to edit</p>
                            </div>
                        ) : (
                            <div className="h-full relative">
                                {!sidebarOpen && (
                                    <button
                                        onClick={() => setSidebarOpen(true)}
                                        className="absolute top-2 left-2 z-10 p-1 bg-[#27272a]/80 rounded hover:text-white backdrop-blur shadow-lg"
                                        title="Open Explorer"
                                    >
                                        <PanelLeftOpen size={16} />
                                    </button>
                                )}
                                <CodeEditor path={activeFile} onClose={() => setActiveFile(null)} />
                            </div>
                        )}
                    </div>

                    {/* Preview Pane */}
                    {mirrorOpen && (
                        <div className="w-1/2 h-full bg-white flex flex-col">
                            <div className="h-8 bg-[#f4f4f5] border-b border-[#e4e4e7] flex items-center px-3 gap-2 text-xs text-[#71717a]">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                                </div>
                                <input
                                    className="flex-1 bg-white border border-[#e4e4e7] rounded px-2 py-0.5 text-center ml-2 outline-none"
                                    value={previewUrl}
                                    readOnly
                                />
                            </div>
                            <iframe
                                key={refreshKey}
                                src={previewUrl}
                                className="flex-1 w-full h-full border-none"
                                title="Live Preview"
                                sandbox="allow-same-origin allow-scripts allow-forms"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
