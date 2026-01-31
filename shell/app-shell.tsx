import React, { ReactNode } from 'react';

export const AppShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="h-dvh w-screen bg-dark-950 text-slate-200 font-sans selection:bg-brand-500 selection:text-white overflow-hidden flex flex-col animate-fade-in">
      {children}
    </div>
  );
};
