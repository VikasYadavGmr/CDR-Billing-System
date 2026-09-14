import React from 'react';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
};
