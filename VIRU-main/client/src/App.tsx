import { useState } from 'react';
import { Terminal } from './components/Terminal';
import { Workspace } from './components/Workspace';
import { Gym } from './components/Gym';
import { AuthPage } from './components/AuthPage';
import { ProjectDashboard } from './components/ProjectDashboard';
import { DatabaseManager } from './components/DatabaseManager';
import { SettingsManager } from './components/SettingsManager';
import { Database, Activity, FolderGit2, Settings, Brain, Network } from 'lucide-react';
import { motion } from 'framer-motion';

import { NeuralLink } from './components/NeuralLink';
import { AgentManager } from './components/AgentManager';
import { PrivyChatPanel } from './components/PrivyChatPanel';
import { Bot } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [activeProject, setActiveProject] = useState<any>(null);

  if (!token) {
    return <AuthPage onLogin={(t) => {
      setToken(t);
      localStorage.setItem('auth_token', t);
    }} />;
  }

  if (!activeProject) {
    return (
      <ProjectDashboard
        token={token}
        onSelectProject={(p) => setActiveProject(p)}
        onLogout={() => {
          setToken(null);
          localStorage.removeItem('auth_token');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-[#e4e4e7] overflow-hidden font-mono antialiased">
      <aside className="w-16 flex flex-col items-center border-r border-[#27272a] bg-[#0c0c0e] py-4 gap-4 z-20">
        {/* ... */}
        {[
          { id: 'terminal', icon: <Activity size={20} /> },
          { id: 'workspace', icon: <FolderGit2 size={20} /> },
          { id: 'neural', icon: <Network size={20} /> },
          { id: 'hive', icon: <Bot size={20} /> },
          { id: 'gym', icon: <Brain size={20} /> },
          { id: 'database', icon: <Database size={20} /> },
          { id: 'settings', icon: <Settings size={20} /> },
        ].map(item => (
          // ... button logic
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
              ? 'bg-[#27272a] text-[#58a6ff] shadow-[0_0_15px_rgba(88,166,255,0.3)]'
              : 'text-[#71717a] hover:bg-[#18181b] hover:text-[#d4d4d8]'
              }`}
          >
            {item.icon}
          </button>
        ))}
        {/* ... */}
      </aside>

      <main className="flex-1 flex flex-col relative z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#18181b] via-[#09090b] to-[#09090b]">
        {/* ... header ... */}

        <div className="flex-1 overflow-hidden relative p-1">
          {activeTab === 'terminal' && (
            // ...
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full w-full rounded-lg border border-[#27272a] bg-[#0c0c0e]/50 backdrop-blur-md overflow-hidden shadow-2xl"
            >
              <Terminal token={token || ''} projectId={activeProject?.id} />
            </motion.div>
          )}
          {activeTab === 'workspace' && (
            // ...
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full w-full"
            >
              <Workspace project={activeProject} />
            </motion.div>
          )}
          {activeTab === 'neural' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
              <NeuralLink />
            </motion.div>
          )}
          {activeTab === 'hive' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
              <AgentManager />
            </motion.div>
          )}
          {activeTab === 'gym' && (
            // ...
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full">
              <Gym />
            </motion.div>
          )}
          {/* ... database, settings ... */}
          {activeTab === 'database' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full">
              <DatabaseManager />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full">
              <SettingsManager />
            </motion.div>
          )}
        </div>
      </main>

      {/* PrivyChat Integration */}
      <PrivyChatPanel />
    </div>
  );
}

export default App;

