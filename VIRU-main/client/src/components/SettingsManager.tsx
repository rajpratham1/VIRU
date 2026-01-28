import { useState } from 'react';
import { Settings, Cpu, Shield, Globe } from 'lucide-react';
import { API_BASE_URL } from '../config';

export const SettingsManager = () => {
    const [model, setModel] = useState('mistral');


    return (
        <div className="h-full bg-[#0c0c0e] text-[#e4e4e7] p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 border-b border-[#27272a] pb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Settings size={32} className="text-[#58a6ff]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-[#e4e4e7]">System Configuration</h1>
                        <p className="text-[#a1a1aa]">Manage neural core parameters and system constraints.</p>
                    </div>
                </div>

                {/* AI Model Settings */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                        <Cpu size={14} /> Neural Core Configuration
                    </h3>
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden divide-y divide-[#27272a]">

                        {/* Model Select */}
                        <div className="p-6 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#58a6ff]/10 rounded-lg text-[#58a6ff] border border-[#58a6ff]/20">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <div className="text-[#e4e4e7] font-bold text-sm">Active Model</div>
                                    <div className="text-xs text-[#a1a1aa] mt-0.5">Select the Large Language Model powering VIRU</div>
                                </div>
                            </div>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="bg-[#09090b] border border-[#27272a] text-[#e4e4e7] rounded-lg px-4 py-2 text-sm outline-none focus:border-[#58a6ff] cursor-pointer font-mono"
                            >
                                <option value="mistral">Mistral 7B (Recommended)</option>
                                <option value="llama3">Llama 3</option>
                                <option value="gemma">Gemma</option>
                                <option value="deepseek">DeepSeek Coder</option>
                            </select>
                        </div>

                        {/* Privacy Mode */}
                        <div className="p-6 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-green-500/10 rounded-lg text-green-500 border border-green-500/20">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <div className="text-[#e4e4e7] font-bold text-sm">Privacy Barrier</div>
                                    <div className="text-xs text-[#a1a1aa] mt-0.5">Local-only execution. No data leaves this machine.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 text-xs font-bold rounded-lg border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                <Shield size={12} />
                                <span>ENFORCED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Settings */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-wider flex items-center gap-2">
                        <Globe size={14} /> Network
                    </h3>
                    <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex items-center justify-between hover:bg-[#27272a]/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500 border border-orange-500/20">
                                <Globe size={24} />
                            </div>
                            <div>
                                <div className="text-[#e4e4e7] font-bold text-sm">Host Interface</div>

                                <div className="text-xs text-[#a1a1aa] mt-0.5 font-mono">{API_BASE_URL}</div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#e4e4e7] text-xs font-bold rounded-lg transition-all border border-[#3f3f46]">
                            CONFIGURE
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-[#27272a]/50">
                    <p className="text-[10px] text-[#52525b] font-mono tracking-widest uppercase mb-2">
                        VIRU SYSTEM ID: 7204-1401-B8EC-4408
                    </p>
                    <p className="text-[10px] text-[#3f3f46]">
                        v2.4.0 (Stable) • Local Environment
                    </p>
                </div>
            </div>
        </div>
    );
};
