import React from 'react';
import { Plane } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px]">
      <Plane className="w-12 h-12 text-primary animate-pulse" />
      <span className="mt-4 text-muted-foreground font-medium">Loading CDR System...</span>
    </div>
  );
};
