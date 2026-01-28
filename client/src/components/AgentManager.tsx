import { useState, useEffect } from 'react';
import { Save, Bot, Terminal } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Agent {
    description: string;
    systemPrompt: string;
}

interface AgentsData {
    [key: string]: Agent;
}

export const AgentManager = () => {
    const [agents, setAgents] = useState<AgentsData>({});
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [token] = useState(localStorage.getItem('auth_token'));

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/agents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAgents(data);
            if (!selectedAgent && Object.keys(data).length > 0) {
                setSelectedAgent(Object.keys(data)[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedAgent || !agents[selectedAgent]) return;
        setSaving(true);
        try {
            await fetch(`${API_BASE_URL}/api/agents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(agents)
            });
            setTimeout(() => setSaving(false), 500);
        } catch (error) {
            console.error(error);
            setSaving(false);
        }
    };

    const updateAgent = (field: keyof Agent, value: string) => {
        if (!selectedAgent) return;
        setAgents(prev => ({
            ...prev,
            [selectedAgent]: {
                ...prev[selectedAgent],
                [field]: value
            }
        }));
    };

    if (loading) return <div className="p-8 text-[#71717a]">Loading Hive configuration...</div>;

    return (
        <div className="flex h-full w-full bg-[#09090b] text-[#e4e4e7]">
            {/* Sidebar List */}
            <div className="w-64 border-r border-[#27272a] bg-[#0c0c0e] flex flex-col">
                <div className="p-4 border-b border-[#27272a] bg-[#0c0c0e]/50 backdrop-blur">
                    <h2 className="text-sm font-bold text-[#58a6ff] flex items-center gap-2">
                        <Bot size={16} /> THE HIVE
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {Object.keys(agents).map(agentName => (
                        <button
                            key={agentName}
                            onClick={() => setSelectedAgent(agentName)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors ${selectedAgent === agentName
                                ? 'bg-[#27272a] text-[#58a6ff] border border-[#58a6ff]/20'
                                : 'text-[#71717a] hover:bg-[#18181b] hover:text-[#e4e4e7]'
                                }`}
                        >
                            {agentName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col h-full bg-[#09090b]">
                {selectedAgent && agents[selectedAgent] ? (
                    <>
                        {/* Toolbar */}
                        <div className="h-12 border-b border-[#27272a] flex items-center justify-between px-6 bg-[#0c0c0e]">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-[#58a6ff]/20 flex items-center justify-center text-[#58a6ff]">
                                    <Bot size={14} />
                                </div>
                                <span className="font-bold tracking-wide">{selectedAgent}</span>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${saving
                                    ? 'bg-[#28c840] text-black'
                                    : 'bg-[#27272a] text-[#58a6ff] hover:bg-[#58a6ff] hover:text-black'
                                    }`}
                            >
                                <Save size={14} />
                                {saving ? 'SAVED' : 'SAVE CHANGES'}
                            </button>
                        </div>

                        {/* Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider">Description</label>
                                <input
                                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-3 text-sm text-[#e4e4e7] placeholder-[#52525b] focus:border-[#58a6ff] outline-none transition-colors"
                                    value={agents[selectedAgent].description}
                                    onChange={(e) => updateAgent('description', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 flex-1 flex flex-col">
                                <label className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                                    <Terminal size={12} /> System Prompt (Soul)
                                </label>
                                <textarea
                                    className="w-full h-[400px] bg-[#18181b] border border-[#27272a] rounded-lg p-4 text-sm text-[#e4e4e7] font-mono leading-relaxed focus:border-[#58a6ff] outline-none transition-colors resize-none placeholder-[#52525b]"
                                    value={agents[selectedAgent].systemPrompt}
                                    onChange={(e) => updateAgent('systemPrompt', e.target.value)}
                                    spellCheck={false}
                                />
                                <p className="text-[10px] text-[#71717a]">
                                    * This defines the agent's personality, capabilities, and rules. Edits apply immediately after saving.
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[#71717a]">
                        Select an agent to configure
                    </div>
                )}
            </div>
        </div>
    );
};
