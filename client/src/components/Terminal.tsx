import { useState, useRef, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Send, TerminalSquare, Mic, MicOff, History, Trash2, Rocket, Infinity as InfinityIcon } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { API_BASE_URL } from '../config';

interface Log {
    id: string;
    type: 'cmd' | 'info' | 'error' | 'success' | 'ai';
    content: string;
    agent?: string; // e.g. 'ARCHITECT', 'DEVELOPER'
}

// Helper to get agent styling
const getAgentStyle = (agent?: string) => {
    switch (agent) {
        case 'ARCHITECT': return { color: 'text-blue-400', label: 'ARCHITECT', border: 'border-blue-500/30', bg: 'bg-blue-500/10' };
        case 'DEVELOPER': return { color: 'text-green-400', label: 'DEV CORE', border: 'border-green-500/30', bg: 'bg-green-500/10' };
        case 'DEBUGGER': return { color: 'text-red-400', label: 'DEBUGGER', border: 'border-red-500/30', bg: 'bg-red-500/10' };
        case 'GIT_SPECIALIST': return { color: 'text-purple-400', label: 'GIT OPS', border: 'border-purple-500/30', bg: 'bg-purple-500/10' };
        case 'RAG_SYSTEM': return { color: 'text-yellow-400', label: 'MEMORY', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' };
        default: return { color: 'text-[#58a6ff]', label: 'NEURAL CORE', border: 'border-[#58a6ff]/30', bg: 'bg-[#58a6ff]/10' };
    }
};

interface TerminalProps {
    token: string;
    projectId?: string;
}

export const Terminal = ({ token, projectId }: TerminalProps) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<Log[]>([
        { id: 'init', type: 'info', content: 'VIRU System Initialized...' },
        { id: 'ready', type: 'success', content: 'Ready for instructions.' }
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Voice Handler (defined before useVoice call)
    const handleVoiceCommand = (text: string) => {
        const cmd = text.trim();
        if (!cmd) return;

        // Optimistic UI for voice
        setLogs(prev => [...prev, { id: Date.now().toString(), type: 'cmd', content: cmd }]);

        // Execute
        // We need to bypass the form event
        executeCommand(cmd);
    };

    const { isListening, transcript, startListening, stopListening, speak, supported, mode } = useVoice(handleVoiceCommand);

    const executeCommand = async (cmd: string) => {
        setIsLoading(true);

        if (cmd.toLowerCase().startsWith('autopilot')) {
            setLogs(prev => [...prev, { id: Date.now().toString(), type: 'info', content: 'Voice Autopilot Initiated...' }]);
            // Logic would go here
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                // ...
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt: cmd, projectId })
            });
            const data = await res.json();
            setLogs(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: data.response, agent: data.agent }]);
            if (data.response) speak(data.response);
        } catch (err) {
            setLogs(prev => [...prev, { id: Date.now().toString(), type: 'error', content: 'Voice Link Failed.' }]);
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch History on Mount
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    const historyLogs: Log[] = data.messages.map((msg: any) => ({
                        id: msg.id,
                        type: msg.role === 'user' ? 'cmd' : 'ai',
                        content: msg.content,
                        agent: msg.agent
                    }));
                    setLogs(prev => [...prev.filter(l => l.id === 'init' || l.id === 'ready'), ...historyLogs]);
                }
            } catch (error) {
                console.error("Failed to load history", error);
            }
        };
        fetchHistory();

        // Check Voice Support
        // We use a timeout to let useVoice initialize
        setTimeout(() => {
            const win = window as any;
            const hasSpeech = !!(win.SpeechRecognition || win.webkitSpeechRecognition);
            setLogs(prev => [...prev, {
                id: 'voice-check',
                type: hasSpeech ? 'success' : 'error',
                content: hasSpeech ? 'Voice Core: ONLINE (Web Speech API Detected)' : 'Voice Core: OFFLINE (Browser not supported)'
            }]);
        }, 1000);

    }, [token]);

    // ... (rest of effects)
    useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, isLoading]);

    // State cleaned up

    // Restoring handleCommand which is used by handleKeyDown
    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.trim();
        setInput('');

        // Log manually since executeCommand does it conditionally? 
        // Actually executeCommand in my previous edit does logging too? 
        // Let's make executeCommand handle the logic after logging.
        // Wait, the previous edit for handleVoiceCommand adds the log. 
        // Let's keep handleCommand simple: Log -> Execute.

        setLogs(prev => [...prev, { id: Date.now().toString(), type: 'cmd', content: cmd }]);
        await executeCommand(cmd);
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!input.trim()) return;

            const cmd = input.trim();
            // Client Commands
            if (cmd === '/clear') {
                setLogs([
                    { id: 'init', type: 'info', content: 'Console cleared.' }
                ]);
                return;
            }

            if (cmd === '/help') {
                setLogs(prev => [...prev, { id: Date.now().toString(), type: 'info', content: 'Commands: /autopilot <goal>, /clear, /refresh, /deploy' }]);
                return;
            }

            await handleCommand({ preventDefault: () => { } } as React.FormEvent);
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                if (!blob) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64 = event.target?.result as string;
                    const minimalBase64 = base64.split(',')[1];

                    setLogs(prev => [...prev, {
                        id: Date.now().toString(),
                        type: 'cmd',
                        content: '[Uploading Clipbard Image...]'
                    }]);
                    setIsLoading(true);

                    try {
                        const res = await fetch(`${API_BASE_URL}/api/vision/analyze`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                image: minimalBase64,
                                prompt: "Analyze this image and provide code.",
                                projectId
                            })
                        });
                        const data = await res.json();
                        setLogs(prev => [...prev, {
                            id: Date.now().toString(),
                            type: 'ai',
                            content: data.response,
                            agent: 'VISION_CORE'
                        }]);
                        if (data.response) speak(data.response);
                    } catch (err) {
                        setLogs(prev => [...prev, { id: Date.now().toString(), type: 'error', content: "Visual Cortex Error." }]);
                    } finally {
                        setIsLoading(false);
                    }
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    // ... (return JSX)
    // Clear Logs
    const clearLogs = () => {
        setLogs([
            { id: 'init', type: 'info', content: 'VIRU System Initialized...' },
            { id: 'ready', type: 'success', content: 'Ready for instructions.' }
        ]);
    };

    const refreshHistory = async () => {
        setIsLoading(true);
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/chat/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
                const historyLogs: Log[] = data.messages.map((msg: any) => ({
                    id: msg.id,
                    type: msg.role === 'user' ? 'cmd' : 'ai',
                    content: msg.content,
                    agent: msg.agent
                }));
                // Merge/Dedupe could happen here, but for now just replacing logs with history + defaults is cleaner or appending
                // Actually, let's just reset to history
                setLogs([
                    { id: 'init', type: 'info', content: 'History loaded...' },
                    ...historyLogs,
                    { id: 'ready', type: 'success', content: 'Ready.' }
                ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const [isDragging, setIsDragging] = useState(false);

    // ... (existing effects)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(f => f.type.startsWith('image/'));

        if (imageFile) {
            // Process Image
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                // Remove data url prefix for API
                const cleanBase64 = base64.split(',')[1];

                // Optimistic UI
                setLogs(prev => [...prev, {
                    id: Date.now().toString(),
                    type: 'cmd',
                    content: `[Uploading Image: ${imageFile.name}]`
                }]);
                setIsLoading(true);

                try {
                    const res = await fetch(`${API_BASE_URL}/api/vision/analyze`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            image: cleanBase64,
                            prompt: input || "Analyze this image",
                            projectId: projectId
                        })
                    });
                    const data = await res.json();

                    setLogs(prev => [...prev, {
                        id: Date.now().toString(),
                        type: 'ai',
                        content: data.response || "Vision analysis failed.",
                        agent: 'VISION_CORE'
                    }]);

                    if (data.response) speak(data.response);

                } catch (e) {
                    setLogs(prev => [...prev, {
                        id: Date.now().toString(),
                        type: 'error',
                        content: "Failed to upload image to Vision Core."
                    }]);
                } finally {
                    setIsLoading(false);
                    setInput('');
                }
            };
            reader.readAsDataURL(imageFile);
        }
    };

    return (
        <div
            className={`flex h-full flex-col font-mono text-sm relative transition-colors ${isDragging ? 'bg-[#58a6ff]/10 border-2 border-dashed border-[#58a6ff]' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm pointer-events-none">
                    <div className="text-[#58a6ff] font-bold text-xl animate-bounce">
                        DROP IMAGE TO ANALYZE
                    </div>
                </div>
            )}

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#18181b]/80 border-b border-[#27272a] backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 text-[#71717a] text-xs uppercase tracking-wider font-bold">
                    <TerminalSquare size={14} className="text-[#58a6ff]" />
                    <span className="whitespace-nowrap">Bash // Neural Interface</span>
                    <span className="mx-2 text-[#27272a]">|</span>
                    <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <Rocket size={10} className="animate-pulse" />
                        <span className="whitespace-nowrap">AUTOPILOT: ONLINE</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setInput('/autopilot ')}
                        className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded text-[10px] font-bold transition-all flex items-center gap-1 mr-2"
                        title="Start Autonomous Mission"
                    >
                        <Rocket size={12} />
                        NEW MISSION
                    </button>
                    <button
                        onClick={refreshHistory}
                        className="p-1.5 hover:bg-[#27272a] rounded text-[#71717a] hover:text-[#e4e4e7] transition-colors flex items-center gap-2 text-[10px]"
                        title="Reload History"
                    >
                        <History size={14} />
                        <span>HISTORY</span>
                    </button>
                    <button
                        onClick={clearLogs}
                        className="p-1.5 hover:bg-[#27272a] rounded text-[#71717a] hover:text-[#e4e4e7] transition-colors text-[10px]"
                        title="Clear Output"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {logs.map(log => {
                    const style = getAgentStyle(log.agent);
                    return (
                        <div key={log.id} className={`flex ${log.type === 'cmd' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 ${log.type === 'cmd'
                                ? 'bg-[#27272a] text-[#e4e4e7] border border-[#3f3f46]'
                                : log.type === 'error'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : log.type === 'info'
                                        ? 'text-[#a1a1aa] italic text-xs'
                                        : `bg-[#0c0c0e] border ${style.border} relative overflow-hidden`
                                }`}>

                                {log.type === 'ai' ? (
                                    <div className="flex gap-3 relative z-10">
                                        <div className="mt-1 flex flex-col items-center gap-2 min-w-[20px]">
                                            <TerminalSquare size={20} className={style.color} />
                                        </div>
                                        <div className="overflow-hidden space-y-1">
                                            <div className={`text-[10px] font-bold tracking-widest ${style.color} opacity-80 uppercase mb-1`}>
                                                {style.label}
                                            </div>
                                            <MarkdownRenderer content={log.content} />
                                        </div>
                                    </div>
                                ) : (
                                    <span>{log.content}</span>
                                )}

                                {log.type === 'ai' && <div className={`absolute inset-0 ${style.bg} opacity-20 pointer-events-none`}></div>}
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 bg-transparent p-3 max-w-[85%]">
                            <div className="mt-1 min-w-[20px]">
                                <TerminalSquare size={20} className="text-[#58a6ff] animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-1 justify-center">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs text-[#71717a] animate-pulse">
                                    {Date.now() - parseInt(logs[logs.length - 1]?.id || '0') > 5000
                                        ? "Model is loading (or downloading)... Please wait."
                                        : "Processing..."}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleCommand} className="p-4 bg-[#09090b]/80 border-t border-[#27272a] backdrop-blur-sm">
                <div className="relative flex items-center bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#58a6ff] focus-within:border-[#58a6ff] transition-all shadow-lg">
                    <span className="mr-3 text-green-500 font-bold animate-pulse">$</span>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        placeholder="Enter command or paste image..."
                        className="w-full bg-transparent outline-none text-[#e4e4e7] placeholder-[#3f3f46] resize-none h-[24px] overflow-hidden"
                        autoFocus
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (!supported) {
                                setLogs(prev => [...prev, { id: Date.now().toString(), type: 'error', content: 'Voice not supported in this browser (Use Chrome/Edge).' }]);
                                return;
                            }
                            isListening && mode === 'command' ? stopListening() : startListening(false)
                        }}
                        className={`p-2 rounded-lg transition-colors mr-1 ${!supported ? 'text-gray-600 cursor-not-allowed' :
                            isListening && mode === 'command'
                                ? 'bg-red-500/20 text-red-400 animate-pulse'
                                : 'text-[#71717a] hover:text-[#e4e4e7]'
                            }`}
                        title={supported ? "Voice Command (Single)" : "Voice not supported"}
                    >
                        {isListening && mode === 'command' ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!supported) {
                                setLogs(prev => [...prev, { id: Date.now().toString(), type: 'error', content: 'Voice not supported in this browser (Use Chrome/Edge).' }]);
                                return;
                            }
                            isListening && mode === 'continuous' ? stopListening() : startListening(true)
                        }}
                        className={`p-2 rounded-lg transition-colors mr-2 ${!supported ? 'text-gray-600 cursor-not-allowed' :
                            isListening && mode === 'continuous'
                                ? 'bg-purple-500/20 text-purple-400 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                : 'text-[#71717a] hover:text-[#e4e4e7]'
                            }`}
                        title={supported ? "God Mode (Continuous Conversation)" : "Voice not supported"}
                    >
                        <InfinityIcon size={18} />
                    </button>

                    <button type="submit" className="ml-2 text-[#58a6ff] hover:text-white transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};
