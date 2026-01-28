import { useState } from 'react';
import { TerminalSquare, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface AuthPageProps {
    onLogin: (token: string, username: string) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Success
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', data.user.username);
            onLogin(data.token, data.user.username);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#050505] text-[#e4e4e7] flex items-center justify-center font-mono overflow-hidden relative">

            {/* Background Grid Animation */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.5)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>

            <div className="w-full max-w-md z-10 p-6">

                {/* Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0c0c0e] border border-[#27272a] shadow-2xl mb-4 group">
                        <TerminalSquare size={32} className="text-[#58a6ff] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#71717a]">
                        VIRU GEN-1
                    </h1>
                    <p className="text-[#52525b] text-sm tracking-widest uppercase">
                        Secure Access Terminal
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-[#27272a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#58a6ff] to-transparent opacity-50"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                <ShieldCheck size={14} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#71717a] uppercase ml-1">Identity</label>
                            <div className="relative group">
                                <User size={16} className="absolute left-4 top-3.5 text-[#52525b] group-focus-within:text-[#58a6ff] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all placeholder-zinc-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#71717a] uppercase ml-1">Passkey</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-3.5 text-[#52525b] group-focus-within:text-[#58a6ff] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all placeholder-zinc-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-[#58a6ff] hover:bg-[#4d93e3] text-[#050505] font-bold text-sm transition-all shadow-[0_0_20px_rgba(88,166,255,0.3)] hover:shadow-[0_0_25px_rgba(88,166,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Authenticating...' : (isLogin ? 'Access System' : 'Create Identity')}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-xs text-[#71717a] hover:text-[#58a6ff] transition-colors"
                        >
                            {isLogin ? "Need access? Initialize User" : "Already registered? Login"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-[#27272a] text-[10px] space-y-1">
                    <p>SYSTEM VERSION 1.0.0</p>
                    <p>ENCRYPTED CONNECTION // SECURE SHELL</p>
                </div>
            </div>
        </div>
    );
};
