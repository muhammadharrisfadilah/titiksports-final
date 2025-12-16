import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ 
  icon = '⚽', 
  title, 
  message,
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-6xl mb-4 opacity-30">{icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      {message && (
        <p className="text-sm text-gray-500 mb-6 max-w-xs">{message}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}