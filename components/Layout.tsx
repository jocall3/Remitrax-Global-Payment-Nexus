
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const menuItems = [
    { id: View.Dashboard, icon: 'fa-chart-pie', label: 'Nexus' },
    { id: View.SendMoney, icon: 'fa-paper-plane', label: 'Transfer' },
    { id: View.Transactions, icon: 'fa-list-ul', label: 'Ledger' },
    { id: View.Settings, icon: 'fa-cog', label: 'Configs' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center z-50">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-2">
            <i className="fas fa-bolt text-white text-sm"></i>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">REMITRAX</span>
        </div>
        <button className="text-slate-400 p-2"><i className="fas fa-bars"></i></button>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-950 border-r border-slate-800 p-6 space-y-8 h-screen sticky top-0">
        <div className="flex items-center px-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/20">
            <i className="fas fa-bolt text-white text-lg"></i>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tighter text-white block leading-none">REMITRAX</span>
            <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase mt-1 block">Quantum Nexus</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                activeView === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} mr-4 text-lg transition-transform group-hover:scale-110`}></i>
              <span className="font-semibold">{item.label}</span>
              {activeView === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
              <i className="fas fa-shield-alt text-xs text-cyan-400"></i>
            </div>
            <span className="text-xs font-bold text-slate-300">Security: ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">Post-quantum encryption enabled. All channels verified.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex justify-around p-3 z-50">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center space-y-1 p-2 ${activeView === item.id ? 'text-cyan-400' : 'text-slate-500'}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
