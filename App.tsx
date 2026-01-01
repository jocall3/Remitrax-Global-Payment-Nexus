
import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import { View } from './types';
import DashboardView from './components/views/DashboardView';
import TransactionsView from './components/views/TransactionsView';
import SendMoneyView from './components/views/SendMoneyView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <DashboardView />;
      case View.Transactions:
        return <TransactionsView />;
      case View.SendMoney:
        return <SendMoneyView setActiveView={setActiveView} />;
      case View.Settings:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <i className="fas fa-sliders-h text-6xl text-slate-800 mb-6"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Configuration Node</h2>
            <p className="text-slate-400">Settings are automatically synchronized with your neural profile.</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <DataProvider>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderView()}
      </Layout>
    </DataProvider>
  );
};

export default App;
