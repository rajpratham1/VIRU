import { useState, useEffect } from 'react';
import { Activity, Shield, Users, Radio, Zap, AlertTriangle, Search } from 'lucide-react';

export const Overwatch = () => {
    const [stats, setStats] = useState<any>({ users: 0, load: 'Low', activeNodes: 0 });
    const [users, setUsers] = useState<any[]>([]);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'broadcast'>('users');
    const [token, setToken] = useState<string | null>(localStorage.getItem('viru_token'));

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
                setStats((prev: any) => ({ ...prev, users: data.length, activeNodes: Math.floor(data.length * 0.8) }));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ message: broadcastMsg, type: 'info' })
            });
            alert('Signal Transmitted Globally.');
            setBroadcastMsg('');
        } catch (e) {
            console.error(e);
        }
    };

    const handleTierChange = async (userId: string, tier: 'free' | 'pro') => {
        try {
            await fetch('http://localhost:5000/api/admin/tier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId, tier })
            });
            fetchUsers(); // Refresh
        } catch (e) {
            console.error(e);
        }
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('viru_token', data.token);
                setToken(data.token);
            } else {
                alert('Access Denied: ' + (data.error || 'Invalid credentials'));
            }
        } catch (err) {
            console.error(err);
            alert('Connection Failed');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-500">
                <div className="border border-red-500/50 p-8 rounded-xl bg-red-950/20 max-w-md w-full text-center space-y-4">
                    <Shield size={64} className="mx-auto animate-pulse" />
                    <h1 className="text-2xl font-bold">OVERWATCH LOGIN</h1>
                    <p className="text-sm mb-4">Identify yourself, Commander.</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-red-500/70 mb-1">CODENAME</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-red-900 rounded p-2 text-white outline-none focus:border-red-500"
                                placeholder="root"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-500/70 mb-1">PASSPHRASE</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-red-900 rounded p-2 text-white outline-none focus:border-red-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded w-full transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        >
                            AUTHENTICATE
                        </button>
                    </form>

                    <button
                        onClick={() => window.location.href = 'http://localhost:5173'}
                        className="text-xs text-red-500/50 hover:text-red-400 mt-4 block mx-auto"
                    >
                        Return to Public Interface
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#e4e4e7] font-mono flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#27272a] bg-[#09090b] flex flex-col p-4">
                <div className="flex items-center gap-3 px-4 py-4 mb-8 border-b border-[#27272a]/50">
                    <Shield className="text-red-500" />
                    <div>
                        <h1 className="font-bold tracking-wider">OVERWATCH</h1>
                        <p className="text-[10px] text-red-500 font-bold uppercase">Admin Command</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'users' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:bg-[#27272a]/50'}`}
                    >
                        <Users size={18} /> User Grid
                    </button>
                    <button
                        onClick={() => setActiveTab('broadcast')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'broadcast' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:bg-[#27272a]/50'}`}
                    >
                        <Radio size={18} /> Global Signal
                    </button>
                </nav>

                <div className="p-4 bg-red-900/10 rounded-xl border border-red-900/20 mt-auto">
                    <div className="text-xs text-red-400 font-bold mb-1 flex items-center gap-2">
                        <Activity size={12} className="animate-pulse" /> SYSTEM LOAD
                    </div>
                    <div className="h-1 bg-red-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[34%] animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-red-400/60 mt-2">
                        <span>CPU: 34%</span>
                        <span>MEM: 12GB</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {activeTab === 'users' ? 'Operative Surveillance' : 'Broadcast System'}
                        </h2>
                        <p className="text-[#71717a] text-sm">
                            {activeTab === 'users' ? `Found ${users.length} registered entities.` : 'Send messages to all active terminals.'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-[#18181b] rounded-lg border border-[#27272a] text-xs flex flex-col items-center min-w-[100px]">
                            <span className="text-[#52525b] uppercase">Active Nodes</span>
                            <span className="text-xl font-bold text-green-500">{stats.activeNodes}</span>
                        </div>
                        <div className="px-4 py-2 bg-[#18181b] rounded-lg border border-[#27272a] text-xs flex flex-col items-center min-w-[100px]">
                            <span className="text-[#52525b] uppercase">Total Users</span>
                            <span className="text-xl font-bold text-[#e4e4e7]">{stats.users}</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'users' && (
                    <div className="bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-[#27272a] flex items-center gap-2 bg-[#18181b]/50">
                            <Search size={16} className="text-[#71717a]" />
                            <input type="text" placeholder="Search operatives by ID..." className="bg-transparent outline-none text-sm w-full placeholder-[#52525b]" />
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#18181b] text-[#71717a] uppercase text-[10px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">User Identity</th>
                                    <th className="px-6 py-3">Registered</th>
                                    <th className="px-6 py-3">Clearance</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#27272a]">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-[#18181b]/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-[#e4e4e7]">
                                            <div className="font-bold flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${u.isAdmin ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                {u.email || u.username || 'Unknown'}
                                            </div>
                                            <div className="text-[10px] text-[#52525b]">{u.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[#a1a1aa]">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${u.isAdmin ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                                {u.isAdmin ? 'ADMIN' : 'OPERATIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleTierChange(u.id, 'pro')}
                                                    className="p-1.5 hover:bg-[#27272a] rounded text-[#71717a] hover:text-[#e4e4e7] transition-colors"
                                                    title="Upgrade to Pro"
                                                >
                                                    <Zap size={14} />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-500/10 rounded text-[#71717a] hover:text-red-400 transition-colors" title="Revoke Access">
                                                    <AlertTriangle size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'broadcast' && (
                    <div className="max-w-2xl mx-auto mt-12">
                        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>

                            <div className="text-center space-y-2">
                                <Radio size={48} className="mx-auto text-red-500 mb-4" />
                                <h2 className="text-2xl font-bold">Global System Broadcast</h2>
                                <p className="text-[#a1a1aa]">This message will be transmitted to all connected neural terminals instantly.</p>
                            </div>

                            <form onSubmit={handleBroadcast} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#71717a] uppercase mb-2">Transmission Content</label>
                                    <textarea
                                        value={broadcastMsg}
                                        onChange={e => setBroadcastMsg(e.target.value)}
                                        className="w-full bg-[#09090b] border border-[#27272a] rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none min-h-[120px]"
                                        placeholder="Enter alert message..."
                                    />
                                </div>
                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20">
                                    TRANSMIT SIGNAL
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
