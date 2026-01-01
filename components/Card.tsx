
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-cyan-500/50 ${className}`}>
      {title && (
        <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center">
            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3 animate-pulse"></span>
            {title}
          </h2>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          </div>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default Card;
