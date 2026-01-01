
import React, { useContext } from 'react';
import Card from '../Card';
import { DataContext } from '../../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DashboardView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { transactions } = context;

  const totalSpent = transactions.reduce((sum, tx) => sum + (tx.type === 'expense' ? tx.amount : 0), 0);
  const totalImpact = transactions.reduce((sum, tx) => sum + tx.carbonFootprint, 0);

  const data = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 600 },
    { name: 'Thu', amount: 800 },
    { name: 'Fri', amount: 500 },
    { name: 'Sat', amount: 900 },
    { name: 'Sun', amount: 1100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Financial Nexus</h1>
          <p className="text-slate-400 mt-1">Real-time multi-dimensional overview of your assets.</p>
        </div>
        <div className="flex space-x-3">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-xs font-bold text-slate-300">SYSTEMS: OPTIMAL</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center">
             <i className="fas fa-satellite text-cyan-500 mr-2 text-xs"></i>
            <span className="text-xs font-bold text-slate-300">NET: HYPERLINK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Available Balance</p>
          <p className="text-4xl font-bold text-white mt-2">$245,670.00</p>
          <div className="mt-4 flex items-center text-green-400 text-sm font-bold">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+12.5% this month</span>
          </div>
        </Card>
        
        <Card className="relative overflow-hidden group border-purple-500/20 hover:border-purple-500/50">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Carbon Impact</p>
          <p className="text-4xl font-bold text-white mt-2">{totalImpact.toFixed(2)}kg CO2e</p>
          <div className="mt-4 flex items-center text-cyan-400 text-sm font-bold">
            <i className="fas fa-leaf mr-1 text-green-500"></i>
            <span>15% below regional average</span>
          </div>
        </Card>

        <Card className="relative overflow-hidden group border-orange-500/20 hover:border-orange-500/50">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Active Contracts</p>
          <p className="text-4xl font-bold text-white mt-2">12</p>
          <div className="mt-4 flex items-center text-slate-400 text-sm font-bold">
            <i className="fas fa-shield-halved mr-1 text-orange-400"></i>
            <span>4 requiring attention</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Activity Vectors">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '12px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Pulsations">
          <div className="space-y-4">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-800/60 transition-colors">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${tx.type === 'expense' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    <i className={`fas ${tx.type === 'expense' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100">{tx.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                    {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">{tx.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
