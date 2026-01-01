
import React, { useContext, useState } from 'react';
import Card from '../Card';
import { DataContext } from '../../context/DataContext';

const TransactionsView: React.FC = () => {
  const context = useContext(DataContext);
  if (!context) return null;
  const { transactions } = context;
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Ledger Matrix</h1>
          <p className="text-slate-400 mt-1">Full immutable history of all platform activities.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-center">
          {['all', 'expense', 'scheduled_expense'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {f.toUpperCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Timeline</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Classification</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Magnitude</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-5">
                    <p className="text-sm font-bold text-slate-200">{tx.date}</p>
                    <p className="text-[10px] text-slate-500 font-mono">TX-{tx.id.substring(4, 10)}</p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${tx.type === 'expense' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        <i className={`fas ${tx.type === 'expense' ? 'fa-arrow-up' : 'fa-calendar-check'} text-xs`}></i>
                      </div>
                      <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{tx.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <p className={`text-sm font-bold ${tx.type === 'expense' ? 'text-slate-200' : 'text-blue-400'}`}>
                      ${tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-green-400">{tx.carbonFootprint.toFixed(3)}kg</span>
                      <span className="text-[8px] text-slate-500 uppercase font-mono">CO2 OFFSET</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TransactionsView;
