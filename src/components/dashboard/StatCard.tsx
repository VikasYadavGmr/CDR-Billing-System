import React from 'react';


interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        <div className="text-muted-foreground opacity-70">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
