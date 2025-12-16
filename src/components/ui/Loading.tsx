import { cn } from '@/lib/utils/cn';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center',
        fullScreen ? 'min-h-screen' : 'py-20'
      )}
    >
      <div className="w-12 h-12 border-3 border-background border-t-primary rounded-full animate-spin mb-4" />
      <div className="text-gray-500 text-[15px] font-medium">{message}</div>
    </div>
  );
}